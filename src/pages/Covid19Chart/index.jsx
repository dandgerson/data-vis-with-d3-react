/* eslint-disable no-shadow */
import React, {
  useMemo, useEffect, useCallback, useState,
} from 'react'
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
  max,
  Delaunay,
} from 'd3'

import s from './Covid19Chart.m.scss'

const formatNumber = num => format('.2s')(num)
const parseDate = timeParse('%m/%d/%Y')
const parseTime = timeFormat('%e %b %y')
const getXValue = d => d.date
const getYValue = d => d.deaths || 1
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

  const { totalDeathsData, totalData, deathsDataByCountries } = useMemo(() => {
    const days = data.columns.slice(4)

    const deathsDataByCountries = data
      .filter(d => d['Province/State'] === '')
      .map(d => ({
        name: d['Country/Region'],
        data: days.map(day => ({
          name: d['Country/Region'],
          date: parseDate(day),
          deaths: +d[day],
        })),
      }))

    const totalData = deathsDataByCountries
      .map(d => d.data)
      .reduce((acc, current) => acc.concat(current), [])

    console.log({ totalData })

    const totalDeathsData = days.map(day => ({
      date: parseDate(day),
      deaths: data.reduce((acc, current) => acc + +current[day], 0),
    }))

    return {
      totalDeathsData,
      totalData,
      deathsDataByCountries,
    }
  }, [data])

  const svgSize = useMemo(() => {
    const svgRect = document.querySelector('[data-svg]')?.getBoundingClientRect()

    return {
      width: svgRect?.width || 0,
      height: svgRect?.height || 0,
    }
  }, [data])

  const { innerHeight, innerWidth } = useMemo(
    () => ({
      // https://observablehq.com/@d3/margin-convention
      innerWidth: svgSize.width - c.margin.left - c.margin.right,
      innerHeight: svgSize.height - c.margin.top - c.margin.bottom,
    }),
    [svgSize],
  )

  const xScale = useMemo(
    () => scaleTime().domain(extent(totalDeathsData, getXValue)).range([0, innerWidth]),
    [totalDeathsData, innerWidth],
  )

  // The trick with Log scale is that you can't start with zero in the domain
  const yScale = useMemo(
    () => scaleLog()
      .domain([1, max(totalDeathsData, getYValue)])
      .range([innerHeight, 0]),
    [totalDeathsData, innerHeight],
  )

  const lineGenerator = useMemo(
    () => line()
      .x(d => xScale(getXValue(d)))
      .y(d => yScale(getYValue(d))),
    [xScale, yScale],
  )

  const renderYMarker = useMemo(
    () => () => {
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
    },
    [xScale, yScale, innerWidth, totalDeathsData, innerHeight],
  )

  const renderXMarker = useCallback(() => {
    const xValue = getXValue(totalDeathsData.slice(-1)[0])
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
  }, [totalDeathsData, innerHeight])

  useEffect(() => {
    if (totalDeathsData.length === 0) return

    const xAxis = axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(c.axis.tickXPadding)
      .tickFormat(parseTime)

    const xAxisG = select('[data-x-axis]').call(xAxis)

    xAxisG.select('.domain').classed(s.domain, true)
    xAxisG.selectAll('.tick').classed(s.tick, true).selectAll('text').nodes()
      .slice(-1)[0].remove()
  }, [totalDeathsData])

  const renderXAxis = () => (
    <g data-x-axis className={s.xAxis} transform={`translate(0,${innerHeight})`} />
  )

  useEffect(() => {
    if (totalDeathsData.length === 0) return

    const yAxis = axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(c.axis.tickYPadding)
      .ticks(10, '~s')

    const yAxisG = select('[data-y-axis]').call(yAxis)

    yAxisG.select('.domain').classed(s.domain, true)
    yAxisG.selectAll('.tick').classed(s.tick, true)
  }, [totalDeathsData])

  const renderYAxis = () => <g data-y-axis className={s.yAxis} />

  const [activeCountryName, setActiveCountryName] = useState('')

  // console.log({ activeCountryName })

  const handleVoronoiHover = useCallback(
    d => {
      if (activeCountryName === d.name) return

      setActiveCountryName(d.name)
      // console.log('Hovered', d)
    },
    [setActiveCountryName],
  )

  // console.log('plain')

  const renderVoronoiOverlay = () => {
    // console.log('memo')
    const points = totalData.map(d => [xScale(getXValue(d)), yScale(getYValue(d))])
    const delaunay = Delaunay.from(points)
    const voronoi = delaunay.voronoi([0, 0, innerWidth, innerHeight])

    return (
      <g data-voronoi-overlay>
        {console.log('memo voronoi')
          || points.map((_, i) => (
            <path
              key={i}
              fill='none'
              stroke='hotpink'
              d={voronoi.renderCell(i)}
              onMouseEnter={() => handleVoronoiHover(totalData[i])}
            />
          ))}
      </g>
    )
  }

  return (
    <div
      className={s.root}
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
          <g transform={`translate(${c.margin.left},${c.margin.top})`}>
            <g data-line-countries className={s.line_countries}>
              {useMemo(
                () => (deathsDataByCountries.length > 0
                  ? deathsDataByCountries.map((country, i) => (
                    <path
                      key={i}
                      style={{
                        fill: 'none',
                      }}
                      d={lineGenerator(country.data)}
                    />
                  ))
                  : null),
                [deathsDataByCountries, lineGenerator],
              )}
            </g>

            {useMemo(
              () => (activeCountryName ? (
                <path
                  className={s.line_active}
                  style={{
                    fill: 'none',
                  }}
                  d={lineGenerator(
                    deathsDataByCountries.find(d => d.name === activeCountryName).data,
                  )}
                />
              ) : null),
              [deathsDataByCountries, lineGenerator, activeCountryName],
            )}

            {useMemo(
              () => (
                <g data-line-total className={s.line_total}>
                  <path
                    style={{
                      fill: 'none',
                    }}
                    d={lineGenerator(totalDeathsData)}
                  />
                </g>
              ),
              [lineGenerator, totalDeathsData],
            )}

            {totalDeathsData.length > 0 ? (
              <>
                {renderXAxis()}
                {renderYAxis()}

                {renderYMarker()}
                {renderXMarker()}

                <g data-labels className={s.labels}>
                  <text className={s.title} dy={c.label.top.dy}>
                    World Coronavirus Deaths Over Time by Country
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
              </>
            ) : null}

            {useMemo(() => (totalData.length > 0 ? renderVoronoiOverlay() : null), [totalData])}
          </g>
        </svg>
      </div>
    </div>
  )
}

export default Covid19Chart
