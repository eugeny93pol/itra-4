import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {TableUsers} from '../components/TableUsers'

export const UsersPage = () => {
    const {request, statusRef} = useHttp()
    const {token, logout} = useContext(AuthContext)
    const [data, setData] = useState([])

    const getData = useCallback(async () => {
        try {
            const fetched = await request('/api/data/load', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setData(fetched)
        } catch (e) {
            (statusRef.current === 401) && logout()
        }
    }, [token, request])

    useEffect(() => {
        getData()
    }, [getData])

    const refreshData = () => {
            getData()
    }

    return (
        <TableUsers users={data} reload={refreshData}/>
    )
}