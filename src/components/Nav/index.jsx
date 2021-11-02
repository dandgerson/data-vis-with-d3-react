import React from 'react'
import cl from 'clsx'
import PropTypes from 'prop-types'

import { NavLink, useRouteMatch, useLocation } from 'react-router-dom'

import s from './Nav.m.scss'

const Nav = ({ routes, isColumn, isSubNav }) => {
  const { url, path } = useRouteMatch()
  const location = useLocation()

  console.log('nav', { url, path, pathname: location.pathname })

  return (
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
            className={cl(s.navItem)}
            activeClassName={cl(s['navItem-active'])}
            exact={navItem.path === '/'}
            to={`${url}${isSubNav ? navItem.path : navItem.path.slice(1)}`}
          >
            {navItem.title}
          </NavLink>
        ))}
    </div>
  )
}

Nav.defaultProps = {
  isColumn: false,
  isSubNav: false,
}

Nav.propTypes = {
  routes: PropTypes.array.isRequired,
  isColumn: PropTypes.bool,
  isSubNav: PropTypes.bool,
}

export default Nav
