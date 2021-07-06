import React from 'react'

import Nav from './Nav'

import s from './Header.m.scss'

const Header = () => (
  <div className={s.root}>
    <div className={s.logo}>
      <h1>Data Visualization with D3 and React</h1>
    </div>

    <div className={s.nav}>
      <Nav />
    </div>
  </div>
)

export default Header
