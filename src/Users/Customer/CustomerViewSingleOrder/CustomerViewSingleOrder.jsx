import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import { io } from "socket.io-client";
import axios from 'axios';
import download from 'downloadjs';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import 'react-toastify/dist/ReactToastify.css';
// import ScrollToBottom from "react-scroll-to-bottom";
import configData from '../../../default.json';


toast.configure();

function CustomerViewSingleOrder(props) {

    const socket = useRef();

    const history = useHistory();

    console.log(props);

    const UserNameKey = 'CustomerName';
    const CustomerToken = 'CustomerToken';
    const token = localStorage.getItem(CustomerToken);

    const serverString = configData.serverURI;

    const [customerFile, setCustomerFile] = useState();
    const [previewFile, setPreviewFile] = useState();
    const [finalPreviewFile, setFinalPreviewFile] = useState();
    const [receiverId, setReceiverId] = useState();
    const [order, setOrder] = useState(props.location.state[0]);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messageToSend, setMessageToSend] = useState({
        messageValue: ''
    });

    const OnMessageChange = (e) => {

        const name = e.target.name;
        const value = e.target.value;

        setMessageToSend((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })

    }

    const SendMessage = (e) => {

        const messageText = messageToSend.messageValue;

        if (messageText === '') {

        }
        else {
            try {
                axios.post(`${serverString}message/add`,
                    {
                        OrderId: props.location.state[0]._id,
                        SenderId: props.location.state[0].CustomerId,
                        ReceiverId: receiverId,
                        Message: messageText
                    },
                    {
                        headers: {
                            'x-auth-token': `${token}`
                        }
                    }).then(res => {
                        // console.log(res)
                        // console.log(receiverId)
                        socket.current.emit("sendMessage", {
                            senderId: props.location.state[0].CustomerId,
                            receiverId: receiverId,
                            text: messageText
                        });

                        setMessages((prev) => [...prev, {
                            OrderId: props.location.state[0]._id,
                            SenderId: props.location.state[0].CustomerId,
                            Message: messageText
                        }]);

                    });
            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }

        setMessageToSend(() => {
            return {
                messageValue: '',
            }
        });


    }


    async function loadDataFromAPI() {

        document.getElementById('menu').style.display = "block";
        document.getElementById('customerfile').style.display = 'none';

        // document.getElementById('preview-file').disabled = true;
        // document.getElementById('final-preview-file').disabled = true;

        // Hiding all tabs data at startup
        var i;
        var x = document.getElementsByClassName("tab-pane");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }

        try {

            // Getting admin ID
            var adminId = await axios.get(`${serverString}admin/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            setReceiverId(adminId.data);

            const fetchedConversation = await axios.get(`${serverString}Message/${props.location.state[0]._id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            let conversation = [];
            for (let i = 0; i < fetchedConversation.data.length; i++) {
                if (fetchedConversation.data[i].ReceiverId === props.location.state[0].CustomerId ||
                    fetchedConversation.data[i].SenderId === props.location.state[0].CustomerId) {

                    conversation.push(fetchedConversation.data[i]);
                }
            }
            setMessages(conversation);
            // console.log(fetchedConversation);
            props.location.state[0]["CustomerName"] = localStorage.getItem(UserNameKey);


            const getHeader = props.location.state[0].CustomerName.split(' ').join('_') + "_" + props.location.state[0].CustomerId;

            try {

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

                    setPreviewFile(res.data);

                });

                await axios.get(`${serverString}order/getfile/${props.location.state[0]._id}`, {
                    headers: {
                        'dirpath': `${getHeader}`,
                        'filepath': `${props.location.state[0].DrafterSubmitFinalFile}`,
                        'x-auth-token': `${token}`
                    },
                    responseType: 'blob'
                }).then(res => {

                    setFinalPreviewFile(res.data);

                });

            } catch (err) {
                toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
        catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    const downloadFile = (val) => {

        if (val === 'PreviewFile') {

            download(previewFile, `${props.location.state[0].DrafterSubmitFile}`);
        }
        else if (val === 'FinalPreviewFile') {

            download(finalPreviewFile, `${props.location.state[0].DrafterSubmitFinalFile}`);
        }
        else if (val === 'initialZip') {

            download(customerFile, `${props.location.state[0].OrderFilePath}`);
        }


    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/`)
        else
            loadDataFromAPI();
            OpenTab('menu');
    }, []);


    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                SenderId: data.senderId,
                Message: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {

        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);

    }, [arrivalMessage]);

    useEffect(() => {

        const CustomerIdKey = 'CustomerId';
        socket.current.emit("addUser", localStorage.getItem(CustomerIdKey));
        socket.current.on("getUsers", users => {
            // console.log(users);
        });
    }, []);

    useEffect(() => {
        if (arrivalMessage) {

            setMessages((prev) => [...prev, arrivalMessage]);

        }
    }, []);

    const OpenTab = (divname) => {

        var i;
        var x = document.getElementsByClassName("tab-pane");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById(`${divname}`).style.display = "block";
    }

    return (
        <>


            <div className="container-order">
                <section className="ordr-no">
                    <div className="row">
                        <h1 style={{ fontWeight: '600', color: 'white' }}>
                            Order Id: #{order._id.substr(order._id.length - 5)}
                        </h1>
                    </div>
                </section>
                <section className="ordr-chat">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="crd">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3 style={{ fontWeight: '600' }}>
                                            Name: {order.CustomerName}
                                        </h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3 style={{ fontWeight: '600' }}>Id: #{order.CustomerId.substr(order.CustomerId.length - 5)}</h3>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Customer file: &nbsp;&nbsp;
                                                <button id="customerfile" className="userButton" readOnly onClick={() => downloadFile('initialZip')}><i className="fa fa-download" aria-hidden="true"></i></button>
                                            </label>
                                            {
                                                order.OrderFilePath ?
                                                    <input type="text" className="form-control col-sm-10" id="name" readOnly value={order.OrderFilePath} /> :
                                                    <input type="text" className="form-control col-sm-10" id="name" readOnly value="N/A" />

                                            }
                                        </div><br />
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Drawing type: </label>
                                            <input type="text" readOnly value={order.OrderDrawingType} className="form-control col-sm-10" id="name" />
                                        </div><br />
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Instructions: </label>
                                            <textarea className="form-control col-sm-10" id="exampleFormControlTextarea1" rows="3" name="orderInstructions" readOnly defaultValue={order.OrderInformation} type="textarea" placeholder="Instructions"></textarea>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="col-md-6">
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>PTO Office: </label>
                                            <input type="text" readOnly value={order.OrderPTOOffice} className="form-control col-sm-10" id="name" />
                                        </div><br />
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Attorney Ref no.: </label>
                                            {
                                                order.OrderAttorneyReferenceNumber ?
                                                    <input type="text" className="form-control col-sm-10" id="name" readOnly value={order.OrderAttorneyReferenceNumber} /> :
                                                    <input type="text" className="form-control col-sm-10" id="name" readOnly value="N/A" />
                                            }
                                        </div><br />
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Order Criticality: </label>
                                            <input type="text" className="form-control col-sm-10" id="criticality" rows="3" readOnly value={order.OrderCriticality} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="crd">
                                <div className="row">
                                    <div className="chat-window">
                                        <div className="chat-header">
                                            <p>Chat with Admin</p>
                                        </div>
                                        <div className="chat-body">
                                            {/* <ScrollToBottom className="message-container"> */}
                                                {messages.map((messageContent) => {
                                                    return (
                                                        <div
                                                            className="message"
                                                            id={order.CustomerId === messageContent.SenderId ? "you" : "other"}
                                                        >
                                                            <div className="message-meta">
                                                                <p id="time">{format(messageContent.createdAt)}</p>
                                                                {
                                                                    order.CustomerId === messageContent.SenderId ?
                                                                        <p id="author">{order.CustomerName}</p> :
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
                                                value={messageToSend.messageValue}
                                                name="messageValue"
                                                onChange={OnMessageChange}
                                                placeholder="Hey..."
                                                onKeyPress={event => {
                                                    if (event.key === "Enter") {
                                                        SendMessage();
                                                    }
                                                }}
                                            />
                                            <button className="chatbutton" onClick={SendMessage}>&#9658; </button>
                                        </div>
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
                                        <span style={{ fontSize: 'large', fontWeight: '600' }}>Order Status:</span>
                                        <div className="ordr-status">
                                            <div className="form-group">
                                                <input className="form-control" id="status"
                                                    value={order.OrderStatus}
                                                    readOnly
                                                    style={{
                                                        backgroundColor:
                                                            (
                                                                (order.OrderStatus === 'requested' && 'goldenrod') ||
                                                                (order.OrderStatus === 'awaiting-approval' && 'red') ||
                                                                (order.OrderStatus === 'in-progress' && 'royalblue') ||
                                                                (order.OrderStatus === 'draft-submitted' && 'coral') ||
                                                                (order.OrderStatus === 'completed' && 'green') ||
                                                                (order.OrderStatus === 'cancelled' && 'grey')
                                                                )
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <button style={{ fontSize: 'large', fontWeight: '700' }} className="nav-link" onClick={() => { OpenTab('menu') }} data-toggle="tab">Order Info</button>
                                            </li>
                                            <li className="nav-item">
                                                <button style={{ fontSize: 'large', fontWeight: '700' }} className="nav-link" onClick={() => { OpenTab('menu1') }} data-toggle="tab">Preview File</button>
                                            </li>
                                            <li className="nav-item">
                                                <button style={{ fontSize: 'large', fontWeight: '700' }} className="nav-link" onClick={() => OpenTab('menu2')} data-toggle="tab">Final Preview File</button>
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
                                                            <input type="number" className="form-control col-sm-10" id="name" value={order.OrderQuotation} readOnly placeholder="Enter Quotation" />
                                                        </div>
                                                        <div className="coldiv">
                                                            Date of delivery:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        </div>
                                                        <div className="coldiv">
                                                            <input type="text" className="form-control col-sm-10" id="name" value={order.OrderTimeToComplete} readOnly placeholder="Enter Delivery Date" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane active" id="menu1">
                                                <div className="stts">
                                                    <div className="rowdiv">
                                                        <div className="coldiv">
                                                            Preview file: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br />
                                                            {
                                                                order.ShowCustomerPreviewFile ? (previewFile ?
                                                                    <button id="preview-file" className="userButton" readOnly onClick={() => downloadFile("PreviewFile")}><i className="fa fa-download" aria-hidden="true"></i></button> :
                                                                    null) :
                                                                    null
                                                            }
                                                        </div>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <div className="coldiv">
                                                            {
                                                                order.ShowCustomerPreviewFile ?
                                                                    <input className="form-control col-sm-10" id="name" type="text" readOnly value={order.DrafterSubmitFile} /> :
                                                                    <input className="form-control col-sm-10" id="name" type="text" readOnly />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane active" id="menu2">
                                                <div className="stts">
                                                    <div className="rowdiv">
                                                        <div className="coldiv">
                                                            Final file:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                                                            {
                                                                order.ShowCustomerFinalFile ? (finalPreviewFile ?
                                                                    <button id="final-preview-file" className="userButton" readOnly onClick={() => downloadFile("FinalPreviewFile")}><i className="fa fa-download" aria-hidden="true"></i></button> :
                                                                    null) :
                                                                    null
                                                            }
                                                        </div>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <div className="coldiv">
                                                            {
                                                                order.ShowCustomerFinalFile ?
                                                                    <input className="form-control col-sm-10" id="name" type="text" readOnly value={order.DrafterSubmitFinalFile} /> :
                                                                    <input className="form-control col-sm-10" id="name" type="text" readOnly />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <CustomerNavBar />
        </>

    );

}

export default CustomerViewSingleOrder;