import React, { useContext, useEffect, useState } from 'react';
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
import CreditIcon from '@mui/icons-material/CreditScoreTwoTone';
import useStyles from '@/utils/styles/Styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckOutWizard from '@/component/checkOutWizard/CheckOutWizard';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { getError } from '@/utils/error/error';
import Cookies from 'js-cookie';

const PlaceOrder = () => {
  const inStyle = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [paymentMethod, setPaymentMethod] = useState(
    Cookies.get('paymentMethod')
  );
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartShopItems.length === 0) {
      router.push('/cart');
    }
  }, []);
  const {
    darkMode,
    userInfo,
    cart: { cartShopItems, shippingAddress },
  } = state;
  // console.log('Place Order cartShopItems', cartShopItems);

  const round2N = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // change 211.333 to 211.33
  const itemsPrice = round2N(
    cartShopItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 12;
  const taxPrice = round2N(itemsPrice * 0.17);
  const totalPrice = round2N(itemsPrice + shippingPrice + taxPrice);

  // console.log('Place paymentMethod', paymentMethod);
  // const  payMethod = Cookies.get('paymentMethod');

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const placeOrderHandle = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartShopItems,
          shippingAddress,
          // payMethod,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      // console.log(' Place Order data: ', data);
      // console.log(' Place Order paymentMethod: ', paymentMethod);

      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartShopItems');
      setLoading(false);

      router.push(`order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Layout title='Place Order'>
      <Box className={inStyle.Shipping}>
        <CheckOutWizard activeStep={3}></CheckOutWizard>
      </Box>
      <Typography component='h1' variant='h1'>
        Place Order Step
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={inStyle.section}>
            <List>
              <ListItem className={inStyle.placeOrderHeaderCart}>
                <Typography>
                  <strong>Shipping Address</strong>
                </Typography>
                <Link component={NextLink} href={`/shipping`}>
                  Edit
                </Link>
              </ListItem>
              <ListItem>
                <Typography>
                  {shippingAddress?.fullName} - {shippingAddress?.phone} -{' '}
                  {shippingAddress?.address} - {shippingAddress?.city} -{' '}
                  {shippingAddress?.postalCode} - {shippingAddress?.country}
                </Typography>
              </ListItem>
            </List>
          </Card>
          <Card className={inStyle.section}>
            <List>
              <ListItem className={inStyle.placeOrderHeaderCart}>
                <Typography>
                  <strong>Payment Method</strong>
                </Typography>
                <Link component={NextLink} href={`/payment`}>
                  Edit
                </Link>
              </ListItem>
              <ListItem>
                <Typography>{paymentMethod}</Typography>
              </ListItem>
            </List>
          </Card>
          <Card className={inStyle.section}>
            <List>
              <ListItem className={inStyle.placeOrderHeaderCart}>
                <Typography>
                  <strong>Orders Items</strong>
                </Typography>
                <Link component={NextLink} href={`/cart`}>
                  Edit
                </Link>
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
                    {cartShopItems
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
                count={cartShopItems.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {/* </ListItem> */}
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={inStyle.section}>
            <List>
              <ListItem>
                <Typography>
                  <strong>Order Summary</strong>
                </Typography>
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
              <ListItem>
                <Button
                  fullWidth
                  startIcon={<CreditIcon />}
                  variant='contained'
                  onClick={placeOrderHandle}
                >
                  place orders
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
