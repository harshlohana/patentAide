import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import axios from 'axios';
import download from 'downloadjs';
import './AdminViewSingleOrder.css';
// import ScrollToBottom from "react-scroll-to-bottom";
import AdminNavBar from '../AdminNavBar/AdminNavBar';
import 'react-toastify/dist/ReactToastify.css';
import JSZip, { JSZipUtils } from 'jszip';
import { io } from "socket.io-client";
import {
    Box, Button, Typography, Modal
} from '@material-ui/core';
import configData from '../../../default.json';


toast.configure();


function AdminViewSingleOrder(props) {

    const dtToday = new Date();

    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();

    const maxDate = year + '-' + month + '-' + day;

    const history = useHistory();
    const socket = useRef();

    const AdminIdKey = 'AdminId';
    const AdminToken = 'AdminToken';
    const token = localStorage.getItem(AdminToken);

    const serverString = configData.serverURI;

    // console.log("Props");
    console.log(props);

    const [customerFile, setCustomerFile] = useState();
    const [drafterPreviewFile, setDrafterPreviewFile] = useState();
    const [drafterFinalPreviewFile, setDrafterFinalPreviewFile] = useState();
    const [adminFile, setAdminFile] = useState();
    const [drafters, setDrafters] = useState([]);
    const [drafterMessage, setDrafterMessages] = useState([]);
    const [customerMessage, setCustomerMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const [customerMessageToSend, setCustomerMessageToSend] = useState('');
    const [drafterMessageToSend, setDrafterMessageToSend] = useState('');
    const [orderData, setOrderData] = useState({
        orderCustomerName: props.location.state[0].CustomerName,
        orderCustomerId: props.location.state[0].CustomerId,
        orderFilePath: props.location.state[0].OrderFilePath,
        // adminCorrectedFilePath: props.location.state[0].AdminCorrectedFilePath,
        drafterFilePath: props.location.state[0].DrafterSubmitFile,
        drafterFinalFilePath: props.location.state[0].DrafterSubmitFinalFile,
        orderDrawingType: props.location.state[0].OrderDrawingType,
        orderPTOOffice: props.location.state[0].OrderPTOOffice,
        orderCiriticality: props.location.state[0].OrderCriticality,
        orderInstructions: props.location.state[0].OrderInformation,
        orderStatus: props.location.state[0].OrderStatus,
        orderDrafterId: props.location.state[0].DrafterId,
        orderQuotation: props.location.state[0].OrderQuotation,
        orderDeliveryDate: props.location.state[0].OrderTimeToComplete,
        drafterOrderDeliveryDate: props.location.state[0].DrafterOrderTimeToComplete,
        orderAttorneyReferenceNumber: props.location.state[0].OrderAttorneyReferenceNumber
    });
    const [validateOrderData, setValidateOrderData] = useState({
        orderDrawingType: props.location.state[0].OrderDrawingType,
        orderPTOOffice: props.location.state[0].OrderPTOOffice,
        orderCiriticality: props.location.state[0].OrderCriticality,
        orderInstructions: props.location.state[0].OrderInformation,
        orderStatus: props.location.state[0].OrderStatus,
        orderDrafterId: props.location.state[0].DrafterId,
        orderQuotation: props.location.state[0].OrderQuotation,
        orderDeliveryDate: props.location.state[0].OrderTimeToComplete,
        drafterOrderDeliveryDate: props.location.state[0].DrafterOrderTimeToComplete,
    });

    const OnCustomerMessageChange = (e) => {

        const value = e.target.value;

        setCustomerMessageToSend(value);

    }

    const OnDrafterMessageChange = (e) => {

        const value = e.target.value;

        setDrafterMessageToSend(value);

    }

    const ShowDrafterPreviewFileToUser = (e) => {

        e.preventDefault();

        try {

            axios.post(`${serverString}order/update/${props.location.state[0]._id}`,
                { showCustomerPreviewFile: true },
                {
                    headers: {
                        'x-auth-token': `${token}`,
                        'user': 'showCustomerPreviewFile'
                    }
                })
                .then()
                .catch(e => toast.error(e, { position: toast.POSITION.BOTTOM_RIGHT }));
        } catch (err) {
            toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
        }

    }

    const ShowDrafterFinalPreviewToUser = (e) => {

        e.preventDefault();

        try {

            axios.post(`${serverString}order/update/${props.location.state[0]._id}`,
                { showCustomerFinalFile: true },
                {
                    headers: {
                        'x-auth-token': `${token}`,
                        'user': 'showCustomerFinalFile'
                    }
                })
                .then()
                .catch(e => toast.error(e, { position: toast.POSITION.BOTTOM_RIGHT }));
        } catch (err) {
            toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
        }

    }

    const SendCustomerMessage = (recId) => {


        const messageText = customerMessageToSend;
        const receiverId = recId;

        if (messageText === '') {

        }
        else {
            try {
                axios.post(`${serverString}message/add`,
                    {
                        OrderId: props.location.state[0]._id,
                        SenderId: localStorage.getItem(AdminIdKey),
                        ReceiverId: receiverId,
                        Message: messageText
                    }, {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                }).then(res => {
                    // console.log(res)
                    socket.current.emit("sendMessage", {
                        senderId: localStorage.getItem(AdminIdKey),
                        receiverId,
                        text: messageText
                    });

                    setCustomerMessages((prev) => [...prev, {
                        OrderId: props.location.state[0]._id,
                        SenderId: localStorage.getItem(AdminIdKey),
                        Message: messageText
                    }]);

                }).catch(e => toast.error(e, { position: toast.POSITION.BOTTOM_RIGHT }));
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }

        setCustomerMessageToSend('');
    }

    const SendDrafterMessage = (recId) => {
        const messageText = drafterMessageToSend;
        const receiverId = recId;

        if (messageText === '') {

        }
        else {
            try {
                axios.post(`${serverString}message/add`,
                    {
                        OrderId: props.location.state[0]._id,
                        SenderId: localStorage.getItem(AdminIdKey),
                        ReceiverId: receiverId,
                        Message: messageText
                    }, {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                }).then(res => {
                    // console.log(res)
                    socket.current.emit("sendMessage", {
                        senderId: localStorage.getItem(AdminIdKey),
                        receiverId,
                        text: messageText
                    });

                    setDrafterMessages((prev) => [...prev, {
                        OrderId: props.location.state[0]._id,
                        SenderId: localStorage.getItem(AdminIdKey),
                        Message: messageText
                    }]);

                }).catch(e => toast.error(e, { position: toast.POSITION.BOTTOM_RIGHT }));
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }

        setDrafterMessageToSend('');
    }


    const EventChange = (e) => {
        e.preventDefault();

        let name = e.target.name;
        let value = e.target.value;

        if (e.target.name === 'adminCorrectedFilePath') {

            var zip = new JSZip();
            var count = 0;

            for (let i = 0; i < e.target.files.length; i++) {

                zip.file(e.target.files[i].name, e.target.files[i]);
                count++;

                if (count == e.target.files.length) {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        setAdminFile(content);
                    });
                }
            }
        }

        setOrderData((preValue) => {
            // console.log(preValue);
            return {
                ...preValue,
                [name]: value
            }
        });
    }

    const UpdateOrder = () => {

        // console.log("order data");
        // console.log(orderData);
        // console.log("validateOrderData");
        // console.log(validateOrderData);

        if (orderData.orderDrawingType === '' || orderData.orderPTOOffice === '' ||
            orderData.orderCiriticality === '' || orderData.orderInstructions === '' ||
            orderData.orderStatus === '' || orderData.adminCorrectedFilePath === '') {

            toast.error("Predefined Fields Can't be empty.\n You can't make predefined fields empty", { position: toast.POSITION.BOTTOM_RIGHT });
        }
        else if (orderData.orderDrawingType !== validateOrderData.orderDrawingType ||
            orderData.orderPTOOffice !== validateOrderData.orderPTOOffice ||
            orderData.orderCiriticality !== validateOrderData.orderCiriticality ||
            orderData.orderInstructions !== validateOrderData.orderInstructions ||
            orderData.orderStatus !== validateOrderData.orderStatus ||
            orderData.orderDrafterId !== validateOrderData.orderDrafterId ||
            orderData.orderQuotation !== validateOrderData.orderQuotation ||
            orderData.orderDeliveryDate !== validateOrderData.orderDeliveryDate ||
            orderData.drafterOrderDeliveryDate !== validateOrderData.drafterOrderDeliveryDate ||
            orderData.adminCorrectedFilePath !== validateOrderData.adminCorrectedFilePath
        ) {

            document.getElementById('disableButton').disabled = true;
            document.getElementById('disableButton').style.opacity = 0.5;
            document.getElementById('disableButton').style.cursor = 'not-allowed';

            const formData = new FormData();

            formData.append("drawing", orderData.orderDrawingType);
            formData.append("criticality", orderData.orderCiriticality);
            formData.append("ptooffice", orderData.orderPTOOffice);
            formData.append("instructions", orderData.orderInstructions);
            formData.append("file", adminFile);
            formData.append("value", orderData.orderDrafterId);
            formData.append("status", orderData.orderStatus);
            formData.append("quotation", orderData.orderQuotation);
            formData.append("deliveryDate", orderData.orderDeliveryDate);
            formData.append("drafterDeliveryDate", orderData.drafterOrderDeliveryDate);

            const updatedOrder = {
                drawing: orderData.orderDrawingType,
                criticality: orderData.orderCiriticality,
                ptooffice: orderData.orderPTOOffice,
                instructions: orderData.orderInstructions,
                adminCorrectedFilePath: adminFile,
                value: orderData.orderDrafterId,
                status: orderData.orderStatus,
                quotation: orderData.orderQuotation,
                deliveryDate: orderData.orderDeliveryDate,
                drafterDeliveryDate: orderData.drafterOrderDeliveryDate
            };

            // console.log(updatedOrder);

            const getHeader = props.location.state[0].CustomerName.split(' ').join('_') + "_" + props.location.state[0].CustomerId;

            try {
                // console.log(props.location.state[0].CustomerName.split(' ').join('_') + "_" + props.location.state[0].CustomerId);

                // console.log(orderData.orderStatus !== validateOrderData.orderStatus);
                if (orderData.orderStatus !== validateOrderData.orderStatus) {

                    axios.post(`${serverString}order/update/${props.location.state[0]._id}`,
                        formData,
                        {
                            headers: {
                                'dirpath': `${getHeader}`,
                                'x-auth-token': `${token}`
                            }
                        }).then(res => {
                            // console.log(res);
                            if (res.data === "Order Status Updated!") {

                                document.getElementById('disableButton').disabled = false;
                                document.getElementById('disableButton').style.opacity = 'none';
                                document.getElementById('disableButton').style.cursor = 'pointer';

                                toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });


                                setOrderData({
                                    orderCustomerName: props.location.state[0].CustomerName,
                                    orderCustomerId: props.location.state[0].CustomerId,
                                    orderFilePath: props.location.state[0].OrderFilePath,
                                    orderDrawingType: updatedOrder.drawing,
                                    orderPTOOffice: updatedOrder.ptooffice,
                                    orderCiriticality: updatedOrder.criticality,
                                    orderInstructions: updatedOrder.instructions,
                                    orderStatus: updatedOrder.status,
                                    orderDrafterId: updatedOrder.value,
                                    orderQuotation: updatedOrder.quotation,
                                    orderDeliveryDate: updatedOrder.deliveryDate,
                                    drafterOrderDeliveryDate: updatedOrder.drafterDeliveryDate,
                                });


                            }
                        }).catch(e => toast.error(e, { position: toast.POSITION.BOTTOM_RIGHT }));
                }
                else {
                    axios.post(`${serverString}order/update/${props.location.state[0]._id}`,
                        formData,
                        {
                            headers: {
                                'dirpath': `${getHeader}`,
                                'x-auth-token': `${token}`,
                                'user': 'admin'
                            }
                        }).then(res => {
                            // console.log(res);
                            if (res.data === "Order Status Updated!") {
                                toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });

                                // loadDataFromAPI();

                                setOrderData({
                                    orderCustomerName: props.location.state[0].CustomerName,
                                    orderCustomerId: props.location.state[0].CustomerId,
                                    orderFilePath: props.location.state[0].OrderFilePath,
                                    orderDrawingType: updatedOrder.drawing,
                                    orderPTOOffice: updatedOrder.ptooffice,
                                    orderCiriticality: updatedOrder.criticality,
                                    orderInstructions: updatedOrder.instructions,
                                    orderStatus: updatedOrder.status,
                                    orderDrafterId: updatedOrder.value,
                                    orderQuotation: updatedOrder.quotation,
                                    orderDeliveryDate: updatedOrder.deliveryDate,
                                    drafterOrderDeliveryDate: updatedOrder.drafterDeliveryDate,
                                });


                            }
                        }).catch(e => toast.error(e, { position: toast.POSITION.BOTTOM_RIGHT }));
                }
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
        else {
            toast.error("No change is made!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    async function loadDataFromAPI() {

        // Hiding all tabs data at startup
        var i;
        var x = document.getElementsByClassName("tab-pane");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById('menu').style.display = "block";
        document.getElementById('customerfile').style.display = 'none';

        document.getElementById('myForm').style.display = "none";
        document.getElementById('myFormDrafter').style.display = "none";
        document.getElementById('chatSelectionButtons').style.display = "block";

        try {

            const fetchedDrafters = await axios.get(`${serverString}drafter/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });


            setDrafters(fetchedDrafters.data);



            const fetchedConversation = await axios.get(`${serverString}message/${props.location.state[0]._id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });


            let customerConversation = [];
            let drafterConversation = [];

            for (let i = 0; i < fetchedConversation.data.length; i++) {
                if (fetchedConversation.data[i].ReceiverId === props.location.state[0].CustomerId ||
                    fetchedConversation.data[i].SenderId === props.location.state[0].CustomerId) {

                    customerConversation.push(fetchedConversation.data[i]);
                }
                else if (fetchedConversation.data[i].ReceiverId === props.location.state[0].DrafterId ||
                    fetchedConversation.data[i].SenderId === props.location.state[0].DrafterId) {

                    drafterConversation.push(fetchedConversation.data[i]);
                }
            }

            setDrafterMessages(drafterConversation);
            setCustomerMessages(customerConversation);


            setCustomerMessageToSend('');
            setDrafterMessageToSend('');


            try {

                const getHeader = props.location.state[0].CustomerName.split(' ').join('_') + "_" + props.location.state[0].CustomerId;

                await axios.get(`${serverString}order/getfile/${props.location.state[0]._id}`, {
                    headers: {
                        'dirpath': `${getHeader}`,
                        'filepath': `${props.location.state[0].OrderFilePath}`,
                        'x-auth-token': `${token}`
                    },
                    responseType: 'blob'
                }).then(res => {

                    setCustomerFile(res.data);

                    setTimeout(() => {
                        document.getElementById('customerfile').style.display = 'block';
                    }, 2000);

                });

                await axios.get(`${serverString}order/getfile/${props.location.state[0]._id}`, {
                    headers: {
                        'dirpath': `${getHeader}`,
                        'filepath': `${props.location.state[0].DrafterSubmitFile}`,
                        'x-auth-token': `${token}`
                    },
                    responseType: 'blob'
                }).then(res => {
                    setDrafterPreviewFile(res.data);
                });

                await axios.get(`${serverString}order/getfile/${props.location.state[0]._id}`, {
                    headers: {
                        'dirpath': `${getHeader}`,
                        'filepath': `${props.location.state[0].DrafterSubmitFinalFile}`,
                        'x-auth-token': `${token}`
                    },
                    responseType: 'blob'
                }).then(res => {
                    setDrafterFinalPreviewFile(res.data);
                });

            }
            catch (err) {
                console.log('File Does not exist');
            }


        } catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT })
        }
    }

    const downloadFile = (val) => {

        if (val === 'drafterFile') {
            download(drafterPreviewFile, `${orderData.drafterFilePath}`);

        }
        else if (val === 'drafterFinalFile') {
            download(drafterFinalPreviewFile, `${orderData.drafterFinalFilePath}`);

        }
        else if (val === 'initialZip') {
            download(customerFile, `${orderData.orderFilePath}`);
        }

    }

    const openForm = () => {

        document.getElementById("myForm").style.display = "block";
        document.getElementById("myFormDrafter").style.display = "none";
        document.getElementById("chatSelectionButtons").style.display = "none";
    }


    // Remove these and implement in react 
    const closeForm = () => {
        document.getElementById("myForm").style.display = "none";
        document.getElementById("myFormDrafter").style.display = "none";
        document.getElementById("chatSelectionButtons").style.display = "block";
    }

    const openFormDrafter = () => {
        document.getElementById("myForm").style.display = "none";
        document.getElementById("myFormDrafter").style.display = "block";
        document.getElementById("chatSelectionButtons").style.display = "none";
    }

    const closeFormDrafter = () => {
        document.getElementById("myForm").style.display = "none";
        document.getElementById("myFormDrafter").style.display = "none";
        document.getElementById("chatSelectionButtons").style.display = "block";
    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/admin/login`)
        else
            loadDataFromAPI();


    }, []);

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            // console.log(data);
            setArrivalMessage({
                SenderId: data.senderId,
                Message: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        // console.log('Inside Socket useEffect');

        socket.current.emit("addUser", localStorage.getItem(AdminIdKey));
        socket.current.on("getUsers", users => {
            // console.log(users);
        });
    }, []);

    useEffect(() => {


        if (arrivalMessage !== null) {

            if (arrivalMessage.SenderId === props.location.state[0].CustomerId) {

                setCustomerMessages((prev) => [...prev, arrivalMessage]);
            }
            else {

                setDrafterMessages((prev) => [...prev, arrivalMessage]);
            }

        }


    }, [arrivalMessage]);



    const OpenTab = (divname) => {

        var i;
        var x = document.getElementsByClassName("tab-pane");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById(divname).style.display = "block";
    }

    return (
        <>
            <div className="area">
                <div className="container-order">
                    <section className="ordr-no">
                        <div className="row">
                            <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                Order Id: #{props.location.state[0]._id.slice(props.location.state[0]._id.length - 5)}
                            </h1>
                        </div>
                    </section>
                    <section className="ordr-chat">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="crd">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 style={{ fontWeight: 'bold' }}>
                                                Name: {props.location.state[0].CustomerName}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 style={{ fontWeight: 'bold' }}>Id: #{props.location.state[0]._id.slice(props.location.state[0]._id.length - 5)}</h3>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-row">
                                                <label style={{ fontSize: 'larger', fontWeight: '600' }}>Customer file: &nbsp; &nbsp;

                                                    <button id="customerfile" className="userButton" readOnly onClick={() => downloadFile('initialZip')}><i style={{ color: 'black' }} className="fa fa-download" aria-hidden="true"></i></button>

                                                </label>
                                                {
                                                    <input className="form-control col-sm-10" type="text" readOnly value={orderData.orderFilePath} />
                                                }
                                            </div><br />
                                            <div className="form-row">
                                                <label style={{ fontSize: 'larger', fontWeight: '600' }}>Drawing type: </label>
                                                <select className="form-control col-sm-10" id="name" value={orderData.orderDrawingType} onChange={EventChange} name="orderDrawingType">
                                                    <option value="">Select Drawing Type...</option>
                                                    <option value="Utility Drawing">Utility Drawing</option>
                                                    <option value="Design Drawing" >Design Drawing</option>
                                                    <option value="Objected Patent Drawing" >Objected Patent Drawing</option>
                                                    <option value="Trademark Drawing" >Trademark Drawing</option>
                                                    <option value="Plant Patent Drawing" >Plant Patent Drawing</option>
                                                    <option value="others" >Others</option>
                                                </select>
                                            </div><br />
                                            <div className="form-row">
                                                <label style={{ fontSize: 'larger', fontWeight: '600' }}>Instructions: </label>
                                                <textarea className="form-control col-sm-10" id="exampleFormControlTextarea1" rows="3" name="orderInstructions" value={orderData.orderInstructions} onChange={EventChange} type="textarea" placeholder="Instructions" ></textarea>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="col-md-6">
                                            <div className="form-row">
                                                <label style={{ fontSize: 'larger', fontWeight: '600' }}>PTO Office: </label>
                                                <input defaultValue={orderData.orderPTOOffice} onChange={EventChange} name="orderPTOOffice" type="text" placeholder="PTO office Name" className="form-control col-sm-10" id="name" />
                                            </div><br />
                                            <div className="form-row">
                                                <label style={{ fontSize: 'larger', fontWeight: '600' }}>Attorney Ref no.: </label>
                                                {
                                                    orderData.orderAttorneyReferenceNumber ?
                                                        <input type="text" className="form-control col-sm-10" id="name" readOnly value={orderData.orderAttorneyReferenceNumber} /> :
                                                        <input type="text" className="form-control col-sm-10" id="name" readOnly value="N/A" />
                                                }
                                            </div><br />
                                            <div className="form-row">
                                                <label style={{ fontSize: 'larger', fontWeight: '600' }}>Order Criticality: </label>
                                                <select className="form-control col-sm-10" id="name" value={orderData.orderCiriticality} onChange={EventChange} name="orderCiriticality">
                                                    <option value="">Select Delivery Type...</option>
                                                    <option value="Normal Delivery" >Normal Delivery</option>
                                                    <option value="Urgent Delivery">Urgent Delivery</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="crd">
                                    <div id="chatSelectionButtons">
                                        <div className="row" >
                                            <div className="col-md-12">
                                                <div style={{ textAlign: 'center' }} >
                                                    <h4>Have any Queries?</h4>
                                                    <h5>Chat with...</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ justifyContent: 'center', alignItems: 'center' }} >
                                            <div>
                                                <button className="userChatButton" onClick={() => openForm()}>Customer</button>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <div>
                                                <button className="userChatButton" onClick={() => openFormDrafter()}>Drafter</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div id="myForm">
                                            <form className="form-container">
                                                <div className="chat-window">
                                                    <div className="chat-header">
                                                        <p>Chat with {props.location.state[0].CustomerName} <button type="button" className="chatClose" onClick={closeForm}><i className="fa fa-times"></i></button></p>
                                                    </div>
                                                    <div className="chat-body">
                                                        {/* <ScrollToBottom className="message-container"> */}
                                                        {customerMessage.map((messageContent) => {
                                                            return (
                                                                <div
                                                                    className="message"
                                                                    id={orderData.orderCustomerId === messageContent.SenderId ? "other" : "you"}
                                                                >
                                                                    <div className="message-meta">
                                                                        <p id="time">{format(messageContent.createdAt)}</p>
                                                                        {
                                                                            orderData.orderCustomerId === messageContent.SenderId ?
                                                                                <p id="author">{orderData.orderCustomerName}</p> :
                                                                                <p id="author">Admin</p>
                                                                            // "you" : "admin"
                                                                        }
                                                                    </div>
                                                                    <br />
                                                                    <div className="message-content">
                                                                        <p>{messageContent.Message}</p>
                                                                    </div>

                                                                </div>
                                                            );
                                                        })}
                                                        {/* </ScrollToBottom> */}
                                                    </div>
                                                    <div className="chat-footer">
                                                        <input
                                                            type="text"
                                                            value={customerMessageToSend}
                                                            name="messageValue"
                                                            onChange={OnCustomerMessageChange}
                                                            placeholder="Hey..."
                                                            onKeyPress={event => {
                                                                if (event.key === "Enter") {
                                                                    SendCustomerMessage(props.location.state[0].CustomerId);
                                                                }
                                                            }}
                                                        />
                                                        <button className="chatbutton" onClick={(e) => { e.preventDefault(); SendCustomerMessage(props.location.state[0].CustomerId) }}>&#9658; </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div id="myFormDrafter">
                                            <form className="form-container">
                                                <div className="chat-window">
                                                    <div className="chat-header">
                                                        <p>Chat with {props.location.state[0].DrafterName} <button type="button" className="chatClose" onClick={closeFormDrafter}><i className="fa fa-times"></i></button></p>
                                                    </div>
                                                    <div className="chat-body">
                                                        {/* <ScrollToBottom className="message-container"> */}
                                                        {drafterMessage.map((messageContent) => {
                                                            return (
                                                                <div
                                                                    className="message"
                                                                    id={orderData.orderDrafterId === messageContent.SenderId ? "other" : "you"}
                                                                >
                                                                    <div className="message-meta">
                                                                        <p id="time">{format(messageContent.createdAt)}</p>
                                                                        {
                                                                            orderData.orderDrafterId === messageContent.SenderId ?
                                                                                <p id="author">{
                                                                                    drafters.map(drafter => {
                                                                                        return (
                                                                                            drafter._id === messageContent.SenderId ? drafter.DrafterName : null
                                                                                        )
                                                                                    })
                                                                                }</p> :
                                                                                <p id="author">Admin</p>
                                                                        }
                                                                    </div>
                                                                    <br />
                                                                    <div className="message-content">
                                                                        <p>{messageContent.Message}</p>
                                                                    </div>

                                                                </div>
                                                            );
                                                        })}
                                                        {/* </ScrollToBottom> */}
                                                    </div>
                                                    <div className="chat-footer">
                                                        <input
                                                            type="text"
                                                            value={drafterMessageToSend}
                                                            name="messageValue"
                                                            onChange={OnDrafterMessageChange}
                                                            placeholder="Hey..."
                                                            onKeyPress={event => {
                                                                if (event.key === "Enter") {
                                                                    SendDrafterMessage(props.location.state[0].DrafterId);
                                                                }
                                                            }}
                                                        />
                                                        <button className="chatbutton" onClick={(e) => { e.preventDefault(); SendDrafterMessage(props.location.state[0].DrafterId) }}>&#9658; </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="timeline">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="crd">
                                    <div className="row">
                                        <div className="offset-md-4 col-md-4">
                                            <span style={{ fontSize: 'larger', fontWeight: '600' }}>Order Status:</span>
                                            <div className="ordr-status">
                                                <div className="form-group">
                                                    <select className="form-control col-sm-10" id="name"
                                                        name="orderStatus"
                                                        value={orderData.orderStatus}
                                                        onChange={EventChange}
                                                        style={{
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            backgroundColor:
                                                                (
                                                                    (orderData.orderStatus === 'requested' && 'goldenrod') ||
                                                                    (orderData.orderStatus === 'awaiting-approval' && 'red') ||
                                                                    (orderData.orderStatus === 'in-progress' && 'royalblue') ||
                                                                    (orderData.orderStatus === 'draft-submitted' && 'coral') ||
                                                                    (orderData.orderStatus === 'completed' && 'green') ||
                                                                    (orderData.orderStatus === 'cancelled' && 'grey')
                                                                )
                                                        }}
                                                    >
                                                        <option value="requested">Requested</option>
                                                        <option value="awaiting-approval">Awaiting-Approval</option>
                                                        <option value="in-progress">In-Progress</option>
                                                        <option value="draft-submitted">Draft-Submitted</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item">
                                                    <button style={{ fontSize: 'larger', fontWeight: '700' }} className="nav-link" onClick={() => { OpenTab('menu') }} data-toggle="tab">Order Info</button>
                                                </li>
                                                <li className="nav-item">
                                                    <button style={{ fontSize: 'larger', fontWeight: '700' }} className="nav-link" onClick={() => { OpenTab('menu1') }} data-toggle="tab">Assign to Drafter</button>
                                                </li>
                                                <li className="nav-item">
                                                    <button style={{ fontSize: 'larger', fontWeight: '700' }} className="nav-link" onClick={() => { OpenTab('menu2') }} data-toggle="tab">Preview File</button>
                                                </li>
                                                <li className="nav-item">
                                                    <button style={{ fontSize: 'larger', fontWeight: '600' }} className="nav-link" onClick={() => OpenTab('menu3')} data-toggle="tab">Final Preview File</button>
                                                </li>
                                            </ul>

                                            {/* <!-- Tab panes --> */}
                                            <div className="tab-content">
                                                <div className="tab-pane active" id="menu">
                                                    <div className="stts">
                                                        <div className="rowdiv">
                                                            <div className="coldiv">
                                                                Quotation:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </div>
                                                            <div className="coldiv">
                                                                <input type="number" className="form-control col-sm-10" id="name" value={orderData.orderQuotation} name="orderQuotation" onChange={EventChange} min='0' placeholder="Enter Quotation" />
                                                            </div>
                                                            <div className="coldiv">
                                                                Date of delivery:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </div>
                                                            <div className="coldiv">
                                                                <input type="date" className="form-control col-sm-10" id="name" min={maxDate} defaultValue={orderData.orderDeliveryDate} name="orderDeliveryDate" onChange={EventChange} placeholder="Enter Delivery Date" />
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <div className="rowdiv">
                                                            <div className="coldiv">
                                                                Drafter Date of delivery:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </div>
                                                            <div className="coldiv">
                                                                <input type="date" className="form-control col-sm-11" id="name" min={maxDate} defaultValue={orderData.drafterOrderDeliveryDate} name="drafterOrderDeliveryDate" onChange={EventChange} placeholder="Enter Delivery Date" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane active" id="menu1">
                                                    <div className="stts">
                                                        <div className="rowdiv">
                                                            <div className="coldiv">
                                                                Admin Files:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </div>
                                                            <div className="coldiv">
                                                                <input style={{ width: '80%', padding: '2%' }} id="name" type="file" name="adminCorrectedFilePath" multiple defaultValue={orderData.adminCorrectedFilePath} onChange={EventChange} />
                                                            </div>
                                                            <div className="coldiv">
                                                                Select Drafter:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </div>
                                                            <div className="coldiv">
                                                                <select id="name" value={orderData.orderDrafterId} onChange={EventChange} name="orderDrafterId">
                                                                    <option value="">Select a drafter...</option>
                                                                    {
                                                                        drafters.map(drafter => {
                                                                            return (
                                                                                <option value={drafter._id}>{drafter.DrafterName}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane active" id="menu2">
                                                    <div className="stts">
                                                        <div className="rowdiv">
                                                            <div className="coldiv">
                                                                Preview File:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                <br />
                                                                {
                                                                    orderData.drafterFilePath ?
                                                                        <button className="userButton" readOnly onClick={() => downloadFile('drafterFile')} ><i style={{ color: 'black' }} className="fa fa-download" aria-hidden="true"></i></button> :
                                                                        null
                                                                }
                                                                {
                                                                    orderData.drafterFilePath ?
                                                                        <button className="userButton-showtouser" onClick={ShowDrafterPreviewFileToUser}>Show to user</button> :
                                                                        null
                                                                }
                                                            </div>
                                                            <div className="coldiv">

                                                                <input id="name" className="FilePath" type="text" readonly value={props.location.state[0].DrafterSubmitFile} />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane active" id="menu3">
                                                    <div className="stts">
                                                        <div className="rowdiv">
                                                            <div className="coldiv">
                                                                Final file:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                <br />
                                                                {
                                                                    orderData.drafterFilePath ?
                                                                        <button className="userButton" readOnly onClick={() => downloadFile('drafterFinalFile')} ><i style={{ color: 'black' }} className="fa fa-download" aria-hidden="true"></i></button> :
                                                                        null
                                                                }
                                                                {
                                                                    orderData.drafterFinalFilePath ?
                                                                        <button className="userButton-showtouser" onClick={ShowDrafterFinalPreviewToUser}>Show to user</button> :
                                                                        null
                                                                }
                                                            </div>
                                                            <div className="coldiv">

                                                                <input type="text" readonly value={props.location.state[0].DrafterSubmitFinalFile} />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="offset-md-4 col-md-4 d-flex justify-content-center">
                                                    <button type="button" id="disableButton" className="btn btn-success" onClick={UpdateOrder}>Update Record</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div id="content">
                    <div className="container-fluid">
                        <div>

                        </div>
                    </div>
                </div>
            </div>

            <AdminNavBar />

        </>

    );

}

export default AdminViewSingleOrder;