import React from 'react'
import cl from 'clsx'

import { NavLink } from 'react-router-dom'
import routes from 'routes'

import s from './Nav.m.scss'

const Nav = () => (
  <div className={s.root}>
    {routes
      .filter((route) => route.isNavItem)
      .map((navItem) => (
        <NavLink
          key={navItem.id}
          className={cl(s.navItem)}
          activeClassName={cl(s['navItem-active'])}
          exact
          to={navItem.path}
        >
          {navItem.title}
        </NavLink>
      ))}
  </div>
)

export default Nav
