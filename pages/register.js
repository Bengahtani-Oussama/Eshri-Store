import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/component/layout/Layout';
import { Person2Sharp } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import useStyles from '@/utils/styles/Styles';
import { useRouter } from 'next/router';
import { Store } from '@/utils/store/Store';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '@/utils/error/error';
import { LoadingButton } from '@mui/lab';
const loginImg = '/images/login/register.svg';

const RegisterScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const inStyle = useStyles();

  const router = useRouter();
  const { redirect } = router.query; // login?redirect=shipping then redirect to shipping page
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
    // console.log('userInfo', userInfo);
  }, []);

  const submitHandle = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    setLoading(true);
    if (password !== confirmPassword) {
      enqueueSnackbar('Password not match!', { variant: 'error' });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      // console.log('data : ' ,data)
      Cookies.set('userInfo', JSON.stringify(data));
      setLoading(false);
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
      setLoading(false);
    }
  };
  return (
    <div>
      <Layout title={'Register'} notHome>
        <div className={inStyle.login}>
          <div className={inStyle.Overlay}></div>
          <Box className={inStyle.layoutContent}>
            <form
              onSubmit={handleSubmit(submitHandle)}
              className={inStyle.Registerform}
            >
              <Grid className={inStyle.cartContainer} container spacing={1}>
                <Grid
                  className={inStyle.gridItemL}
                  item
                  md={6}
                  xs={12}
                  // bgcolor='#c9d7e5'
                  // bgcolor='rgba(220, 220, 220, 0.63)'
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
                            inputProps={{ type: 'text' }}
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
                      <TextField
                        disabled={true}
                        variant='filled'
                        fullWidth
                        size='small'
                        id='firstName'
                        label='First name'
                        inputProps={{ type: 'text' }}
                      />
                    </ListItem>
                    <ListItem>
                      <TextField
                        disabled={true}
                        variant='filled'
                        fullWidth
                        size='small'
                        id='lastName'
                        label='Last name'
                        inputProps={{ type: 'text' }}
                      />
                    </ListItem>
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
                                  ? 'password is not valid'
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
                      <Controller
                        name='confirmPassword'
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
                            id='confirmPassword'
                            label='Confirm Password'
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.confirmPassword
                                ? errors.confirmPassword.type === 'minLength'
                                  ? 'password is not valid'
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
                          <span>Register</span>
                        </LoadingButton>
                      </Box>
                    </ListItem>
                    <ListItem>
                      You have an account!{' '}
                      <Link
                        component={NextLink}
                        href={`/login?redirect=${redirect || '/'}`}
                        color='##001A40'
                        p
                      >
                        {' '}
                        Login
                      </Link>
                    </ListItem>
                  </List>
                </Grid>
                <Grid
                  className={inStyle.gridItemR}
                  item
                  md={6}
                  xs={12}
                  // bgcolor='#c9d7e5'
                  // bgcolor='rgba(220, 220, 220, 0.63)'
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
    </div>
  );
};

export default RegisterScreen;
