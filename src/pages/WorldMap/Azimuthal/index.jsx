/* eslint-disable no-shadow */
import React, { useMemo, useEffect, useState } from 'react'
import { geoAzimuthalEquidistant, geoPath, geoGraticule } from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'

import s from './Azimuthal.m.scss'

const Azimuthal = () => {
  const { path, graticule, data } = useMemo(() => {
    const projection = geoAzimuthalEquidistant().rotate([0, -90])
    const path = geoPath(projection)
    const graticule = geoGraticule()

    return {
      path,
      graticule,
      data: {
        land: feature(countries50m, countries50m.objects.land),
        interiors: mesh(countries50m, countries50m.objects.countries, (a, b) => a !== b),
      },
    }
  }, [])

  const [size, setSize] = useState({ svgWidth: 0, svgHeight: 0 })

  useEffect(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    setSize({
      svgWidth: svgRect?.width || 0,
      svgHeight: svgRect?.height || 0,
    })
  }, [])

  const pos = {
    xOffset: -230,
    zero: -250,
    scale: 1.8,
  }

  const renderMarks = ({ data }) => (
    <g
      data-marks
      className={s.marks}
      transform={`translate(${(pos.xOffset + pos.zero) * pos.scale + size.svgWidth / 2},${
        pos.zero * pos.scale + size.svgHeight / 2
      }) scale(${pos.scale})`}
    >
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
      {size.svgHeight ? renderMarks({ data }) : null}
    </svg>
  )
}

export default Azimuthal
