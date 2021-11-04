import React from 'react'
import { geoAzimuthalEquidistant } from 'd3'

import CitiesMap from 'pages/WorldMap/CitiesMap'

// import s from './Home.m.scss'
const projection = geoAzimuthalEquidistant().scale(130).rotate([0, -90])

const Home = () => (
  <div
    data-home-root
    style={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <CitiesMap projection={projection} />
  </div>
)

export default Home
