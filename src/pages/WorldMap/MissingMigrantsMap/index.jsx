/* eslint-disable no-shadow */
import React, { useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  geoPath, geoGraticule, scaleSqrt, extent, format,
} from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'
import useCsv from 'hooks/useCsv'

import s from './MissingMigrantsMap.m.scss'

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

  const [migrantsData] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/0e0b9478a72c23a60f3622efd6300338/raw/missing_migrants.csv',
    d => {
      const [lat, lng] = d['Location Coordinates'].split(',').map(d => +d)

      return {
        ...d,
        lat,
        lng,
        totalDeadAndMissing: +d['Total Dead and Missing'],
      }
    },
  )

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

  const [size, setSize] = useState({ svgWidth: 0, svgHeight: 0 })

  useEffect(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    setSize({
      svgWidth: svgRect?.width || 0,
      svgHeight: svgRect?.height || 0,
    })
  }, [])

  const formatNumberValue = format('.2s')
  const formatTooltipValue = value => formatNumberValue(value).replace('G', 'B')
  const getSizeValue = d => d.totalDeadAndMissing
  const sizeScale = scaleSqrt().domain(extent(migrantsData, getSizeValue)).range(c.circle.size)

  const renderMarks = ({ mapData, migrantsData }) => (
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

      {migrantsData.map((d, i) => {
        const [x, y] = projection([d.lng, d.lat])

        return (
          <circle key={i} cx={x} cy={y} r={sizeScale(getSizeValue(d))} className={s.marks_circle}>
            <title>{`${formatTooltipValue(getSizeValue(d))}`}</title>
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
      {size.svgHeight && migrantsData.length > 0
        ? renderMarks({
          mapData,
          migrantsData,
        })
        : null}
    </svg>
  )
}

Map.propTypes = {
  projection: PropTypes.func.isRequired,
}

export default Map
