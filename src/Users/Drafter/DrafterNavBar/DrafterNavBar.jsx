import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function DrafterNavBar() {

    const history = useHistory();

    const LogoutDrafter = () => {
        localStorage.clear();
        toast.info("You've been Logged Out", { position: toast.POSITION.BOTTOM_RIGHT });
        history.push('/drafter/login', null);
    }

    const Opendashboard = () => {
        history.push({
            pathname: `/drafter/home`
        });
    }
    const AllAssignments = () => {
        history.push({
            pathname: `/Drafter/allAssignments`
        });
    }

    const UserProfile = () => {
        history.push({
            pathname: `/drafter/profile`
        });
    }

    return (
        <>
            {/* <div id="viewport">
                <div id="sidebar">
                    <header>
                        <a href="#">My App</a>
                    </header>
                    <ul className="nav">
                        <li onClick={opendashboard}>
                            <a>
                                <i className="fa fa-home fa-2x"></i> Dashboard
                            </a>
                        </li>
                        <li onClick={neworder}>
                            <a>
                                <i className="fa fa-list fa-2x"></i> Create New Order
                            </a>
                        </li>
                        <li onClick={allorders}>
                            <a>
                                <i className="fa fa-table fa-2x"></i> All Orders
                            </a>
                        </li>
                        <li onClick={userprofile}>
                            <a>
                                <i className="fa fa-user fa-2x"></i> Profile
                            </a>
                        </li>
                        <li id="logout" onClick={logoutCustomer}>
                            <a>
                                <i className="fa fa-power-off fa-2x"></i> Logout
                            </a>
                        </li>
                    </ul>
                </div>
                <div id="content">
                    <div className="container-fluid">
                        <div className="LoginFormContainer">
                            <div className="MainForm">
                                <h1>Welcome {props.location.state.name}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <nav className="main-menu">
                <ul>
                    <li onClick={Opendashboard}>
                        <a>
                            <i className="fa fa-home fa-2x"></i>
                            <span className="nav-text">
                                Dashboard
                            </span>
                        </a>

                    </li>
                    <li className="has-subnav" onClick={AllAssignments}>
                        <a>
                            <i className="fa fa-list fa-2x"></i>
                            <span className="nav-text">
                                Assignments
                            </span>
                        </a>

                    </li>

                    <li className="has-subnav" onClick={UserProfile}>
                        <a>
                            <i className="fa fa-user fa-2x"></i>
                            <span className="nav-text">
                                Profile
                            </span>
                        </a>

                    </li>
                </ul>

                <ul className="logout" onClick={LogoutDrafter}>
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

export default DrafterNavBar;