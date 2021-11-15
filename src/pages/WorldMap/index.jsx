/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { geoAzimuthalEquidistant, geoEqualEarth } from 'd3'

import { useDropDown } from 'components/DropDown'
import CitiesMap from 'pages/WorldMap/CitiesMap'
import HivAidsChoroplethMap from './HivAidsChoroplethMap'

const WorldMap = ({ map }) => {
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

  const maps = {
    cities: {
      title: 'Cities Map',
      render: ({ projection }) => <CitiesMap projection={projection} />,
    },
    hiv: {
      title: 'HIV Map',
      render: ({ projection }) => <HivAidsChoroplethMap projection={projection} />,
    },
  }

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
        <h2>{`World ${maps[map].title}`}</h2>
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

        {maps[map].render({ projection: selectedProjection.projection })}
      </div>
    </div>
  )
}

WorldMap.defaultProps = {
  map: 'cities',
}

WorldMap.propTypes = {
  map: PropTypes.string,
}

export default WorldMap
