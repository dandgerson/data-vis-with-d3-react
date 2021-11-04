import React from 'react'

import Home from 'pages/Home'
import Faces from 'pages/Faces'
import LoadCsv from 'pages/LoadCsv'
import MouseFollower from 'pages/MouseFollower'
import ParseCsv from 'pages/ParseCsv'
import LoadingDataWithReact from 'pages/LoadingDataWithReact'
import BarChart from 'pages/BarChart'
import ScatterPlot from 'pages/ScatterPlot'
import LineChart from 'pages/LineChart'

import Page404 from 'pages/Page404'
import WorldMap from 'pages/WorldMap'

const route404 = {
  id: 0,
  path: '*',
  title: 'Page404',
  render: () => <Page404 />,
}

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
    isNavItem: false,
    render: () => <Faces />,
  },
  {
    id: 3,
    path: '/load-csv',
    title: 'Load CSV Data',
    isExact: true,
    isNavItem: false,
    render: () => <LoadCsv />,
  },
  {
    id: 4,
    path: '/mouse-follower',
    title: 'Mouse Follower',
    isExact: true,
    isNavItem: false,
    render: () => <MouseFollower />,
  },
  {
    id: 5,
    path: '/parse-csv-data-with-d3',
    title: 'Parse CSV Data with D3',
    isExact: true,
    isNavItem: false,
    render: () => <ParseCsv />,
  },
  {
    id: 7,
    path: '/loading-data-with-react',
    title: 'Loading Data with React',
    isExact: false,
    isNavItem: true,
    render: () => <LoadingDataWithReact />,
  },
  {
    id: 8,
    path: '/bar-chart',
    title: 'Bar Chart',
    isExact: false,
    isNavItem: true,
    render: () => <BarChart />,
  },
  {
    id: 9,
    path: '/scatter-plot',
    title: 'Scatter Plot',
    isExact: false,
    isNavItem: true,
    render: () => <ScatterPlot />,
  },
  {
    id: 10,
    path: '/line-chart',
    title: 'Line Chart',
    isExact: false,
    isNavItem: true,
    render: () => <LineChart />,
  },
  {
    id: 11,
    path: '/world-map',
    title: 'World Map',
    isExact: false,
    isNavItem: true,
    render: () => <WorldMap />,
  },
  route404,
]

export default routes
