/* eslint-disable no-shadow */
import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import Nav from 'components/Nav'
import routes from 'routes'
import Azimuthal from 'pages/WorldMap/Azimuthal'

const WorldMap = () => {
  const worldMapRoutes = routes.find(route => route.path === '/world-map').routes
  const { path } = useRouteMatch()

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
        <h2>Projections:</h2>

        <Nav routes={worldMapRoutes} isColumn isSubNav />
      </div>

      <div className='separator-v'>
        <div />
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
        }}
      >
        <Switch>
          <Route
            exact
            path={path}
            render={() => (
              <div
                style={{
                  flex: 1,
                }}
              >
                <Azimuthal />
              </div>
            )}
          />

          {worldMapRoutes.map(route => (
            <Route
              key={route.id}
              exact={route.isExact}
              path={`${path}${route.path}`}
              render={route.render}
            />
          ))}
        </Switch>
      </div>
    </div>
  )
}

export default WorldMap
