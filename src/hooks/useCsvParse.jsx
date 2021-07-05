import { useMemo } from 'react'
import { csvParse } from 'd3'

const useCsvParse = (text) =>
  useMemo(() => {
    const data = csvParse(text)

    return {
      meta: {
        kB: text.length / 1024,
        rows: data.length,
        columns: data.columns.length,
      },
      data,
    }
  }, [text])

export default useCsvParse
