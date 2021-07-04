import React from 'react'
import cl from 'clsx'
import { NavLink } from 'react-router-dom'

import routes from 'routes'

import s from './Header.m.scss'

const Header = () => (
  <div className={s.root}>
    {routes
      .filter((route) => route.isNavItem)
      .map((navItem) => (
        <NavLink
          key={navItem.id}
          className={cl(s.navItem)}
          activeClassName={cl(s['navItem-active'])}
          to={navItem.path}
        >
          {navItem.title}
        </NavLink>
      ))}
  </div>
)

export default Header
