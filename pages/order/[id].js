import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { Store } from '@/utils/store/Store';
import Layout from '@/component/layout/Layout';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
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
import { useRouter } from 'next/router';
import { getError } from '@/utils/error/error';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { enqueueSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      state;
  }
}

const Order = ({ params }) => {
  const orderId = params.id;
  // console.log('Params Id', orderId);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const inStyle = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const { userInfo, darkMode } = state;
  // console.log('paymentMethod', paymentMethod);

  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  // console.log('order ', order);

  const {
    orderItems,
    shippingAddress,
    // payMethod,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  //  console.log('orderItems ',orderItems);

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    // console.log('userInfo ', userInfo);
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        enqueueSnackbar('Order is paid', { variant: 'success' });
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deliverOrderHandle = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar('Order is delivered', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  // console.log('Order Details orderItems ',typeof orderItems);
  return (
    <Layout title='Order Details'>
      <Typography component='h1' variant='h1'>
        Order Details {orderId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={inStyle.section}>
              <List>
                <ListItem>
                  <Typography>
                    <strong>Shipping Address</strong>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>
                    {shippingAddress.fullName}, {shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country},
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Status :</Typography>
                  {isDelivered ? (
                    <div className={inStyle.delivered}>
                      Delivered At :
                      {format(parseISO(deliveredAt), 'dd MMMM yyyy HH:mm')}
                    </div>
                  ) : (
                    <div className={inStyle.notDelivered}>Is Not Delivered</div>
                  )}
                </ListItem>
              </List>
            </Card>
            <Card className={inStyle.section}>
              <List>
                <ListItem>
                  <Typography>
                    <strong>Payment Method</strong>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Status :</Typography>
                  {isPaid ? (
                    <div className={inStyle.paid}>
                      Paid At : {format(parseISO(paidAt), 'dd MMMM yyyy HH:mm')}
                    </div>
                  ) : (
                    <div className={inStyle.notPaid}>Is Not Paid</div>
                  )}
                </ListItem>
                <ListItem>
                  <Typography>{paymentMethod}</Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={inStyle.section}>
              <List>
                <ListItem>
                  <Typography>
                    <strong>Orders Items</strong>
                  </Typography>
                </ListItem>
                <TableContainer>
                  <Table>
                    <TableHead
                      sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                    >
                      <TableRow>
                        <TableCell align='center'>Image</TableCell>
                        <TableCell align='center'>Name</TableCell>
                        <TableCell align='center'>Quantity</TableCell>
                        <TableCell align='center'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item) => (
                          <TableRow key={item._id}>
                            <TableCell align='center'>
                              <Link
                                component={NextLink}
                                href={`/product/${item.slug}`}
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </TableCell>
                            <TableCell align='center'>
                              <Link
                                component={NextLink}
                                href={`/product/${item.slug}`}
                              >
                                <Typography>{item.name}</Typography>
                              </Link>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                  rowsPerPageOptions={[3, 6, 9, 15]}
                  component='div'
                  count={orderItems.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={inStyle.section}>
              <List>
                <ListItem>
                  <Typography>Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items Price :</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>$ {itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping Price :</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>$ {shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax Price :</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>$ {taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total Price :</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        <strong>$ {totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={inStyle.paypalBtn}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress />}
                    <Button
                      fullWidth
                      variant='contained'
                      size='small'
                      onClick={deliverOrderHandle}
                    >
                      Deliver Order
                    </Button>
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
