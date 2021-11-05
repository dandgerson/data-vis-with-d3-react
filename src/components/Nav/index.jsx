import React from 'react'
import cl from 'clsx'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'

import s from './Nav.m.scss'

const Nav = ({ routes, isColumn }) => (
  <div
    className={s.root}
    style={{
      flexDirection: isColumn ? 'column' : 'raw',
    }}
  >
    {routes
      .filter(route => route.isNavItem)
      .map(navItem => (
        <NavLink
          key={navItem.id}
          className={navData => cl(s.navItem, navData.isActive ? s['navItem-active'] : '')}
          to={navItem.path}
        >
          {navItem.title}
        </NavLink>
      ))}
  </div>
)

Nav.defaultProps = {
  isColumn: false,
}

Nav.propTypes = {
  routes: PropTypes.array.isRequired,
  isColumn: PropTypes.bool,
}

export default Nav
