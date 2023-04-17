import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '@/utils/store/Store';
import axios from 'axios';
import { getError } from '@/utils/error/error';
import Layout from '@/component/layout/Layout';
import {
  Box,
  Button,
  Card,
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
const loginImg = '/images/login/register.svg';

const Profile = () => {
  const { state, dispatch } = useContext(Store);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const inStyle = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);
  //   console.log('userInfo :', userInfo);

  const submitHandle = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      // console.log('data : ' ,data)
      Cookies.set('userInfo', JSON.stringify(data));
      enqueueSnackbar('Profile Updated Success Full', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title='Profile'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={inStyle.section}>
            <Link href='/profile' component={NextLink}>
              <ListItemButton selected button components='a'>
                <ListItemText primary='User Profile'></ListItemText>
              </ListItemButton>
            </Link>
            <Link href='/order-history' component={NextLink}>
              <ListItemButton button components='a'>
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
                  Profile
                </Typography>
              </ListItem>

              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandle)}
                  className={inStyle.form}
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
                              pattern:
                                /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
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
                              validate: (value) =>
                                value === '' ||
                                value.length > 5 ||
                                'Password length is more then 5',
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
                                  errors.password ? 'password is not valid' : ''

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
                              validate: (value) =>
                                value === '' ||
                                value.length > 5 ||
                                'Confirm Password length is more then 5',
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
                                    ? 'Confirm password is not valid'
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
                            <Button
                              variant='contained'
                              type='submit'
                              size='small'
                              startIcon={<Person2Sharp />}
                            >
                              Update
                            </Button>
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
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
