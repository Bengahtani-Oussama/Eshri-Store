import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '@/utils/store/Store';
import axios from 'axios';
import { getError } from '@/utils/error/error';
import Layout from '@/component/layout/Layout';
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
  CardContent,
  CardActions,
} from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '@/utils/styles/Styles';
import { format, parseISO } from 'date-fns';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/NavBar';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };

    default:
      state;
  }
}

const AdminDashboard = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { darkMode, userInfo } = state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const inStyle = useStyles();

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    // <Layout title='Order Details History'>

    // </Layout>
    <Layout title='Admin Dashboard' admin='admin'>
      <Grid container>
        <Grid item md={2} xs={1}>
          <Sidebar />
        </Grid>
        <Grid item md={10} xs={11}>
          <List sx={{ padding: 0, margin: 0 }}>
            <ListItem sx={{ padding: 0, margin: 0 }}>
              <Navbar />
            </ListItem>
            <ListItem>
              <Grid container spacing={1}>
                <Grid className='users' item md={3} xs={6}>
                  <Card raised>
                    <CardContent>
                      <h1>{summary.usersCount}</h1>
                      <Typography>Users</Typography>
                    </CardContent>
                    <CardActions>
                      <Link href='/admin/Users' component={NextLink}>
                        View Users
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid className='Sales' item md={3} xs={6}>
                  <Card raised>
                    <CardContent>
                      <h1>${summary.orderPrice}</h1>
                      <Typography>Sales</Typography>
                    </CardContent>
                    <CardActions>
                      <Link href='/admin/orders' component={NextLink}>
                        View Sales
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid className='ordersCount' item md={3} xs={6}>
                  <Card raised>
                    <CardContent>
                      <h1>{summary.ordersCount}</h1>
                      <Typography>orders</Typography>
                    </CardContent>
                    <CardActions>
                      <Link href='/admin/orders' component={NextLink}>
                        View Orders
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid className='products' item md={3} xs={6}>
                  <Card raised>
                    <CardContent>
                      <h1>{summary.productsCount}</h1>
                      <Typography>products</Typography>
                    </CardContent>
                    <CardActions>
                      <Link href='/admin/products' component={NextLink}>
                        View products
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Bar
                data={{
                  labels: summary.salesData.map((e) => e._id),
                  datasets: [
                    {
                      label: 'Sales',
                      backgroundColor: '#3588f2',
                      data: summary.salesData.map((e) => e.totalSales),
                    },
                  ],
                }}
                options={{
                  legend: { display: true, position: 'right' },
                }}
              ></Bar>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
