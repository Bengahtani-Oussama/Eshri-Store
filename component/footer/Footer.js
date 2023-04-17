import React from 'react';
import NextLink from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import GitHubIcon from '@mui/icons-material/GitHub';
import useStyles from '@/utils/styles/Styles';
import { Grid, Typography, Link } from '@mui/material';
import DataWeb from '@/utils/data/site/site';
import Image from 'next/image';

const Footer = () => {
  const inStyle = useStyles();
  return (
    <div className={inStyle.footer}>
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        className={inStyle.footerScetion}
        component='footer'
      >
        <Grid container direction='column' md={3}>
          <Grid item >
            <Image
              className={inStyle.brandFooter}
              src='/images/logos/logo-light.png'
              alt='Eshri store logo'
              width={150}
              height={80}
            />
          </Grid>

          <Typography component='h4' className={inStyle.footerSubTitle}>
            Contact
          </Typography>

          <a
            href={`https://maps.google.com/maps?q=Route+El+Wiam،+Djelfa`}
            target='_blank'
            rel='noreferrer'
            style={{ margin: '4px 0' }}
          >
            <Typography component='p'>
              <strong>address</strong> {DataWeb.siteInfo.address}
            </Typography>
          </a>

          <a href={`tel:${DataWeb.siteInfo.phone}`} style={{ margin: '4px 0' }}>
            <Typography component='p'>
              <strong>Phone</strong> {DataWeb.siteInfo.phone}
            </Typography>
          </a>

          <a
            href={`mailto:${DataWeb.siteInfo.email}`}
            style={{ margin: '4px 0' }}
          >
            <Typography component='p'>
              <strong>Email</strong> {DataWeb.siteInfo.email}
            </Typography>
          </a>

          <Typography component='p' style={{ margin: '4px 0' }}>
            <strong>W. Time </strong> {DataWeb.siteInfo.work_time}
          </Typography>

          <Typography
            component='h4'
            className={inStyle.footerSubTitle}
            style={{ marginTop: '5px' }}
          >
            Follow Us
          </Typography>

          <Grid item >
            <Link
              component={NextLink}
              className={inStyle.footerLink}
              href={DataWeb.siteSocialMedia.facebook}
            >
              <FacebookIcon className={inStyle.footerLinkSocial} />
            </Link>

            <Link
              component={NextLink}
              className={inStyle.footerLink}
              href={DataWeb.siteSocialMedia.instagram}
            >
              <InstagramIcon className={inStyle.footerLinkSocial} />
            </Link>

            <Link
              component={NextLink}
              className={inStyle.footerLink}
              href={DataWeb.siteSocialMedia.twitter}
            >
              <TwitterIcon className={inStyle.footerLinkSocial} />
            </Link>

            <Link
              component={NextLink}
              className={inStyle.footerLink}
              href={DataWeb.siteSocialMedia.pinterest}
            >
              <PinterestIcon className={inStyle.footerLinkSocial} />
            </Link>

            <Link
              className={inStyle.footerLink}
              component={NextLink}
              href={DataWeb.siteInfo.devlopperAccount}
            >
              <GitHubIcon className={inStyle.footerLinkSocial} />
            </Link>
          </Grid>
        </Grid>

        <Grid container direction='column' md={3}>
          <Typography component='h4' className={inStyle.footerSubTitle}>
            About
          </Typography>

          <Link component={NextLink} href={`/about`} passHref>
            <Link className={inStyle.footerLink}>About</Link>
          </Link>

          <Link component={NextLink} href={`/contact`} passHref>
            <Link className={inStyle.footerLink}>Contact Us</Link>
          </Link>

          <Link component={NextLink} href={`/delivery/`} passHref>
            <Link className={inStyle.footerLink}>Delivery Information</Link>
          </Link>

          <Link component={NextLink} href={`/privacypolicy`} passHref>
            <Link className={inStyle.footerLink}>Privacy Policy</Link>
          </Link>
        </Grid>

        <Grid container direction='column' md={3}>
          <Typography component='h4' className={inStyle.footerSubTitle}>
            My Account
          </Typography>

          <Link component={NextLink} href={`/login`} passHref>
            <Link className={inStyle.footerLink}>Sign In</Link>
          </Link>

          <Link component={NextLink} href={`/register`} passHref>
            <Link className={inStyle.footerLink}>Sign Up</Link>
          </Link>

          <Link component={NextLink} href={`/cart`} passHref>
            <Link className={inStyle.footerLink}>View Cart</Link>
          </Link>
          <Link component={NextLink} href={`/favorite`} passHref>
            <Link className={inStyle.footerLink}>My wishlist</Link>
          </Link>

          <Link component={NextLink} href={`/order-history`} passHref>
            <Link className={inStyle.footerLink}>Track My Orders</Link>
          </Link>
        </Grid>

        <Grid container direction='column' md={3}>
          <Typography component='h4' className={inStyle.footerSubTitle}>
            Install App
          </Typography>

          <Typography component='h4' className={inStyle.footerSubTitleText}>
            From App store or google play
          </Typography>

          <Grid item className={inStyle.footerPayContainer}>
            <Image
              width={150}
              height={45}
              alt=''
              className={inStyle.footerPay}
              src='/images/pay/app.jpg'
            />
            <Image
              width={150}
              height={45}
              alt=''
              className={inStyle.footerPay}
              src='/images/pay/play.jpg'
            />
          </Grid>

          <Typography component='h4' className={inStyle.footerSubTitle}>
            Secured Payment Gateways
          </Typography>

          <Grid item className={inStyle.footerPayCenter}>
            <Image width={150} height={45} alt='' src='/images/pay/pay.png' />
          </Grid>
        </Grid>

        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          md={12}
        >
          <Typography component='h4' className={inStyle.footerCopyright}>
            Copyright &copy; 2023, All Right Reserved ESHRRI-STORE.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
