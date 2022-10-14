import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip, Typography } from "@material-ui/core";
import countryList from 'react-select-country-list';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import configData from '../../../default.json';


toast.configure();
function CusromerProfile() {

    const history = useHistory();

    const options = useMemo(() => countryList().getData(), []);

    const CustomerIdKey = 'CustomerId';
    const CustomerToken = 'CustomerToken';
    const UserNameKey = 'CustomerName';

    const token = localStorage.getItem(CustomerToken);

    const serverString = configData.serverURI;

    const [currentUser, setCurrentUser] = useState({
        name: '',
        username: '',
        email: '',
        country: '',
        phone: '',
        password: ''
    });
    const [currentUserValidate, setCurrentUserValidate] = useState({
        name: '',
        username: '',
        email: '',
        country: '',
        phone: '',
        password: ''
    });

    async function loadDataFromAPI() {

        try {
            // Getting data of Particular Order
            const fetchedCustomer = await axios.get(`${serverString}customer/${localStorage.getItem(CustomerIdKey)}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            setCurrentUser(() => {

                return {
                    name: fetchedCustomer.data["CustomerFullName"],
                    username: fetchedCustomer.data["CustomerUserName"],
                    email: fetchedCustomer.data["CustomerEmail"],
                    country: fetchedCustomer.data["CustomerCountry"],
                    phone: fetchedCustomer.data["CustomerPhone"],
                    password: ''
                }
            });

            setCurrentUserValidate(() => {
                return {
                    name: fetchedCustomer.data["CustomerFullName"],
                    username: fetchedCustomer.data["CustomerUserName"],
                    email: fetchedCustomer.data["CustomerEmail"],
                    country: fetchedCustomer.data["CustomerCountry"],
                    phone: fetchedCustomer.data["CustomerPhone"],
                    password: ''
                }
            });
        } catch (err) {
            toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/`)
        else
            loadDataFromAPI()

    }, []);

    const PutUser = (e) => {
        e.preventDefault();

        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const phonePattern = new RegExp(/^[0-9\b]+$/);
        const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

        if (currentUser.name === '' || currentUser.username === '' ||
            currentUser.email === '' || currentUser.country === '' ||
            currentUser.phone === '' || currentUser.password === '') {
            toast.error('Fields Cannot Be Empty', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        if (!emailPattern.test(currentUser.email)) {

            toast.error("Please enter valid email address.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (!phonePattern.test(+currentUser.phone)) {

            toast.error("Please enter only number.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (currentUser.phone.toString().length != 10) {

            toast.error("Please enter valid phone number of length 10.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (!passwordPattern.test(currentUser.password)) {

            toast.error("Please enter a Password according to the format.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (currentUser.name !== currentUserValidate.name ||
            currentUser.username !== currentUserValidate.username ||
            currentUser.email !== currentUserValidate.email ||
            currentUser.country !== currentUserValidate.country ||
            currentUser.phone !== currentUserValidate.phone ||
            currentUser.password !== currentUserValidate.password) {

            document.getElementById('disableButton').disabled = true;
            document.getElementById('disableButton').style.opacity = 0.5;
            document.getElementById('disableButton').style.cursor = 'not-allowed';

            try {
                axios.post(`${serverString}customer/update/${e.target.value}`, currentUser, {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                }).
                    then(res => {
                        if (res.data === 'Profile updated!') {

                            document.getElementById('disableButton').disabled = false;
                            document.getElementById('disableButton').style.opacity = 'none';
                            document.getElementById('disableButton').style.cursor = 'pointer';

                            toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });

                            loadDataFromAPI();
                        }
                        else {
                            toast.error(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(res => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
        else {
            toast.error("No Change is Made", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    const InputEvent = (e) => {

        e.preventDefault();

        const value = e.target.value;
        const name = e.target.name;

        setCurrentUser((preValue) => {

            return {
                ...preValue,
                [name]: value
            }
        });
    }

    return (
        <>
            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div className="PageHeader">

                            <h1>{localStorage.getItem(UserNameKey)}'s, Profile</h1>

                            <div className="UserFormContainer">
                                <div className="DataForm">
                                    <form>
                                        <div className="HorizontalAlignmentContainer">

                                            <div>
                                                <span id="form-input-tag">Name:<span className="required">*</span></span>
                                                <input defaultValue={currentUser.name} onChange={InputEvent} name="name" type="text" placeholder="Full Name" />
                                            </div>
                                            <div>
                                                <span id="form-input-tag">UserName:<span className="required">*</span></span>
                                                <input defaultValue={currentUser.username} onChange={InputEvent} name="username" type="text" placeholder="User Name" />
                                            </div>
                                        </div>

                                        <div className="HorizontalAlignmentContainer">

                                            <div>
                                                <span id="form-input-tag">Phone:<span className="required">*</span></span>
                                                <input defaultValue={currentUser.phone} onChange={InputEvent} name="phone" type="text" placeholder="Phone Number" />
                                            </div>
                                            <div>
                                                <span id="form-input-tag">Email:<span className="required">*</span></span>
                                                <input defaultValue={currentUser.email} onChange={InputEvent} name="email" type="text" placeholder="E-Mail Address" />
                                            </div>
                                        </div>

                                        <div>
                                            <span id="form-input-tag">Country:<span className="required">*</span></span>
                                            <select name="country" value={currentUser.country} onChange={InputEvent}>
                                                {
                                                    options.map((option) => {
                                                        return (
                                                            <option value={option.label}>{option.label}</option>
                                                        );
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <span id="form-input-tag">Password:
                                            <Tooltip
                                                title={
                                                    <>
                                                        <Typography color="inherit">Password Should Be:</Typography>
                                                        <Typography color="inherit">- 8 Characters Long</Typography>
                                                        <Typography color="inherit">- Should Contain 1 Digit(0,1,2...9)</Typography>
                                                        <Typography color="inherit">- Should Contain 1 Small letter(q,w,a,s...)</Typography>
                                                        <Typography color="inherit">- Should Contain 1 Capital letter(Q,W,A,S...)</Typography>
                                                        <Typography color="inherit">- Should Contain 1 Special Character(!,@,#...*)</Typography>
                                                    </>
                                                }
                                                placement="right"
                                            >
                                                <span style={{ cursor: 'pointer' }} className="required">*</span>
                                            </Tooltip>
                                        </span>
                                        <input defaultValue={currentUser.password} onChange={InputEvent} name="password" type="password" placeholder="Password" />


                                        <div className="Button">
                                            <button id="disableButton" value={localStorage.getItem(CustomerIdKey)} onClick={e => PutUser(e)}>Update User Data</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerNavBar />
        </>
    );

}

export default CusromerProfile;