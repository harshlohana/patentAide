import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip, Typography } from "@material-ui/core";
import DrafterNavBar from '../DrafterNavBar/DrafterNavBar';
import configData from '../../../default.json';


toast.configure();
function DrafterProfile() {

    const history = useHistory();

    const DrafterIdKey = 'DrafterId';
    const DrafterToken = 'DrafterToken';
    const UserNameKey = 'DrafterName';
    const token = localStorage.getItem(DrafterToken);

    const serverString = configData.serverURI;

    const [currentUser, setCurrentUser] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: ''
    });

    const [currentUserValidate, setCurrentUserValidate] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: ''
    });



    async function loadDataFromAPI() {

        try {
            // Getting data of Particular Order
            const fetchedDrafter = await axios.get(`${serverString}drafter/${localStorage.getItem(DrafterIdKey)}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            setCurrentUser(() => {

                return {
                    name: fetchedDrafter.data.DrafterName,
                    username: fetchedDrafter.data.DrafterUserName,
                    email: fetchedDrafter.data.DrafterEmail,
                    phone: fetchedDrafter.data.DrafterPhone,
                    password: ''
                }
            });

            setCurrentUserValidate(() => {
                return {
                    name: fetchedDrafter.data.DrafterName,
                    username: fetchedDrafter.data.DrafterUserName,
                    email: fetchedDrafter.data.DrafterEmail,
                    phone: fetchedDrafter.data.DrafterPhone,
                    password: ''
                }
            });
        } catch (err) {
            toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/drafter/login`)
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
        else if (!emailPattern.test(currentUser.email)) {

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
                axios.post(`${serverString}drafter/update/${e.target.value}`, currentUser, {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                }).
                    then(res => {
                        if (res.data === 'Profile Updated!') {
                            document.getElementById('disableButton').disabled = false;
                            document.getElementById('disableButton').style.opacity = 'none';
                            document.getElementById('disableButton').style.cursor = 'pointer';
                            toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                        else {
                            toast.error(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));

                loadDataFromAPI();
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


            <DrafterNavBar />
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
                                                <span id="form-input-tag">Name: <span className="required">*</span></span>
                                                <input defaultValue={currentUser.name} onChange={InputEvent} name="name" type="text" placeholder="Full Name" />
                                            </div>
                                            <div>
                                                <span id="form-input-tag">User Name: <span className="required">*</span></span>
                                                <input defaultValue={currentUser.username} onChange={InputEvent} name="username" type="text" placeholder="User Name" />
                                            </div>
                                        </div>

                                        <div className="HorizontalAlignmentContainer">

                                            <div>
                                                <span id="form-input-tag">Email: <span className="required">*</span></span>
                                                <input defaultValue={currentUser.email} onChange={InputEvent} name="email" type="text" placeholder="E-Mail Address" />
                                            </div>
                                            <div>
                                                <span id="form-input-tag">Phone: <span className="required">*</span></span>
                                                <input defaultValue={currentUser.phone} onChange={InputEvent} name="phone" type="text" placeholder="Phone Number" />
                                            </div>
                                        </div>

                                        <span id="form-input-tag">Password:
                                            <Tooltip
                                                title={
                                                    <>
                                                        <Typography color="inherit">Password Should Be: </Typography>
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
                                            <button id="disableButton" value={localStorage.getItem(DrafterIdKey)} onClick={e => PutUser(e)}>Update User Data</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default DrafterProfile;