import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Register.css';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip, Typography, Button } from "@material-ui/core";
import countryList from 'react-select-country-list';
import HomeNavBar from '../../AppHomeNavBar/AppHomeNavBar';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import parsePhoneNumber from 'libphonenumber-js'
import { isValidPhoneNumber } from 'react-phone-number-input';
import configData from '../../../default.json';



toast.configure();
function RegisterForm() {

    const history = useHistory();

    const serverString = configData.serverURI;

    const [file, setFile] = useState();
    const [DisableNda, setDisableNda] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    const options = useMemo(() => countryList().getData(), []);

    const [userRegister, setUserRegister] = useState({

        userTitle: 'Mr.',
        userFName: '',
        userLName: '',
        userEmail: '',
        userCountry: options[0].label,
        userPhone: '',
        userProvidedNDA: '',
        regusername: '',
        userregpass: '',
        userregconfirmpass: ''
    });

    // Function to show/hide NDA file upload field acording to the need
    let DisalbeUploadNDA = e => {
        setUserRegister((preValue) => {

            return {
                ...preValue,
                userProvidedNDA: ''

            }
        });
        setDisableNda(current => !current);
    };

    const ShowLoginPage = () => {
        history.push('/login');
    }


    // Function to set value of username and password
    let UpdateRegistrationFields = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        if (name === 'userProvidedNDA') {
            setFile(e.target.files[0]);
        }

        setUserRegister((preValue) => {
            return {
                ...preValue,
                [name]: value

            }
        });

    }


    let RegisterUser = (event) => {
        event.preventDefault();
        console.log(phoneNumber);

        const userFullName = userRegister.userTitle + " " + userRegister.userFName + " " + userRegister.userLName;

        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const phonePattern = new RegExp(/^[0-9\b]+$/);
        const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);


        if (userRegister.userFName === '' || userRegister.userLName === '' || userRegister.userEmail === '' ||
            userRegister.userCountry === '' || phoneNumber === '' || userRegister.regusername === '' ||
            userRegister.userregpass === '') {

            toast.error('All The Fields are required', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else if ((!userRegister.userProvidedNDA) && DisableNda) {

            toast.error('NDA not provided', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else if (userRegister.userregpass !== userRegister.userregconfirmpass) {

            toast.error("Passwords do not match", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (!emailPattern.test(userRegister.userEmail)) {

            toast.error("Please enter valid email address.", { position: toast.POSITION.BOTTOM_RIGHT });

        }

        // else {
        //     toast.error("Please enter valid phone number of length 10.", { position: toast.POSITION.BOTTOM_RIGHT });
        // }
        // else if (!phonePattern.test(+userRegister.userPhone)) {

        //     toast.error("Please enter only number.", { position: toast.POSITION.BOTTOM_RIGHT });

        // }
        // else if (userRegister.userPhone.length != 10) {

        //     toast.error("Please enter valid phone number of length 10.", { position: toast.POSITION.BOTTOM_RIGHT });

        // }
        else if (!passwordPattern.test(userRegister.userregpass)) {

            toast.error("Please enter password according to the requirement.", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else if (isValidPhoneNumber(phoneNumber)) {

            userRegister.userPhone = parsePhoneNumber(phoneNumber).formatInternational();

            const formData = new FormData();
            formData.append('CustomerFullName', userFullName);
            formData.append('CustomerEmail', userRegister.userEmail.toLowerCase());
            formData.append('CustomerCountry', userRegister.userCountry);
            formData.append('CustomerPhone', userRegister.userPhone);
            formData.append('CustomerPassword', userRegister.userregpass);
            formData.append('CustomerUserName', userRegister.regusername.toLowerCase());

            if (userRegister.userProvidedNDA === '') {
                // const CustomerNDA = {
                //     NDAProvided: "N/A",
                //     NDARequested: userRegister.userRequestedNDA
                // }
                formData.append('NDAProvided', 'N/A');
                formData.append('NDARequested', true);
            }
            else {

                // const CustomerNDA = {
                //     NDAProvided: 'NDA_Of' + userFullName.split(' ').join('_') + "_" +
                //         userRegister.userProvidedNDA.split('\\').pop().split(' ').join('_'),
                //     NDARequested: userRegister.userRequestedNDA
                // }
                formData.append('NDAProvided', `NDA_Of_${userFullName.split(' ').join('_')}`);
                formData.append('NDARequested', false);

            }

            formData.append('file', file);
            // const user = {
            //     CustomerFullName: userFullName, CustomerEmail: userRegister.userEmail,
            //     CustomerCountry: userRegister.userCountry,
            //     CustomerPhone: +userRegister.userPhone,
            //     CustomerNDA: {
            //         NDAProvided: 'NDA_Of' + userFullName.split(' ').join('_') + "_" +
            //             userRegister.userProvidedNDA.split('\\').pop().split(' ').join('_'),
            //         NDARequested: userRegister.userRequestedNDA
            //     },
            //     CustomerPassword: userRegister.userregpass, CustomerUserName: userRegister.regusername
            // };
            // console.log(user);

            try {
                axios.post(`${serverString}customer/register`, formData)
                    .then(res => {

                        if (res.data === 'New Customer added successfully') {
                            history.push('/login');
                            toast.success("Registered Successfully.\n You can now Login.", { position: toast.POSITION.BOTTOM_RIGHT });
                        }
                        else {
                            toast.error(res.data.message, { position: toast.POSITION.BOTTOM_RIGHT });
                        }

                    }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
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
                    <form className="register-form">
                        <div className="UserFullName">
                            <select defaultValue={userRegister.userTitle} onChange={UpdateRegistrationFields}>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs." >Mrs.</option>
                                <option value="Miss" >Miss</option>
                                <option value="Dr." >Dr.</option>
                            </select>
                            <input value={userRegister.userFName} name="userFName" onChange={UpdateRegistrationFields} style={{ float: 'right' }} type="text" placeholder="First Name" />
                            <input value={userRegister.userLName} name="userLName" onChange={UpdateRegistrationFields} style={{ float: 'right' }} type="text" placeholder="Last Name" />
                        </div>
                        <input value={userRegister.userEmail} name="userEmail" onChange={UpdateRegistrationFields} type="text" placeholder="E-Mail Address" />

                        <select name="userCountry" value={userRegister.userCountry} onChange={UpdateRegistrationFields}>
                            {
                                options.map((option) => {
                                    return (
                                        <option value={option.label}>{option.label}</option>
                                    );
                                })
                            }
                        </select>
                        <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry="IN"
                            value={phoneNumber}
                            onChange={setPhoneNumber} />
                        {/* <input value={userRegister.userPhone} name="userPhone" onChange={UpdateRegistrationFields} type="tel" placeholder="Phone Number" /> */}
                        <input value={userRegister.regusername} name="regusername" onChange={UpdateRegistrationFields} type="text" placeholder="User Name" />
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
                            <span className="passwordToolTipSpan">i</span>
                        </Tooltip>
                        <input value={userRegister.userregpass} name="userregpass" onChange={UpdateRegistrationFields} type="password" placeholder="Password" />
                        <input value={userRegister.userregconfirmpass} name="userregconfirmpass" onChange={UpdateRegistrationFields} type="password" placeholder="Confirm Password" />
                        {
                            DisableNda ?
                                <div>
                                    {
                                        userRegister.userProvidedNDA ?
                                            <input value={userRegister.userProvidedNDA.split('\\').pop()} name="userProvidedNDA" readOnly /> : null
                                    }
                                    <input value={userRegister.userProvidedNDA} style={{ display: 'none' }} name="userProvidedNDA" id="contained-button-file" onChange={UpdateRegistrationFields} type="file" placeholder="Upload File" />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color="primary" component="span">
                                            Choose NDA
                                        </Button>
                                    </label>
                                </div>
                                : null
                        }
                        <br />
                        <p style={{ color: 'black' }}>Or</p>
                        <br />
                        <div style={{ display: 'block', color: 'black' }}>
                            Request NDA?
                            <input onClick={DisalbeUploadNDA} style={{ float: 'left' }} type="checkbox" placeholder="Request File" />
                        </div>
                        <button onClick={RegisterUser}>create</button>
                        <p className="message">Already registered? <span onClick={ShowLoginPage}>Sign In</span></p>
                    </form>
                </div>
            </div>
        </>

    );
}



export default RegisterForm;