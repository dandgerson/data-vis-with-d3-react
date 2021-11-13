/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import { format } from 'd3'

const formatNumber = num => format(',')(num)

const Covid19Chart = () => {
  const [data] = useCsv(
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  )

  console.log({ data })

  const { lastDateColumn, deathsTotalByLastDate } = useMemo(() => {
    const lastDateColumn = data.columns[data.columns.length - 1]

    const deathsTotalByLastDate = data.reduce((acc, current) => acc + +current[lastDateColumn], 0)

    console.log({ columns: data.columns })

    return {
      lastDateColumn,
      deathsTotalByLastDate,
    }
  }, [data])

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

        <p>{`${formatNumber(deathsTotalByLastDate)} deaths as of ${lastDateColumn}`}</p>
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

        <p>Hello wolrd</p>
      </div>
    </div>
  )
}

export default Covid19Chart
