import React from 'react'
import PropTypes from 'prop-types'
import cl from 'clsx'
import merge from 'lodash/merge'

import { arc } from 'd3'

import s from './Face.m.scss'

const Face = ({ width, height, options }) => {
  const c = merge(
    {
      centerX: height * 0.5,
      centerY: height * 0.5,
      strokeWidth: height * 0.02,
      eye: {
        r: height * 0.08,
        offsetX: width * 0.22,
        offsetY: height * 0.2,
        strokeWidth: 0,
      },
      mouth: {
        r: height * 0.25,
        width: height * 0.035,
        size: 0.1,
        turn: 0,
        translateX: 0,
        translateY: 0,
      },
    },
    options,
  )

  const mouthArc = arc()
    .innerRadius(c.mouth.r)
    .outerRadius(c.mouth.r + c.mouth.width)
    .startAngle(Math.PI * 0.5 + Math.PI * c.mouth.size - Math.PI * c.mouth.turn)
    .endAngle(Math.PI + Math.PI * 0.5 - Math.PI * c.mouth.size - Math.PI * c.mouth.turn)()

  return (
    <svg data-svg-face width={width} height={height} className={cl(s.root)}>
      <g transform={`translate(${c.centerX},${c.centerY})`}>
        <circle data-head r={c.centerY - c.strokeWidth * 0.5} strokeWidth={c.strokeWidth} />
        <circle data-eye-left r={c.eye.r} cx={-c.eye.offsetX} cy={-c.eye.offsetY} strokeWidth={c.eye.strokeWidth} />
        <circle data-eye-right r={c.eye.r} cx={c.eye.offsetX} cy={-c.eye.offsetY} strokeWidth={c.eye.strokeWidth} />

        <path data-smile transform={`translate(${c.mouth.translateX},${c.mouth.translateY})`} d={mouthArc} />
      </g>
    </svg>
  )
}

Face.defaultProps = {
  options: {},
}

Face.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  options: PropTypes.object,
}

export default Face
