import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '@/utils/store/Store';
import axios from 'axios';
import { getError } from '@/utils/error/error';
import Layout from '@/component/layout/Layout';
import {
  Box,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '@/utils/styles/Styles';
import { Controller, useForm } from 'react-hook-form';
import { Person2Sharp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import Sidebar from '../components/sidebar/Sidebar';
import NavBar from '../components/navbar/NavBar';
const loginImg = '/images/login/register.svg';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      state;
  }
}

const ProductEdit = ({ params }) => {
  const productId = params.id;
  const { state } = useContext(Store);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [isNews, setIsNews] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const inStyle = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsNews(data.isNews);
          setIsFeatured(data.isFeatured);
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('category', data.category);
          setValue('image', data.image);
          setValue('price', data.price);
          setValue('brand', data.brand);
          setValue('MinimumPurchase', data.MinimumPurchase);
          setValue('MaximumPurchase', data.MaximumPurchase);
          setValue('countInStock', data.countInStock);
          setValue('desc', data.desc);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);
  //   console.log('userInfo :', userInfo);

  const uploadHandle = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);

    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue('image', data.secure_url);
      enqueueSnackbar('Image Uploaded SuccessFully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submitHandle = async ({
    name,
    slug,
    category,
    image,
    price,
    brand,
    isNews,
    isFeatured,
    MinimumPurchase,
    MaximumPurchase,
    countInStock,
    desc,
  }) => {
    closeSnackbar();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          category,
          image,
          price,
          brand,
          isNews,
          isFeatured,
          MinimumPurchase,
          MaximumPurchase,
          countInStock,
          desc,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Product Updated SuccessFull', { variant: 'success' });
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title='Admin Dashboard - Product Details' admin='admin'>
      <Grid container spacing={1}>
        <Grid item md={2} xs={1}>
          <Sidebar />
        </Grid>
        <Grid item md={10} xs={11}>
          <List>
            <ListItem>
              <NavBar />
            </ListItem>
            <ListItem>
              <Card raised sx={{ width: '100%' }}>
                <CardHeader title={` Edit Product : ${productId}`} />
                <CardContent>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography>{error}</Typography>
                  ) : (
                    <form
                      onSubmit={handleSubmit(submitHandle)}
                      //   className={inStyle.form}
                    >
                      <Grid
                        className={inStyle.cartContainer}
                        container
                        spacing={1}
                      >
                        <Grid
                          className={inStyle.gridItemL}
                          item
                          md={6}
                          xs={12}
                          bgcolor='#c9d7e5'
                        >
                          <List>
                            <ListItem>
                              <Controller
                                name='name'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Name'
                                    label='Product name'
                                    error={Boolean(errors.productName)}
                                    helperText={
                                      errors.Name
                                        ? 'Product name is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='slug'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Slug'
                                    label='Product slug'
                                    error={Boolean(errors.slug)}
                                    helperText={
                                      errors.Slug ? 'Slug is required' : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='category'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Category'
                                    label='Product Category'
                                    error={Boolean(errors.category)}
                                    helperText={
                                      errors.Category
                                        ? 'Category is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='image'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Image'
                                    label='Product image'
                                    error={Boolean(errors.image)}
                                    helperText={
                                      errors.Image
                                        ? 'Product Image is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Button variant='contained' component='label'>
                                Upload Image
                                <input
                                  type='file'
                                  onChange={uploadHandle}
                                  hidden
                                />
                              </Button>
                              {loadingUpload && <CircularProgress />}
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='price'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Price'
                                    label='Product price'
                                    error={Boolean(errors.price)}
                                    helperText={
                                      errors.Price
                                        ? 'Product Price is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='brand'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Brand'
                                    label='Product brand'
                                    error={Boolean(errors.brand)}
                                    helperText={
                                      errors.Brand
                                        ? 'Product brand is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            {/* <ListItem>
                              <Controller
                                name='isNews'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='IsNews'
                                    label='Product isNews'
                                    error={Boolean(errors.isNews)}
                                    helperText={
                                      errors.IsNews
                                        ? 'Product isNews is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem> */}
                            <ListItem>
                              <FormControlLabel
                                label='is News'
                                control={
                                  <Checkbox
                                    onClick={(e) => setIsNews(e.target.checked)}
                                    checked={isNews}
                                    name='isNews'
                                  />
                                }
                              ></FormControlLabel>
                            </ListItem>
                            <ListItem>
                              <FormControlLabel
                                label='is Featured'
                                control={
                                  <Checkbox
                                    onClick={(e) =>
                                      setIsFeatured(e.target.checked)
                                    }
                                    checked={isFeatured}
                                    name='isFeatured'
                                  />
                                }
                              ></FormControlLabel>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='MinimumPurchase'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='MinimumPurchase'
                                    label='Product MinimumPurchase'
                                    error={Boolean(errors.MinimumPurchase)}
                                    helperText={
                                      errors.MinimumPurchase
                                        ? 'Product MinimumPurchase is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='MaximumPurchase'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='MaximumPurchase'
                                    label='Product MaximumPurchase'
                                    error={Boolean(errors.MaximumPurchase)}
                                    helperText={
                                      errors.MaximumPurchase
                                        ? 'Product MaximumPurchase is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='countInStock'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='CountInStock'
                                    label='Product Count InStock'
                                    error={Boolean(errors.countInStock)}
                                    helperText={
                                      errors.CountInStock
                                        ? 'Product count InStock is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Controller
                                name='desc'
                                control={control}
                                defaultValue=''
                                rules={{
                                  required: true,
                                }}
                                render={({ field }) => (
                                  <TextField
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    id='Desc'
                                    label='Product description'
                                    error={Boolean(errors.desc)}
                                    helperText={
                                      errors.Desc
                                        ? 'Product description is required'
                                        : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>

                            <ListItem>
                              <Box textAlign='right' width='100%'>
                                <Button
                                  variant='contained'
                                  type='submit'
                                  size='small'
                                  startIcon={<Person2Sharp />}
                                >
                                  Update
                                </Button>
                                {loadingUpdate && <CircularProgress />}
                              </Box>
                            </ListItem>
                          </List>
                        </Grid>
                        <Grid
                          className={inStyle.gridItemR}
                          item
                          md={6}
                          xs={12}
                          bgcolor='#c9d7e5'
                        >
                          <Image
                            className={inStyle.loginImg}
                            src={loginImg}
                            alt='login'
                            width={250}
                            height={250}
                          ></Image>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });

{
  /**
Checkbox,
FormControlLabel,
 <ListItem>
                              <FormControlLabel
                                label='is Admin'
                                control={
                                  <Checkbox
                                    onClick={(e) =>
                                      setIsAdmin(e.target.checked)
                                    }
                                    checked={isAdmin}
                                    name='isAdmin'
                                  />
                                }
                              ></FormControlLabel>
                            </ListItem> */
}
