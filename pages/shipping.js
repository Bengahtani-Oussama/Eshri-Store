import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Store } from '@/utils/store/Store';
import Layout from '@/component/layout/Layout';
import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { PaymentSharp } from '@mui/icons-material';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import useStyles from '@/utils/styles/Styles';
import Cookies from 'js-cookie';
import CheckOutWizard from '@/component/checkOutWizard/CheckOutWizard';

const ShippingScreen = () => {
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=shipping then redirect to shipping page

  const { state, dispatch } = useContext(Store);
  const {
    darkMode,
    userInfo,
    cart: { shippingAddress },
  } = state;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const inStyle = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    setValue('fullName', shippingAddress?.fullName);
    setValue('phone', shippingAddress?.phone);
    setValue('address', shippingAddress?.address);
    setValue('city', shippingAddress?.city);
    setValue('postalCode', shippingAddress?.postalCode);
    setValue('country', shippingAddress?.country);
  }, []);

  const submitHandle = ({
    fullName,
    phone,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, phone, address, city, postalCode, country },
    });
    // console.log('data : ' ,data)
    Cookies.set(
      'shippingAddress',
      JSON.stringify({ fullName, phone, address, city, postalCode, country })
    );
    router.push('/payment');
  };

  return (
    <div>
      <Layout title='Shipping'>
        <Box className={inStyle.Shipping}>
          <CheckOutWizard activeStep={1} />
        </Box>
        <Box>
          <Card
            className={inStyle.section}
            sx={{ backgroundColor: darkMode ? '#222' : '#c9d7e5' }}
          >
            <form
              onSubmit={handleSubmit(submitHandle)}
              className={inStyle.ShippingForm}
            >
              <Typography component='h1' variant='h1'>
                Shipping Step
              </Typography>
              <Grid container spacing={1}>
                <Grid className={inStyle.ShippingGridItemL} item md={6} xs={12}>
                  <List>
                    <ListItem>
                      <Controller
                        name='fullName'
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
                            id='fullName'
                            label='Full name'
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.fullName)}
                            helperText={
                              errors.fullName ? 'Full name is required' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='phone'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                          pattern: /(05|06|07)\d{8}$/,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='filled'
                            fullWidth
                            size='small'
                            id='phone'
                            label='Phone Number'
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.phone)}
                            helperText={
                              errors.phone
                                ? errors.phone.type === 'pattern'
                                  ? 'Phone number with 05-06-07 and remaining 8 digit with 0-9'
                                  : 'Phone Number is required'
                                : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='address'
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
                            id='address'
                            label='Address'
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.address)}
                            helperText={
                              errors.address ? 'Address is required' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='city'
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
                            id='city'
                            label='City'
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.city)}
                            helperText={errors.city ? 'city is required' : ''}
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='postalCode'
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
                            id='postalCode'
                            label='Postal code'
                            inputProps={{ type: 'number' }}
                            error={Boolean(errors.postalCode)}
                            helperText={
                              errors.postalCode ? 'Postal code is required' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='country'
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
                            id='country'
                            label='Country'
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.country)}
                            helperText={
                              errors.country ? 'Country is required' : ''
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
                          startIcon={<PaymentSharp />}
                        >
                          Continue
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
                  // bgcolor='#444'
                >
                  <ListItem>
                    <Typography component='h2' variant='h2'>
                      List Of Shipping Addresses :
                    </Typography>
                  </ListItem>
                  <Card sx={{ padding: '15px 20px' }}>
                    {shippingAddress?.fullName} - {shippingAddress?.phone} -{' '}
                    {shippingAddress?.address} - {shippingAddress?.city} -{' '}
                    {shippingAddress?.postalCode} - {shippingAddress?.country}
                  </Card>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Box>
      </Layout>
    </div>
  );
};

export default ShippingScreen;
