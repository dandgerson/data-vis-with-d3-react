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
      <div className={s.header}>
        <Header />
      </div>

      <div className={cl(s.content)}>
        <Switch>
          {routes.map(route => (
            <Route key={route.id} exact={route.isExact} path={route.path} render={route.render} />
          ))}
        </Switch>
      </div>

      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  </BrowserRouter>
)

export default App
