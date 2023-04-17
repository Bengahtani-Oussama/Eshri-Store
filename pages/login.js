import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/component/layout/Layout';
import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import useStyles from '@/utils/styles/Styles';
import { Person2Sharp, SendOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '@/utils/store/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '@/utils/error/error';
import { LoadingButton } from '@mui/lab';

const loginImg = '/images/login/login.svg';
const loginImg1 = '/images/login/img1.png';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const { redirect } = router.query; // login?redirect=shipping then redirect to shipping page
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const inStyle = useStyles();

  const submitHandle = async ({ email, password }) => {
    setLoading(true);
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      // console.log('data : ' ,data)
      Cookies.set('userInfo', JSON.stringify(data));
      setLoading(false);
      router.push(redirect || '/');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(
        err.response.data.message,
        // getError(err),
        { variant: 'error' }
      );
    }
  };
  return (
    <Layout title={'Login'} notHome>
      {/* <div className={inStyle.Overlay}></div> */}
      <div className={inStyle.login}>
        <Box className={inStyle.layoutContent}>
          <form
            onSubmit={handleSubmit(submitHandle)}
            className={inStyle.Lginform}
          >
            <Grid className={inStyle.cartContainer} container spacing={1}>
              <Grid
                className={inStyle.gridItemL}
                item
                md={6}
                xs={12}
                // bgcolor='rgb(250, 250, 250)'
              >
                <List>
                  <ListItem>
                    <Controller
                      name='email'
                      control={control}
                      defaultValue=''
                      rules={{
                        required: true,
                        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant='filled'
                          fullWidth
                          size='small'
                          id='email'
                          label='email'
                          inputProps={{ type: 'email' }}
                          error={Boolean(errors.email)}
                          helperText={
                            errors.email
                              ? errors.email.type === 'pattern'
                                ? 'Email is not valid'
                                : 'Email is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name='password'
                      control={control}
                      defaultValue=''
                      rules={{
                        required: true,
                        // pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/,
                        minLength: 6,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant='filled'
                          fullWidth
                          size='small'
                          id='password'
                          label='Password'
                          inputProps={{ type: 'password' }}
                          error={Boolean(errors.password)}
                          helperText={
                            errors.password
                              ? errors.password.type === 'minLength'
                                ? 'password is minimum 6 char'
                                : 'password is required'
                              : ''

                            // check email and password hadi ta3 fin Project
                            //  errors.password ? errors.password.type === 'minLength'
                            // ? 'password is minimum 6 char'
                            // : errors.password.type === 'pattern'
                            // ? 'Password (UpperCase, LowerCase and Number)'
                            // : 'password is required'
                            // : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Box textAlign='right' width='100%'>
                      <LoadingButton
                        size='small'
                        type='submit'
                        startIcon={<Person2Sharp />}
                        loading={loading}
                        loadingPosition='start'
                        variant='contained'
                      >
                        <span>Login</span>
                      </LoadingButton>
                    </Box>
                  </ListItem>
                  <ListItem>
                    You can have your account Now!{' '}
                    <Link
                      component={NextLink}
                      href={`/register?redirect=${redirect || '/'}`}
                      color='##001A40'
                      p
                    >
                      {' '}
                      Register
                    </Link>
                  </ListItem>
                </List>
              </Grid>
              <Grid
                className={inStyle.gridItemR}
                item
                md={6}
                xs={12}
                // bgcolor='rgb(250, 250, 250)'
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
        </Box>
      </div>
    </Layout>
  );
};

export default Login;
