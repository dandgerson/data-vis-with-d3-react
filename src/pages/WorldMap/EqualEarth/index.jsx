/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import { geoEqualEarth, geoPath, geoGraticule } from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'

import s from './EqualEarth.m.scss'

const projection = geoEqualEarth().scale(250).center([-60, 20])
const path = geoPath(projection)
const graticule = geoGraticule()

const EqualEarth = () => {
  const data = useMemo(
    () => ({
      land: feature(countries50m, countries50m.objects.land),
      interiors: mesh(countries50m, countries50m.objects.countries, (a, b) => a !== b),
    }),
    [],
  )

  const renderMarks = ({ data }) => (
    <g data-marks className={s.marks}>
      <path className={s.marks_sphere} d={path({ type: 'Sphere' })} />
      <path className={s.marks_graticules} d={path(graticule())} />
      {data.land.features.map((feature, i) => (
        <path key={i} className={s.marks_land} d={path(feature)} />
      ))}
      <path className={s.marks_interiors} d={path(data.interiors)} />
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
      {renderMarks({ data })}
    </svg>
  )
}

export default EqualEarth
