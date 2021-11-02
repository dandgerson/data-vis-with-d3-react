import React from 'react'
import Azimuthal from 'pages/WorldMap/Azimuthal'

// import s from './Home.m.scss'

const Home = () => (
  <div
    data-home-root
    style={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Azimuthal />
  </div>
)

export default Home
