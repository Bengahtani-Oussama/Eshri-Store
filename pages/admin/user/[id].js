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
  Card,
  CardHeader,
  CardContent,
  Grid,
  // Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
// import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '@/utils/styles/Styles';
import { Controller, useForm } from 'react-hook-form';
import { Person2Sharp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
// import Cookies from 'js-cookie';
import Sidebar from '../components/sidebar/Sidebar';
import NavBar from '../components/navbar/NavBar';
import { Checkbox } from '@mui/material';
import { FormControlLabel } from '@mui/material';

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

    default:
      state;
  }
}

const UserEdit = ({ params }) => {
  const userId = params.id;
  const { state } = useContext(Store);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const inStyle = useStyles();
  const { userInfo } = state;

  // console.log(userInfo);
  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          setIsAdmin(data.isAdmin);
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  //   console.log('userInfo :', userInfo);

  // const uploadHandle = async (e) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);

  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post('/api/admin/upload', bodyFormData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     dispatch({ type: 'UPLOAD_SUCCESS' });
  //     setValue('image', data.secure_url);
  //     enqueueSnackbar('Image Uploaded SuccessFully', { variant: 'success' });
  //   } catch (err) {
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //     enqueueSnackbar(getError(err), { variant: 'error' });
  //   }
  // };

  const submitHandle = async ({ name }) => {
    closeSnackbar();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('User Updated SuccessFull', { variant: 'success' });
      router.push('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
   
   <Layout title='Admin Dashboard - User Details' admin='admin'>
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
                <CardHeader title={` Edit User : ${userId}`} />
                <CardContent>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography color='red'>{error}</Typography>
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
                                    label='User name'
                                    error={Boolean(errors.userName)}
                                    helperText={
                                      errors.Name ? 'User name is required' : ''
                                    }
                                    {...field}
                                  />
                                )}
                              ></Controller>
                            </ListItem>
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
                            </ListItem>

                            {/* <ListItem>
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
                                    label='User image'
                                    error={Boolean(errors.image)}
                                    helperText={
                                      errors.Image
                                        ? 'User Image is required'
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
                            </ListItem> */}

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

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });

{
  /* <Layout title='Admin Dashboard - User Details' admin='admin'> */
}
// </Layout>
