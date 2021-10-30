import React, { useState, useCallback } from 'react'

const MouseFollower = () => {
  const c = {
    width: 900,
    height: 900,
    r: 0.035,
  }

  const [[posX, posY], setPos] = useState([c.width / 2, c.height / 2])

  const handleMouseMove = useCallback(e => {
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
        width={c.width}
        height={c.height}
        style={{
          outline: '1px solid',
        }}
        onMouseMove={handleMouseMove}
      >
        <circle cx={posX} cy={posY} r={c.height * c.r} fill='aqua' />
      </svg>
    </div>
  )
}

export default MouseFollower
