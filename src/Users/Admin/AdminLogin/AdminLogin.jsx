import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import configData from '../../../default.json';


toast.configure();
function AdminLoginForm() {


    const history = useHistory();

    const serverString = configData.serverURI;

    const [UserCreds, setUserCreds] = useState({
        username: "",
        password: "",
    });

    const inputEvent = (e) => {

        const value = e.target.value;
        const name = e.target.name;

        setUserCreds((preValue) => {

            return {
                ...preValue,
                [name]: value
            }
        });
    };

    let LoginUser = (event) => {

        event.preventDefault();

        if (UserCreds.username === '' || UserCreds.password === '') {
            toast.error('Both The Fields are required', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else {
            const admin = { AdminUserName: UserCreds.username, AdminPassword: UserCreds.password };

            try {
                axios.post(`${serverString}admin/login`, admin)
                    .then(res => {
                        if (res.data !== 'Invalid Credentials') {

                            console.log(res.data);

                            const AdminIdKey = 'AdminId';
                            const AdminNameKey = 'AdminName';
                            const AdminToken = 'AdminToken';
                            localStorage.setItem(AdminIdKey, res.data.admin.id);
                            localStorage.setItem(AdminNameKey, res.data.admin.AdminUserName);
                            localStorage.setItem(AdminToken, res.data.token);

                            toast.success('Login Successful', { position: toast.POSITION.BOTTOM_RIGHT });
                            setUserCreds(() => {
                                return {
                                    username: "",
                                    password: "",
                                };
                            })
                            history.push({
                                pathname: `/Admin/home`
                            });
                        }
                        else {
                            toast.error('Wrong Credentials Login Failed', { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT })
            }
        }

    }

    return (
        <>
            <div className="hero">
                <div className="login-page" >
                    <div className="form" >
                        <h1 style={{ color: 'black' }}>Admin</h1>
                        <form className="login-form">
                            <input name="username" type="text" placeholder="username" onChange={inputEvent}
                                value={UserCreds.username} />
                            <input name="password" type="password" placeholder="password" onChange={inputEvent}
                                value={UserCreds.password} />
                            <button onClick={LoginUser}>login</button>
                        </form>
                    </div>
                </div>
            </div >
        </>
    );
}



export default AdminLoginForm;