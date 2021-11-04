/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  scaleLinear, scaleTime, timeFormat, extent, bin, timeMonths, sum, max,
} from 'd3'

import s from './Histogram.m.scss'

const c = {
  margin: {
    left: 60,
  },
  axis: {
    x: {
      dy: '.71em',
      yOffset: 15,
      label: {
        yOffset: 40,
      },
    },
    y: {
      dy: '.32em',
      xOffset: 8,
      label: {
        xOffset: 50,
      },
    },
  },
  marks: {
    circle: {
      radius: 2,
    },
    line: {
      strokeWidth: 2,
    },
  },
}

const Histogram = ({ data, size }) => {
  const getXValue = d => d.reportedDate
  const getYValue = d => d.totalDeathAndMissing

  const xScale = scaleTime().domain(extent(data, getXValue)).range([0, size.width]).nice()

  const [start, stop] = xScale.domain()

  const processedData = useMemo(() => {
    const binnedData = bin()
      .value(getXValue)
      .domain(xScale.domain())
      .thresholds(timeMonths(start, stop))(data)

    console.log({ binnedData })

    const processedData = binnedData.map(monthDataSet => ({
      totalDeathAndMissingByMonth: sum(monthDataSet, getYValue),
      x0: monthDataSet.x0,
      x1: monthDataSet.x1,
    }))

    return processedData
  }, [data])

  console.log({ processedData })

  const getXProcessedValue = d => d.x0
  const getYProcessedValue = d => d.totalDeathAndMissingByMonth

  const yScale = scaleLinear()
    .domain([0, max(processedData, getYProcessedValue)])
    .range([size.height, 0])
    .nice()

  const xAxisLabel = 'Reported Date'
  const yAxisLabel = 'Dead and Missing By Month'

  const formatTick = timeFormat('%m/%d/%Y')
  const formatTooltip = value => value

  const renderXAxis = ({ xScale, height, formatTick }) => xScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
      <line y2={height} className={s.axisBottom_line} />
      <text className={s.axisBottom_text} dy={c.axis.x.dy} y={height + c.axis.x.yOffset}>
        {formatTick(tickValue)}
      </text>
    </g>
  ))

  const renderYxis = ({ yScale, width }) => yScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(0,${yScale(tickValue)})`}>
      <line className={s.axisLeft_line} x1={0} x2={width} />
      <text className={s.axisLeft_text} dy={c.axis.y.dy} x={0 - c.axis.y.xOffset}>
        {tickValue}
      </text>
    </g>
  ))

  const renderMarks = ({
    data, yScale, xScale, getYValue, getXValue, formatTooltip,
  }) => (
    <g className={s.renderMarks}>
      {data.map((d, i) => (
        <rect
          key={i}
          className={s.marks_circle}
          x={xScale(getXValue(d))}
          y={yScale(getYValue(d))}
          width={xScale(d.x1) - xScale(d.x0)}
          height={size.height - yScale(getYValue(d))}
        >
          <title>{formatTooltip(getYValue(d))}</title>
        </rect>
      ))}
    </g>
  )

  return (
    <g data-histogram>
      <rect className={s.substrate} width={size.width} height={size.height} />

      <g data-x-axis>
        {renderXAxis({
          xScale,
          height: size.height,
          formatTick,
        })}

        <text
          className={s.axisLabel}
          x={size.width / 2}
          y={size.height + c.axis.x.label.yOffset}
          dy={c.axis.x.dy}
          textAnchor='middle'
        >
          {xAxisLabel}
        </text>
      </g>

      <g data-y-axis>
        {renderYxis({
          yScale,
          width: size.width,
          formatTick,
        })}

        <text
          className={s.axisLabel}
          textAnchor='middle'
          transform={`translate(${-c.axis.y.label.xOffset},${size.height / 2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
      </g>

      <g data-marks>
        {renderMarks({
          data: processedData,
          xScale,
          yScale,
          getYValue: getYProcessedValue,
          getXValue: getXProcessedValue,
          formatTooltip,
        })}
      </g>
    </g>
  )
}

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
}

export default Histogram
