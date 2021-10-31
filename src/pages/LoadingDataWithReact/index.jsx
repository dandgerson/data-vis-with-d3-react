import React from 'react'
import useCsv from 'hooks/useCsv'

import s from './LoadingDataWithReact.m.scss'

const LoadingDataWithReact = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/e0c9835bc1a0de2bc13d40160d8e6a6d/raw/CSSNamedColors.csv',
  )

  console.log({
    data,
  })

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          maxWidth: '20%',
        }}
      >
        <h2>Loading Data with React</h2>

        <p>
          A program that loads in some data about CSS named colors, using D3 utilities, and React
          stated to keep track of the data.
        </p>
      </div>

      <div className={s['separator-v']}>
        <div />
      </div>

      <div
        style={{
          flex: 1,
        }}
      >
        {data.length > 0
          ? data.map((d, i) => (
            <div
              key={i}
              style={{
                backgroundColor: d.Keyword,
                height: 10,
              }}
            />
          ))
          : null}
      </div>
    </div>
  )
}

export default LoadingDataWithReact
