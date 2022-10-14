import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import configData from '../../../default.json';


toast.configure();
function DrafterLoginForm() {


    const history = useHistory();

    const serverString = configData.serverURI;

    const [UserCreds, setUserCreds] = useState({
        username: "",
        password: "",
    });

    const showForgotPassswordPage = () => {
        history.push('/sendOTP');
    }

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
            const drafter = { DrafterLoginID: UserCreds.username, DrafterPassword: UserCreds.password };

            try {
                axios.post(`${serverString}drafter/login`, drafter)
                    .then(res => {
                        if (res.data !== 'Invalid Credentials') {


                            const DrafterIdKey = 'DrafterId';
                            const UserNameKey = 'DrafterName';
                            const DrafterToken = 'DrafterToken';
                            localStorage.setItem(DrafterIdKey, res.data.drafter.id);
                            localStorage.setItem(UserNameKey, res.data.drafter.DrafterName);
                            localStorage.setItem(DrafterToken, res.data.token);

                            toast.success('Login Successful', { position: toast.POSITION.BOTTOM_RIGHT });
                            setUserCreds(() => {
                                return {
                                    username: "",
                                    password: "",
                                };
                            })
                            history.push({
                                pathname: `/drafter/home`
                            });

                        }
                        else {
                            toast.error(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }

    }

    return (
        <>
            <div className="hero">
                <div className="login-page" >
                    <div className="form" >
                        <h1 style={{ color: 'black' }}>Drafter</h1>
                        <form className="login-form">
                            <input name="username" type="text" placeholder="username/email" onChange={inputEvent}
                                value={UserCreds.username} />
                            <input name="password" type="password" placeholder="password" onChange={inputEvent}
                                value={UserCreds.password} />
                            <button onClick={LoginUser}>login</button>
                            <p className="message"><span onClick={showForgotPassswordPage}>Forgot Password?</span></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}



export default DrafterLoginForm;