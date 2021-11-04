/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  scaleLinear, scaleTime, timeFormat, extent, bin, timeMonths, sum, max,
} from 'd3'

import s from './Histogram.m.scss'

const c = {
  margin: {
    top: 20,
    right: 20,
    bottom: 70,
    left: 100,
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

const Histogram = ({ data }) => {
  const svgSize = useMemo(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()
    const width = svgRect?.width || 0
    const height = svgRect?.height || 0

    return {
      innerWidth: width - (c.margin.left + c.margin.right),
      innerHeight: height - (c.margin.top + c.margin.bottom),
    }
  }, [data])

  const getXValue = d => d.reportedDate
  const getYValue = d => d.totalDeathAndMissing

  const xScale = scaleTime().domain(extent(data, getXValue)).range([0, svgSize.innerWidth]).nice()

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
    .range([svgSize.innerHeight, 0])
    .nice()

  const xAxisLabel = 'Reported Date'
  const yAxisLabel = 'Total Death and Missing By Month'

  const formatTick = timeFormat('%m/%d/%Y')
  const formatTooltip = value => value

  const renderAxisBottom = ({ xScale, height, formatTick }) => xScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
      <line y2={height} className={s.axisBottom_line} />
      <text className={s.axisBottom_text} dy={c.axis.x.dy} y={height + c.axis.x.yOffset}>
        {formatTick(tickValue)}
      </text>
    </g>
  ))

  const renderAxisLeft = ({ yScale, width }) => yScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(0,${yScale(tickValue)})`}>
      <line
        x1={0}
        x2={width}
        y1={yScale(tickValue)}
        y2={yScale(tickValue)}
        className={s.axisLeft_line}
      />
      <text key={tickValue} className={s.axisLeft_text} dy={c.axis.y.dy} x={0 - c.axis.y.xOffset}>
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
          height={svgSize.innerHeight - yScale(getYValue(d))}
        >
          <title>{formatTooltip(getYValue(d))}</title>
        </rect>
      ))}
    </g>
  )

  return (
    <svg
      data-svg-container
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {processedData.length > 1 ? (
        <g transform={`translate(${c.margin.left},${c.margin.top})`}>
          <g data-axis-bottom>
            {renderAxisBottom({
              xScale,
              height: svgSize.innerHeight,
              formatTick,
            })}

            <text
              className={s.axisLabel}
              x={svgSize.innerWidth / 2}
              y={svgSize.innerHeight + c.axis.x.label.yOffset}
              dy={c.axis.x.dy}
              textAnchor='middle'
            >
              {xAxisLabel}
            </text>
          </g>

          <g data-axis-left>
            {renderAxisLeft({
              yScale,
              width: svgSize.innerWidth,
              formatTick,
            })}

            <text
              className={s.axisLabel}
              textAnchor='middle'
              transform={`translate(${-c.axis.y.label.xOffset},${
                svgSize.innerHeight / 2
              }) rotate(-90)`}
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
      ) : null}
    </svg>
  )
}

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
}

export default Histogram
