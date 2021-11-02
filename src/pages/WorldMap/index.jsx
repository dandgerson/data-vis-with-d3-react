/* eslint-disable no-shadow */
import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import Nav from 'components/Nav'
import routes from 'routes'

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
          flex: 1,
        }}
      >
        <Switch>
          <Route exact path={path} render={() => <h2>Select Projection</h2>} />
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
