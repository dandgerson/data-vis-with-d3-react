/* eslint-disable no-shadow */
import React, { useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  geoPath, geoGraticule, extent, interpolateYlOrRd, scaleSequential,
} from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'
import useCsv from 'hooks/useCsv'

import s from './HivAidsChoropleth.m.scss'

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

const getColorValue = d => d.prevalence
const selectedYear = '2017'
const missingDataColor = 'grey'

const HivAidsChoroplethMap = ({ projection }) => {
  const {
    path, pathSphere, pathGraticules, pathInteriors, countries,
  } = useMemo(() => {
    const path = geoPath(projection)
    const graticule = geoGraticule()
    const interiors = mesh(countries50m, countries50m.objects.countries, (a, b) => a !== b)

    return {
      path,
      pathSphere: path({ type: 'Sphere' }),
      pathGraticules: path(graticule()),
      pathInteriors: path(interiors),
      countries: feature(countries50m, countries50m.objects.countries),
    }
  }, [projection])

  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/cfbc368e85b87c544e04709544ae461d/raw/share-of-population-infected-with-hiv-ihme.csv',
    d => ({
      ...d,
      prevalence: +d['Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent) (%)'],
    }),
  )

  const [codesData] = useCsv(
    'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.csv',
  )

  const { filteredByYearDataWithId, rowByCountriesId } = useMemo(() => {
    const codeToIdMap = codesData.reduce(
      (acc, current) => ({
        ...acc,
        [current['alpha-3']]: current['country-code'],
      }),
      {},
    )

    const filteredByYearDataWithId = data
      .filter(d => d.Year === selectedYear)
      .map(d => ({
        ...d,
        id: codeToIdMap[d.Code],
      }))

    const rowByCountriesId = filteredByYearDataWithId.reduce(
      (acc, current) => ({
        ...acc,
        [current.id]: current,
      }),
      {},
    )

    return {
      filteredByYearDataWithId,
      rowByCountriesId,
    }
  }, [data, codesData])

  const [size, setSize] = useState({ svgWidth: 0, svgHeight: 0 })

  useEffect(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    setSize({
      svgWidth: svgRect?.width || 0,
      svgHeight: svgRect?.height || 0,
    })
  }, [])

  const colorScale = scaleSequential(interpolateYlOrRd).domain(
    extent(filteredByYearDataWithId, getColorValue),
  )

  const renderMarks = () => (
    <g
      data-marks
      className={s.marks}
      transform={`translate(${(c.pos.xOffset + c.pos.zero) * c.pos.scale + size.svgWidth / 2},${
        c.pos.zero * c.pos.scale + size.svgHeight / 2
      }) scale(${c.pos.scale})`}
    >
      <path className={s.marks_sphere} d={pathSphere} />

      <path className={s.marks_graticules} d={pathGraticules} />

      {countries.features.map((feature, i) => {
        const d = rowByCountriesId[feature.id] || {}
        const color = colorScale(getColorValue(d)) || missingDataColor

        return <path key={i} fill={color} d={path(feature)} />
      })}

      <path className={s.marks_interiors} d={pathInteriors} />
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
      {size.svgHeight && filteredByYearDataWithId.length > 0 ? renderMarks() : null}
    </svg>
  )
}

HivAidsChoroplethMap.propTypes = {
  projection: PropTypes.func.isRequired,
}

export default HivAidsChoroplethMap
