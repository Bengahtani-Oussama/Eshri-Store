import React, { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Container,
  CssBaseline,
  Divider,
  Link,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import Footer from '../footer/Footer';
import useStyles from '@/utils/styles/Styles';
import NextLink from 'next/link';
import Image from 'next/image';
import { Store } from '@/utils/store/Store';

import Cookies from 'js-cookie';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import dynamic from 'next/dynamic';
import { Dropdown, User } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { Person4Sharp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { Drawer } from '@mui/material';
import { Close } from '@mui/icons-material';
import { List, ListItem, TextField, InputAdornment } from '@mui/material';
import { ListItemText } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from '@/utils/error/error';
import { SearchSharp } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Light_logo = '/images/logos/logo-dark.png';
const Dark_logo = '/images/logos/logo-light.png';

// Global Screen NavBar+content+Footer
const Layout = ({ children, title, description, admin, notHome }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    darkMode,
    cart: { cartShopItems, cartFavoriteItems },
    userInfo,
  } = state;

  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/products/categories');
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const theme = createTheme({
    typography: {
      body1: {
        color: darkMode ? '#ddd !important' : '#222 !important',
      },
      body2: {
        color: darkMode ? '#ddd !important' : '#222 !important',
      },
      h1: {
        fontSize: '1.8rem',
        fontWeight: 400,
        color: '#1976D2',
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h3: {
        fontSize: '1rem',
        textAlign: 'center',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h5: {
        fontSize: '16px',
        color: darkMode ? '#ddd' : '#222',
      },
      h6: {
        fontSize: '.8rem',
        fontWeight: 400,
        color: darkMode ? '#ddd' : '#777',
      },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 320,
        md: 700,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      // mode: 'light',
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976D2',
        // main: darkMode ? '#ddd' : '#1976D2',
      },
      secondary: {
        main: '#ddd',
      },

      text: {
        secondary: '#333',
      },
      background: {
        // default: '#fff',
        default: darkMode ? '#333' : '#F2FFF2',
        // ++ default: darkMode ? '#333' : '#fff',
        // paper: '#ede5e5',
        paper: darkMode ? '#333' : '#fcfcfc',
      },
    },
  });

  const inStyle = useStyles();

  const darckModeHandeled = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const logOutClickHandle = () => {
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartShopItems');
    Cookies.remove('cartFavoriteItems');
    router.push('/');
  };

  const sideBarOpenHandler = () => {
    setSideBarVisible(true);
  };
  const sideBarCloseHandler = () => {
    setSideBarVisible(false);
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Eshri Store` : 'Eshri Store'}</title>
        {description && <meta name='description' content={description} />}
      </Head>

      {/* Geniral Nav Bar  */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {admin !== 'admin' && (
          <>
            {!notHome && (
              <AppBar position='static' className={inStyle.navbar}>
                <Toolbar className={inStyle.navToolBar}>
                  <Box sx={{ width: '100%' }} className={inStyle.navToolBarTop}>
                    <Box
                      display='flex'
                      height='100px'
                      alignItems='center'
                      justifyContent='center'
                      sx={{ width: '15%' }}
                    >
                      <Link href='/' component={NextLink}>
                        <Image
                          className={inStyle.logo}
                          width={150}
                          height={80}
                          src={darkMode ? Light_logo : Dark_logo}
                          alt='Logo'
                        ></Image>
                      </Link>
                    </Box>
                    <Drawer
                      anchor='left'
                      open={sideBarVisible}
                      onClose={sideBarCloseHandler}
                    >
                      <List>
                        <ListItem >
                          <Typography>Menu</Typography>
                          {/* <IconButton
                            edge='start'
                            aria-label='open drawer'
                            onClick={sideBarCloseHandler}
                          >
                            <Close />
                          </IconButton> */}
                        </ListItem>
                        <Divider light />
                        {categories.map((category) => (
                          <Link
                            key={category}
                            href={`/search?category=${category}`}
                          >
                            <ListItem
                              button
                              component='a'
                              onClick={sideBarCloseHandler}
                            >
                              <ListItemText primary={category}></ListItemText>
                            </ListItem>
                          </Link>
                        ))}
                      </List>
                    </Drawer>
                    <Box
                      sx={{ width: '50%' }}
                      display='flex'
                      height='100px'
                      alignItems='center'
                      justifyContent='center'
                      // className={inStyle.searchSection}
                    >
                      <form
                        onSubmit={submitHandler}
                        className={inStyle.searchForm}
                      >
                        <TextField
                          name='query'
                          fullWidth
                          placeholder='Search ...'
                          // label='Search'
                          // variant='standard'
                          size='small'
                          onChange={queryChangeHandler}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <SearchOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    </Box>
                    <Box
                      display='flex'
                      height='100px'
                      alignItems='center'
                      justifyContent='center'
                      sx={{ width: '25%' }}
                    >
                      <Box className='right-nav'>
                        <Switch
                          className={inStyle.darkModeIcon}
                          checked={darkMode}
                          onChange={darckModeHandeled}
                        ></Switch>
                        {userInfo ? (
                          <Dropdown placement='bottom-left'>
                            <Dropdown.Trigger>
                              <User
                                zoomed
                                squared
                                className={inStyle.AvatarUser}
                                bordered
                                as='button'
                                size='lg'
                                color='warning'
                                name={userInfo.name}
                                description={`@_${userInfo.name}`}
                                src='https://i.pravatar.cc/150?u=a042581f4e29026024d'
                              />
                            </Dropdown.Trigger>
                            <Dropdown.Menu
                              variant='flat'
                              color='primary'
                              aria-label='User Actions'
                            >
                              <Dropdown.Item
                                textValue='Profile Signed in as'
                                description={userInfo.email}
                                key='profile'
                                css={{ height: '$18' }}
                              >
                                <Link
                                  href='/profile'
                                  component={NextLink}
                                  color='inherit'
                                  css={{ d: 'flex' }}
                                >
                                  Profile Signed in as
                                </Link>
                              </Dropdown.Item>
                              {userInfo.isAdmin && (
                                <Dropdown.Item
                                  textValue='My Dashboard'
                                  key='dashboard'
                                >
                                  <Link
                                    href='/admin/dashboard'
                                    component={NextLink}
                                  >
                                    My Dashboard
                                  </Link>
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item
                                textValue='My Orders'
                                key='orders'
                                withDivider
                              >
                                <Link
                                  href='/order-history'
                                  component={NextLink}
                                >
                                  My Orders
                                </Link>
                              </Dropdown.Item>
                              <Dropdown.Item
                                textValue='My Settings'
                                description='Create a new settings'
                                key='settings'
                              >
                                My Settings
                              </Dropdown.Item>
                              <Dropdown.Item
                                textValue='Analytics'
                                key='analytics'
                              >
                                Analytics
                              </Dropdown.Item>
                              <Dropdown.Item
                                textValue='Help & Feedback'
                                key='help_and_feedback'
                              >
                                Help & Feedback
                              </Dropdown.Item>
                              <Dropdown.Item
                                textValue='Log Out'
                                key='logout'
                                color='error'
                                withDivider
                              >
                                <Typography onClick={logOutClickHandle}>
                                  Log Out
                                </Typography>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : (
                          <Link
                            href='/login'
                            component={NextLink}
                            className={inStyle.loginBtn}
                          >
                            <Person4Sharp color='secondary' />
                            <Typography component='h5' variant='h5'>
                              Login
                            </Typography>
                          </Link>
                        )}
                        <Link href='/cart' component={NextLink}>
                          <Badge
                            showZero
                            color='warning'
                            badgeContent={cartShopItems.length}
                          >
                            <ShoppingCartTwoToneIcon
                              sx={{ color: 'white', fontSize: '25px' }}
                            />
                          </Badge>
                        </Link>

                        <Link href='/favorite' component={NextLink}>
                          <Badge
                            showZero
                            color='warning'
                            badgeContent={cartFavoriteItems.length}
                          >
                            <FavoriteTwoToneIcon
                              sx={{ color: 'white', fontSize: '25px' }}
                            />
                          </Badge>
                        </Link>
                        <IconButton
                          sx={{ marginLeft: '5px' }}
                          edge='start'
                          aria-label='open drawer'
                          onClick={sideBarOpenHandler}
                        >
                          <WidgetsIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={inStyle.navToolBarBtm}>
                    <Stack
                      // width='100%'
                      flex
                      justifyContent='flex-end'
                      direction='row'
                      divider={<Divider orientation='vertical' flexItem />}
                      spacing={1}
                    >
                      <Link href='/' component={NextLink}>
                        <Typography component='h5' variant='h5'>
                          About Us
                        </Typography>
                      </Link>
                      <Link href='/' component={NextLink}>
                        <Typography component='h5' variant='h5'>
                          Buyer Protection
                        </Typography>
                      </Link>
                      <Link href='/' component={NextLink}>
                        <Typography component='h5' variant='h5'>
                          Help Center
                        </Typography>
                      </Link>
                      <Link href='/' component={NextLink}>
                        <Typography component='h5' variant='h5'>
                          Contact As
                        </Typography>
                      </Link>
                    </Stack>
                  </Box>
                </Toolbar>
              </AppBar>
            )}
          </>
        )}

        {admin === 'admin' ? (
          <div className={inStyle.main}>{children}</div>
        ) : (
          <Container className={inStyle.main}>{children}</Container>
        )}

        <Footer cls={inStyle.footer} />
      </ThemeProvider>
    </>
  );
};

export default dynamic(() => Promise.resolve(Layout), { ssr: false });
