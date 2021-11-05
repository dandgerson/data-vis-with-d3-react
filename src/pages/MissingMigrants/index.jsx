/* eslint-disable no-shadow */
import React, { useMemo, useState, useEffect } from 'react'
import { geoAzimuthalEquidistant, geoEqualEarth } from 'd3'

import useCsv from 'hooks/useCsv'
import { useDropDown } from 'components/DropDown'
import Map from './Map'
import Histogram from './Histogram'

const getXValue = d => d.reportedDate
const options = [
  {
    projection: geoAzimuthalEquidistant().center([0, -50]).scale(120).rotate([0, -90, -40]),
    value: 'AzimuthalEquidistant',
    label: 'Azimuthal Projection',
  },
  {
    projection: geoEqualEarth().scale(160),
    value: 'EqualEarth',
    label: 'Equal Earth Projection',
  },
]
const c = {
  histogram: {
    margin: {
      left: 70,
      right: 40,
      bottom: 70,
    },
    height: 0.125,
  },
}

const MissingMigrants = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/0e0b9478a72c23a60f3622efd6300338/raw/missing_migrants.csv',
    d => {
      const [lat, lng] = d['Location Coordinates'].split(',').map(d => +d)

      return {
        lat,
        lng,
        totalDeadAndMissing: +d['Total Dead and Missing'],
        reportedDate: new Date(d['Reported Date']),
      }
    },
  )

  const [dropDownProjection, selectedProjection] = useDropDown({
    id: 'projections',
    label: 'Choose Projection: ',
    options,
  })

  const [size, setSize] = useState({ svgWidth: 0, svgHeight: 0 })

  useEffect(() => {
    const rect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()
    const svgHeight = rect?.height || 0
    const svgWidth = rect?.width || 0

    setSize({
      svgWidth,
      svgHeight,
    })
  }, [data])

  const { histogram } = useMemo(
    () => ({
      histogram: {
        height: size.svgHeight * c.histogram.height,
        width: size.svgWidth - c.histogram.margin.left - c.histogram.margin.right,
        xPos: c.histogram.margin.left,
        yPos: size.svgHeight - size.svgHeight * c.histogram.height - c.histogram.margin.bottom,
      },
    }),
    [size],
  )

  const [brushExtent, setBrushExtent] = useState(null)

  const filteredData = useMemo(
    () => (brushExtent
      ? data.filter(d => {
        const date = getXValue(d)

        return date > brushExtent[0] && date < brushExtent[1]
      })
      : data),
    [data, brushExtent, getXValue],
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
        <h2>World Missing Migrants</h2>
        <br />

        {dropDownProjection}
      </div>

      <div className='separator-v'>
        <div />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <h2>{selectedProjection.label}</h2>

        <svg
          data-svg-container
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {size.svgHeight && data.length > 0 ? (
            <>
              <Map
                projection={selectedProjection.projection}
                size={size}
                data={data}
                filteredData={filteredData}
              />

              <g transform={`translate(${histogram.xPos},${histogram.yPos})`}>
                <Histogram
                  data={data}
                  setBrushExtent={setBrushExtent}
                  getXValue={getXValue}
                  size={{
                    height: histogram.height,
                    width: histogram.width,
                  }}
                />
              </g>
            </>
          ) : null}
        </svg>
      </div>
    </div>
  )
}

export default MissingMigrants
