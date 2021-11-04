/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import { geoAzimuthalEquidistant, geoEqualEarth } from 'd3'

import { useDropDown } from 'components/DropDown'
import Map from 'pages/WorldMap/Map'

const WorldMap = () => {
  const options = useMemo(
    () => [
      {
        projection: geoAzimuthalEquidistant().rotate([0, -90]),
        value: 'AzimuthalEquidistant',
        label: 'Azimuthal Projection',
      },
      {
        projection: geoEqualEarth().scale(140),
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
        <h2>World Map!</h2>
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
        <Map projection={selectedProjection.projection} />
      </div>
    </div>
  )
}

export default WorldMap
