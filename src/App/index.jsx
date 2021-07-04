import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import cl from 'clsx'

import routes from 'routes'
import Header from './Header'
import Footer from './Footer'

import s from './App.m.scss'

const App = () => (
  <BrowserRouter>
    <div className={cl(s.root)}>
      <Header />

      <div className={cl(s.layout)}>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.id}
              exact={route.isExact}
              path={route.path}
              render={() => route.render()}
            />
          ))}
        </Switch>
      </div>

      <Footer />
    </div>
  </BrowserRouter>
)

export default App
