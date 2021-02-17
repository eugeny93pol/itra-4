import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from "./routes"
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import 'materialize-css'

function App() {
    const {token, login, logout, userId} = useAuth()
    const isAuth = !!token
    const routes = useRoutes(isAuth)
    return (
        <div className="container-fluid">
            <AuthContext.Provider value={{
                token, login, logout, userId, isAuth
            }}>
                <Router>
                    { routes }
                </Router>
            </AuthContext.Provider>
        </div>
    )
}
export default App
