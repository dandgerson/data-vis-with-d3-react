import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import { arc, pie } from 'd3'

import s from './LoadingDataWithReact.m.scss'

const LoadingDataWithReact = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/e0c9835bc1a0de2bc13d40160d8e6a6d/raw/CSSNamedColors.csv',
  )

  console.log({
    data,
  })

  const svgContainerProps = useMemo(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    return {
      width: svgRect?.width || 0,
      height: svgRect?.height || 0,
    }
  }, [data])

  const pieArc = useMemo(
    () => arc()
      .innerRadius(0)
      .outerRadius(svgContainerProps.height / 2),
    [data],
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
          maxWidth: '20%',
        }}
      >
        <h2>Loading Data with React</h2>

        <p>
          A program that loads in some data about CSS named colors, using D3 utilities, and React
          stated to keep track of the data as a radial burst.
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
        <svg
          data-svg-container
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <g
            transform={`translate(${svgContainerProps.width / 2},${svgContainerProps.height / 2})`}
          >
            {data.length > 0
              ? pie()
                .value(1)(data)
                .map((d, i) => (
                  <path
                    key={i}
                    style={{
                      fill: d.data.Keyword,
                    }}
                    d={pieArc(d)}
                  />
                ))
              : null}
          </g>
        </svg>
      </div>
    </div>
  )
}

export default LoadingDataWithReact
