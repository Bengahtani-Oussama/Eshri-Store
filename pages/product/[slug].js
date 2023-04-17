import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
// import data from '@/utils/data/data';
// import { useRouter } from 'next/router';
import Layout from '@/component/layout/Layout';
import useStyles from '@/utils/styles/Styles';
import Image from 'next/legacy/image';
import Shopping from '@mui/icons-material/ShoppingCartTwoTone';
import Favorite from '@mui/icons-material/FavoriteTwoTone';
import CreditIcon from '@mui/icons-material/CreditScoreTwoTone';
import db from '@/utils/DB/db';
import Product from '@/models/product/Product';
import axios from 'axios';
import { Store } from '@/utils/store/Store';
import { useRouter } from 'next/router';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { getError } from '@/utils/error/error';
import { Send } from '@mui/icons-material';

// All Products Screen
const ProductScreen = (props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store); // always in the begin
  const { darkMode, userInfo } = state;
  const { product } = props;
  const inStyle = useStyles();

  const [value, setValue] = useState('1');
  const [breadArray, setBreadArray] = useState([]); //

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      getBreadArr(product);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  }, [product.slug]);
  // }, [product.slug]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);

      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('dasdadawdawdadws');
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setLoading(false);
      enqueueSnackbar('Review submitted successfully!', { variant: 'success' });
      fetchReviews();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const getBreadArr = (product) => {
    const arr = [];
    arr.push(product.category, product.brand, product.name);
    setBreadArray(arr);
  };
  // console.log('breadArray 2', breadArray);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  // console.log('product' , product);

  const addToShopCartHandle = async (product) => {
    setLoading(true);
    const { data } = await axios.get(`/api/products/${product._id}`);

    const shoppingItem = state.cart.cartShopItems.find(
      (item) => item._id === product._id
    );
    const quantity = shoppingItem ? shoppingItem.quantity + 1 : 1;
    if (data.countInStock < quantity) {
      window.alert('Sorry ! this product is out of stock');
      setLoading(false);
      return;
    }
    dispatch({
      type: 'CART_ADD_SHOP_ITEM',
      payload: { ...product, quantity },
    });
    setLoading(false);
    router.push('/cart');
  };

  const addToFavoriteCartHandle = async (product) => {
    setLoading(true);

    dispatch({
      type: 'CART_ADD_FAVORITE_ITEM',
      payload: { ...product },
    });
    setLoading(false);
    router.push('/favorite');
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Layout title={product.name} description={product.desc}>
      <Card className={inStyle.BreadcrumbSection}>
        <Breadcrumbs className={inStyle.Breadcrumb} separator='>'>
          <Link href='/' component={NextLink}>
            Home
          </Link>
          {breadArray.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </Breadcrumbs>
      </Card>

      <Grid container spacing={1}>
        <Grid item lg={5} md={5} xs={12}>
          <Card className={inStyle.section}>
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              layout='responsive'
            ></Image>
          </Card>
        </Grid>
        <Grid item lg={7} md={7} xs={12}>
          <Card className={inStyle.section}>
            <List>
              <ListItem>
                <Typography fontSize={13} color='GrayText'>
                  {product.category}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography component='h1' fontSize={24} variant='h1'>
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Box
                  className='footerBox-1'
                  display='flex'
                  gap={1}
                  textAlign='center'
                  marginBottom={1}
                >
                  <Rating
                    // defaultValue={product?.rating}
                    value={product?.rating}
                    readOnly
                    precision={0.2}
                  />
                  <Link href='#reviews' component={NextLink}>
                    <Typography>( {product.numReviews} reviews )</Typography>
                  </Link>
                </Box>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Price : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    <Typography>${product.price} </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Typography>Offers Now </Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Category : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    <Typography>{product.category} </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Brand : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    <Typography>{product.brand} </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Condition : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    <Typography>{product.isNews} </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Status : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    <Typography>{product.countInStock} </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Min Purchase : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    {product.MinimumPurchase > 1 ? (
                      <Typography>{product.MinimumPurchase} items</Typography>
                    ) : (
                      <Typography>{product.MinimumPurchase} item</Typography>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={3} xs={12}>
                    <Typography>Max Purchase : </Typography>
                  </Grid>
                  <Grid item md={9} xs={12}>
                    {product.MaximumPurchase > 1 ? (
                      <Typography>{product.MaximumPurchase} items</Typography>
                    ) : (
                      <Typography>{product.MaximumPurchase} item</Typography>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem className={inStyle.ShopBtn}>
                <LoadingButton
                  startIcon={<Shopping />}
                  loading={loading}
                  onClick={() => addToShopCartHandle(product)}
                  loadingPosition='start'
                  variant='contained'
                >
                  <span>Add to cart</span>
                </LoadingButton>

                <LoadingButton
                  startIcon={<Favorite />}
                  onClick={() => addToFavoriteCartHandle(product)}
                  loading={loading}
                  loadingPosition='start'
                  variant='contained'
                >
                  <span>Add to Favorite</span>
                </LoadingButton>
              </ListItem>
              <ListItem className={inStyle.ShopBtn}>
                <LoadingButton
                  startIcon={<CreditIcon />}
                  loading={loading}
                  loadingPosition='start'
                  variant='contained'
                >
                  <span>check out</span>
                </LoadingButton>
              </ListItem>
              <ListItem>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange}>
                        <Tab label='Description' value='1' />
                        <Tab label='reviews' value='2' />
                        <Tab label='Info' value='3' />
                      </TabList>
                    </Box>
                    <TabPanel value='1'>
                      <Grid container>
                        <Grid item md={3} xs={12}>
                          <Typography>Description : </Typography>
                        </Grid>
                        <Grid item md={9} xs={12}>
                          <Typography>{product.desc} </Typography>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel name='reviews' value='2'>
                      <List>
                        <ListItem>
                          <Typography component='h2' id='' variant='h2'>
                            List Of Reviews :{' '}
                          </Typography>
                        </ListItem>
                        <ListItem>
                          {reviews.length === 0 ? (
                            <Typography>No review yet </Typography>
                          ) : (
                            <Typography>{reviews.length} </Typography>
                          )}
                          {reviews.map((review) => (
                            <ListItem key={review._id}>
                              <Grid container>
                                <Grid item>
                                  <Typography>
                                    <strong>{review.name}</strong>
                                  </Typography>
                                  <Typography>
                                    {review.createdAt.substring(0, 10)}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Rating
                                    // defaultValue={product?.rating}
                                    value={product.rating}
                                    readOnly
                                    precision={0.2}
                                  />
                                  <Typography>{review.comment}</Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                          ))}
                        </ListItem>
                        {userInfo ? (
                          <form onSubmit={submitHandle}>
                            <Card>
                              <List>
                                <ListItem>
                                  <TextField
                                    multiline
                                    variant='filled'
                                    fullWidth
                                    size='small'
                                    label='Review'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                  />
                                  {/* {console.log('comment : ', comment)} */}
                                </ListItem>
                                <ListItem>
                                  <Box
                                    className='footerBox-1'
                                    display='flex'
                                    gap={1}
                                    textAlign='center'
                                    marginBottom={1}
                                  >
                                    <Rating
                                      name='simple-controlled'
                                      value={rating}
                                      precision={0.5}
                                      onChange={(e) =>
                                        setRating(parseInt(e.target.value))
                                      }
                                    />
                                  </Box>
                                </ListItem>
                                <ListItem>
                                  <Box textAlign='right' width='100%'>
                                    <LoadingButton
                                      size='small'
                                      fullWidth
                                      type='submit'
                                      startIcon={<Send />}
                                      loading={loading}
                                      loadingPosition='start'
                                      variant='contained'
                                    >
                                      <span>Submit review</span>
                                    </LoadingButton>
                                   
                                  </Box>
                                </ListItem>
                              </List>
                            </Card>
                          </form>
                        ) : (
                          <Box>
                            <Typography>Login To Write Your Review </Typography>
                            <Link
                              href={`/login?redirect=/product/${product.slug}`}
                              component={NextLink}
                            >
                              Login
                            </Link>
                          </Box>
                        )}
                      </List>
                    </TabPanel>
                    <TabPanel value='3'>Info ---- Photos</TabPanel>
                  </TabContext>
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();

  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
