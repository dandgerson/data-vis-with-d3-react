import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import cl from 'clsx'

import routes from 'routes'
import Header from './Header'

import s from './App.m.scss'

const App = () => (
  <HashRouter basename='/'>
    <div className={cl(s.root)}>
      <div className={s.header}>
        <Header />
      </div>

      <div className={cl(s.content)}>
        <Routes>
          {routes.map(route => (
            <Route key={route.id} path={route.path} element={route.render()} />
          ))}
        </Routes>
      </div>
    </div>
  </HashRouter>
)

export default App
