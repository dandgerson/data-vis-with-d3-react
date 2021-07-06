import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import cl from 'clsx'
import merge from 'lodash/merge'

import { arc } from 'd3'

import s from './Face.m.scss'

const Face = ({ width, height, options }) => {
  const c = useMemo(
    () => merge(
      {
        centerX: 0.5,
        centerY: 0.5,
        strokeWidth: 0.02,
        eye: {
          leftR: 0.08,
          rightR: 0.08,
          offsetX: 0.22,
          offsetY: 0.2,
          strokeWidth: 0,
        },
        mouth: {
          r: 0.25,
          width: 0.035,
          size: 0.1,
          turn: 0,
          translateX: 0,
          translateY: 0,
        },
      },
      options,
    ),
    [],
  )

  const mouthArc = useMemo(
    () => arc()
      .innerRadius(height * c.mouth.r)
      .outerRadius(height * c.mouth.r + height * c.mouth.width)
      .startAngle(Math.PI * 0.5 + Math.PI * c.mouth.size - Math.PI * c.mouth.turn)
      .endAngle(Math.PI + Math.PI * 0.5 - Math.PI * c.mouth.size - Math.PI * c.mouth.turn)(),
    [],
  )

  return (
    <div className={cl(s.root)}>
      <svg data-svg-face width={width} height={height} className={cl(s.root)}>
        <g transform={`translate(${c.centerX * width},${c.centerY * height})`}>
          <circle
            data-head
            r={c.centerY * height - c.strokeWidth * height * 0.5}
            strokeWidth={c.strokeWidth * height}
          />
          <circle
            data-eye-left
            r={height * c.eye.leftR}
            cx={-c.eye.offsetX * width}
            cy={-c.eye.offsetY * height}
            strokeWidth={c.eye.strokeWidth}
          />
          <circle
            data-eye-right
            r={height * c.eye.rightR}
            cx={c.eye.offsetX * width}
            cy={-c.eye.offsetY * height}
            strokeWidth={c.eye.strokeWidth * height}
          />

          <path
            data-mouth
            transform={`translate(${width * c.mouth.translateX},${height * c.mouth.translateY})`}
            d={mouthArc}
          />
        </g>
      </svg>
    </div>
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
