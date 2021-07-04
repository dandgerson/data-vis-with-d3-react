import React, { useState, useCallback } from 'react'

const MouseFollower = () => {
  const width = 900
  const height = 900
  const r = 0.035

  const [[posX, posY], setPos] = useState([width / 2, height / 2])
  const handleMouseMove = useCallback((e) => {
    const { top, left } = document
      .querySelector('[data-mouse-follower-svg]')
      .getBoundingClientRect()
    setPos([e.clientX - left, e.clientY - top])
  }, [])

  return (
    <div
      data-mouse-follower
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div>Mouse Follower</div>
      <svg
        data-mouse-follower-svg
        width={width}
        height={height}
        style={{
          outline: '1px solid',
        }}
        onMouseMove={handleMouseMove}
      >
        <circle cx={posX} cy={posY} r={height * r} fill="aqua" />
      </svg>
    </div>
  )
}

export default MouseFollower
