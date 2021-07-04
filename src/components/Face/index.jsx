import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import cl from 'clsx'
import merge from 'lodash/merge'

import { arc } from 'd3'

import s from './Face.m.scss'

const Face = ({ width, height, options }) => {
  const c = useMemo(
    () =>
      merge(
        {
          centerX: 0.5,
          centerY: 0.5,
          strokeWidth: 0.02,
          eye: {
            r: height * 0.08,
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
    () =>
      arc()
        .innerRadius(height * c.mouth.r)
        .outerRadius(height * c.mouth.r + height * c.mouth.width)
        .startAngle(Math.PI * 0.5 + Math.PI * c.mouth.size - Math.PI * c.mouth.turn)
        .endAngle(Math.PI + Math.PI * 0.5 - Math.PI * c.mouth.size - Math.PI * c.mouth.turn)(),
    [],
  )

  return (
    <svg data-svg-face width={width} height={height} className={cl(s.root)}>
      <g transform={`translate(${c.centerX * width},${c.centerY * height})`}>
        <circle
          data-head
          r={c.centerY * height - c.strokeWidth * height * 0.5}
          strokeWidth={c.strokeWidth * height}
        />
        <circle
          data-eye-left
          r={c.eye.r}
          cx={-c.eye.offsetX * width}
          cy={-c.eye.offsetY * height}
          strokeWidth={c.eye.strokeWidth}
        />
        <circle
          data-eye-right
          r={c.eye.r}
          cx={c.eye.offsetX * width}
          cy={-c.eye.offsetY * height}
          strokeWidth={c.eye.strokeWidth * height}
        />

        <path
          data-smile
          transform={`translate(${width * c.mouth.translateX},${height * c.mouth.translateY})`}
          d={mouthArc}
        />
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
