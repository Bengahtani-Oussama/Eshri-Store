import CheckOutWizard from '@/component/checkOutWizard/CheckOutWizard';
import Layout from '@/component/layout/Layout';
import { Store } from '@/utils/store/Store';
import useStyles from '@/utils/styles/Styles';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import InventoryIcon from '@mui/icons-material/InventoryTwoTone';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

const Payment = () => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const inStyle = useStyles();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const { state, dispatch } = useContext(Store);

  const {
    darkMode,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      // setPaymentMethod('');

      setPaymentMethod(
        Cookies.get('paymentMethod') ? Cookies.get('paymentMethod') : ''
      );
    }
  }, []);
  // console.log('1pay paymentMethod', paymentMethod);

  const submitHandle = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment Method is required ! please check one', {
        variant: 'error',
      });
    } else {
      Cookies.remove('paymentMethod');

      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };
  return (
    <Layout title='Payment'>
      <Box className={inStyle.Shipping}>
        <CheckOutWizard activeStep={2} />
      </Box>
      <Card
        className={inStyle.section}
        sx={{ backgroundColor: darkMode ? '#222' : '#c9d7e5' }}
      >
        <form className={inStyle.paymentForm} onSubmit={submitHandle}>
          <Typography component='h1' variant='h1'>
            Payment Method
          </Typography>
          <Typography component='h5' variant='h5'>
            Please choose one of these methods :
          </Typography>
          <Grid container spacing={1}>
            <Grid className={inStyle.ShippingGridItemL} item md={6} xs={12}>
              <List>
                <ListItem>
                  <FormControl component='fieldset'>
                    <RadioGroup
                      aria-label='Payment Step'
                      name='paymentStep'
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        label='PayPal'
                        value='PayPal'
                        control={<Radio />}
                      ></FormControlLabel>
                      <FormControlLabel
                        label='Stripe'
                        value='Stripe'
                        control={<Radio />}
                      ></FormControlLabel>
                      <FormControlLabel
                        label='Cash'
                        value='Cash'
                        control={<Radio />}
                      ></FormControlLabel>
                    </RadioGroup>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <Box className={inStyle.paymentBtn}>
                    <Button
                      variant='contained'
                      fullWidth
                      type='button'
                      size='small'
                      startIcon={<PlaceTwoToneIcon />}
                      onClick={() => router.push('/shipping')}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      fullWidth
                      type='submit'
                      size='small'
                      startIcon={<InventoryIcon />}
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
              direction='column'
              // bgcolor='#444'
            >
              <ListItem>
                PayPal : PayPal is a widely recognized and trusted payment
                method that allows buyers to securely make payments online. One
                of the main benefits of PayPal is that it offers buyer
                protection, which means that if there is an issue with the
                transaction, PayPal will work to resolve the issue and help
                ensure that the buyer receives a refund if necessary.
              </ListItem>
              <ListItem>
                Stripe : Stripe is another popular payment method that is widely
                used by businesses of all sizes. One of the main benefits of
                Stripe is that it offers a wide range of payment options,
                including credit/debit cards, Apple Pay, Google Pay, and more.
              </ListItem>
              <ListItem>
                Cash : Cash is a traditional payment method that involves
                physically exchanging cash for goods or services. One of the
                main benefits of cash is that it is a simple and straightforward
                payment method that does not require any additional fees or
                processing time. Additionally, some buyers may prefer to use
                cash as a payment method as it allows them to remain anonymous
                and keep their personal financial information private.
              </ListItem>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Layout>
  );
};

export default Payment;
