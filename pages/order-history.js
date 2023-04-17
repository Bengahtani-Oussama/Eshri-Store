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
} from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '@/utils/styles/Styles';
import { format, parseISO } from 'date-fns';

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

const OrderHistory = () => {
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

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Layout title='Order Details History'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={inStyle.section}>
            <Link href='/profile' component={NextLink}>
              <ListItemButton button components='a'>
                <ListItemText primary='User Profile'></ListItemText>
              </ListItemButton>
            </Link>
            <Link href='/order-history' component={NextLink}>
              <ListItemButton selected button components='a'>
                <ListItemText primary='Order History'></ListItemText>
              </ListItemButton>
            </Link>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={inStyle.section}>
            <List>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  Order Details History : ({orders.length} Order)
                </Typography>
              </ListItem>

              {orders.length === 0 ? (
                <p>order zero</p>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead
                        sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                      >
                        <TableRow>
                          <TableCell align='center'>ID</TableCell>
                          <TableCell align='center'>DATE</TableCell>
                          <TableCell align='center'>TOTAL</TableCell>
                          <TableCell align='center'>PAID</TableCell>
                          <TableCell align='center'>DELIVERED</TableCell>
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
                                  <Typography>
                                    ****{order._id.substring(20, 24)}
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
                                      ? `Paid At ${format(
                                          parseISO(order.paidAt),
                                          'dd MMMM yyyy HH:mm'
                                        )}`
                                      : 'Not Paid'}
                                  </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                  <Typography>
                                    {order.isDelivered
                                      ? `Delivered At ${format(
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
                                    <Button variant='contained'>
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
                </>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
