import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavBar from '../AdminNavBar/AdminNavBar';
import download from 'downloadjs';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, TablePagination, TableFooter
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
        textAlign: 'center'
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

function AdminViewAllCustomers() {

    const history = useHistory();

    const classes = useStyles();

    const AdminToken = 'AdminToken';
    const token = localStorage.getItem(AdminToken);
    const serverString = configData.serverURI;

    const [file, setFile] = useState();
    const [users, setUsers] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const downloadNda = async (userData) => {

        console.log(userData.CustomerNDA)

        const dirpath = userData.CustomerFullName.split(' ').join('_') + '_' + userData.CustomerID;

        try {
            let fetchedFile = await axios.get(`${serverString}order/getfile/${userData.CustomerID}`, {
                headers: {
                    'dirpath': `${dirpath}`,
                    'filepath': `${userData.CustomerNDA.NDAProvided}`,
                    'x-auth-token': `${token}`
                },
                responseType: 'blob'
            });

            setFile(fetchedFile.data);
            console.log(fetchedFile.data);


            download(file, `${userData.CustomerNDA.NDAProvided}`);
        } catch (err) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    async function loadDataFromAPI() {
        try {

            const fetchedUsers = await axios.get(`${serverString}customer/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            const usersData = fetchedUsers.data;

            setUsers(usersData);
        } catch (err) {
            toast.error("Server Down!", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }
    useEffect(() => {

        if (localStorage.length <= 0)
            history.push(`/admin/login`)
        else
            loadDataFromAPI()

    }, []);


    return (
        <>

            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div className="LoginFormContainer">
                            <div className="MainForm">
                                <div style={{ padding: "1rem" }}>
                                    <h1>List of all customers</h1>
                                    <div>
                                        <TableContainer component={Paper} className={classes.container} >
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className={classes.tableHeaderCell}>Sr. No</TableCell>
                                                        <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                                                        <TableCell className={classes.tableHeaderCell}>UserName</TableCell>
                                                        <TableCell className={classes.tableHeaderCell}>Email</TableCell>
                                                        <TableCell className={classes.tableHeaderCell}>Country</TableCell>
                                                        <TableCell className={classes.tableHeaderCell}>Phone</TableCell>
                                                        <TableCell className={classes.tableHeaderCell}>NDA</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell className={classes.tableDataCell}>{index + 1}</TableCell>
                                                                    <TableCell className={classes.tableDataCell}>{user.CustomerFullName}</TableCell>
                                                                    <TableCell className={classes.tableDataCell}>{user.CustomerUserName}</TableCell>
                                                                    <TableCell className={classes.tableDataCell}>{user.CustomerEmail}</TableCell>
                                                                    <TableCell className={classes.tableDataCell}>{user.CustomerCountry}</TableCell>
                                                                    <TableCell className={classes.tableDataCell}>{user.CustomerPhone}</TableCell>
                                                                    {
                                                                        user.CustomerNDA.NDARequested ?
                                                                            <TableCell className={classes.tableDataCell}>Requested</TableCell> :
                                                                            <TableCell style={{ cursor: 'pointer', color: 'blue' }} onClick={() => downloadNda(user)} className={classes.tableDataCell}>{user.CustomerNDA.NDAProvided}</TableCell>
                                                                    }
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
                                                    count={users.length}
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
            </div>

            <AdminNavBar />
        </>
    );

};

export default AdminViewAllCustomers;