import React, { useEffect, useState } from 'react'

const LoadCSV = () => {
  const [, setData] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const url = 'https://gist.githubusercontent.com/dandgerson/e0c9835bc1a0de2bc13d40160d8e6a6d/raw/CSSNamedColors.csv'
        const response = await fetch(url)
        const text = await response.text()

        setData(text)
      } catch (e) {
        throw Error(e)
      }
    })()
  }, [])

  return <div data-load-csv>Load and Parsing CSV Data</div>
}

export default LoadCSV
