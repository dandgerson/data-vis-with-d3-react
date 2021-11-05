/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import { scaleBand, scaleLinear, format } from 'd3'

import s from './BarChart.m.scss'

const BarChart = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/74072e8d929f78691f52b3bc2088771a/raw/worldPopulation2021.cvs',
    d => ({
      ...d,
      population: Number.parseFloat(d['2020'] * 1000),
    }),
  )

  const processedData = useMemo(() => data.slice(0, 10), [data])

  const c = {
    margin: {
      top: 20,
      right: 20,
      bottom: 70,
      left: 200,
    },
    axis: {
      bottom: {
        dy: '.71em',
        margin: 3,
      },
      left: {
        dy: '.32em',
        margin: 3,
      },
      label: {
        margin: 40,
      },
    },
  }

  const svgContainerProps = useMemo(() => {
    const svgRect = document.querySelector('[data-svg-container]')?.getBoundingClientRect()
    const width = svgRect?.width || 0
    const height = svgRect?.height || 0

    return {
      innerWidth: width - (c.margin.left + c.margin.right),
      innerHeight: height - (c.margin.top + c.margin.bottom),
    }
  }, [processedData])

  const getYValue = d => d.Country
  const getXValue = d => d.population
  const formatNumberValue = format('.2s')
  const formatXAxisTick = tickValue => formatNumberValue(tickValue).replace('.0', '').replace('G', 'B')

  const d3Props = useMemo(
    () => ({
      yScale: scaleBand()
        .domain(processedData.map(getYValue))
        .range([0, svgContainerProps.innerHeight])
        .paddingInner(0.15),
      xScale: scaleLinear()
        .domain([0, Math.max(...processedData.map(getXValue))])
        .range([0, svgContainerProps.innerWidth]),
    }),
    [processedData],
  )

  const renderAxisBottom = ({ xScale, height, formatTick }) => xScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
      <line y2={height} className={s.axisBottom_line} />
      <text className={s.axisBottom_text} dy={c.axis.bottom.dy} y={height + c.axis.bottom.margin}>
        {formatTick(tickValue)}
      </text>
    </g>
  ))

  const renderAxisLeft = ({ yScale }) => yScale.domain().map(tickValue => (
    <text
      key={tickValue}
      className={s.axisLeft_text}
      dy={c.axis.left.dy}
      y={yScale(tickValue) + yScale.bandwidth() / 2}
      x={0 - c.axis.left.margin}
    >
      {tickValue}
    </text>
  ))

  const renderMarks = ({
    data, yScale, xScale, getYValue, getXValue, formatTooltip,
  }) => data.map(d => (
    <rect
      key={getYValue(d)}
      className={s.mark}
      x={0}
      y={yScale(getYValue(d))}
      width={xScale(getXValue(d))}
      height={yScale.bandwidth()}
    >
      <title>{formatTooltip(getXValue(d))}</title>
    </rect>
  ))

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
        <br />
        <h2>Top-10 Countries Population by 2021</h2>
        <p>
          Total Population - Both Sexes. De facto population in a country as of 1 July of the year
          indicated.
        </p>
        <a
          className='a'
          href='https://population.un.org/wpp/Download/Standard/Population/'
          target='_blank'
          rel='noreferrer'
        >
          Data fetched from unated nations site
        </a>
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
                formatTick: formatXAxisTick,
              })}
            </g>

            <g data-axis-left>
              {renderAxisLeft({
                yScale: d3Props.yScale,
              })}
            </g>

            <text
              className={s.axisLabel}
              x={svgContainerProps.innerWidth / 2}
              y={svgContainerProps.innerHeight + c.axis.label.margin}
              dy={c.axis.bottom.dy}
              textAnchor='middle'
            >
              Top-10 Countries Population 2021
            </text>

            <g data-marks>
              {renderMarks({
                data: processedData,
                xScale: d3Props.xScale,
                yScale: d3Props.yScale,
                getYValue,
                getXValue,
                formatTooltip: formatXAxisTick,
              })}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default BarChart
