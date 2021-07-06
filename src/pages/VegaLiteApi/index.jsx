import React, { useEffect, useMemo } from 'react'
import * as vega from 'vega'
import * as vegaLite from 'vega-lite'
import * as vl from 'vega-lite-api'
import { Handler } from 'vega-tooltip'

import useCsv from 'hooks/useCsv'

const VegaLiteApi = () => {
  const [data] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/e0c9835bc1a0de2bc13d40160d8e6a6d/raw/CSSNamedColors.csv',
  )

  const viz = useMemo(() => {
    vl.register(vega, vegaLite, {
      view: { renderer: 'svg' },
      init: view => view.tooltip(new Handler().call),
    })

    return vl
      .markPoint()
      .encode(
        vl.x().fieldQ('Specification').scale({ zero: false }),
        vl.y().fieldQ('Keyword').scale({ zero: false }),
        vl.tooltip().fieldN('RGB hex value'),
      )
  }, [])

  useEffect(() => {
    if (data.length === 0) return;
    (async () => {
      const root = document.querySelector('[data-vega-lite-api-root]')
      const { width: w, height: h } = root.getBoundingClientRect()
      const dark = '#3e3c38'

      const marks = viz
        .data(data)
        .width(w)
        .height(h)
        .autosize({ type: 'fit', contains: 'padding' })
        .config({
          axis: {
            domain: false,
            tickColor: 'lightGray',
          },
          style: {
            'guide-label': {
              fontSize: 20,
              fill: dark,
            },
            'guide-title': {
              fontSize: 30,
              fill: dark,
              labelLimit: 0,
            },
          },
        })

      const renderedMarks = await marks.render()

      root.append(renderedMarks)
    })()
  }, [data])

  return <div data-vega-lite-api-root />
}

export default VegaLiteApi
