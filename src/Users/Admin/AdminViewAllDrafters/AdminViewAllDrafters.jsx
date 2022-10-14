import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavBar from '../AdminNavBar/AdminNavBar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, TablePagination, TableFooter, Button
} from '@material-ui/core';
import configData from '../../../default.json';


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

toast.configure();

function AdminViewAllDrafters() {

    const history = useHistory();

    const classes = useStyles();

    const AdminToken = 'AdminToken';
    const token = localStorage.getItem(AdminToken);
    const serverString = configData.serverURI;

    const [drafters, setdrafters] = useState([]);
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
            const fetchedDrafters = await axios.get(`${serverString}drafter/`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            setdrafters(fetchedDrafters.data);

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

    const RemoveDrafter = (e) => {

        try {
            axios.delete(`${serverString}Drafter/${e}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            }).then(res => {
                toast.success(res.data, { position: toast.POSITION.BOTTOM_RIGHT });

                loadDataFromAPI();
            }).catch(e => toast.success(e, { position: toast.POSITION.BOTTOM_RIGHT }));
        } catch (err) {
            toast.error(err, { position: toast.POSITION.BOTTOM_RIGHT })
        }

    }

    return (
        <>
            <div className="dashboard">
                <div id="content">
                    <div className="container-fluid">
                        <div className="LoginFormContainer">
                            <div className="MainForm">
                                <div style={{ padding: "1rem" }}>
                                    <h1>List of all Drafters</h1>
                                    <TableContainer component={Paper} className={classes.container} >
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableHeaderCell}>Sr. No</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>UserName</TableCell>
                                                    {/* <TableCell className={classes.tableHeaderCell}>Password</TableCell> */}
                                                    <TableCell className={classes.tableHeaderCell}>Email</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Phone</TableCell>
                                                    <TableCell className={classes.tableHeaderCell}>Remove Drafter</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    drafters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((drafter, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell className={classes.tableDataCell}>{index + 1}</TableCell>
                                                                <TableCell className={classes.tableDataCell}>{drafter.DrafterName}</TableCell>
                                                                <TableCell className={classes.tableDataCell}>{drafter.DrafterUserName}</TableCell>
                                                                {/* <TableCell className={classes.tableDataCell}>{drafter.DrafterPassword}</TableCell> */}
                                                                <TableCell className={classes.tableDataCell}>{drafter.DrafterEmail}</TableCell>
                                                                <TableCell className={classes.tableDataCell}>{drafter.DrafterPhone}</TableCell>
                                                                <TableCell className={classes.tableDataCell}><Button size="small" variant="contained" color="secondary" value={drafter._id} onClick={e => RemoveDrafter(drafter._id)}>Remove</Button></TableCell>
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
                                                count={drafters.length}
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
            <AdminNavBar />
        </>
    );

}

export default AdminViewAllDrafters;