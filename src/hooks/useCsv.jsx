import { useEffect, useState } from 'react'
import { csv, csvFormat } from 'd3'

const useCsv = (url, convertRow) => {
  const initialCsv = []
  initialCsv.columns = []

  const [csvData, setCsvData] = useState(initialCsv)

  useEffect(() => {
    csv(url, convertRow).then(setCsvData)

    return () => setCsvData(csvData)
  }, [url])

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
