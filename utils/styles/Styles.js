import { makeStyles } from '@mui/styles';
import theme from '@/utils/styles/theme';

const useStyles = makeStyles(() => ({
  // NavBar Style Start /Layout.js
  navbar: {
    padding: '0 80px',
  },
  navToolBar: {
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  navToolBarTop: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .right-nav': {
      display: 'flex',
      alignItems: 'center',
      gap: 15,
    },
    '& .right-nav p': {
      color: 'black',
      fontSize: 18,
      fontWeight: 600,
      TextDecoder: 'none !important',
    },
  },

  logo: {
    [theme.breakpoints.down('md')]: {
      width: '100px',
      height: '50px',
    },
    // [theme.breakpoints.down('sm')]: {
    //   width: '100px',
    //   height: '50px',
    // },
  },

  searchSection: {
    display: 'none',

    [theme.breakpoints.up('md')]: {
      // width: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  navToolBarBtm: {
    display: 'none',

    [theme.breakpoints.up('md')]: {
      width: '130%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '40px',
      backgroundColor: '#FFF',

      // padding: '3px 100px',
      // alignItems: 'right',
      // justifyContent: 'flex-end',
      // justifyContent: 'space-between',
    },
  },

  searchForm: {
    border: '1px solid white',
    backgroundColor: '#f2fff2',
    borderRadius: 5,
    height: '45px',
    width: '90%',
    '&:hover': {
      border: 0,
      outline: 0,
    },
    '&:focus': {
      border: 0,
      outline: 0,
    },
  },

  darkModeIcon: {
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(0px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(25px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff'
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#aab4be',
          // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#003892',
      // backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
    },
  },

  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    // '& :hover:last-child': {
    //   color: '#1976D2',
    //   transitionDuration: 300,
    // },
  },

  btnUserInfo: {
    color: '#111 !important',
    fontWeight: '600 !important',
  },

  AvatarUser: {
    '& div span:first-child': {
      color: '#111 !important',
      fontSize: 16,
      fontWeight: 'bold',
    },
    '& div span:last-child': {
      color: '#bbb !important',
      fontSize: 12,
      fontWeight: 'bold',
    },
  },

  // NavBar Style End

  //   *******************************************************

  // Main Style Start /Layout.js
  main: {
    minHeight: '90vh',
  },
  carouselBox: {
    // marginTop: 10,
    position: 'absolute',
    left: 0,
    top: '140px',
    width: '100% !important',
    height: '300px !important',
    '&a': {
      width: '100% !important',
      height: '300px !important',
    },
    '& div': {
      width: '100% !important',
      height: '300px !important',
      '& div img': {
        width: '100% !important',
        height: '300px !important',
      },
    },
  },
  // Main Style Start

  //   ********************************************************

  // search Style Start
  mt1Grid: {
    marginTop: '1rem !important',
  },

  resultSearch: {
    padding: '10px 40px',
    '& svg': {
      margin: '0 !important',
      padding: '0 !important',
    },
  },
  // search Style Start

  //   ********************************************************

  // section Style Start /product/[slug].js #CEE4FE

  BreadcrumbSection: {
    backgroundColor: '#CEE4FE !important',
    marginTop: 20,
    padding: '0px 20px',
    display: 'flex',
    alignItems: 'center',
  },
  Breadcrumb: {
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    '& li': {
      padding: 0,
      margin: '0px 3px',
    },
  },

  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  ShopBtn: {
    width: '90% !important',
    margin: '10px auto',
    justifyContent: 'space-between !important',
    gap: 10,
    padding: '0 !important',
    '& button': {
      flex: 1,
    },
  },
  // section Style Start

  //   ********************************************************

  // Cart Style Start /index.js

  BoxcartContainerWrapper: {
    margin: '0 !important',
    marginTop: '350px !important',
    width: '100%',
    // padding: '25px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    gap: '30px',
    flexDirection: 'column',
  },

  BoxcartContainer: {
    margin: '0 !important',
    width: '100%',
    // backgroundColor: '#FF0',
    padding: '25px 15px',
    borderRadius: '8px',
  },

  cartContainer: {
    margin: '0 !important',
    width: '100%',
  },

  GridcartItem: {
    padding: 10,
    maxWidth: 230,
    // minWidth: 140,
    // maxHeight: 500,
    // minHeight: '100%',
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  cartItem: {
    // boxShadow: '0px 0px 5px 2px rgba(37, 139, 234,.2) ',
    border: '1px solid rgba(37, 139, 234,.3)',
    '&:hover': {
      boxShadow: '0px 0px 5px 3px rgba(37, 139, 234,.35) ',
    },
    padding: 10,
    // maxWidth: 230,
    // minWidth: 140,
    // maxHeight: 500,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    '& button > img': {
      objectFit: 'fill',
    },
  },

  cardMedia: {
    border: '1px solid rgba(25, 118, 210,0.3)',
    borderRadius: 5,
  },

  cardContent: {
    padding: 0,
    marginBottom: 7,
    borderBottom: '1px solid #1976D2',
    '& p': {
      color: 'gray',
      fontSize: 14,
    },
  },

  cardContentMarck: {
    padding: 0,
    '& p:first-child': {
      color: 'gray',
      fontSize: 13,
    },
    '& p:last-child': {
      textAlign: 'center',
      fontSize: 15,
    },
    '& :hover:last-child': {
      color: '#1976D2',
      transitionDuration: 300,
    },
  },
  cardContentFooter: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',

    '& .footerBox-1 p': {
      fontSize: 12,
      color: 'gray',
    },
    '& .footerBox-1 span': {
      fontSize: 20,
    },

    '& .footerBox-2': {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    '& .footerBox-2 p': {
      fontSize: 20,
      // color: '#1976D2',
    },
    '& .footerBox-2 > div > svg': {
      cursor: 'pointer',

      '&:hover': {
        color: '#0a4687',
      },
    },
  },

  // Cart Style Start

  //   ********************************************************

  // Shopping Cart Items Style Start

  nbItem: {
    border: '1px solid black',
    padding: 4,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '70%',
    margin: 'auto',
    '& button': {
      border: '0',
      height: '100%',
      margin: 0,
      padding: 0,
    },
  },
  // Shopping Cart Items Style Start

  //   ********************************************************

  // Login Style Start

  login: {
    position: 'relative',
    zIndex: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '90vh',
  },
  // loginWrapper: {
  //   position: 'relative',
  //   // zIndex: 0,
  //   // width: '100wh !important',
  //   height: '90vh',
  // },

  layoutContent: {
    width: '100% !important',

    '& input': {
      // margin: '0 !important',
      paddingTop: '18px',
      paddingRight: '10px',
      paddingBottom: '0px',
      paddingLeft: '12px',
    },
    '& li': {
      margin: 0,
      padding: 8,
    },
  },
  // Overlay: {
  //   position: 'absolute',

  //   background: `url(/images/login/img1.jpg) center center/cover no-repeat`,
  //   width: '100wh !important',
  //   height: '100%',
  //   left: 0,
  //   top: 0,

  //   opacity: 0.7,
  //   zIndex: -1,
  // },

  Lginform: {
    background: `url(/images/login/img1.jpg) center center/cover no-repeat`,
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    height: '40vh !important',
    maxWidth: 900,
    margin: '0 auto',
    borderRadius: '10px',
  },
  Registerform: {
    position: 'relative',
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    height: '70vh !important',
    maxWidth: 900,
    margin: '0 auto',
    background: `url(/images/login/img1.jpg) rgba(255, 255, 255, 0.5) center center/cover no-repeat`,
    borderRadius: '10px',
  },

  gridItemL: {
    borderStartStartRadius: 10,
    // borderEndStartRadius: 10,
  },

  gridItemR: {
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    borderEndEndRadius: 10,
    padding: '10px 28px !important',
  },

  loginImg: {
    animation: '$myAnim 25s ease 0s infinite normal forwards',
  },

  '@keyframes myAnim': {
    '0% , 100%': {
      transform: 'translateY(0)',
    },

    '10%, 30%, 50%, 70%': {
      transform: 'translateY(-8px)',
    },

    '20%, 40%, 60%': {
      transform: 'translateY(8px)',
    },

    '80%': {
      transform: 'translateY(6.4px)',
    },

    '90%': {
      transform: 'translateY(-6.4px)',
    },
  },

  // Login Style End

  //   ********************************************************

  // Shipping Style Start

  Shipping: {
    margin: '30px 0 0',
  },

  ShippingLayoutContent: {
    width: '100% !important',

    '& input': {
      paddingTop: '18px',
      paddingRight: '10px',
      paddingBottom: '0px',
      paddingLeft: '12px',
    },
    '& li': {
      margin: 0,
      padding: 8,
    },
  },
  ShippingForm: {
    display: 'flex !important',
    flexDirection: 'column',
    padding: 15,
    // maxWidth: 900,
    // margin: '20px auto',
  },
  ShippingGridItemL: {
    borderStartStartRadius: 10,
  },

  // Check Style End

  //   ********************************************************

  // Payment step Style Start '#c9d7e5'

  paymentForm: {
    display: 'flex !important',
    flexDirection: 'column',
    padding: 15,
  },
  paymentBtn: {
    display: 'flex !important',
    gap: 15,
    width: '100%',
  },

  paypalBtn: {
    width: '100%',
  },

  // Payment step Style End

  //   ********************************************************

  // Place Order Style Start

  placeOrderHeaderCart: {
    justifyContent: 'space-between !important',
    '& a': {
      backgroundColor: '#cee4fe',
      padding: '1px 15px',
      color: '#444',
      borderStartStartRadius: 10,
    },
  },

  // Place Order Style End

  //   ********************************************************

  //  Order Style Start

  delivered: {
    backgroundColor: '#cee4fe',
    margin: 'auto ',
    padding: '5px 15px',
    color: '#444 ',
    borderStartStartRadius: 10,
    width: '85% ',
  },
  notDelivered: {
    backgroundColor: '#fcbdbd ',
    margin: 'auto ',
    padding: '5px 15px',
    color: '#444 ',
    borderStartStartRadius: 10,
    width: '85% ',
  },
  paid: {
    backgroundColor: '#cee4fe',
    margin: 'auto ',
    padding: '5px 15px',
    color: '#444 ',
    borderStartStartRadius: 10,
    width: '85% ',
  },
  notPaid: {
    backgroundColor: '#fcbdbd ',
    margin: 'auto ',
    padding: '5px 15px',
    color: '#444 ',
    borderStartStartRadius: 10,
    width: '85% ',
  },

  //  Order Style End

  //   *******************************************************

  // Admin Dashboard / SideBar Style Start

  sidebar: {
    flex: 1,
    borderRight: '0.5px solid rgb(230, 227, 227)',
    minHeight: '100%',
    backgroundColor: 'white',

    '& .top': {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& .logo': {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#6439ff',
      },
    },

    hr: {
      height: 0,
      border: '0.5px solid rgb(230, 227, 227)',
    },

    '& .center': {
      paddingLeft: '10px',

      '& ul': {
        listStyle: 'none',
        margin: 0,
        padding: 0,

        '& .title': {
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#999',
          marginTop: '15px',
          marginBottom: '5px',
        },

        '& li': {
          display: 'flex',
          alignItems: 'center',
          padding: '5px',
          cursor: 'pointer',

          ' &:hover': {
            backgroundColor: '#d3cbf9 !important',
          },

          '& .icon': {
            fontSize: '18px',
            color: '#7451f8',
          },

          '& span': {
            fontSize: '13px',
            fontWeight: '600',
            color: '#888',
            marginLeft: '10px',
          },
        },
      },
    },

    '& .bottom': {
      display: 'flex',
      alignItems: 'center',
      margin: '10px',

      // '& .colorOption': {
      //   width: '20px',
      //   height: '20px',
      //   borderRadius: '5px',
      //   border: '1px solid #7451f8',
      //   cursor: 'pointer',
      //   margin: '5px',

      //   '&:nth-child(1)': {
      //     backgroundColor: 'whitesmoke',
      //   },
      //   '&:nth-child(2)': {
      //     backgroundColor: '#333',
      //   },
      //   '&:nth-child(3)': {
      //     backgroundColor: 'darkblue',
      //   },
      // },
    },
  },

  dashboardNavbar: {
    padding: 15,
    backgroundColor: 'white',
    borderBottom: '0.5px solid rgb(231, 228, 228)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#555',

    '& .dashboardWrapper': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      // margin: '10px !important',

      '& .dashboardSearch': {
        display: 'flex',
        alignItems: 'center',
        // marginTop: '15px !important',

        '& input': {
          border: 'none !important',
          outline: 'none !important',
          background: 'transparent !important',

          '&::placeholder': {
            fontSize: '12px',
          },
        },
      },

      '& .dashboardItems': {
        display: 'flex',
        alignItems: 'center',

        '& .dashboardItem': {
          display: 'flex',
          alignItems: 'center',
          marginRight: '20px',
          position: 'relative',

          '& p': {
            marginLeft: '5px',
          },
          '& .dashboardIcon': {
            fontSize: '25px',
          },
        },
      },
    },
  },

  // Admin Dashboard / SideBar Style End

  //   *********************************************************

  // footer Style Start /Layout.js

  footer: {
    textAlign: 'center',
    marginTop: 15,
    padding: '10px 60px',
    background: '#FFF',
  },

  footerLink: {
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    paddingBottom: '10px',
  },

  footerLinkSocial: {
    marginRight: '9px',
    marginBottom: '5px',
    color: '#1976D2',
    fontWeight: 800,
    fontSize: '30px',
    '&:hover': {
      // fontSize : '32px',
    },
  },
  footerPayContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '5px 0',

    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },

  footerPay: {
    border: '1px solid #088178',
    borderRadius: '6px',
    width: '46%',

    [theme.breakpoints.down('xs')]: {
      width: '60%',
      margin: '10px 0',
    },
  },

  footerPayCenter: {
    width: '80%',
    '& img': {
      width: '100%',
    },
  },

  footerSubTitle: {
    fontWeight: 700,
    padding: '05px 0 15px 0',
    fontSize: 15,
    width: '100%',
  },

  footerSubTitleText: {
    padding: '05px 0 15px 0',
    fontSize: 15,
    width: '100%',
  },
  footerCopyright: {
    fontWeight: 700,
    padding: '10px 10px',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',

    // fontStyle: 'oblique',
  },

  footerScetion: {
    marginTop: '20px',
    padding: '40px 40px',
    borderTop: '1px solid rgba(0, 0, 0, .085)',

    [theme.breakpoints.down('sm')]: {
      padding: '20px 20px',
      paddingBottom: '40px',
    },
  },

  // footer Style End

  //   ********************************************************

  // N Style Start

  // N Style End

  //   ********************************************************
}));
export default useStyles;
