import useCsv from 'hooks/useCsv'
import React from 'react'

const Covid19Chart = () => {
  const [data] = useCsv(
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  )

  console.log({ data })

  return <div>Hello wolrd</div>
}

export default Covid19Chart
