import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import './Form.css'
import { FaEdit, FaTrash,FaAffiliatetheme } from 'react-icons/fa';

export default function Form() {
    const [input, setInput] = useState({ firstName: '', lastName: '', email: '', password: '', dob: '', gender: '' });
    const [allUser, setAllUser] = useState([]);
    const [editFlow, setEditFlow] = useState(false);
    const [updateUserID, setUpdateUserID] = useState('');

    const handelInput = (e) => {
        setInput(preState => ({
            ...preState,
            [e.target.name]: (e.target.name === 'password') ? Number(e.target.value) : e.target.value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        editFlow ? await UpdateUserAPI(updateUserID) : await sendFormDataAPI()
    };

    //API TO POST DATA IN BE
    const sendFormDataAPI = async () => {
        try {
            await axios.post('http://localhost:7000/app/userdata', input)
            setInput({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                dob: '',
                gender: ''
            });
            console.log('BE KO DATA MILA GAYA')
            getAllUserApi();
        } catch (error) {
            console.log('BE KO DATA NI MILA, MAY BE URL PATH GALAT HAI')
        }
    }

    // calling the API once a time when page gona load, and this is done by the use of useEffect 
    useEffect(() => {
        getAllUserApi();
    }, [])// always remember to use empty array dependency otherwise getAllUserApi() will goes in infinit loop

    //GET ALL USER API
    const getAllUserApi = async () => {
        try {
            const response = await axios.get('http://localhost:7000/app/getAllUserData');
            setAllUser(response.data)
            console.log('ALL USER DATA IS FETCHED')
        } catch (error) {
            console.log('USER DATA NOT FETCHED', error)
        }
    }

    //API TO DELETE USER FROM BE
    const deletUserAPI = async (id,user) => {
        try {
            console.log(typeof id ,'deleted user call' )
           await axios.delete(`http://localhost:7000/app/delete/${id}`)
            alert(`${user} User deleted successfully`)
            getAllUserApi();
        } catch (error) {
            console.log('USER NOT DELETED')
        }
    }
    
    //API TO UPDATE USER FROM BE
    const UpdateUserAPI = async (updateUserID) => {
        try {
            console.log(updateUserID,"userinfo")
            console.log(typeof updateUserID,"userinfo type of")
            await axios.patch(`http://localhost:7000/UpdateUserData/${updateUserID}`,input)
            alert('User updated successfully')
            setInput({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                dob: '',
                gender: ''
            });
            setEditFlow(false);
            getAllUserApi();
        } catch (error) {
            console.log(error)
        }
    }

    const handelEditFlow = (userInfo)=>{
        setInput({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            password: userInfo.password,
            dob: userInfo.dob,
            gender: userInfo.gender
        });
        setEditFlow(true);
        setUpdateUserID(userInfo._id);
    }

    return (
        <div className="container">
            <h1>Basic Form</h1>
            <form action="/submit" method="POST" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input value={input.firstName} onChange={handelInput} type="text" id="firstName" name="firstName" required />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input value={input.lastName} onChange={handelInput} type="text" id="lastName" name="lastName" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input value={input.email} onChange={handelInput} type="email" id="email" name="email" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input value={input.password} onChange={handelInput} type="password" id="password" name="password" required />
                </div>

                <div className="form-group">
                    <label htmlFor="dob">Date of Birth:</label>
                    <input value={input.dob} onChange={handelInput} type="date" id="dob" name="dob" required />
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <select id="gender" name="gender" required onChange={handelInput}>
                        <option disabled >select</option>
                        <option></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <input type="submit" value="Submit" />
                </div>
            </form>

            <h2>User List</h2>
            <table className="user-table">
                <thead>
                    <tr>
                    <th>{<FaAffiliatetheme/>}</th>
                        <th>First Name</th>
                        <th>Last Name.</th>
                        <th>Email.</th>
                        <th>Password.</th>
                        <th>Date of Birth.</th>
                        <th>Gender</th>
                        {
                            allUser.length !== 0 ? <th>Actions</th> : null
                        }

                    </tr>
                </thead>
                <tbody>
                    {allUser.map((user) => (
                        <tr key={user._id}>

                            <td>{<FaAffiliatetheme/>}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.dob}</td>
                            <td>{user.gender}</td>
                            {
                                allUser.length !== 0 ?
                                    <td>
                                        <button onClick={()=>handelEditFlow(user)} className="edit-btn">
                                            <i className="fa fa-edit">
                                                <FaEdit />
                                            </i>
                                        </button>
                                        <button onClick={()=>deletUserAPI(user._id,user.firstName)} className="delete-btn">
                                            <i className="fa fa-trash">
                                                <FaTrash />
                                            </i>
                                        </button>
                                    </td>
                                    : null
                            }

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
