/* eslint-disable no-shadow */
import React, { useMemo, useState } from 'react'
import useCsv from 'hooks/useCsv'
import {
  scaleLinear, scaleOrdinal, format, extent,
} from 'd3'

import { useDropDown } from 'components/DropDown'

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

  const options = useMemo(
    () => (data.length
      ? Object.keys(data[0])
        .filter(key => key !== 'species')
        .map(key => ({
          label: key,
          value: key,
        }))
      : [{ label: '', value: '' }]),
    [data],
  )

  const [xSelectDropDown, selectedX] = useDropDown(
    {
      label: 'x-select: ',
      id: 'x-select',
      options,
      initialValue: options[0],
    },
    [options],
  )

  const [YSelectDropDown, selectedY] = useDropDown(
    {
      label: 'y-select: ',
      id: 'y-select',
      options,
      initialValue: options[1],
    },
    [options],
  )

  const c = {
    margin: {
      top: 20,
      right: 250,
      bottom: 70,
      left: 80,
    },
    axis: {
      bottom: {
        dy: '.71em',
        margin: 8,
        label: {
          margin: 40,
        },
      },
      left: {
        dy: '.32em',
        margin: 8,
        label: {
          margin: 40,
        },
      },
    },
    marks: {
      radius: 10,
      opacity: 0.25,
      selectedRadius: 3,
    },
    legend: {
      label: 'Species',
      xOffset: 60,
      yOffset: 60,
      tick: {
        radius: 10,
        spacing: 40,
        dy: '.16em',
      },
    },
  }

  const [hoveredValue, setHoveredValue] = useState('')
  const [selectedValues, setSelectedValues] = useState([])

  const getXValue = d => d[selectedX.value]
  const getYValue = d => d[selectedY.value]
  const getColorValue = d => d.species

  const filteredData = useMemo(
    () => data.filter(
      d => [hoveredValue].includes(getColorValue(d)) || selectedValues.includes(getColorValue(d)),
    ),
    [hoveredValue, selectedValues],
  )

  const formatNumberValue = format('.2s')
  const formatTick = tickValue => formatNumberValue(tickValue).replace('.0', '')
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
      colorScale: scaleOrdinal()
        .domain(data.map(getColorValue))
        .range([s.colorAccent, s.colorAccent2, s.colorAccent3]),
    }),
    [data, selectedX, selectedY],
  )

  const renderAxisBottom = ({ xScale, height, formatTick }) => xScale.ticks().map(tickValue => (
    <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
      <line y2={height} className={s.axisBottom_line} />
      <text className={s.axisBottom_text} dy={c.axis.bottom.dy} y={height + c.axis.bottom.margin}>
        {formatTick(tickValue)}
      </text>
    </g>
  ))

  const renderAxisLeft = ({ yScale, width, formatTick }) => yScale.ticks().map(tickValue => (
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
        {formatTick(tickValue)}
      </text>
    </g>
  ))

  const renderLegend = ({ colorScale }) => colorScale.domain().map((domainValue, i) => (
    <g
      key={domainValue}
      data-legend-item
      className={s.legendItem}
      transform={`translate(0,${i * c.legend.tick.spacing})`}
      onMouseEnter={() => setHoveredValue(domainValue)}
      onMouseLeave={() => setHoveredValue('')}
      onClick={() => (selectedValues.includes(domainValue)
        ? setSelectedValues(
          selectedValues.filter(selectedValue => selectedValue !== domainValue),
        )
        : setSelectedValues([...selectedValues, domainValue]))}
      opacity={
          [hoveredValue].includes(domainValue)
          || selectedValues.includes(domainValue)
          || (!hoveredValue && !selectedValues.length)
            ? 1
            : c.marks.opacity
        }
    >
      <circle fill={colorScale(domainValue)} r={c.legend.tick.radius} />
      {selectedValues.includes(domainValue) ? (
        <circle r={c.legend.tick.radius / c.marks.selectedRadius} />
      ) : null}
      <text x={15} dy={c.legend.tick.dy}>{`- ${formatTooltip(domainValue)}`}</text>
    </g>
  ))

  const renderMarks = ({
    data,
    yScale,
    xScale,
    colorScale,
    getYValue,
    getXValue,
    getColorValue,
    formatTooltip,
  }) => data.map((d, i) => (
    <g key={i}>
      <circle
        className={s.mark}
        cx={xScale(getXValue(d))}
        cy={yScale(getYValue(d))}
        r={c.marks.radius}
        fill={colorScale(getColorValue(d))}
      >
        <title>{formatTooltip(d.species)}</title>
      </circle>

      {selectedValues.includes(d.species) ? (
        <circle
          cx={xScale(getXValue(d))}
          cy={yScale(getYValue(d))}
          r={c.marks.radius / c.marks.selectedRadius}
        >
          <title>{formatTooltip(d.species)}</title>
        </circle>
      ) : null}
    </g>
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

        <br />
        <br />

        <div
          data-controls
          style={{
            display: 'flex',
          }}
        >
          {xSelectDropDown}

          <br />

          {YSelectDropDown}
        </div>
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
                formatTick,
              })}

              <text
                className={s.axisLabel}
                x={svgContainerProps.innerWidth / 2}
                y={svgContainerProps.innerHeight + c.axis.bottom.label.margin}
                dy={c.axis.bottom.dy}
                textAnchor='middle'
              >
                {selectedX.value}
              </text>
            </g>

            <g data-axis-left>
              {renderAxisLeft({
                yScale: d3Props.yScale,
                width: svgContainerProps.innerWidth,
                formatTick,
              })}

              <text
                className={s.axisLabel}
                textAnchor='middle'
                transform={`translate(${-c.axis.left.label.margin},${
                  svgContainerProps.innerHeight / 2
                }) rotate(-90)`}
              >
                {selectedY.value}
              </text>
            </g>

            <g
              data-legend
              transform={`translate(${svgContainerProps.innerWidth + c.legend.xOffset},${
                c.legend.yOffset
              })`}
            >
              <text className={s.axisLabel} textAnchor='start' dy={-40} dx={-10}>
                {c.legend.label}
              </text>

              {renderLegend({
                colorScale: d3Props.colorScale,
              })}
            </g>

            <g data-marks opacity={hoveredValue || selectedValues.length ? c.marks.opacity : 1}>
              {renderMarks({
                data,
                xScale: d3Props.xScale,
                yScale: d3Props.yScale,
                colorScale: d3Props.colorScale,
                getYValue,
                getXValue,
                getColorValue,
                formatTooltip,
              })}
            </g>

            {filteredData.length ? (
              <g data-marks-filtered>
                {renderMarks({
                  data: filteredData,
                  xScale: d3Props.xScale,
                  yScale: d3Props.yScale,
                  colorScale: d3Props.colorScale,
                  getYValue,
                  getXValue,
                  getColorValue,
                  formatTooltip,
                })}
              </g>
            ) : null}
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ScatterPlot
