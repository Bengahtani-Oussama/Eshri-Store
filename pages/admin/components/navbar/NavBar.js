import React, { useContext } from 'react';
import {
  Badge,
  Link,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import MarkUnreadChatAltTwoToneIcon from '@mui/icons-material/MarkUnreadChatAltTwoTone';
import { Dropdown, User } from '@nextui-org/react';

import useStyles from '@/utils/styles/Styles';
import NextLink from 'next/link';
import { Store } from '@/utils/store/Store';
import dynamic from 'next/dynamic';

const Navbar = () => {
  const inStyle = useStyles();

  const { state } = useContext(Store);
  const { userInfo } = state;
 

  return (
    <div className={inStyle.dashboardNavbar}>
      <div className='dashboardWrapper'>
        <div className='dashboardSearch'>
          <TextField
            label='Search'
            id='outlined-size-small'
            placeholder='Search ...'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className='dashboardItems'>
          <div className='dashboardItem'>
            <LanguageOutlinedIcon className='dashboardIcon' />
            <Typography>English</Typography>
          </div>
          <div className='dashboardItem'>
            <Link href='#' component={NextLink}>
              <Badge showZero color='warning' badgeContent={3}>
                <NotificationsActiveTwoToneIcon className='dashboardIcon' />
              </Badge>
            </Link>
          </div>
          <div className='dashboardItem'>
            <Link href='#' component={NextLink}>
              <Badge showZero color='warning' badgeContent={1}>
                <MarkUnreadChatAltTwoToneIcon className='dashboardIcon' />
              </Badge>
            </Link>
          </div>
          <div className='dashboardItem'>
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
                  // name={userInfo.name}
                  // description={`@_${userInfo.name}`}
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
                    color='#333'
                    css={{ d: 'flex' }}
                  >
                    Profile Signed in as
                  </Link>
                </Dropdown.Item>
                {userInfo.isAdmin && (
                  <Dropdown.Item textValue='My Dashboard' key='dashboard'>
                    <Link
                      color='#333'
                      href='/admin/dashboard'
                      component={NextLink}
                    >
                      My Dashboard
                    </Link>
                  </Dropdown.Item>
                )}
                <Dropdown.Item textValue='My Orders' key='orders' withDivider>
                  <Link color='#333' href='/order-history' component={NextLink}>
                    All Orders
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item
                  textValue='My Settings'
                  description='Create a new settings'
                  key='settings'
                >
                  My Settings
                </Dropdown.Item>
                <Dropdown.Item textValue='Analytics' key='analytics'>
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
                  {' '}
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
// <Typography onClick={logOutClickHandle}> Log Out  </Typography>
