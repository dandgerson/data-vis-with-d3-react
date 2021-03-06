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

const Map = ({
  projection, data, filteredData, size,
}) => {
  const {
    spherePath, interiorsPath, landFeaturesPaths, graticules, land,
  } = useMemo(() => {
    const graticule = geoGraticule()
    const interiors = mesh(countries50m, countries50m.objects.countries, (a, b) => a !== b)
    const land = feature(countries50m, countries50m.objects.land)
    const path = geoPath(projection)

    return {
      spherePath: path({ type: 'Sphere' }),
      interiorsPath: path(interiors),
      landFeaturesPaths: land.features.map(landFeature => path(landFeature)),
      graticules: path(graticule()),
      land,
    }
  }, [projection])

  const sizeScale = useMemo(
    () => scaleSqrt().domain(extent(data, getSizeValue)).range(c.circle.size),
    [data, getSizeValue, c],
  )

  return (
    <g
      data-marks
      className={s.marks}
      transform={`translate(${(c.pos.xOffset + c.pos.zero) * c.pos.scale + size.svgWidth / 2},${
        c.pos.zero * c.pos.scale + size.svgHeight / 2
      }) scale(${c.pos.scale})`}
    >
      {useMemo(
        () => (
          <>
            <path className={s.marks_sphere} d={spherePath} />

            <path className={s.marks_graticules} d={graticules} />

            {land.features.map((landFeature, i) => (
              <path key={i} className={s.marks_land} d={landFeaturesPaths[i]} />
            ))}

            <path className={s.marks_interiors} d={interiorsPath} />
          </>
        ),
        [spherePath, graticules, land, landFeaturesPaths, interiorsPath],
      )}

      {filteredData.map((d, i) => {
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
  filteredData: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
}

export default Map
