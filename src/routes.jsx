import React from 'react'

import Home from 'pages/Home'
import Faces from 'pages/Faces'
import LoadCsv from 'pages/LoadCsv'
import MouseFollower from 'pages/MouseFollower'
import ParseCsv from 'pages/ParseCsv'
import LoadingDataWithReact from 'pages/LoadingDataWithReact'
import VegaLiteApi from 'pages/VegaLiteApi'
import BarChart from 'pages/BarChart'
import ScatterPlot from 'pages/ScatterPlot'
import LineChart from 'pages/LineChart'

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
    id: 6,
    path: '/vega-lite-api',
    title: 'Vega Lite API',
    isExact: true,
    isNavItem: true,
    render: () => <VegaLiteApi />,
  },
  {
    id: 7,
    path: '/loading-data-with-react',
    title: 'Loading Data with React',
    isExact: true,
    isNavItem: true,
    render: () => <LoadingDataWithReact />,
  },
  {
    id: 8,
    path: '/bar-chart',
    title: 'Bar Chart',
    isExact: true,
    isNavItem: true,
    render: () => <BarChart />,
  },
  {
    id: 9,
    path: '/scatter-plot',
    title: 'Scatter Plot',
    isExact: true,
    isNavItem: true,
    render: () => <ScatterPlot />,
  },
  {
    id: 10,
    path: '/line-chart',
    title: 'Line Chart',
    isExact: true,
    isNavItem: true,
    render: () => <LineChart />,
  },
  {
    id: 0,
    path: '*',
    title: 'Page404',
    render: () => <Page404 />,
  },
]

export default routes
