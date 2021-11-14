/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import {
  // format,
  timeParse,
  scaleTime,
  scaleLinear,
  extent,
  max,
  line,
} from 'd3'

import s from './Covid19Chart.m.scss'

// const formatNumber = num => format(',')(num)
const parseDate = timeParse('%m/%d/%Y')
const getXValue = d => d.date
const getYValue = d => d.deaths

const Covid19Chart = () => {
  const [data] = useCsv(
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  )

  console.log({ data })

  const deathsData = useMemo(
    () => data.columns.slice(4).map(day => ({
      date: parseDate(day),
      deaths: data.reduce((acc, current) => acc + +current[day], 0),
    })),
    [data],
  )

  console.log({ deathsData })

  const svgSize = useMemo(() => {
    const svgRect = document.querySelector('[data-svg]')?.getBoundingClientRect()

    return {
      width: svgRect?.width || 0,
      height: svgRect?.height || 0,
    }
  }, [data])

  const xScale = scaleTime().domain(extent(deathsData, getXValue)).range([0, svgSize.width])

  const yScale = scaleLinear()
    .domain([0, max(deathsData, getYValue)])
    .range([svgSize.height, 0])

  console.log(yScale.domain())

  const lineGenerator = line()
    .x(d => xScale(getXValue(d)))
    .y(d => yScale(getYValue(d)))(deathsData)

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
            <path
              className={s.line}
              style={{
                fill: 'none',
              }}
              d={lineGenerator}
            />
          ) : null}
        </svg>
      </div>
    </div>
  )
}

export default Covid19Chart
