import React, {useState, useContext, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useMessage} from '../hooks/messages.hook'


export const LoginPage = () => {
    const message = useMessage()
    const auth = useContext(AuthContext)
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect( () => {
        message(error)
        clearError()
    }, [error, message])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const pressHandler = event => {
        if (event.key === 'Enter') {
            loginHandler()
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) { }
    }

    return (
        <main className="form-signin my-4">
            <form action="">
                <h1 className="h2 mb-4">Sign In</h1>
                <label htmlFor="email" className="visually-hidden">Email address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email address"
                    autoComplete="username"
                    value={form.email}
                    onChange={ changeHandler }
                    onKeyPress={ pressHandler }
                    required
                />
                <label htmlFor="password" className="visually-hidden">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={ changeHandler }
                    onKeyPress={ pressHandler }
                    required
                />
                <button
                    className="w-100 btn btn-lg btn-primary mb-2"
                    type="submit"
                    onClick={ loginHandler }
                    disabled={loading}
                >Sign in</button>
                <Link to="/registration" className="w-100 btn btn-lg btn-outline-dark">Sign Up</Link>
            </form>
        </main>
    )
}