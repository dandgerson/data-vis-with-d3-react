/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import useCsv from 'hooks/useCsv'
import { scaleLinear, format, extent } from 'd3'

import s from './ScatterPlot.m.scss'

const ScatterPlot = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/5c9dc255410d4ac8b490866d56764f90/raw/iris.csv',
    d => ({
      sepalLength: +d.sepal_length,
      sepalWidth: +d.sepal_width,
      petalLength: +d.petal_length,
      petalWidth: +d.petal_width,
      species: d.species,
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
          text: 'Sepal Length',
          margin: 40,
        },
      },
      left: {
        dy: '.32em',
        margin: 8,
        label: {
          text: 'Sepal Width',
          margin: 40,
        },
      },
    },
    marks: {
      radius: 10,
    },
  }

  const getXValue = d => d.sepalLength
  const getYValue = d => d.sepalWidth

  const formatNumberValue = format('.2s')
  const formatXAxisTick = tickValue => formatNumberValue(tickValue).replace('.0', '')
  const formatTooltip = tickValue => `${tickValue[0].toUpperCase()}${tickValue.slice(1)}`

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
      xScale: scaleLinear()
        .domain(extent(data, getXValue))
        .range([0, svgContainerProps.innerWidth])
        .nice(),
      yScale: scaleLinear()
        .domain(extent(data, getYValue).reverse())
        .range([0, svgContainerProps.innerHeight])
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
  }) => data.map((d, i) => (
    <circle
      key={i}
      className={s.mark}
      cx={xScale(getXValue(d))}
      cy={yScale(getYValue(d))}
      r={c.marks.radius}
    >
      <title>{formatTooltip(d.species)}</title>
    </circle>
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
        <h2>Scatter Plot</h2>
        <br />
        <h2>The Iris flower dataset</h2>
        <p>
          Originally published at
          {' '}
          <a
            className='a'
            target='_blank'
            href='https://archive.ics.uci.edu/ml/datasets/Iris'
            rel='noreferrer'
          >
            UCI Machine Learning Repository: Iris Data Set
          </a>
          , this small dataset from 1936 is often used for testing out machine learning algorithms
          and visualizations. Each row of the table represents an iris flower, including its species
          and dimensions of its botanical parts, sepal and petal, in centimeters.
        </p>
        <a
          className='a'
          href='https://gist.github.com/curran/a08a1080b88344b0c8a7'
          target='_blank'
          rel='noreferrer'
        >
          Data fetched from Curran gist
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
                width: svgContainerProps.innerWidth,
              })}
            </g>

            <text
              className={s.axisLabel}
              textAnchor='middle'
              transform={`translate(${-c.axis.left.label.margin},${
                svgContainerProps.innerHeight / 2
              }) rotate(-90)`}
            >
              {c.axis.left.label.text}
            </text>

            <text
              className={s.axisLabel}
              x={svgContainerProps.innerWidth / 2}
              y={svgContainerProps.innerHeight + c.axis.bottom.label.margin}
              dy={c.axis.bottom.dy}
              textAnchor='middle'
            >
              {c.axis.bottom.label.text}
            </text>

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

export default ScatterPlot
