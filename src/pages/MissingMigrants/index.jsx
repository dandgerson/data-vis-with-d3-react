/* eslint-disable no-shadow */
import React, { useMemo, useState, useEffect } from 'react'
import { geoAzimuthalEquidistant, geoEqualEarth } from 'd3'

import useCsv from 'hooks/useCsv'
import { useDropDown } from 'components/DropDown'
import Map from './Map'
import Histogram from './Histogram'

const MissingMigrants = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/0e0b9478a72c23a60f3622efd6300338/raw/missing_migrants.csv',
  )

  const { mapData, histogramData } = useMemo(() => {
    if (data.length === 0) {
      return {
        mapData: [],
        histogramData: [],
      }
    }

    const mapData = data.map(d => {
      const [lat, lng] = d['Location Coordinates'].split(',').map(d => +d)

      return {
        ...d,
        lat,
        lng,
        totalDeadAndMissing: +d['Total Dead and Missing'],
      }
    })

    const histogramData = data.map(d => ({
      ...d,
      reportedDate: new Date(d['Reported Date']),
      totalDeathAndMissing: +d['Total Dead and Missing'],
    }))

    return {
      mapData,
      histogramData,
    }
  }, [data])

  const options = useMemo(
    () => [
      {
        projection: geoAzimuthalEquidistant().scale(120).rotate([0, -90]),
        value: 'AzimuthalEquidistant',
        label: 'Azimuthal Projection',
      },
      {
        projection: geoEqualEarth().scale(160),
        value: 'EqualEarth',
        label: 'Equal Earth Projection',
      },
    ],
    [],
  )

  const [dropDownProjection, selectedProjection] = useDropDown({
    id: 'projections',
    label: 'Choose Projection: ',
    options,
  })

  const [size, setSize] = useState({ svgWidth: 0, svgHeight: 0 })

  useEffect(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    setSize({
      svgWidth: svgRect?.width || 0,
      svgHeight: svgRect?.height || 0,
    })
  }, [])

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
              <Map projection={selectedProjection.projection} size={size} data={mapData} />

              <Histogram data={histogramData} />
            </>
          ) : null}
        </svg>
      </div>
    </div>
  )
}

export default MissingMigrants
