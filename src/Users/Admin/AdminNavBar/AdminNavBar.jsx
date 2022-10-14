import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminNavBar.css';

toast.configure();

function AdminNavBar() {

    const history = useHistory();

    const logoutCustomer = () => {

        localStorage.clear();
        history.push('/admin/login');
        toast.info("You've been Logged Out", { position: toast.POSITION.BOTTOM_RIGHT });
    }

    const opendashboard = () => {
        history.push({
            pathname: `/admin/home`
        });
    }
    const newdrafter = () => {
        history.push({
            pathname: `/admin/adddrafter`
        });
    }
    const allorders = () => {
        history.push({
            pathname: `/admin/viewallorders`
        });
    }
    const allcustomers = () => {
        history.push({
            pathname: `/admin/viewallcustomers`
        });
    }
    const alldrafters = () => {
        history.push({
            pathname: `/admin/viewalldrafters`
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
                    <li className="has-subnav" onClick={allorders}>
                        <a>
                            <i className="fa fa-table fa-2x"></i>
                            <span className="nav-text">
                                All Orders
                            </span>
                        </a>

                    </li>
                    <li className="has-subnav" onClick={allcustomers}>
                        <a>
                            <i className="fa fa-table fa-2x"></i>
                            <span className="nav-text">
                                View All Customers
                            </span>
                        </a>
                    </li>
                    <li className="has-subnav" onClick={alldrafters}>
                        <a>
                            <i className="fa fa-table fa-2x"></i>
                            <span className="nav-text">
                                View All Drafters
                            </span>
                        </a>
                    </li>
                    <li className="has-subnav" onClick={newdrafter}>
                        <a>
                            <i className="fa fa-user fa-2x"></i>
                            <span className="nav-text">
                                Add a Drafter
                            </span>
                        </a>
                    </li>
                </ul>

                <ul className="logout">
                    <li onClick={logoutCustomer}>
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

export default AdminNavBar;