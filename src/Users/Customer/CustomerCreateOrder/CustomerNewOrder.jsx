import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import JSZip, { JSZipUtils } from 'jszip';
import axios from 'axios';
import './CustomerNewOrder.css';
import 'react-toastify/dist/ReactToastify.css';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import configData from '../../../default.json';


toast.configure();

function CusromerNewOrder() {

    const history = useHistory();

    const CustomerIdKey = 'CustomerId';
    const UserNameKey = 'CustomerName';
    const CustomerToken = 'CustomerToken';
    const token = localStorage.getItem(CustomerToken);

    const serverString = configData.serverURI;

    let nameArr = localStorage.getItem(UserNameKey).split(' ').join('_');

    const [file, setFile] = useState();
    const [order, setOrder] = useState({
        orderFilePath: '',
        orderDrawingType: '',
        orderPTOOffice: '',
        orderAttorneyReferenceNumber: '',
        orderCiriticality: '',
        orderInstructions: '',
    });

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/`)

    }, []);


    const InputEvent = (e) => {

        e.preventDefault();

        let name = e.target.name;
        let value = e.target.value;

        if (e.target.name === 'orderFilePath') {

            var zip = new JSZip();
            var count = 0;

            for (let i = 0; i < e.target.files.length; i++) {
                // console.log(e.target.files[i].name);
                // console.log(e.target.files[i].type);
                // console.log(e.target.files[i]);
                zip.file(e.target.files[i].name, e.target.files[i]);
                count++;

                if (count == e.target.files.length) {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        setFile(content);
                    });
                }
            }
        }

        setOrder((preValue) => {

            return {
                ...preValue,
                [name]: value
            }
        })

    }

    const disableButton = (e) => {

        e.preventDefault();



        if (order.orderDrawingType === '' || order.orderFilePath === '' ||
            order.orderPTOOffice === '' || order.orderCiriticality === '' ||
            order.orderInstructions === '') {
            toast.error('All The Fields are required', { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else {

            document.getElementById('disableButton').disabled = true;
            document.getElementById('disableButton').style.opacity = 0.5;
            document.getElementById('disableButton').style.cursor = 'not-allowed';

            const formData = new FormData();

            formData.append('userData', nameArr + "_" + localStorage.getItem(CustomerIdKey));
            // formData.append('userId', localStorage.getItem(CustomerIdKey));
            formData.append('customerID', localStorage.getItem(CustomerIdKey));
            // formData.append('orderFilePath', order.orderDrawingType.split(" ").join("_") + "_" + localStorage.getItem(CustomerIdKey).slice(localStorage.getItem(CustomerIdKey) - 5) + "_" +
            //     order.orderFilePath.split('\\').pop().split(' ').join('_'));
            formData.append('orderDrawingType', order.orderDrawingType);
            formData.append('orderPTOOffice', order.orderPTOOffice);

            formData.append('orderAttorneyReferenceNumber', order.orderAttorneyReferenceNumber);

            formData.append('orderCiriticality', order.orderCiriticality);
            formData.append('orderInstructions', order.orderInstructions);
            formData.append('orderStatus', 'requested');
            formData.append('file', file);


            try {
                axios.post(`${serverString}order/add`, formData, {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                })
                    .then(res => {

                        if (res.data) {
                            document.getElementById('disableButton').disabled = false;
                            document.getElementById('disableButton').style.opacity = 'none';
                            document.getElementById('disableButton').style.cursor = 'pointer';

                            toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });
                            history.push({
                                pathname: `/customer/allorders`
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

            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div className="PageHeader">
                            <h1>Create a new Order</h1>
                            <div className="UserFormContainer">
                                <div className="OrderForm">
                                    <form>
                                        <span id="form-input-tag">Upload File:<span className="required">*</span></span>
                                        <span className="required" style={{ fontSize: '16px' }}>* Do not upload zip!<br/></span>
                                        <span className="required" style={{ fontSize: '16px' }}>* Upload all files at once!</span>
                                        {
                                            order.orderFilePath ?
                                                <input className="FileUpload" value="Order.zip" readonly /> : null
                                        }
                                        <input className="FileUpload" value={order.orderFilePath} onChange={InputEvent} name="orderFilePath" type="file" multiple placeholder="Upload A File" />



                                        <span id="form-input-tag">Drawing Type:<span className="required">*</span></span>
                                        <select value={order.orderDrawingType} onChange={InputEvent} name="orderDrawingType">
                                            <option>Select Drawing Type...</option>
                                            <option value="Utility Drawing">Utility Drawing</option>
                                            <option value="Design Drawing" >Design Drawing</option>
                                            <option value="Objected Patent Drawing" >Objected Patent Drawing</option>
                                            <option value="Trademark Drawing" >Trademark Drawing</option>
                                            <option value="Plant Patent Drawing" >Plant Patent Drawing</option>
                                            <option value="others" >Others</option>
                                        </select>

                                        <span id="form-input-tag">PTO office Name:<span className="required">*</span></span>
                                        <input value={order.orderPTOOffice} onChange={InputEvent} name="orderPTOOffice" type="text" placeholder="PTO office Name" />

                                        <span id="form-input-tag">Attorney Reference Number:</span>
                                        <input value={order.orderAttorneyReferenceNumber} onChange={InputEvent} name="orderAttorneyReferenceNumber" type="text" placeholder="Attorney Reference Number" />

                                        <span id="form-input-tag">Criticality of Delivery:<span className="required">*</span></span>
                                        <select value={order.orderCiriticality} onChange={InputEvent} name="orderCiriticality">
                                            <option>Select Delivery Type...</option>
                                            <option value="Normal Delivery" >Normal Delivery</option>
                                            <option value="Urgent Delivery">Urgent Delivery</option>
                                        </select>

                                        <span id="form-input-tag">Instructions:<span className="required">*</span></span>
                                        <textarea value={order.orderInstructions} onChange={InputEvent} name="orderInstructions" type="textarea" placeholder="Instructions" ></textarea>

                                        <div className="Button">
                                            <button id="disableButton" onClick={disableButton}>Create Order</button>
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

export default CusromerNewOrder;