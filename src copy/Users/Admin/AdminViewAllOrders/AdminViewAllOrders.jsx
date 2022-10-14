import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavBar from '../AdminNavBar/AdminNavBar';
import { makeStyles } from '@material-ui/core/styles';
import { CSVLink, CSVDownload } from "react-csv";
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


function AdminViewAllOrders() {

    const classes = useStyles();
    const history = useHistory();

    const AdminToken = 'AdminToken';
    const token = localStorage.getItem(AdminToken);
    const serverString = configData.serverURI;

    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [orders, setOrders] = useState([]);
    const [ordersCopy, setOrdersCopy] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    async function loadDataFromAPI() {

        try {
            const fetchedOrders = await axios.get(`${serverString}order/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });


            setOrders(fetchedOrders.data);
            setOrdersCopy(fetchedOrders.data.map(item => item).reverse());

        }
        catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/admin/login`)
        else
            loadDataFromAPI()

    }, []);

    const handleStatusChange = (e, param) => {

        const status = e.target.value;

        try {
            axios.post(`${serverString}order/update/${param}`, { status }, {
                headers: {
                    'x-auth-token': `${token}`
                }
            }).then(res => {

                if (res.data === "Order Status Updated!") {
                    toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });

                    loadDataFromAPI();
                }
            }).catch(e => toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT }));
        } catch (err) {
            toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT })
        }
    };

    const OpenSingleOrderView = (currentOrder) => {

        history.push({
            pathname: `/admin/order/${currentOrder._id}`,
            state: [currentOrder]
        });
    }

    const ChangeFilter = (e) => {

        if (e.target.value === '') {
            setFilter('');
            setOrdersCopy(orders);
        }
        else {
            setFilter(e.target.value);
        }
    }

    const SearchFilteredValue = () => {

        const filteredArray = [];

        if (filter === '') {


            toast.error("Enter a valid seach term", { position: toast.POSITION.BOTTOM_RIGHT })
        }
        else {
            const filterTerm = filter.toLowerCase();

            for (let i = 0; i < orders.length; i++) {

                if (orders[i]._id.includes(filter) ||
                    orders[i].CustomerId.includes(filterTerm) ||
                    orders[i].OrderStatus.includes(filterTerm) ||
                    orders[i].OrderAttorneyReferenceNumber.includes(filterTerm) ||
                    orders[i].CustomerName.toLowerCase().includes(filterTerm) ||
                    orders[i].OrderCriticality.toLowerCase().includes(filterTerm) ||
                    orders[i].OrderDrawingType.toLowerCase().includes(filterTerm)) {

                    filteredArray.push(orders[i]);
                }
                else if (typeof orders[i].DrafterName !== 'undefined') {

                    if (orders[i].DrafterName.toLowerCase().includes(filterTerm)) {
                        filteredArray.push(orders[i]);
                    }
                }
            }
            setOrdersCopy(filteredArray);
        }
    }

    const ResetTable = () => {
        setFilter('');

        setOrdersCopy(orders.map(item => item).reverse());
    }

    const SearchDateFilteredValue = (e) => {

        e.preventDefault();

        const name = e.target.name;
        const value = e.target.value;

        setDateFilter(preValue => {
            return {
                ...preValue,
                [name]: value
            }
        });

        const dateFilteredArray = [];

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].OrderTimeToComplete === e.target.value) {
                dateFilteredArray.push(orders[i]);
            }
        }

        setOrdersCopy(dateFilteredArray)
    }

    return (
        <>

            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div className="MainForm">
                            <div style={{ padding: "1rem" }}>
                                <h1>List of all Orders
                                    <input className="AllOrdersInput" type="text" onChange={ChangeFilter} value={filter} placeholder="search" />
                                    <button className="AllOrdersButton" onClick={SearchFilteredValue} >Search</button>
                                    <input className="AllOrdersInput" name="dateFilter" defaultValue={dateFilter} type="date" onChange={SearchDateFilteredValue} />
                                    <button className="AllOrdersButton" onClick={ResetTable} >Reset</button>
                                    <CSVLink className="AllOrdersDownloadCSVButton" data={orders}>Download CSV</CSVLink>
                                </h1>
                                <br />
                                <TableContainer component={Paper} className={classes.container} >
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.tableHeaderCell}>Sr. No</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Customer Info</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Order ID</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Attorney Ref No.</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Drawing Type</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Delivery Date</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Drafter</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Criticality of Delivery</TableCell>
                                                <TableCell className={classes.tableHeaderCell}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                ordersCopy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell className={classes.tableDataCell}>{index + 1}</TableCell>
                                                            <TableCell onClick={e => OpenSingleOrderView(order)}>
                                                                <Grid item lg={10}>
                                                                    <Typography className={classes.tableDataCell}>{order.CustomerName}</Typography>
                                                                    <Typography className={classes.tableDataCell}>#{order.CustomerId.slice(order.CustomerId.length - 5)}</Typography>
                                                                </Grid>
                                                            </TableCell>
                                                            <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>#{order._id.slice(order._id.length - 5)}</TableCell>
                                                            {
                                                                order.OrderAttorneyReferenceNumber ?
                                                                    <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>#{order.OrderAttorneyReferenceNumber}</TableCell> :
                                                                    <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>N/A</TableCell>
                                                            }
                                                            <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderDrawingType}</TableCell>
                                                            <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderTimeToComplete}</TableCell>

                                                            {
                                                                order.DrafterName ?
                                                                    < TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.DrafterName}</TableCell> :
                                                                    < TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>Not Assigned</TableCell>
                                                            }


                                                            <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderCriticality}</TableCell>
                                                            {/* <TableCell onClick={e => OpenSingleOrderView(order._id)} className={classes.tableDataCell}>{order.OrderInformation}</TableCell> */}

                                                            {/* <TableCell className={classes.tableDataCell}>
                                                                <Typography
                                                                    className={classes.status}
                                                                    style={{
                                                                        backgroundColor:
                                                                            ((order.OrderStatus === 'delivered' && 'green') ||
                                                                                (order.OrderStatus === 'requested' && 'blue') ||
                                                                                (order.OrderStatus === 'pending' && 'orange'))
                                                                    }}
                                                                ><Button size="small" variant="contained" color="secondary" value={order.OrderStatus}>{order.OrderStatus}</Button>
                                                                </Typography>
                                                            </TableCell> */}

                                                            < TableCell >
                                                                <Select
                                                                    className={classes.status}
                                                                    defaultValue={order.OrderStatus}
                                                                    // value={age}
                                                                    onChange={(e) => handleStatusChange(e, order._id)}
                                                                    style={{
                                                                        backgroundColor:
                                                                            (
                                                                                (order.OrderStatus === 'requested' && 'goldenrod') ||
                                                                                (order.OrderStatus === 'awaiting-approval' && 'red') ||
                                                                                (order.OrderStatus === 'in-progress' && 'royalblue') ||
                                                                                (order.OrderStatus === 'draft-submitted' && 'coral') ||
                                                                                (order.OrderStatus === 'delivered' && 'green') ||
                                                                                (order.OrderStatus === 'cancelled' && 'grey')
                                                                            )
                                                                    }}
                                                                >
                                                                    <MenuItem value="requested">Requested</MenuItem>
                                                                    <MenuItem value="awaiting-approval">Awaiting-Approval</MenuItem>
                                                                    <MenuItem value="in-progress">In-Progress</MenuItem>
                                                                    <MenuItem value="draft-submitted">Draft-Submitted</MenuItem>
                                                                    <MenuItem value="delivered">Delivered</MenuItem>
                                                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                                                </Select></TableCell>
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
                                            count={orders.length}
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
            </div >

            <AdminNavBar />
        </>
    );

}

export default AdminViewAllOrders;