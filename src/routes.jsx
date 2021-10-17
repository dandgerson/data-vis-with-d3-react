import React from 'react'

import Home from 'pages/Home'
import Faces from 'pages/Faces'
import LoadCsv from 'pages/LoadCsv'
import MouseFollower from 'pages/MouseFollower'
import ParseCsv from 'pages/ParseCsv'
import VegaLiteApi from 'pages/VegaLiteApi'

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
    id: 3,
    path: '/load-csv',
    title: 'Load CSV Data',
    isExact: true,
    isNavItem: true,
    render: () => <LoadCsv />,
  },
  {
    id: 4,
    path: '/mouse-follower',
    title: 'Mouse Follower',
    isExact: true,
    isNavItem: true,
    render: () => <MouseFollower />,
  },
  {
    id: 5,
    path: '/parse-csv-data-with-d3',
    title: 'Parse CSV Data with D3',
    isExact: true,
    isNavItem: true,
    render: () => <ParseCsv />,
  },
  {
    id: 6,
    path: '/vega-lite-api',
    title: 'Vega Lite API',
    isExact: true,
    isNavItem: true,
    render: () => <VegaLiteApi />,
  },
  {
    id: 0,
    path: '*',
    title: 'Page404',
    render: () => <Page404 />,
  },
]

export default routes
