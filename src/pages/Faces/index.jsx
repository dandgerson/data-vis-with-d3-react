import React from 'react'
import cl from 'clsx'

import Face from './Face'

import s from './Faces.m.scss'

const Faces = () => (
  <div className={cl(s.root)}>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '5px',
      }}
    >
      {Array.from({ length: 9 * 18 }, (_, i) => (
        <Face
          key={i}
          width={100}
          height={100}
          options={{
            strokeWidth: 0,
            eye: {
              leftR: (Math.random() + 0.2) * 0.09,
              rightR: (Math.random() + 0.2) * 0.09,
            },
            mouth: {
              r: (Math.random() + 0.1) * 0.35,
              width: (Math.random() + 0.5) * 0.045,
              turn: Math.random() * 0.15 * (Math.random() >= 0.5 ? -1 : 1),
            },
          }}
        />
      ))}
    </div>
  </div>
)

export default Faces
