import React, { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { Store } from '@/utils/store/Store';
import Layout from '@/component/layout/Layout';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';
import { Delete, SendOutlined } from '@mui/icons-material';
import CreditIcon from '@mui/icons-material/CreditScoreTwoTone';
import useStyles from '@/utils/styles/Styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store); // always in the begin
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const {
    darkMode,
    cart: { cartShopItems },
  } = state;

  const inStyle = useStyles();

  const setQuantity = async (item, qun) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < qun) {
      window.alert('Sorry. Product is Not avalibale');
      return;
    }

    dispatch({
      type: 'CART_ADD_SHOP_ITEM',
      payload: { ...item, quantity: qun },
    });
  };

  const deleteItemHandle = (item) => {
    dispatch({ type: 'CART_DELETE_SHOP_ITEM', payload: item });
  };

  const checkoutHandle = () => {
    setLoading(true);
    router.push('/shipping');
    setLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Layout title='Cart'>
      <Typography component='h1' variant='h1'>
        Shopping Cart Items :
      </Typography>
      {cartShopItems.length === 0 ? (
        <div>
          Cart is empty
          <Link component={NextLink} href='/'>
            Go to Shopping
          </Link>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card>
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
                      <TableCell align='center'>Action</TableCell>
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
                            <div className={inStyle.nbItem}>
                              <Button
                                onClick={(e) => {
                                  item.quantity > 1 &&
                                    setQuantity(item, item.quantity - 1);
                                }}
                              >
                                -
                              </Button>
                              {item.quantity}
                              <Button
                                onClick={(e) => {
                                  setQuantity(item, item.quantity + 1);
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell align='center'>
                            <Typography>${item.price}</Typography>
                          </TableCell>
                          <TableCell align='center'>
                            <Button
                              color='primary'
                              variant='outlined'
                              startIcon={<Delete color='warning' />}
                              onClick={() => deleteItemHandle(item)}
                            >
                              Delete
                            </Button>
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
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item lg={6} md={6} xs={6}>
                      <Typography>Total Item :</Typography>
                    </Grid>
                    <Grid item lg={6} md={6} xs={6}>
                      <Typography>
                        (
                        {cartShopItems.reduce(
                          (acum, current) => acum + current.quantity,
                          0
                        )}{' '}
                        items)
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item lg={6} md={6} xs={6}>
                      <Typography>Total Price :</Typography>
                    </Grid>
                    <Grid item lg={6} md={6} xs={6}>
                      <Typography>
                        ${' '}
                        {cartShopItems.reduce(
                          (acum, current) =>
                            acum + current.quantity * current.price,
                          0
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <LoadingButton
                    fullWidth
                    onClick={checkoutHandle}
                    loading={loading}
                    startIcon={<CreditIcon />}
                    loadingPosition='start'
                    variant='contained'
                  >
                    <span>check out</span>
                  </LoadingButton>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
