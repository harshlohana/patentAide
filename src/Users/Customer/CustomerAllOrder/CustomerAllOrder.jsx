import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, TablePagination, TableFooter
} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
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

function CusromerAllOrders() {

    const classes = useStyles();
    const history = useHistory();

    const CustomerIdKey = 'CustomerId';
    const CustomerToken = 'CustomerToken';
    const token = localStorage.getItem(CustomerToken);

    const serverString = configData.serverURI;

    const [orders, setOrders] = useState([]);
    const [ordersCopy, setOrdersCopy] = useState([]);
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
            const fetchedOrders = await axios.get(`${serverString}order/${localStorage.getItem(CustomerIdKey)}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
            setOrders(fetchedOrders.data);
            setOrdersCopy(fetchedOrders.data.map(item => item).reverse())

        }
        catch (e) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }

    }

    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/`)
        else
            loadDataFromAPI()

    }, []);



    const OpenSingleOrderView = (currentOrder) => {


        history.push({
            pathname: `/customer/order/${currentOrder._id}`,
            state: [currentOrder]
        });
    }

    return (
        <>

            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div>
                            <div>
                                <div style={{ padding: "1rem" }}>
                                    <h1>All Orders</h1>
                                    <TableContainer component={Paper} className={classes.container} >
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableHeaderCell}>Sr. No</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Order ID</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Attorney Ref No.</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Drawing Type</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>PTO Office</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Criticality of Delivery</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Instruction</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    ordersCopy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell className={classes.tableDataCell}>{index + 1}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>#{order._id.slice(order._id.length - 5)}</TableCell>
                                                                {
                                                                    order.OrderAttorneyReferenceNumber ?
                                                                        <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>#{order.OrderAttorneyReferenceNumber}</TableCell> :
                                                                        <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>N/A</TableCell>
                                                                }
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderDrawingType}</TableCell>
                                                                <TableCell onClick={e => OpenSingleOrderView(order)} className={classes.tableDataCell}>{order.OrderPTOOffice}</TableCell>
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
                                                                                (
                                                                                    (order.OrderStatus === 'requested' && 'goldenrod') ||
                                                                                    (order.OrderStatus === 'awaiting-approval' && 'red') ||
                                                                                    (order.OrderStatus === 'in-progress' && 'royalblue') ||
                                                                                    (order.OrderStatus === 'draft-submitted' && 'coral') ||
                                                                                    (order.OrderStatus === 'completed' && 'green') ||
                                                                                    (order.OrderStatus === 'cancelled' && 'grey')
                                                                                )
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
                </div>
            </div>

            <CustomerNavBar />
        </>
    );

}

export default CusromerAllOrders;