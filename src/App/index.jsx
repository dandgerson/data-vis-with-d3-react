import React from 'react'
import cl from 'clsx'

import HelloWorld from 'components/HelloWorld'

import s from './App.m.scss'

const App = () => (
  <div className={cl(s.root)}>
    <HelloWorld />
  </div>
)

export default App
