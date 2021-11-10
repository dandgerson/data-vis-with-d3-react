/* eslint-disable no-shadow */
import React, { useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  geoPath, geoGraticule, extent, format, schemeYlOrRd, scaleSequential,
} from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'
import useCsv from 'hooks/useCsv'

import s from './MissingMigrantsMap.m.scss'

const c = {
  pos: {
    xOffset: -230,
    zero: -250,
    scale: 1.8,
  },
  circle: {
    size: [0.5, 5],
  },
}

const formatNumberValue = format('.2s')
const formatTooltipValue = value => formatNumberValue(value).replace('G', 'B')
const getColorValue = d => d.prevalence
const selectedYear = '2017'

const Map = ({ projection }) => {
  const { path, graticule, mapData } = useMemo(() => {
    const path = geoPath(projection)
    const graticule = geoGraticule()

    return {
      path,
      graticule,
      mapData: {
        land: feature(countries50m, countries50m.objects.land),
        interiors: mesh(countries50m, countries50m.objects.countries, (a, b) => a !== b),
      },
    }
  }, [projection])

  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/cfbc368e85b87c544e04709544ae461d/raw/share-of-population-infected-with-hiv-ihme.csv',
    d => ({
      ...d,
      prevalence: +d['Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent) (%)'],
    }),
  )

  const processedData = useMemo(() => data.filter(d => d.Year === selectedYear), [data])

  console.log({ data: processedData })

  const [size, setSize] = useState({ svgWidth: 0, svgHeight: 0 })

  useEffect(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    setSize({
      svgWidth: svgRect?.width || 0,
      svgHeight: svgRect?.height || 0,
    })
  }, [])

  const colorScale = scaleSequential(schemeYlOrRd).domain(extent(processedData, getColorValue))

  const renderMarks = () => (
    <g
      data-marks
      className={s.marks}
      transform={`translate(${(c.pos.xOffset + c.pos.zero) * c.pos.scale + size.svgWidth / 2},${
        c.pos.zero * c.pos.scale + size.svgHeight / 2
      }) scale(${c.pos.scale})`}
    >
      <path className={s.marks_sphere} d={path({ type: 'Sphere' })} />

      <path className={s.marks_graticules} d={path(graticule())} />

      {mapData.land.features.map((feature, i) => (
        <path key={i} className={s.marks_land} d={path(feature)} />
      ))}

      <path className={s.marks_interiors} d={path(mapData.interiors)} />

      {processedData.map((d, i) => {
        const [x, y] = projection([d.lng, d.lat])

        return (
          <circle key={i} cx={x} cy={y} r={colorScale(getColorValue(d))} className={s.marks_circle}>
            <title>{`${formatTooltipValue(getColorValue(d))}`}</title>
          </circle>
        )
      })}
    </g>
  )

  return (
    <svg
      data-svg-container
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {size.svgHeight && processedData.length > 0
        ? renderMarks({
          mapData,
          migrantsData: processedData,
        })
        : null}
    </svg>
  )
}

Map.propTypes = {
  projection: PropTypes.func.isRequired,
}

export default Map
