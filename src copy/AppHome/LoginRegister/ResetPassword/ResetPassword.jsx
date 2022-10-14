import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavBar from '../../AppHomeNavBar/AppHomeNavBar';
import configData from '../../../default.json';


toast.configure();
function ResetPassword(props) {

    const history = useHistory();

    const serverString = configData.serverURI;

    const [resetData, setResetData] = useState({
        otp: '',
        password: '',
        confirmpassword: ''
    });

    // Function to set value of username and password
    const UpdateFields = (e) => {

        const name = e.target.name;
        const value = e.target.value;

        setResetData((preValue) => {

            return {
                ...preValue,
                [name]: value
            }
        });
    }

    const resetPassword = (e) => {
        e.preventDefault();

        const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);


        if (resetData.otp === '' || resetData.password === '' ||
            resetData.confirmpassword === '') {
            toast.error('Fields Can not be empty', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else {
            if (resetData.password !== resetData.confirmpassword) {
                toast.error('Passwords Do not Match', { position: toast.POSITION.BOTTOM_RIGHT });
            }
            else if (!passwordPattern.test(resetData.confirmpassword)) {

                toast.error("Please enter password according to the requirement.", { position: toast.POSITION.BOTTOM_RIGHT });

            }
            else {
                try {
                    axios.get(`${serverString}otp/getOTP`, {
                        headers: {
                            email: props.location.state,
                            otp: resetData.otp,
                            password: resetData.confirmpassword
                        }
                    }).then(res => {
                        if (res.status === 200 && res.data === 'Password Updated Succesfully!') {
                            toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                        if (res.status === 200 && res.data === 'OTP Expired') {
                            toast.error(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(error => {
                        toast.error(error, { position: toast.POSITION.BOTTOM_RIGHT });
                    });
                } catch (err) {
                    toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
                }
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

                            <input name="otp" type="text" placeholder="Enter OTP"
                                onChange={UpdateFields}
                                value={resetData.otp} />

                            <input name="password" type="password" placeholder="New Password"
                                onChange={UpdateFields}
                                value={resetData.password} />

                            <input name="confirmpassword" type="password" placeholder="Confirm Password"
                                onChange={UpdateFields}
                                value={resetData.confirmpassword} />

                            <button onClick={resetPassword}>Reset</button>
                        </form>
                    </div>
                </div>
            </div>
        </>

    );

}
export default ResetPassword;