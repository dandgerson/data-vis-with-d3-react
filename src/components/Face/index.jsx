import React from 'react'
import PropTypes from 'prop-types'
import cl from 'clsx'
import merge from 'lodash/merge'

import s from './Face.m.scss'

const Face = ({ width, height, strokeWidth, options }) => {
  const c = merge(
    {
      centerX: width / 2,
      centerY: height / 2,
      eye: {
        r: 5,
        offsetX: 150,
        offsetY: 70,
      },
    },
    options,
  )

  return (
    <svg data-svg-face width={width} height={height} className={cl(s.root)}>
      <circle data-head r={c.centerX - strokeWidth / 2} cx={c.centerX} cy={c.centerY} strokeWidth={strokeWidth} />
      <circle
        data-eye-left
        r={c.centerY / c.eye.r}
        cx={c.centerX - c.eye.offsetX}
        cy={c.centerY - c.eye.offsetY}
        strokeWidth={strokeWidth}
      />
      <circle
        data-eye-right
        r={c.centerY / c.eye.r}
        cx={c.centerX + c.eye.offsetX}
        cy={c.centerY - c.eye.offsetY}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

Face.defaultProps = {
  options: {},
  strokeWidth: 0,
}

Face.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  options: PropTypes.object,
}

export default Face
