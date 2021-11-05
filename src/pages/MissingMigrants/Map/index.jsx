/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  geoPath, geoGraticule, scaleSqrt, extent, format,
} from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'

import s from './Map.m.scss'

const formatNumberValue = format('.2s')
const formatTooltipValue = value => formatNumberValue(value).replace('G', 'B')
const getSizeValue = d => d.totalDeadAndMissing
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

const Map = ({ projection, data, size }) => {
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

  const sizeScale = scaleSqrt().domain(extent(data, getSizeValue)).range(c.circle.size)

  return (
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

      {data.map((d, i) => {
        const [x, y] = projection([d.lng, d.lat])

        return (
          <circle key={i} cx={x} cy={y} r={sizeScale(getSizeValue(d))} className={s.marks_circle}>
            <title>{`${formatTooltipValue(getSizeValue(d))}`}</title>
          </circle>
        )
      })}
    </g>
  )
}

Map.propTypes = {
  projection: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
}

export default Map
