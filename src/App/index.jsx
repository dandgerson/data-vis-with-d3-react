import React from 'react'
import cl from 'clsx'

import Face from 'components/Face'

import s from './App.m.scss'

const App = () => (
  <div className={cl(s.root)}>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <Face width={600} height={600} />
      <Face
        width={300}
        height={300}
        options={{
          mouth: {
            turn: 0.95,
            translateY: 0.35,
          },
        }}
      />
    </div>
  </div>
)

export default App
