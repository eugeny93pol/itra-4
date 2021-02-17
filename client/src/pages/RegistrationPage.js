import React, {useState, useContext, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import {useMessage} from "../hooks/messages.hook";

export const RegistrationPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, clearError, request} = useHttp()
    const [form, setForm] = useState({
        name: '', email: '', password: ''
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
            registerHandler()
        }
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/registration', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    return (
        <main className="form-signin my-4">
            <form action="">
                <h1 className="h2 mb-4">Registration</h1>
                <label htmlFor="name" className="visually-hidden">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={ form.name }
                    onChange={ changeHandler }
                    onKeyPress={ pressHandler }
                    required
                />
                <label htmlFor="email" className="visually-hidden">Email address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email address"
                    autoComplete="username"
                    value={ form.email }
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
                    autoComplete="new-password"
                    value={ form.password }
                    onChange={ changeHandler }
                    required
                />
                <button
                    className="w-100 btn btn-lg btn-primary mb-2"
                    type="submit"
                    onClick={registerHandler}
                    disabled={loading}
                >Sign up</button>
                <Link to="/login" className="w-100 btn btn-lg btn-outline-dark">Sign In</Link>
            </form>
        </main>
    )
}