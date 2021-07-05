import { useEffect, useState } from 'react'
import { csv, csvFormat } from 'd3'

const useCsv = (url) => {
  const initial = []
  initial.columns = []

  const [data, setData] = useState(initial)
  useEffect(() => {
    ;(async () => {
      const parsedCsv = await csv(url)

      setData(parsedCsv)
    })()
  }, [url])

  return [
    data,
    {
      kB: csvFormat(data).length / 1024,
      rows: data.length,
      columns: data.columns.length,
    },
  ]
}

export default useCsv
