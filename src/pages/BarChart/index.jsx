import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import { scaleBand, scaleLinear } from 'd3'

// import s from './BarChart.m.scss'

const BarChart = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/74072e8d929f78691f52b3bc2088771a/raw/worldPopulation2021.cvs',
    d => ({
      ...d,
      population: Number.parseFloat(d['2020']),
    }),
  )

  console.log({
    data,
  })

  const processedData = useMemo(() => data.slice(0, 10), [data])

  const svgContainerProps = useMemo(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()

    return {
      width: svgRect?.width || 0,
      height: svgRect?.height || 0,
    }
  }, [processedData])

  const c = {
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  }

  const d3Props = useMemo(
    () => ({
      yScale: scaleBand()
        .domain(processedData.map(d => d.Country))
        .range([0, svgContainerProps.height - (c.margin.top + c.margin.bottom)]),
      xScale: scaleLinear()
        .domain([0, Math.max(...processedData.map(d => d.population))])
        .range([0, svgContainerProps.width - (c.margin.left + c.margin.right)]),
    }),
    [processedData],
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
        <h2>Bar Chart</h2>

        <p>Making a Bar Chart with React and D3.</p>
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
            {processedData.map(d => (
              <rect
                key={d.Country}
                x={0}
                y={d3Props.yScale(d.Country)}
                width={d3Props.xScale(d.population)}
                height={d3Props.yScale.bandwidth()}
                stroke='white'
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

export default BarChart
