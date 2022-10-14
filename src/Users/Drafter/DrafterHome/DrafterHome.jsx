import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import DrafterNavBar from '../DrafterNavBar/DrafterNavBar';
import configData from '../../../default.json';

toast.configure();

function DrafterHome() {

    const history = useHistory();

    const UserNameKey = 'DrafterName';
    const DrafterIdKey = "DrafterId";
    const DrafterToken = 'DrafterToken';
    const token = localStorage.getItem(DrafterToken);

    const serverString = configData.serverURI;

    const [totalTasks, setTotalTasks] = useState();

    async function loadDataFromAPI() {

        try {
            const orders = await axios.get(`${serverString}Order/${localStorage.getItem(DrafterIdKey)}`, {
                headers: {
                    'Drafter': 'Drafter',
                    'x-auth-token': `${token}`
                }
            });

            setTotalTasks(orders.data.length);
        } catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/drafter/login`)
        else
            loadDataFromAPI()

    }, []);

    const GoToAllTasks = () => {
        history.push({
            pathname: `/Drafter/allAssignments`
        });
    }
    const GoToUserProfile = () => {
        history.push({
            pathname: `/drafter/profile`
        });
    }

    return (
        <>

            <div className="area">
                <div className="dashboard">
                    <div id="content">
                        <div className="PageHeader">
                            <h1>Welcome, {localStorage.getItem(UserNameKey)}</h1>
                            <p>
                                Choose an item from the menu.
                            </p>
                        </div>
                        <div className='CardsContainer'>
                            <div className='Card' style={{ backgroundColor: "#efdeff", color: "black" }} onClick={GoToAllTasks}>
                                <h3>
                                    <p>{totalTasks}</p>
                                    Assignments
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
            </div>

            <DrafterNavBar />
        </>
    );

}

export default DrafterHome;