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

Chart.register(...registerables);

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };

    default:
      state;
  }
}

const AdminDashboard = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { darkMode, userInfo } = state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const inStyle = useStyles();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Layout title='Admin Dashboard - Orders' admin='admin'>
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
                <Typography variant='h5'>All Orders</Typography>
                <TableContainer>
                  <Table>
                    <TableHead
                      sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                    >
                      <TableRow>
                        <TableCell align='center'>ID</TableCell>
                        <TableCell align='center'>User</TableCell>
                        <TableCell align='center'>ORDER AT</TableCell>
                        <TableCell align='center'>TOTAL</TableCell>
                        <TableCell align='center'>PAID AT</TableCell>
                        <TableCell align='center'>DELIVERED AT</TableCell>
                        <TableCell align='center'>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <CircularProgress />
                    ) : error ? (
                      <Typography>{error}</Typography>
                    ) : (
                      <TableBody>
                        {orders
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((order) => (
                            <TableRow key={order._id}>
                              <TableCell align='center'>
                                <Typography sx={{ fontSize: '11px' }}>
                                  {order._id}
                                  {/* ****{order._id.substring(20, 24)} */}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>
                                  {order.user
                                    ? order.user.name
                                    : 'DELETED USER'}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>
                                  {format(
                                    parseISO(order.createdAt),
                                    'dd MMMM yyyy HH:mm'
                                  )}{' '}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>${order.totalPrice}</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>
                                  {order.isPaid
                                    ? `${format(
                                        parseISO(order.paidAt),
                                        'dd MMMM yyyy HH:mm'
                                      )}`
                                    : 'Not Paid'}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>
                                  {order.isDelivered
                                    ? `${format(
                                        parseISO(order.deliveredAt),
                                        'dd MMMM yyyy HH:mm'
                                      )}`
                                    : 'Not Delivered'}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Link
                                  href={`/order/${order._id}`}
                                  component={NextLink}
                                >
                                  <Button
                                    size='small'
                                    fullWidth
                                    variant='contained'
                                  >
                                    Order Details
                                  </Button>
                                </Link>
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
                  count={orders.length}
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
