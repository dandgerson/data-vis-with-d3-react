/* eslint-disable no-shadow */
import React, { useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  geoPath, geoGraticule, scaleSqrt, extent, format,
} from 'd3'
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

  const c = {
    pos: {
      xOffset: -230,
      zero: -250,
      scale: 1.8,
    },
    cities: {
      minPopulation: 50000,
      size: [0.5, 3.5],
    },
  }

  const filteredCitiesData = useMemo(
    () => citiesData.filter(d => d.population >= c.cities.minPopulation),
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

  const formatNumberValue = format('.2s')
  const formatTooltipValue = value => formatNumberValue(value).replace('G', 'B')
  const getSizeValue = d => d.population
  const sizeScale = scaleSqrt()
    .domain(extent(filteredCitiesData, getSizeValue))
    .range(c.cities.size)

  const renderMarks = ({ mapData, citiesData }) => (
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

      {citiesData.map((d, i) => {
        const [x, y] = projection([d.lng, d.lat])

        return (
          <circle key={i} cx={x} cy={y} r={sizeScale(getSizeValue(d))} className={s.marks_city}>
            <title>{`${d.city}: ${formatTooltipValue(d.population)}`}</title>
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
