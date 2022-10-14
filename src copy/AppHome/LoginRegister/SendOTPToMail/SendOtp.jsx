import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavBar from '../../AppHomeNavBar/AppHomeNavBar';
import configData from '../../../default.json';

toast.configure();
function SendOTPToEmail() {


    const history = useHistory();

    const serverString = configData.serverURI;

    const [userEmail, setuserEmail] = useState('');

    // Function to set value of username and password
    const UpdateEmail = (e) => {

        const value = e.target.value;

        setuserEmail(value);
    }

    let sendOTP = (e) => {

        e.preventDefault();

        if (userEmail === '') {
            toast.error('Please Enter Email ID', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else {
            try {
                axios.post(`${serverString}otp/sendOTP`, { email: userEmail }).then(res => {

                    if (res.data === 'Invalid E-Mail ID') {
                        toast.error('Invalid E-Mail ID', { position: toast.POSITION.BOTTOM_RIGHT });
                    }
                    else {
                        toast.success('Check your mail for otp', { position: toast.POSITION.BOTTOM_RIGHT });
                        history.push({
                            pathname: '/reset-password',
                            state: userEmail
                        });
                    }
                }).catch(error => {
                    toast.error('Invalid Email ID', { position: toast.POSITION.BOTTOM_RIGHT });
                });
            } catch (err) {
                toast.error(`${err}`, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }

    }


    return (
        <>

            <div className="hero">
                <HomeNavBar />
                <div className="login-page" >
                    <div className="form" >
                        <form className="login-form">

                            <input name="email" type="text" placeholder="Enter E-Mail"
                                onChange={UpdateEmail}
                                value={userEmail} />

                            <button onClick={sendOTP}>Send OTP</button>
                        </form>
                    </div>
                </div>
            </div>
        </>

    );

}
export default SendOTPToEmail;