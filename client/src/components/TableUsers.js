import React, {useContext, useRef} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'

export const TableUsers = ({users, reload}) => {
    const checkBoxRef = useRef(null)
    const {token, logout} = useContext(AuthContext)
    const {request, statusRef} = useHttp()


    const logoutHandler = () => {
        logout()
    }

    const changeRequest = async (path) => {
        const ids = getSelectedIds()
        try {
            await request(`/api/data/${path}`, 'POST', ids, {
                Authorization: `Bearer ${token}`
            })
            reload()
        } catch (e) {
            (statusRef.current === 401) && logout()
        }
    }

    const blockHandler = async () => { await changeRequest('block') }

    const unblockHandler = async () => { await changeRequest('unblock') }

    const deleteHandler = async () => { await changeRequest('delete') }

    const checkAllHandler = event => {
        users.forEach(user => {
            document.getElementById(user._id).checked = event.target.checked
        })
    }

    const checkHandler = () => {
        checkBoxRef.current.checked = users.every(user => document.getElementById(user._id).checked === true)
    }

    const getSelectedUsers = () => {
        return users.filter(user => document.getElementById(user._id).checked === true)
    }

    const getSelectedIds = () => {
        let selectedIds = []
        getSelectedUsers().forEach(user => selectedIds.push(user._id))
        return selectedIds
    }

    return (
        <div className="table-responsive">
            <div className="pt-2 pe-2 d-flex justify-content-end">
                <button id="block" type="button" className="btn btn-dark" onClick={blockHandler}>
                    <i className="bi-lock align-text-bottom"/>
                    <span className="visually-hidden">Block</span>
                </button>
                <button id="unblock" type="button" className="btn btn-dark mx-2" onClick={unblockHandler}>
                    <i className="bi-unlock align-text-bottom"/>
                    <span className="visually-hidden">Unblock</span>
                </button>
                <button id="delete" type="button" className="btn btn-dark" onClick={deleteHandler}>
                    <i className="bi-trash align-text-bottom"/>
                    <span className="visually-hidden">Delete</span>
                </button>
                <button id="logout" type="button" className="btn btn-dark ms-5" onClick={logoutHandler}>
                    <i className="bi-door-open align-text-bottom"/>
                    <span className="visually-hidden">Logout</span>
                </button>
            </div>
            <table className="table table-hover">
                <caption>List of users</caption>
                <thead>
                    <tr>
                        <th scope="col">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="selectAll"
                                onChange={ checkAllHandler }
                                ref={ checkBoxRef }
                            />
                        </th>
                        <th scope="col">#id</th>
                        <th scope="col">Name</th>
                        <th scope="col">email</th>
                        <th scope="col">Register</th>
                        <th scope="col">Last login</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                { users.map(user => {
                    return (
                        <tr key={user._id} data-id={user._id} >
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={user._id}
                                    onChange={ checkHandler }
                                />
                            </td>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{new Date(parseInt(user.dateRegistration,10)).toLocaleDateString()}</td>
                            <td>{new Date(parseInt(user.lastLogin,10)).toLocaleString()}</td>
                            <td>{user.status}</td>
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
        </div>
    )
}