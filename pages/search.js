import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/component/layout/Layout';
import {
  Button,
  Box,
  Card,
  List,
  ListItem,
  MenuItem,
  Rating,
  Select,
  Pagination,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '@/utils/error/error';
import useStyles from '@/utils/styles/Styles';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import db from '@/utils/DB/db';
import Product from '@/models/product/Product';
import ProductItem from '@/component/ProductItem/ProductItem';
import { Store } from '@/utils/store/Store';
import CancelIcon from '@mui/icons-material/Cancel';

const PAGE_SIZE = 3;

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const inStyle = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;

  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const { state, dispatch } = useContext(Store);

  const addToShopCartHandle = async (product) => {
    const { data } = await axios.get(`/api/products/${product._id}`);

    const shoppingItem = state.cart.cartShopItems.find(
      (item) => item._id === product._id
    );
    const quantity = shoppingItem ? shoppingItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry ! this product is out of stock', {
        variant: 'error',
      });
      //   window.alert('Sorry ! this product is out of stock');
      //   return;
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

  //   console.log('products', products);
  //   console.log('countProducts', countProducts);
  //   console.log('categories', categories);
  //   console.log('brands', brands);
  //   console.log('pages', pages);

  //{console.log('products', products)}
  //{console.log('products', products)}
  return (
    <Layout title='Search'>
      <Grid container spacing={1} className={inStyle.mt1Grid}>
        <Grid md={3} item>
          <Card className={inStyle.section}>
            <List>
              <ListItem>
                <Box className={inStyle.fullWidth}>
                  <Typography>Categories</Typography>
                  <Select fullWidth value={category} onChange={categoryHandler}>
                    <MenuItem value='all'>All</MenuItem>
                    {categories &&
                      categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>
              <ListItem>
                <Box className={inStyle.fullWidth}>
                  <Typography>Brands</Typography>
                  <Select fullWidth value={brand} onChange={brandHandler}>
                    <MenuItem value='all'>All</MenuItem>
                    {brands &&
                      brands.map((brand) => (
                        <MenuItem key={brand} value={brand}>
                          {brand}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>
              <ListItem>
                <Box className={inStyle.fullWidth}>
                  <Typography>Prices</Typography>
                  <Select fullWidth value={price} onChange={priceHandler}>
                    <MenuItem value='all'>All</MenuItem>
                    {prices &&
                      prices.map((price) => (
                        <MenuItem key={price.value} value={price.value}>
                          {price.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>
              <ListItem>
                <Box className={inStyle.fullWidth}>
                  <Typography>Ratings</Typography>
                  <Select fullWidth value={rating} onChange={ratingHandler}>
                    <MenuItem value='all'>All</MenuItem>
                    {ratings &&
                      ratings.map((rating) => (
                        <MenuItem key={rating} value={rating}>
                          <Rating value={rating} readOnly />
                          <Typography component='span'>& Up</Typography>
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid md={9} item>
          <Card className={inStyle.section}>
            <Grid container>
              <Grid item className={inStyle.resultSearch}>
                {products.length === 0 ? 'No' : countProducts} Results
                {query !== 'all' && query !== '' && ' : ' + query}
                {category !== 'all' && ' : ' + category}
                {brand !== 'all' && ' : ' + brand}
                {price !== 'all' && ' : Price ' + price}
                {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                {(query !== 'all' && query !== '') ||
                category !== 'all' ||
                brand !== 'all' ||
                rating !== 'all' ||
                price !== 'all' ? (
                  <Button onClick={() => router.push('/search')}>
                    <CancelIcon />
                  </Button>
                ) : null}
              </Grid>
              <Grid item>
                <Typography component='span'>Sort By</Typography>
                <Select value={sort} onChange={sortHandler}>
                  <MenuItem value='featured'>Featured</MenuItem>
                  <MenuItem value='lowest'>Price : Low to Hight</MenuItem>
                  <MenuItem value='highest'>Price : Hight to Low </MenuItem>
                  <MenuItem value='toprated'>Customer Reviews</MenuItem>
                  <MenuItem value='newest'>Newest Arrivals</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Card>
          <Card className={inStyle.section}>
            <Grid container spacing={1} className={inStyle.cartContainer}>
              {products.map((product) => (
                <Grid
                  item
                  lg={3}
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
          </Card>
          <Pagination
            defaultPage={parseInt(query.page || '1')}
            count={pages}
            onChange={pageHandler}
          ></Pagination>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...ratingFilter,
      ...priceFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...brandFilter,
    ...ratingFilter,
    ...priceFilter,
  });
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
