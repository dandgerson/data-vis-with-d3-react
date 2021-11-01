/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import {
  scaleLinear, scaleTime, timeFormat, format, extent, line, curveNatural,
} from 'd3'

import s from './LineChart.m.scss'

const LineChart = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/2841e9b30f3a7c2c9da7bb4d06ecc3fc/raw/week_temperatature.csv',
    d => ({
      temperature: +d.temperature,
      timestamp: new Date(d.timestamp),
    }),
  )

  console.log({
    data,
  })

  const c = {
    margin: {
      top: 20,
      right: 20,
      bottom: 70,
      left: 80,
    },
    axis: {
      bottom: {
        dy: '.71em',
        margin: 8,
        label: {
          text: 'Time',
          margin: 40,
        },
      },
      left: {
        dy: '.32em',
        margin: 8,
        label: {
          text: 'Temperature C°',
          margin: 40,
        },
      },
    },
    marks: {
      circle: {
        radius: 5,
      },
      line: {
        strokeWidth: 4,
      },
    },
  }

  const getXValue = d => d.timestamp
  const getYValue = d => d.temperature

  const formatTick = timeFormat('%a')
  const formatTooltip = tickValue => `${format('.4s')(tickValue)} C°`

  const svgContainerProps = useMemo(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()
    const width = svgRect?.width || 0
    const height = svgRect?.height || 0

    return {
      innerWidth: width - (c.margin.left + c.margin.right),
      innerHeight: height - (c.margin.top + c.margin.bottom),
    }
  }, [data])

  const d3Props = useMemo(
    () => ({
      xScale: scaleTime()
        .domain(extent(data, getXValue))
        .range([0, svgContainerProps.innerWidth])
        .nice(),
      yScale: scaleLinear()
        .domain(extent(data, getYValue))
        .range([svgContainerProps.innerHeight, 0])
        .nice(),
    }),
    [data],
  )

  const renderAxisBottom = ({ xScale, height, formatTick }) => xScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
      <line y2={height} className={s.axisBottom_line} />
      <text className={s.axisBottom_text} dy={c.axis.bottom.dy} y={height + c.axis.bottom.margin}>
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
      <text
        key={tickValue}
        className={s.axisLeft_text}
        dy={c.axis.left.dy}
        x={0 - c.axis.left.margin}
      >
        {tickValue}
      </text>
    </g>
  ))

  const renderMarks = ({
    data, yScale, xScale, getYValue, getXValue, formatTooltip,
  }) => (
    <g className={s.renderMarks}>
      <path
        className={s.marks_line}
        strokeWidth={c.marks.line.strokeWidth}
        d={line()
          .curve(curveNatural)
          .x(d => xScale(d.timestamp))
          .y(d => yScale(d.temperature))(data)}
      />
      {data.map((d, i) => (
        <circle
          key={i}
          className={s.marks_circle}
          cx={xScale(getXValue(d))}
          cy={yScale(getYValue(d))}
          r={c.marks.circle.radius}
        >
          <title>{formatTooltip(d.temperature)}</title>
        </circle>
      ))}
    </g>
  )

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '20%',
        }}
      >
        <h2>Line Chart</h2>
        <br />
        <h2>The Week Temperature dataset</h2>
        <p>The Week Temperature dataset of San Francisco</p>
      </div>

      <div className='separator-v'>
        <div />
      </div>

      <div
        style={{
          flex: 1,
        }}
      >
        <svg
          data-svg-container
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <g transform={`translate(${c.margin.left},${c.margin.top})`}>
            <g data-axis-bottom>
              {renderAxisBottom({
                xScale: d3Props.xScale,
                height: svgContainerProps.innerHeight,
                formatTick,
              })}

              <text
                className={s.axisLabel}
                x={svgContainerProps.innerWidth / 2}
                y={svgContainerProps.innerHeight + c.axis.bottom.label.margin}
                dy={c.axis.bottom.dy}
                textAnchor='middle'
              >
                {c.axis.bottom.label.text}
              </text>
            </g>

            <g data-axis-left>
              {renderAxisLeft({
                yScale: d3Props.yScale,
                width: svgContainerProps.innerWidth,
                formatTick,
              })}

              <text
                className={s.axisLabel}
                textAnchor='middle'
                transform={`translate(${-c.axis.left.label.margin},${
                  svgContainerProps.innerHeight / 2
                }) rotate(-90)`}
              >
                {c.axis.left.label.text}
              </text>
            </g>

            <g data-marks>
              {renderMarks({
                data,
                xScale: d3Props.xScale,
                yScale: d3Props.yScale,
                getYValue,
                getXValue,
                formatTooltip,
              })}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default LineChart
