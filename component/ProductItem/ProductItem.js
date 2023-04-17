import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Typography,
} from '@mui/material';
import Shopping from '@mui/icons-material/ShoppingCartTwoTone';
import Favorite from '@mui/icons-material/FavoriteTwoTone';
import useStyles from '@/utils/styles/Styles';
import NextLink from 'next/link';

export default function ProductItem({
  product,
  addToShopCartHandle,
  addToFavoriteCartHandle,
}) {
  const inStyle = useStyles();
  return (
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
          <Rating defaultValue={product?.rating} readOnly precision={0.2} />
          <Typography>({product.numReviews})</Typography>
        </Box>
        <Box className='footerBox-2'>
          <Typography>${product.price}</Typography>
          <div>
            <Shopping
              color='primary'
              onClick={() => addToShopCartHandle(product)}
            />
            <Favorite
              color='primary'
              onClick={() => addToFavoriteCartHandle(product)}
            />
          </div>
        </Box>
      </CardActions>
    </Card>
  );
}
