import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip, Typography } from "@material-ui/core";
import AdminNavBar from '../AdminNavBar/AdminNavBar';
import configData from '../../../default.json';


toast.configure();
function AdminAddDrafter() {

    const history = useHistory();

    const AdminToken = 'AdminToken';
    const token = localStorage.getItem(AdminToken);

    const serverString = configData.serverURI;

    const [newDrafter, setNewDrafter] = useState({
        drafterFullName: '',
        drafterUserName: '',
        drafterPassword: '',
        drafterConfirmPassword: '',
        drafterPhone: '',
        drafterMail: ''
    });


    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/admin/login`)

    }, []);

    const InputEventChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const name = e.target.name;

        setNewDrafter((preValue) => {

            return {
                ...preValue,
                [name]: value
            }
        });
    }

    // Register New Drafter
    const AddNewDrafter = (e) => {
        e.preventDefault();

        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const phonePattern = new RegExp(/^[0-9\b]+$/);
        const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

        if (newDrafter.drafterFullName === '' || newDrafter.drafterUserName === '' ||
            newDrafter.drafterPassword === '' || newDrafter.drafterPhone === '' ||
            newDrafter.drafterConfirmPassword === '' || newDrafter.drafterMail === '') {
            toast.error('All The Fields are required', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else if (newDrafter.drafterPassword !== newDrafter.drafterConfirmPassword) {

            toast.error("Passwords do not match", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (!emailPattern.test(newDrafter.drafterMail)) {

            toast.error("Please enter valid email address.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (!phonePattern.test(+newDrafter.drafterPhone)) {

            toast.error("Please enter only number.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (newDrafter.drafterPhone.length != 10) {

            toast.error("Please enter valid phone number of length 10.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (!passwordPattern.test(newDrafter.drafterPassword)) {

            toast.error("Please enter a Password according to the format.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else {
            const drafterUser = {
                DrafterName: newDrafter.drafterFullName,
                DrafterEmail: newDrafter.drafterMail.toLowerCase(),
                DrafterUserName: newDrafter.drafterUserName.toLowerCase(),
                DrafterPassword: newDrafter.drafterPassword,
                DrafterPhone: +newDrafter.drafterPhone
            };

            try {
                axios.post(`${serverString}drafter/add`, drafterUser, {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                })
                    .then(res => {

                        if (res.data.message) {
                            toast.error(res.data.message, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                        else {
                            toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                    }).catch(res =>
                        toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT })
                    );
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT })
            }
        }
    }

    return (
        <>

            <div className="dashboard">
                <div id="content">
                    <div className="PageHeader">

                        <h1>Add a new Drafter</h1>
                        <div className="UserFormContainer">

                            <div className="DataForm" >
                                <form>
                                    <div className="HorizontalAlignmentContainer">

                                        <div>
                                            <span id="form-input-tag">Full Name:<span className="required">*</span></span>
                                            <input value={newDrafter.drafterFullName} onChange={InputEventChange} name="drafterFullName" type="text" placeholder="Full Name" />
                                        </div>
                                        <div>
                                            <span id="form-input-tag">E-Mail:<span className="required">*</span></span>
                                            <input value={newDrafter.drafterMail} onChange={InputEventChange} name="drafterMail" type="text" placeholder="E-Mail Address" />
                                        </div>
                                    </div>


                                    <div className="HorizontalAlignmentContainer">

                                        <div>
                                            <span id="form-input-tag">Phone:<span className="required">*</span></span>
                                            <input value={newDrafter.drafterPhone} onChange={InputEventChange} name="drafterPhone" type="text" placeholder="Phone Number" />
                                        </div>
                                        <div>
                                            <span id="form-input-tag">UserName:<span className="required">*</span></span>
                                            <input value={newDrafter.drafterUserName} onChange={InputEventChange} name="drafterUserName" type="text" placeholder="User Name" />
                                        </div>
                                    </div>

                                    <span id="form-input-tag">User Password:
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
                                    <input value={newDrafter.drafterPassword} onChange={InputEventChange} name="drafterPassword" type="password" placeholder="Password" />
                                    <input value={newDrafter.drafterConfirmPassword} onChange={InputEventChange} name="drafterConfirmPassword" type="password" placeholder="Confirm Password" />

                                    <div className="Button">
                                        <button onClick={AddNewDrafter}>Add new Drafter</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AdminNavBar />
        </>

    );

}

export default AdminAddDrafter;