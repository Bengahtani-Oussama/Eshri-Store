// import './sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsSystemDaydreamOutlinedIcon from '@mui/icons-material/SettingsSystemDaydreamOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import useStyles from '@/utils/styles/Styles';
import dynamic from 'next/dynamic';

const Sidebar = () => {
  const inStyle = useStyles();

  return (
    <div className={inStyle.sidebar}>
      <div className='top'>
        <Link href='/' component={NextLink} style={{ textDecoration: 'none' }}>
          <span className='logo'>EshriStore</span>
        </Link>
      </div>
      <hr className={inStyle.hr} />
      <div className='center'>
        <ul>
          <p className='title'>MAIN</p>
          <Link
            href='/admin/dashboard'
            component={NextLink}
            style={{ textDecoration: 'none' }}
          >
            <li>
              <DashboardIcon className='icon' />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className='title'>LISTS</p>
          <Link
            href='/admin/users'
            component={NextLink}
            style={{ textDecoration: 'none' }}
          >
            <li>
              <PersonOutlineIcon className='icon' />
              <span>Users</span>
            </li>
          </Link>
          <Link
            href='/admin/products'
            component={NextLink}
            style={{ textDecoration: 'none' }}
          >
            <li>
              <StoreIcon className='icon' />
              <span>Products</span>
            </li>
          </Link>
          <Link
            href='/admin/orders'
            component={NextLink}
            style={{ textDecoration: 'none' }}
          >
            <li>
              <CreditCardIcon className='icon' />
              <span>Orders</span>
            </li>
          </Link>
          <li>
            <LocalShippingIcon className='icon' />
            <span>Delivery</span>
          </li>
          <p className='title'>USEFUL</p>
          <li>
            <InsertChartIcon className='icon' />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className='icon' />
            <span>Notifications</span>
          </li>
          <p className='title'>SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className='icon' />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className='icon' />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className='icon' />
            <span>Settings</span>
          </li>
          <p className='title'>USER</p>
          <li>
            <AccountCircleOutlinedIcon className='icon' />
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppIcon className='icon' />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Sidebar), { ssr: false });
