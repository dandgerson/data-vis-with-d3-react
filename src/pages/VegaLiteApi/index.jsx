import React, { useEffect, useMemo } from 'react'
import * as vega from 'vega'
import * as vegaLite from 'vega-lite'
import * as vl from 'vega-lite-api'
import { Handler } from 'vega-tooltip'

import useCsv from 'hooks/useCsv'

import s from './VegaLiteApi.m.scss'

const urls = {
  vaccinated:
    'https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/global_data/vaccine_data_global.csv',
  dead: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-05-2021.csv',
}

const VegaLiteApi = () => {
  const [data] = useCsv(urls.vaccinated)

  const viz = useMemo(() => {
    vl.register(vega, vegaLite, {
      view: { renderer: 'svg' },
      init: view => view.tooltip(new Handler().call),
    })

    return vl
      .markPoint({
        // fill: `rgba(${s.colorAccent}, 0.5)`,
        fill: s.colorAccent,
        stroke: 0,
        size: 200,
        opacity: 0.5,
      })
      .encode(
        vl.y().fieldQ('Doses_admin').scale({ zero: false }),
        vl.x().fieldN('Province_State').scale({ zero: false }),
        vl.tooltip().fieldN('Doses_admin'),
      )
  }, [])

  useEffect(() => {
    if (data.length === 0) return
    console.log({
      s,
      data,
      countries: data.map(item => item.Country_Region),
      regions: data.filter(item => ['India'].includes(item.Country_Region)),
      attributes: Object.keys(data[0]),
    });
    (async () => {
      const root = document.querySelector('[data-vega-lite-api-root]')
      const { width: w, height: h } = root.getBoundingClientRect()
      const background = 'rgba(255, 255, 255, 0.1)'
      const guideLabel = 'rgba(255, 255, 255, 0.25)'
      const guideTitle = 'rgba(255, 255, 255, 0.5)'

      const marks = viz
        .data(data.filter(item => ['India'].includes(item.Country_Region)).slice(1))
        .width(w - 100)
        .height(h - 100)
        .autosize({ type: 'fit', contains: 'padding' })
        .background(background)
        .view({
          stroke: 0,
        })
        .config({
          axis: {
            domain: false,
            tickColor: guideLabel,
            gridColor: guideLabel,
          },
          style: {
            'guide-label': {
              fontSize: 20,
              fill: guideLabel,
            },
            'guide-title': {
              fontSize: 30,
              fill: guideTitle,
              labelLimit: 0,
            },
          },
        })

      root.append(await marks.render())
    })()
  }, [data])

  return <div data-vega-lite-api-root className={s.root} />
}

export default VegaLiteApi
