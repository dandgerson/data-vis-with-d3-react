/* eslint-disable no-shadow */
import React, { useMemo, useEffect } from 'react'
import useCsv from 'hooks/useCsv'
import {
  select,
  axisBottom,
  axisLeft,
  format,
  timeParse,
  timeFormat,
  scaleTime,
  scaleLog,
  extent,
  line,
} from 'd3'

import s from './Covid19Chart.m.scss'

const formatNumber = num => format('.2s')(num)
const parseDate = timeParse('%m/%d/%Y')
const parseTime = timeFormat('%e %b %y')
const getXValue = d => d.date
const getYValue = d => d.deaths
const c = {
  marker: {
    left: { dx: -8 },
    bottom: { dy: 8 },
  },
  margin: {
    top: 80,
    right: 80,
    bottom: 100,
    left: 100,
  },
  axis: {
    tickXPadding: 16,
    tickYPadding: 4,
  },
  label: {
    top: { dy: -40 },
    left: { dy: -50 },
    bottom: { dy: 50 },
  },
}

const Covid19Chart = () => {
  const [data] = useCsv(
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  )

  const deathsData = useMemo(
    () => data.columns.slice(4).map(day => ({
      date: parseDate(day),
      deaths: data.reduce((acc, current) => acc + +current[day], 0),
    })),
    [data],
  )

  const svgSize = useMemo(() => {
    const svgRect = document.querySelector('[data-svg]')?.getBoundingClientRect()

    return {
      width: svgRect?.width || 0,
      height: svgRect?.height || 0,
    }
  }, [data])

  // https://observablehq.com/@d3/margin-convention
  const innerWidth = svgSize.width - c.margin.left - c.margin.right
  const innerHeight = svgSize.height - c.margin.top - c.margin.bottom

  const xScale = scaleTime().domain(extent(deathsData, getXValue)).range([0, innerWidth])

  // The trick with Log scale is that you can't start with zero in the domain
  const yScale = scaleLog().domain(extent(deathsData, getYValue)).range([innerHeight, 0])

  console.log(extent(deathsData, getYValue))

  const lineGenerator = line()
    .x(d => xScale(getXValue(d)))
    .y(d => yScale(getYValue(d)))(deathsData)

  const renderYMarker = () => {
    const qty = 100000 * 30
    const yPos = yScale(qty)

    return (
      <g data-y-marker className={s.marker}>
        <text
          className={s.marker_text}
          textAnchor='end'
          alignmentBaseline='central'
          y={yPos}
          dx={c.marker.left.dx}
        >
          {formatNumber(qty)}
        </text>
        <line className={s.marker_line} x2={innerWidth} y1={yPos} y2={yPos} />
      </g>
    )
  }

  const renderXMarker = () => {
    const xValue = getXValue(deathsData.slice(-1)[0])
    const xPos = xScale(xValue)

    return (
      <g data-x-marker className={s.marker}>
        <text
          className={s.marker_text}
          textAnchor='middle'
          alignmentBaseline='hanging'
          x={xPos}
          y={innerHeight}
          dy={c.marker.bottom.dy}
        >
          {parseTime(xValue)}
        </text>
        <line className={s.marker_line} y2={innerHeight} x1={xPos} x2={xPos} />
      </g>
    )
  }

  useEffect(() => {
    if (deathsData.length === 0) return

    const xAxis = axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(c.axis.tickXPadding)
      .tickFormat(parseTime)

    const xAxisG = select('[data-x-axis]').call(xAxis)

    xAxisG.select('.domain').classed(s.domain, true)
    xAxisG.selectAll('.tick').classed(s.tick, true).selectAll('text').nodes()
      .slice(-1)[0].remove()
  }, [deathsData])

  const renderXAxis = () => (
    <g data-x-axis className={s.xAxis} transform={`translate(0,${innerHeight})`} />
  )

  useEffect(() => {
    if (deathsData.length === 0) return

    const yAxis = axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(c.axis.tickYPadding)
      .ticks(10, '~s')

    const yAxisG = select('[data-y-axis]').call(yAxis)

    yAxisG.select('.domain').classed(s.domain, true)
    yAxisG.selectAll('.tick').classed(s.tick, true)
  }, [deathsData])

  const renderYAxis = () => <g data-y-axis className={s.yAxis} />

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
        <h2>Covid-19 Chart</h2>
        <br />

        <p>
          This program loads and parses the
          {' '}
          <a
            className='a'
            target='_blank'
            href='https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
            rel='noreferrer'
          >
            Jhons Hopkins Coronavirus Dataset
          </a>
        </p>
      </div>

      <div className='separator-v'>
        <div />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <h2>Covid-19 Chart</h2>

        <svg data-svg width='100%' height='100%'>
          {deathsData.length > 0 ? (
            <g transform={`translate(${c.margin.left},${c.margin.top})`}>
              <path
                className={s.line}
                style={{
                  fill: 'none',
                }}
                d={lineGenerator}
              />

              {renderXAxis()}
              {renderYAxis()}

              {renderYMarker()}
              {renderXMarker()}

              <g data-labels className={s.labels}>
                <text className={s.title} dy={c.label.top.dy}>
                  World Coronavirus Deaths Over Time
                </text>
                <text
                  transform={`translate(0,${innerHeight / 2}) rotate(-90)`}
                  textAnchor='middle'
                  dy={c.label.left.dy}
                >
                  Cumulative Deaths
                </text>
                <text
                  transform={`translate(${innerWidth / 2},${innerHeight})`}
                  textAnchor='middle'
                  alignmentBaseline='hanging'
                  dy={c.label.bottom.dy}
                >
                  Time
                </text>
              </g>
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  )
}

export default Covid19Chart
