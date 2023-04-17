import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  // DARK_MODE
  // darkMode: false,
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,

  // SHOPPING_&_FAVORITE_CART_ITEMS
  cart: {
    cartShopItems: Cookies.get('cartShopItems')
      ? JSON.parse(Cookies.get('cartShopItems'))
      : [],
    cartFavoriteItems: Cookies.get('cartFavoriteItems')
      ? JSON.parse(Cookies.get('cartFavoriteItems'))
      : [],
    // SHIPPING_ADDRESS
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},

    // PAYMENT_METHOD
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },

  // USER_LOGIN_INFO
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };

    // ********  SHOP_ITEM  ********
    case 'CART_ADD_SHOP_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartShopItems.find(
        (item) => item._id === newItem._id
      );
      const cartShopItems = existItem
        ? state.cart.cartShopItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartShopItems, newItem];
      Cookies.set('cartShopItems', JSON.stringify(cartShopItems));
      return { ...state, cart: { ...state.cart, cartShopItems } };
    }

    case 'CART_DELETE_SHOP_ITEM': {
      const cartShopItems = state.cart.cartShopItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookies.set('cartShopItems', JSON.stringify(cartShopItems));
      return { ...state, cart: { ...state.cart, cartShopItems } };
    }

    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartShopItems: [] } };

    // ********  FAVORITE_ITEM  ********
    case 'CART_ADD_FAVORITE_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartFavoriteItems.find(
        (item) => item._id === newItem._id
      );
      const cartFavoriteItems = existItem
        ? state.cart.cartFavoriteItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartFavoriteItems, newItem];
      Cookies.set('cartFavoriteItems', JSON.stringify(cartFavoriteItems));
      return { ...state, cart: { ...state.cart, cartFavoriteItems } };
    }
    case 'CART_DELETE_FAVORITE_ITEM': {
      const cartFavoriteItems = state.cart.cartFavoriteItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookies.set('cartFavoriteItems', JSON.stringify(cartFavoriteItems));
      return { ...state, cart: { ...state.cart, cartFavoriteItems } };
    }

    // ********  SHIPPING_ADDRESS  ********
    case 'SAVE_SHIPPING_ADDRESS': {
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }

    // ********  SAVE_PAYMENT_METHOD  ********
    case 'SAVE_PAYMENT_METHOD': {
      return { ...state, paymentMethod: action.payload };
    }

    // ********  USER_LOGIN_INFO  ********
    case 'USER_LOGIN': {
      return { ...state, userInfo: action.payload };
    }
    case 'USER_LOGOUT': {
      return {
        ...state,
        userInfo: null,
        cart: {
          cartShopItems: [],
          cartFavoriteItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
