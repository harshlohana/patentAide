import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrafterNavBar from '../DrafterNavBar/DrafterNavBar';

import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, Grid,
    TableRow, Typography, TablePagination, TableFooter, Button, Select, MenuItem
} from '@material-ui/core';
import configData from '../../../default.json';


toast.configure();

const useStyles = makeStyles((themes) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: '100%',
        maxWidth: '95%',
        borderRadius: 20
    },
    tableHeaderCell: {
        fontWeight: 'bolder',
        fontSize: 'medium',
        backgroundColor: themes.palette.primary.dark,
        color: themes.palette.getContrastText(themes.palette.primary.dark),
        textAlign: 'center'
    },
    tableDataCell: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'small',
        cursor: 'pointer',
        color: themes.palette.primary.dark,
    },
    status: {
        fontWeight: 'bold',
        fontSize: '0.75rem',
        color: 'white',
        backgroundColor: 'grey',
        borderRadius: 8,
        padding: '3px 10px',
        display: 'inline-block'
    }
}));


function DrafterAllAssignments() {

    const classes = useStyles();
    const history = useHistory();

    const DrafterIdKey = "DrafterId";
    const DrafterToken = 'DrafterToken';
    const token = localStorage.getItem(DrafterToken);

    const serverString = configData.serverURI;

    const [tasks, setTasks] = useState([]);
    const [tasksCopy, setTasksCopy] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    async function loadDataFromAPI() {

        try {
            const fetchedOrders = await axios.get(`${serverString}Order/${localStorage.getItem(DrafterIdKey)}`, {
                headers: {
                    'Drafter': 'Drafter',
                    'x-auth-token': `${token}`
                }
            });


            setTasks(fetchedOrders.data);
            setTasksCopy(fetchedOrders.data.map(item => item).reverse());
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

    const OpenSingleOrderView = (currentOrder) => {

        history.push({
            pathname: `/drafter/order/${currentOrder._id}`,
            state: [currentOrder]
        });
    }

    return (
        <>

            <DrafterNavBar />

            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div className="LoginFormContainer">
                            <div className="MainForm">
                                <div style={{ padding: "1rem" }}>
                                    <h1>All Assignments</h1>
                                    <TableContainer component={Paper} className={classes.container} >
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableHeaderCell}>Sr. No</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Order ID</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>File</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Drawing Type</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Criticality of Delivery</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Instruction</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    tasksCopy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell className={classes.tableDataCell}>{index + 1}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>#{order._id.slice(order._id.length - 5)}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderFilePath}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderDrawingType}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderCriticality}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{
                                                                    order.OrderInformation.length > 20 ?
                                                                        order.OrderInformation.substring(0, 20) :
                                                                        order.OrderInformation
                                                                }...</TableCell>
                                                                <TableCell className={classes.tableDataCell}>
                                                                    <Typography
                                                                        className={classes.status}
                                                                        style={{
                                                                            backgroundColor:
                                                                                ((order.OrderStatus === 'delivered' && 'green') ||
                                                                                    (order.OrderStatus === 'requested' && 'goldenrod') ||
                                                                                    (order.OrderStatus === 'pending' && 'coral') ||
                                                                                    (order.OrderStatus === 'cancelled' && 'grey') ||
                                                                                    (order.OrderStatus === 'in-progress' && 'royalblue'))
                                                                        }}
                                                                    >{order.OrderStatus}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                        <TableFooter>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10]}
                                                component="div"
                                                count={tasks.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onChangePage={handleChangePage}
                                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                            />
                                        </TableFooter>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default DrafterAllAssignments;