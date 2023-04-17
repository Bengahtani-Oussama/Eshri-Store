import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '@/utils/store/Store';
import axios from 'axios';
import { getError } from '@/utils/error/error';
import Layout from '@/component/layout/Layout';
import {
  Button,
  Card,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CardContent,
  CardActions,
} from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '@/utils/styles/Styles';
import { format, parseISO } from 'date-fns';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/NavBar';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useSnackbar } from 'notistack';

import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

Chart.register(...registerables);

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      state;
  }
}

const AdminDashboard = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { darkMode, userInfo } = state;
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const inStyle = useStyles();

  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteHandle = async (userId) => {
    if (!window.confirm('Are you sure to delete this user?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('User Deleted SuccessFull', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Admin Dashboard - Users' admin='admin'>
      <Grid container spacing={1}>
        <Grid item md={2} xs={1}>
          <Sidebar />
        </Grid>
        <Grid item md={10} xs={11}>
          <List>
            <ListItem>
              <Navbar />
            </ListItem>
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant='h5'>All USERS</Typography>
                <TableContainer>
                  <Table>
                    <TableHead
                      sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                    >
                      <TableRow>
                        <TableCell align='center'>ID</TableCell>
                        <TableCell align='center'>Name</TableCell>
                        <TableCell align='center'>EMAIL</TableCell>
                        <TableCell align='center'>ISADMIN</TableCell>
                        <TableCell align='center'>ACTIONS</TableCell>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <CircularProgress />
                    ) : error ? (
                      <Typography>{error}</Typography>
                    ) : (
                      <TableBody>
                        {users
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((user) => (
                            <TableRow key={user._id}>
                              <TableCell align='center'>
                                <Typography sx={{ fontSize: '11px' }}>
                                  {user._id}
                                  {/* ****{user._id.substring(20, 24)} */}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>{user.name}</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>{user.email}</Typography>
                              </TableCell>

                              <TableCell align='center'>
                                <Typography>
                                  {user.isAdmin ? 'YES' : 'NO'}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align='center'
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Link
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                  href={`/admin/user/${user._id}`}
                                  component={NextLink}
                                >
                                  <SettingsTwoToneIcon />
                                </Link>
                                <IconButton
                                  onClick={() => deleteHandle(user._id)}
                                  color='warning'
                                >
                                  <DeleteTwoToneIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                  rowsPerPageOptions={[3, 6, 9, 15]}
                  component='div'
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
