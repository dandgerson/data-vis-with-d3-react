import React from 'react'
import { geoAzimuthalEquidistant } from 'd3'

import Map from 'pages/WorldMap/Map'

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
    <Map projection={projection} />
  </div>
)

export default Home
