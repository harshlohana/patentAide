import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './DrafterViewSingleOrder.css';
// import ScrollToBottom from "react-scroll-to-bottom";
import 'react-toastify/dist/ReactToastify.css';
import DrafterNavBar from '../DrafterNavBar/DrafterNavBar';
import download from 'downloadjs';
import { io } from "socket.io-client";
import { format } from 'timeago.js';
import configData from '../../../default.json';


toast.configure();

function DrafterViewSingleOrder(props) {

    const socket = useRef();

    const history = useHistory();
    // console.log(props);

    const [order, setOrder] = useState([]);
    const [filePath, setFilePath] = useState({
        drafterSubmitFile: '',
        drafterSubmitFinalFile: ''
    });
    const [receiverId, setReceiverId] = useState();
    const [file, setFile] = useState();
    const [previewFile, setPreviewFile] = useState({});
    const [finalPreviewfile, setFinalPreviewFile] = useState({});


    const [previewFileCheck, setPreviewFileCheck] = useState('');
    const [finalPreviewFileCheck, setFinalPreviewFileCheck] = useState('');

    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messageToSend, setMessageToSend] = useState({
        messageValue: ''
    });

    const DrafterToken = 'DrafterToken';
    const UserNameKey = 'DrafterName';
    const token = localStorage.getItem(DrafterToken);
    const drafterName = localStorage.getItem(UserNameKey);

    const serverString = configData.serverURI;

    const inputEvent = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'drafterSubmitFile') {
            setPreviewFileCheck("PreviewFileReceived");
            setPreviewFile(e.target.files[0]);
        }
        if (name === 'drafterSubmitFinalFile') {
            setFinalPreviewFileCheck("PreviewFileReceived");
            setFinalPreviewFile(e.target.files[0]);
        }
        setFilePath((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        });
        // console.log(filePath);
    }

    const SubmitAssignment = (e) => {


        const previewFilename = order.OrderDrawingType + "_" + order._id + "_" + filePath.drafterSubmitFile.split('\\').pop().split(' ').join('_');

        const finalPreviewFilename = order.OrderDrawingType + "_" + order._id + "_" + filePath.drafterSubmitFinalFile.split('\\').pop().split(' ').join('_');

        const dirpath = order.CustomerName.split(' ').join('_') + "_" + order.CustomerId;

        // console.log(previewFilename);

        if (previewFileCheck === '' && finalPreviewFileCheck === '') {
            toast.error("Please upload a preview or final preview file first", { position: toast.POSITION.BOTTOM_RIGHT });

        }
        else {
            if (previewFileCheck !== '') {

                document.getElementById('createOrder').disabled = true;
                document.getElementById('createOrder').style.opacity = 0.5;
                document.getElementById('createOrder').style.cursor = 'not-allowed';

                const formData = new FormData();
                formData.append('file', previewFile);
                formData.append('dirpath', dirpath);

                try {
                    axios.post(`${serverString}order/update/${props.location.state[0]._id}`, formData, {
                        headers: {
                            'filename': `${previewFilename}`,
                            'user': 'drafterpreviewfile',
                            'x-auth-token': `${token}`
                        }
                    }).then(res => {
                        // console.log(res);
                        if (res.data === "Order Status Updated!") {
                            document.getElementById('createOrder').disabled = false;
                            document.getElementById('createOrder').style.opacity = 'none';
                            document.getElementById('createOrder').style.cursor = 'pointer';
                            toast.success("Assignment Submitted", { position: toast.POSITION.BOTTOM_RIGHT });

                        }
                    }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
                } catch (err) {
                    toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }

            if (finalPreviewFileCheck !== '') {
                const formData = new FormData();
                formData.append('file', finalPreviewfile);
                formData.append('dirpath', dirpath);

                try {
                    axios.post(`${serverString}order/update/${props.location.state[0]._id}`, formData, {
                        headers: {
                            'filename': `${finalPreviewFilename}`,
                            'user': 'drafterfinalpreviewfile',
                            'x-auth-token': `${token}`
                        }
                    }).then(res => {
                        // console.log(res);
                        if (res.data === "Order Status Updated!") {
                            toast.success("Assignment Submitted", { position: toast.POSITION.BOTTOM_RIGHT });

                            // loadDataFromAPI();

                            // props.location.state[0].OrderFilePath = `Completed_${dirpath}_${file.name.split(' ').join('_')}`;

                        }
                    }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
                } catch (err) {
                    toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        }

    }

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

        // console.log(messages);

        // const receiverId = "6116521fcd5de239801ff2e2";

        const messageText = messageToSend.messageValue;

        if (messageText === '') {

        }
        else {

            // console.log(props.location.state[0].DrafterId);
            try {
                axios.post(`${serverString}message/add`,
                    {
                        OrderId: props.location.state[0]._id,
                        SenderId: props.location.state[0].DrafterId,
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
                            senderId: props.location.state[0].DrafterId,
                            receiverId: receiverId,
                            text: messageText
                        });

                        setMessages((prev) => [...prev, {
                            OrderId: props.location.state[0]._id,
                            SenderId: props.location.state[0].DrafterId,
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

        const DrafterIdKey = 'DrafterId';
        socket.current.emit("addUser", localStorage.getItem(DrafterIdKey));
        socket.current.on("getUsers", users => {
            // console.log(users);
        });
    }, []);

    useEffect(() => {

        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);

    }, [arrivalMessage]);

    async function loadDataFromAPI() {

        // Hiding all tabs data at startup
        var i;
        var x = document.getElementsByClassName("tab-pane");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById('menu').style.display = "block";

        try {

            // Getting admin ID
            const adminId = await axios.get(`${serverString}Admin/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            const usernameCheck = await axios.get(`${serverString}customer/${props.location.state[0].CustomerId}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            const fetchedConversation = await axios.get(`${serverString}message/${props.location.state[0]._id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });


            let conversation = [];
            for (let i = 0; i < fetchedConversation.data.length; i++) {
                if (fetchedConversation.data[i].ReceiverId === props.location.state[0].DrafterId ||
                    fetchedConversation.data[i].SenderId === props.location.state[0].DrafterId) {

                    conversation.push(fetchedConversation.data[i]);
                }
            }

            // console.log(conversation);
            setMessages(conversation);

            props.location.state[0]["CustomerName"] = usernameCheck.data["CustomerFullName"];

            setOrder(props.location.state[0]);


            const getHeader = props.location.state[0].CustomerName.split(' ').join('_') + "_" + props.location.state[0].CustomerId;

            try {
                axios.get(`${serverString}order/getfile/${props.location.state[0]._id}`, {
                    headers: {
                        'dirpath': `${getHeader}`,
                        'filepath': `${props.location.state[0].AdminCorrectedFilePath}`,
                        'x-auth-token': `${token}`
                    },
                    responseType: 'blob'
                }).then(res => {
                    setFile(res.data);
                });

            } catch (err) {
                console.log(err);
            }

            // console.log(adminId.data);
            setReceiverId(adminId.data);

        } catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    const downloadFile = () => {

        download(file, `${order.AdminCorrectedFilePath}`);

    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/drafter/login`)
        else
            loadDataFromAPI()

    }, []);

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
            <DrafterNavBar drafterData={props} />

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
                                {/* <div className="row">
                                    <div className="col-md-12">
                                        <h3 style={{ fontWeight: 'bold' }}>
                                            Name: {order.CustomerName}
                                        </h3>
                                    </div>
                                </div> */}
                                {/* <div className="row">
                                    <div className="col-md-12">
                                        <h3 style={{ fontWeight: 'bold' }}>Id: #{props.location.state[0]._id.slice(props.location.state[0]._id.length - 5)}</h3>
                                    </div>
                                </div> */}
                                <br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Customer file: &nbsp;&nbsp;
                                                {
                                                    file ?
                                                        <button className="userButton" readOnly onClick={downloadFile}><i style={{ color: 'black' }} className="fa fa-download" aria-hidden="true"></i></button> :
                                                        null
                                                }
                                            </label>
                                            {
                                                props.location.state[0].AdminCorrectedFilePath ?
                                                    <input type="text" className="form-control col-sm-10" name="name" id="name" readOnly value={props.location.state[0].AdminCorrectedFilePath} /> :
                                                    <input type="text" className="form-control col-sm-10" name="name" id="name" readOnly value="N/A" />

                                            }
                                        </div><br />
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Drawing type: </label>
                                            <input type="text" readOnly value={props.location.state[0].OrderDrawingType} className="form-control col-sm-10" name="name" id="name" />
                                        </div><br />
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Instructions: </label>
                                            <textarea className="form-control col-sm-10" id="exampleFormControlTextarea1" rows="3" name="orderInstructions" readOnly defaultValue={props.location.state[0].OrderInformation} type="textarea" placeholder="Instructions"></textarea>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="col-md-6">
                                        {/* <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Attorney Ref no.: </label>
                                            {
                                                order.OrderAttorneyReferenceNumber ?
                                                    <input type="text" className="form-control col-sm-10" name="name" id="name" readOnly value={props.location.state[0].OrderAttorneyReferenceNumber} /> :
                                                    <input type="text" className="form-control col-sm-10" name="name" id="name" readOnly value="N/A" />
                                            }
                                        </div><br /> */}
                                        <div className="form-row">
                                            <label style={{ fontSize: 'large', fontWeight: '600' }}>Order Criticality: </label>
                                            <input type="text" className="form-control col-sm-10" id="criticality" rows="3" readOnly value={props.location.state[0].OrderCriticality} />
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
                                                            id={props.location.state[0].DrafterId === messageContent.SenderId ? "you" : "other"}
                                                        >
                                                            <div className="message-meta">
                                                                <p id="time">{format(messageContent.createdAt)}</p>
                                                                {
                                                                    props.location.state[0].DrafterId === messageContent.SenderId ?
                                                                        <p id="author">{drafterName}</p> :
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
                                            <button className="chatbutton" onClick={SendMessage}>&#9658;</button>
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
                                        <span style={{ fontSize: 'large', fontWeight: 'bold' }}>Order Status:</span>
                                        <div className="ordr-status">
                                            <div className="form-group">
                                                <input className="form-control" id="status"
                                                    value={props.location.state[0].OrderStatus}
                                                    readOnly
                                                    style={{
                                                        backgroundColor:
                                                            (
                                                                (props.location.state[0].OrderStatus === 'requested' && 'goldenrod') ||
                                                                (props.location.state[0].OrderStatus === 'awaiting-approval' && 'red') ||
                                                                (props.location.state[0].OrderStatus === 'in-progress' && 'royalblue') ||
                                                                (props.location.state[0].OrderStatus === 'draft-submitted' && 'coral') ||
                                                                (props.location.state[0].OrderStatus === 'cancelled' && 'grey') ||
                                                                (props.location.state[0].OrderStatus === 'delivered' && 'green')
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
                                                        <div className="coldiv" >
                                                            Date of delivery:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        </div>
                                                        <div className="coldiv">
                                                            <input type="text" className="form-control col-sm-10" name="name" id="name" value={props.location.state[0].DrafterOrderTimeToComplete} readOnly placeholder="Enter Delivery Date" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane active" id="menu1">
                                                <div className="stts">
                                                    <div className="rowdiv">
                                                        <div className="coldiv">
                                                            Upload Preview File:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        </div>
                                                        <div className="coldiv">
                                                            <input type="file" className="form-control col-sm-10" defaultValue={props.location.state[0].drafterSubmitFile} onChange={inputEvent} name='drafterSubmitFile' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane active" id="menu2">
                                                <div className="stts">
                                                    <div className="rowdiv">
                                                        <div className="coldiv">
                                                            Upload Final preview file:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        </div>
                                                        <div className="coldiv">
                                                            <input type="file" className="form-control col-sm-10" defaultValue={props.location.state[0].drafterSubmitFinalFile} onChange={inputEvent} name='drafterSubmitFinalFile' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="offset-md-4 col-md-4 d-flex justify-content-center">
                                                <button id="createOrder" type="button" className="btn btn-success" onClick={SubmitAssignment}>Submit Assignment</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>

    );

}

export default DrafterViewSingleOrder;