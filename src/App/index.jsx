import React from 'react'
import cl from 'clsx'

import Face from 'components/Face'

import s from './App.m.scss'

const App = () => (
  <div className={cl(s.root)}>
    <Face width={600} height={600} strokeWidth={10} />
  </div>
)

export default App
