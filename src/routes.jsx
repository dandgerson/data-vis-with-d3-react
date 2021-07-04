import React from 'react'

import Home from 'pages/Home'
import Faces from 'pages/Faces'
import Page404 from 'pages/Page404'

const routes = [
  {
    id: 1,
    path: '/',
    title: 'Home',
    isExact: true,
    isNavItem: true,
    render: () => <Home />,
  },
  {
    id: 2,
    path: '/faces',
    title: 'Faces',
    isExact: true,
    isNavItem: true,
    render: () => <Faces />,
  },
  {
    id: 0,
    path: '*',
    title: 'Page404',
    render: () => <Page404 />,
  },
]

export default routes
