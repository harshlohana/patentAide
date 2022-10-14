import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavBar from '../../AppHomeNavBar/AppHomeNavBar';
import configData from '../../../default.json';

toast.configure();
function LoginForm() {


    const history = useHistory();

    const serverString = configData.serverURI;

    const [userLogin, setUserLogin] = useState(
        {
            username: '',
            userpass: ''
        }
    );


    const showRegistrationPage = () => {
        history.push('/register');
    }
    const showForgotPassswordPage = () => {
        history.push('/sendOTP');
    }

    // Function to set value of username and password
    let UpdateLoginFields = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        setUserLogin((preValue) => {

            return {
                ...preValue,
                [name]: value

            }
        });
    }


    let LoginUser = (event) => {
        event.preventDefault();

        if (userLogin.username === '' || userLogin.userpass === '') {
            toast.error('Both The Fields are required', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else {
            const user = { CustomerLoginID: userLogin.username, CustomerPassword: userLogin.userpass };

            try {
                axios.post(`${serverString}Customer/login`, user)
                    .then(res => {

                        if (res.data !== 'Invalid Credentials') {

                            const CustomerIdKey = 'CustomerId';
                            const UserNameKey = 'CustomerName';
                            const CustomerToken = 'CustomerToken';
                            localStorage.setItem(CustomerIdKey, res.data.customer.id);
                            localStorage.setItem(UserNameKey, res.data.customer.CustomerFullName);
                            localStorage.setItem(CustomerToken, res.data.token);

                            toast.success('Login Successful', { position: toast.POSITION.BOTTOM_RIGHT });

                            history.push({
                                pathname: `/customer/home`
                            });

                        }
                        else {
                            toast.error(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(error => toast.error(`${error}`, { position: toast.POSITION.BOTTOM_RIGHT }));
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT })
            }
        }
    }


    return (
        <>

            <HomeNavBar />
            <div className="login-page" >
                <div className="form" >
                    <form className="login-form">

                        <input name="username" type="text" placeholder="username/email"
                            onChange={UpdateLoginFields}
                            value={userLogin.username} />

                        <input name="userpass" type="password" placeholder="password"
                            onChange={UpdateLoginFields}
                            value={userLogin.userpass} />

                        <button onClick={LoginUser}>login</button>
                        <p className="message"><span onClick={showForgotPassswordPage}>Forgot Password?</span></p>
                        <p className="message">Not registered? <span onClick={showRegistrationPage}>Create an account</span></p>
                    </form>
                </div>
            </div>
        </>

    );

}
export default LoginForm;