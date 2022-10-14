import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavBar from '../AdminNavBar/AdminNavBar';
import configData from '../../../default.json';


toast.configure();

function AdminHome() {

    const history = useHistory();

    const AdminNameKey = 'AdminName';
    const AdminToken = 'AdminToken';
    const token = localStorage.getItem(AdminToken);

    const serverString = configData.serverURI;

    const [totalOrders, setTotalOrders] = useState();

    const loadDataFromAPI = async () => {
        try {

            const orders = await axios.get(`${serverString}order/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            setTotalOrders(orders.data.length);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/admin/login`);
        else
            loadDataFromAPI();
    }, []);

    const GoToAllOrders = () => {
        history.push(`/admin/viewallorders`);
    }
    const GoToAllCustomers = () => {
        history.push(`/admin/viewallcustomers`);
    }
    const GoToAllDrafters = () => {
        history.push(`/admin/viewalldrafters`);
    }
    const GoToAddDrafter = () => {
        history.push(`/admin/adddrafter`);
    }

    return (
        <>
            <div className="dashboard">
                <div id="content">
                    <div className="PageHeader">
                        <h1>Welcome, {localStorage.getItem(AdminNameKey)}</h1>
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
                        <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToAllCustomers}>
                            <h3>
                                View All Customers
                            </h3>
                        </div>
                        <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToAllDrafters}>
                            <h3>
                                View All Drafters
                            </h3>
                        </div>
                        <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToAddDrafter}>
                            <h3>
                                {/* <i className="fa fa-plus fa-3x" text="Drafter" aria-hidden="true"></i> */}
                                Add <br />Drafter
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <AdminNavBar />
        </>
    );

}

export default AdminHome;