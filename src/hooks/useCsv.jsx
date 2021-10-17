import { useEffect, useState } from 'react'
import { csv, csvFormat } from 'd3'

const useCsv = url => {
  const initialCsv = []
  initialCsv.columns = []

  const [csvData, setCsvData] = useState(initialCsv)
  useEffect(() => csv(url).then(setCsvData), [url])

  return [
    csvData,
    {
      kB: csvFormat(csvData).length / 1024,
      rows: csvData.length,
      columns: csvData.columns,
    },
  ]
}

export default useCsv
