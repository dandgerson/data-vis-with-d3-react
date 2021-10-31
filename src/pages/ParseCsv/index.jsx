import React from 'react'
import useCsv from 'hooks/useCsv'

const ParseCsv = () => {
  const [data, meta] = useCsv(
    'https://gist.githubusercontent.com/dandgerson/e0c9835bc1a0de2bc13d40160d8e6a6d/raw/CSSNamedColors.csv',
  )

  console.log({
    data,
    meta,
  })

  return (
    <div data-parse-csv-root>
      <h2>Parse CSV Data with D3</h2>
      {data.length > 0 && (
        <>
          <div>CSV loaded with this meta:</div>
          <div>
            size:
            {meta.kB}
            {' '}
            kB
          </div>
          <div>
            rows:
            {meta.rows}
          </div>
          <div>
            columns:
            {meta.columns}
          </div>
        </>
      )}
    </div>
  )
}

export default ParseCsv
