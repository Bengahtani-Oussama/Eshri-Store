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
  IconButton,
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

import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';

Chart.register(...registerables);

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
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
  const { state } = useContext(Store);
  const router = useRouter();

  const { darkMode, userInfo } = state;

  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const inStyle = useStyles();

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
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

  const createHandle = async () => {
    if (!window.confirm('Are you confirm your data to create new product!')) {
      return;
    }

    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/admin/products',
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('Product Created SuccessFull', { variant: 'success' });
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const deleteHandle = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Admin Dashboard - Products' admin='admin'>
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
                <Grid sx={{ margin: '10px 0' }} container alignItems='center'>
                  <Grid item xs={6}>
                    <Typography variant='h5'>All Products</Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid item xs={6} align='right'>
                    <Button
                      color='primary'
                      variant='contained'
                      size='small'
                      onClick={createHandle}
                    >
                      Create New
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>

                <TableContainer>
                  <Table>
                    <TableHead
                      sx={{ backgroundColor: darkMode ? '#222' : '#cee4fe' }}
                    >
                      <TableRow>
                        <TableCell align='center'>ID</TableCell>
                        <TableCell align='center'>Name</TableCell>
                        <TableCell align='center'>Image</TableCell>
                        <TableCell align='center'>PRICE</TableCell>
                        <TableCell align='center'>CATEGORY</TableCell>
                        <TableCell align='center'>COUNT</TableCell>
                        <TableCell align='center'>RATING</TableCell>
                        <TableCell align='center'>ACTIONS</TableCell>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <CircularProgress />
                    ) : error ? (
                      <Typography>{error}</Typography>
                    ) : (
                      <TableBody>
                        {products
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((product) => (
                            <TableRow key={product._id}>
                              <TableCell align='center'>
                                <Typography sx={{ fontSize: '11px' }}>
                                  {product._id}
                                  {/* ****{product._id.substring(20, 24)} */}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Link
                                  component={NextLink}
                                  href={`/product/${product.slug}`}
                                >
                                  <Typography>{product.name}</Typography>
                                </Link>
                              </TableCell>
                              <TableCell align='center'>
                                <Link
                                  component={NextLink}
                                  href={`/product/${product.slug}`}
                                >
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={35}
                                    height={35}
                                  />
                                </Link>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>${product.price}</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>{product.category}</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>{product.countInStock}</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography>{product.rating}</Typography>
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
                                  href={`/admin/product/${product._id}`}
                                  component={NextLink}
                                >
                                  <SettingsTwoToneIcon />
                                </Link>
                                {/* <Button
                                  onClick={() => deleteHandle(product._id)}
                                  color='warning'
                                >
                                  delete
                                </Button> */}
                                <IconButton
                                  onClick={() => deleteHandle(product._id)}
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
                  count={products.length}
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
{
  /**
 <TableCell align='center'>Image</TableCell>
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
                          </TableCell> */
}
