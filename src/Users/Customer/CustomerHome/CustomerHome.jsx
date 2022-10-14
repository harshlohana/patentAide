import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import configData from '../../../default.json';

toast.configure();

function CusromerHome() {

    const history = useHistory();

    const UserNameKey = 'CustomerName';
    const CustomerIdKey = 'CustomerId';
    const CustomerToken = 'CustomerToken';
    const token = localStorage.getItem(CustomerToken);

    const serverString = configData.serverURI;

    const [totalOrders, setTotalOrders] = useState();

    async function loadDataFromAPI() {

        try {
            const orders = await axios.get(`${serverString}order/${localStorage.getItem(CustomerIdKey)}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
            setTotalOrders(orders.data.length);
        }
        catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }

    }
    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/`);
        else
            loadDataFromAPI()

    }, []);

    const GoToNewOrder = () => {
        history.push({
            pathname: `/customer/neworder`
        });
    }
    const GoToAllOrders = () => {
        history.push({
            pathname: `/customer/allorders`
        });
    }
    const GoToUserProfile = () => {
        history.push({
            pathname: `/customer/profile`
        });
    }

    return (
        <>
            <div className="dashboard">
                <div id="content" style={{ height: "100vh !important" }}>
                    <div className="PageHeader">
                        <h1>Welcome, {localStorage.getItem(UserNameKey)}</h1>
                        <p>
                            Choose an item from the menu.
                        </p>
                    </div>
                    <div className='CardsContainer'>
                        <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToAllOrders}>
                            <h3>
                                <p>{totalOrders}</p>
                                Total Orders
                            </h3>
                        </div>
                        <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToNewOrder}>
                            <h3>
                                Create Order
                            </h3>
                        </div>
                        <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToUserProfile}>
                            <h3>
                                User Profile
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerNavBar />
        </>
    );

}

export default CusromerHome;