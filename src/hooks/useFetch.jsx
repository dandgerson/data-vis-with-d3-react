import { useState, useEffect } from 'react'

const useFetch = ({ url }) => {
  const [data, setData] = useState('')
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const response = await fetch(url)
        const text = await response.text()

        setData(text)
      } catch (e) {
        setError(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return [data, error, isLoading]
}

export default useFetch
