/* eslint-disable no-shadow */
import React, { useMemo } from 'react'

import routes from 'routes'
import { useDropDown } from 'components/DropDown'

const WorldMap = () => {
  const worldMapRoutes = routes.find(route => route.path === '/world-map').routes

  const options = worldMapRoutes
    .filter(route => route.path !== '*')
    .map(route => ({
      value: route.path,
      label: route.title,
    }))

  const [dropDownProjection, selectedProjection] = useDropDown({
    id: 'projections',
    label: 'Choose Projection: ',
    options,
  })

  const projection = useMemo(
    () => worldMapRoutes.find(route => route.path === selectedProjection),
    [selectedProjection],
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
        <h2>{projection.title}</h2>
        {projection.render()}
      </div>
    </div>
  )
}

export default WorldMap
