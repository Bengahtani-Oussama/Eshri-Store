/* eslint-disable @next/next/no-img-element */
import { useContext } from 'react';
// import styles from '@/styles/Home.module.css'
import Layout from '@/component/layout/Layout';
import {
  Box,
  Grid,
  Link,
} from '@mui/material';
import useStyles from '@/utils/styles/Styles';
import NextLink from 'next/link';
import db from '@/utils/DB/db';
import Product from '@/models/product/Product';
import { Store } from '@/utils/store/Store';
import axios from 'axios';
import ProductItem from '@/component/ProductItem/ProductItem';
import Image from 'next/image';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

// Home Screen
export default function Home(props) {
  const { state, dispatch } = useContext(Store); // always in the begin
  const { darkMode } = state;
  const {
    ElectronicProducts,
    MenProducts,
    featuredProducts,
    BabyProducts,
    products,
  } = props;
  const inStyle = useStyles();

  const addToShopCartHandle = async (product) => {
    const { data } = await axios.get(`/api/products/${product?._id}`);

    const shoppingItem = state.cart.cartShopItems.find(
      (item) => item?._id === product?._id
    );
    const quantity = shoppingItem ? shoppingItem?.quantity + 1 : 1;

    if (data?.countInStock < quantity) {
      window.alert('Sorry ! this product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_SHOP_ITEM',
      payload: { ...product, quantity },
    });
  };
  const addToFavoriteCartHandle = async (product) => {
    dispatch({
      type: 'CART_ADD_FAVORITE_ITEM',
      payload: { ...product },
    });
  };

  const color = darkMode ? '#444' : '#FFF';
  return (
    <Layout>
      <Carousel
        className={inStyle.carouselBox}
        showArrows={false}
        showIndicators={false}
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
      >
        {featuredProducts?.map((product) => (
          <Link
            component={NextLink}
            key={product?._id}
            href={`/product/${product?.slug}`}

            // onClick={(e) => onClickInCarousel(product?.slug)}
            //className={classN.featuredImageCarousel}
          >
            <img
              src={product?.featuredImage?.image}
              alt={product?.featuredImage?.caption}
              //  className={classN?.featuredImage}
            ></img>
          </Link>
        ))}
      </Carousel>

      <div className={inStyle.BoxcartContainerWrapper}>
        {/* <div
          className={inStyle.BoxcartContainer}
          style={{ backgroundColor: `${color}` }}
        >
          <h2>Products</h2>
          <Grid
            container
            // bgcolor='#001e3c'
            spacing={1}
            className={inStyle.cartContainer}
          >
            {products?.map((product) => (
              <Grid
                item
                lg={2.4}
                md={3}
                sm={4}
                xs={12}
                key={product.name}
                className={inStyle.GridcartItem}
              >
                <ProductItem
                  product={product}
                  addToShopCartHandle={addToShopCartHandle}
                  addToFavoriteCartHandle={addToFavoriteCartHandle}
                />
              </Grid>
            ))}
          </Grid>
        </div> */}

        {/********  ELECTRONIC   ******** */}
        <div
          className={inStyle.BoxcartContainer}
          style={{ backgroundColor: `${color}` }}
        >
          <h2>Electronics</h2>
          <Grid container spacing={1} className={inStyle.cartContainer}>
            {ElectronicProducts.map((product) => (
              <Grid
                item
                lg={2.4}
                md={3}
                sm={4}
                xs={12}
                key={product.name}
                className={inStyle.GridcartItem}
              >
                <ProductItem
                  product={product}
                  addToShopCartHandle={addToShopCartHandle}
                  addToFavoriteCartHandle={addToFavoriteCartHandle}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        {/********  ELECTRONIC   ******** */}

        {/********  FASHION   ******** */}
        <div
          className={inStyle.BoxcartContainer}
          style={{ backgroundColor: `${color}` }}
        >
          <h2>Fashion</h2>
          <Grid container spacing={1} className={inStyle.cartContainer}>
            {MenProducts.map((product) => (
              <Grid
                item
                lg={2.4}
                md={3}
                sm={4}
                xs={12}
                key={product.name}
                className={inStyle.GridcartItem}
              >
                <ProductItem
                  product={product}
                  addToShopCartHandle={addToShopCartHandle}
                  addToFavoriteCartHandle={addToFavoriteCartHandle}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        {/********  FASHION   ******** */}

        {/********  featured   ******** */}
        <div
          className={inStyle.BoxcartContainer}
          style={{ backgroundColor: `${color}` }}
        >
          <h2>featured</h2>
          <Grid container spacing={1} className={inStyle.cartContainer}>
            {featuredProducts.map((product) => (
              <Grid
                item
                lg={2.4}
                md={3}
                sm={4}
                xs={12}
                key={product.name}
                className={inStyle.GridcartItem}
              >
                <ProductItem
                  product={product}
                  addToShopCartHandle={addToShopCartHandle}
                  addToFavoriteCartHandle={addToFavoriteCartHandle}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        {/********  featured   ******** */}

        {/********  Toys , Kids & Babies   ******** */}
        <div
          className={inStyle.BoxcartContainer}
          style={{ backgroundColor: `${color}` }}
        >
          <h2>Toys , Kids & Babies</h2>
          <Grid container spacing={1} className={inStyle.cartContainer}>
            {BabyProducts.map((product) => (
              <Grid
                item
                lg={2.4}
                md={3}
                sm={4}
                xs={12}
                key={product.name}
                className={inStyle.GridcartItem}
              >
                <ProductItem
                  product={product}
                  addToShopCartHandle={addToShopCartHandle}
                  addToFavoriteCartHandle={addToFavoriteCartHandle}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        {/********  Toys , Kids & Babies   ******** */}
      </div>
    </Layout>
  );
}
//Toys , Kids & Babies
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, '-reviews').lean();

  const ElectronicProductsDoc = await Product.find(
    { category: 'Android' || 'Appel' || 'Laptop' || 'Tv' },
    '-reviews'
  ).lean();

  const Men_WProductsDoc = await Product.find(
    { category: 'Men' || 'Women' },
    '-reviews'
  ).lean();

  const featuredProductsDoc = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean()
    .limit(4);

  const BabyProductsDoc = await Product.find(
    { category: 'Toys , Kids & Babies' },
    '-reviews'
  ).lean();

  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
      ElectronicProducts: ElectronicProductsDoc.map(db.convertDocToObj),
      MenProducts: Men_WProductsDoc.map(db.convertDocToObj),
      featuredProducts: featuredProductsDoc.map(db.convertDocToObj),
      BabyProducts: BabyProductsDoc.map(db.convertDocToObj),
    },
  };
}
