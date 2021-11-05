/* eslint-disable no-shadow */
import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  scaleLinear,
  scaleTime,
  timeFormat,
  extent,
  bin,
  timeMonths,
  sum,
  max,
  brushX,
  select,
} from 'd3'

import s from './Histogram.m.scss'

const c = {
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

const formatTick = timeFormat('%m/%d/%Y')
const getYValue = d => d.totalDeadAndMissing
const getXProcessedValue = d => d.x0
const getYProcessedValue = d => d.totalDeadAndMissingByMonth
const formatTooltip = value => value

const Histogram = ({
  data, size, setBrushExtent, getXValue,
}) => {
  const xScale = useMemo(
    () => scaleTime().domain(extent(data, getXValue)).range([0, size.width]).nice(),
    [data, getXValue, size.width],
  )

  const processedData = useMemo(() => {
    const [start, stop] = xScale.domain()

    const binnedData = bin()
      .value(getXValue)
      .domain(xScale.domain())
      .thresholds(timeMonths(start, stop))(data)

    const processedData = binnedData.map(monthDataSet => ({
      totalDeadAndMissingByMonth: sum(monthDataSet, getYValue),
      x0: monthDataSet.x0,
      x1: monthDataSet.x1,
    }))

    return processedData
  }, [data, getXValue, xScale, getYValue])

  const yScale = useMemo(
    () => scaleLinear()
      .domain([0, max(processedData, getYProcessedValue)])
      .range([size.height, 0])
      .nice(),
    [processedData, getYProcessedValue, size.height],
  )

  const xAxisLabel = 'Reported Date'
  const yAxisLabel = 'Dead and Missing By Month'

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

  useEffect(() => {
    const brushSelection = select(document.querySelector('[data-brush]'))
    const brush = brushX().extent([
      [0, 0],
      [size.width, size.height],
    ])
    brush(brushSelection)
    brush.on('brush end', ({ selection }) => {
      setBrushExtent(selection?.map(d => xScale.invert(d)))
    })
  }, [data])

  console.log('plain')

  const xAxis = useMemo(
    () => renderXAxis({
      xScale,
      height: size.height,
      formatTick,
    }),
    [xScale, size.height, formatTick],
  )

  const yAxis = useMemo(
    () => renderYxis({
      yScale,
      width: size.width,
      formatTick,
    }),
    [yScale, size.width, formatTick],
  )

  const marks = useMemo(
    () => renderMarks({
      data: processedData,
      xScale,
      yScale,
      getYValue: getYProcessedValue,
      getXValue: getXProcessedValue,
      formatTooltip,
    }),
    [processedData, xScale, yScale, getXProcessedValue, getYProcessedValue, formatTooltip],
  )

  return (
    <g data-histogram>
      <rect className={s.substrate} width={size.width} height={size.height} />

      <g data-x-axis>
        {xAxis}

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
        {yAxis}

        <text
          className={s.axisLabel}
          textAnchor='middle'
          transform={`translate(${-c.axis.y.label.xOffset},${size.height / 2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
      </g>

      <g data-marks>{marks}</g>

      <g data-brush />
    </g>
  )
}

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
  getXValue: PropTypes.func.isRequired,
  setBrushExtent: PropTypes.func.isRequired,
}

export default Histogram
