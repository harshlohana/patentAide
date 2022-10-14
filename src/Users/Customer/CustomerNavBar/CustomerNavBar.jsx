import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function CusromerNavBar() {

    const history = useHistory();

    const logoutCustomer = () => {
        localStorage.clear();
        toast.info("You've been Logged Out", { position: toast.POSITION.BOTTOM_RIGHT });
        history.push('/', null);
    }

    const opendashboard = () => {
        history.push({
            pathname: `/customer/home`
        });
    }
    const neworder = () => {
        history.push({
            pathname: `/customer/neworder`
        });
    }
    const allorders = () => {
        history.push({
            pathname: `/customer/allorders`
        });
    }
    const userprofile = () => {
        history.push({
            pathname: `/customer/profile`
        });
    }

    return (
        <>

            <nav className="main-menu">
                <ul>
                    <li onClick={opendashboard}>
                        <a>
                            <i className="fa fa-home fa-2x"></i>
                            <span className="nav-text">
                                Dashboard
                            </span>
                        </a>

                    </li>
                    <li className="has-subnav" onClick={neworder}>
                        <a>
                            <i className="fa fa-list fa-2x"></i>
                            <span className="nav-text">
                                Create New Orders
                            </span>
                        </a>

                    </li>
                    <li className="has-subnav" onClick={allorders}>
                        <a>
                            <i className="fa fa-table fa-2x"></i>
                            <span className="nav-text">
                                All Orders
                            </span>
                        </a>

                    </li>
                    <li className="has-subnav" onClick={userprofile}>
                        <a>
                            <i className="fa fa-user fa-2x"></i>
                            <span className="nav-text">
                                Profile
                            </span>
                        </a>

                    </li>
                </ul>

                <ul className="logout" onClick={logoutCustomer}>
                    <li>
                        <a>
                            <i className="fa fa-power-off fa-2x"></i>
                            <span className="nav-text">
                                Logout
                            </span>
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );

}

export default CusromerNavBar;