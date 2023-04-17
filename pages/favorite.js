import React, { useContext } from 'react';
import { Store } from '@/utils/store/Store';
import Layout from '@/component/layout/Layout';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Rating,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { Box } from '@mui/system';
import Shopping from '@mui/icons-material/ShoppingCartTwoTone';
import useStyles from '@/utils/styles/Styles';
import axios from 'axios';
import { Delete } from '@mui/icons-material';

const FavoriteScreen = (props) => {
  const { state, dispatch } = useContext(Store);
  const { product } = props;

  const {
    cart: { cartFavoriteItems },
  } = state;

  const inStyle = useStyles();

  const addToShopCartHandle = async (product) => {
    const { data } = await axios.get(`/api/products/${product._id}`);

    const shoppingItem = state.cart.cartShopItems.find(
      (item) => item._id === product._id
    );

    const quantity = shoppingItem ? shoppingItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      window.alert('Sorry ! this product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_SHOP_ITEM', payload: { ...product, quantity } });
  };

  const deleteItemHandle = (product) => {
    dispatch({ type: 'CART_DELETE_FAVORITE_ITEM', payload: product });
  };

  return (
    <Layout>
      <Typography>Favorite Screen Items</Typography>
      {cartFavoriteItems.length === 0 && (
        <div>
          Favorite is Empty
          <Link href='/' component={NextLink}>
            Go to Shopping
          </Link>
        </div>
      )}
      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Grid container spacing={1} className={inStyle.cartContainer}>
            {cartFavoriteItems.map((product) => (
              <Grid
                item
                lg={2.4}
                md={3}
                sm={4}
                xs={12}
                key={product.name}
                className={inStyle.GridcartItem}
              >
                <Card className={inStyle.cartItem}>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <CardActionArea>
                      <CardContent className={inStyle.cardContent}>
                        <Typography>{product.brand}</Typography>
                      </CardContent>
                      <CardMedia
                        className={inStyle.cardMedia}
                        component='img'
                        width={192}
                        height={192}
                        image={product.image}
                        title={product.name}
                      ></CardMedia>
                      <CardContent className={inStyle.cardContentMarck}>
                        <Typography>{product.category}</Typography>
                        <Typography>{product.name}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </NextLink>
                  <CardActions className={inStyle.cardContentFooter}>
                    <Box
                      className='footerBox-1'
                      display='flex'
                      gap={1}
                      textAlign='center'
                      marginBottom={1}
                    >
                      <Rating
                        defaultValue={product?.rating}
                        readOnly
                        precision={0.2}
                      />
                      <Typography>({product.numReviews})</Typography>
                    </Box>
                    <Box className='footerBox-2'>
                      <Typography>${product.price}</Typography>
                      <div>
                        <Shopping
                          color='primary'
                          onClick={() => addToShopCartHandle(product)}
                        />
                        <Button
                          color='primary'
                          variant='outlined'
                          startIcon={<Delete color='warning' />}
                          onClick={() => deleteItemHandle(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* <Grid item md={3} xs={12}>
          Favorite Action
        </Grid> */}
      </Grid>
    </Layout>
  );
};

export default FavoriteScreen;
