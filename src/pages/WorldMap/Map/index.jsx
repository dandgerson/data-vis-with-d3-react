/* eslint-disable no-shadow */
import React, { useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { geoPath, geoGraticule } from 'd3'
import { feature, mesh } from 'topojson-client'
import countries50m from 'world-atlas/countries-50m.json'
import useCsv from 'hooks/useCsv'

import s from './Map.m.scss'

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

  const [citiesData] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/818b414f48bd41bcb1bdf72b4c5fda67/raw/world_cities_filtered.csv',
    d => ({
      ...d,
      lat: +d.lat,
      lng: +d.lng,
      population: +d.population,
    }),
  )
  console.log({ citiesData })

  const filteredCitiesData = useMemo(
    () => citiesData.filter(d => d.population >= 500000),
    [citiesData],
  )

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

  const renderMarks = ({ mapData, citiesData }) => (
    <g
      data-marks
      className={s.marks}
      transform={`translate(${(pos.xOffset + pos.zero) * pos.scale + size.svgWidth / 2},${
        pos.zero * pos.scale + size.svgHeight / 2
      }) scale(${pos.scale})`}
    >
      <path className={s.marks_sphere} d={path({ type: 'Sphere' })} />

      <path className={s.marks_graticules} d={path(graticule())} />

      {mapData.land.features.map((feature, i) => (
        <path key={i} className={s.marks_land} d={path(feature)} />
      ))}

      <path className={s.marks_interiors} d={path(mapData.interiors)} />

      {citiesData.map((d, i) => {
        const [x, y] = projection([d.lng, d.lat])

        return (
          <circle key={i} cx={x} cy={y} r={1} className={s.marks_city}>
            <title>{d.city}</title>
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
      {size.svgHeight
        ? renderMarks({
          mapData,
          citiesData: filteredCitiesData,
        })
        : null}
    </svg>
  )
}

Map.propTypes = {
  projection: PropTypes.func.isRequired,
}

export default Map
