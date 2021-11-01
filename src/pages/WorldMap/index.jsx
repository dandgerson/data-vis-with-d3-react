/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import { geoEqualEarth, geoPath, geoGraticule } from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'

import s from './WorldMap.m.scss'

const projection = geoEqualEarth()
const path = geoPath(projection)
const graticule = geoGraticule()

const WorldMap = () => {
  const data = useMemo(
    () => ({
      land: feature(countries50m, countries50m.objects.land),
      interiors: mesh(countries50m, countries50m.objects.countries, (a, b) => a !== b),
    }),
    [],
  )

  console.log({
    data,
  })

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
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '20%',
        }}
      >
        <h2>World Map</h2>
        <br />
        <h2>The World Map with D3</h2>
        <p>This is the world map</p>
      </div>

      <div className='separator-v'>
        <div />
      </div>

      <div
        style={{
          flex: 1,
        }}
      >
        <svg
          data-svg-container
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {renderMarks({ data })}
        </svg>
      </div>
    </div>
  )
}

export default WorldMap
