import {useCallback, useRef, useState} from 'react'

export  const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const statusRef = useRef(0)
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(url, {method, body, headers})

            const data = await response.json()

            statusRef.current = response.status

            if (!response.ok) {
                console.log(data.message)
                throw new Error(data.message)
            }
            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, statusRef, error, setError, clearError}
}