import * as React from 'react';

// import  {useEffect} from 'react';
import { useEffect } from 'react';

import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import {
  decreaseCart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
} from '../redux/cartSlice';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import Swal from 'sweetalert2'; // Import the main SweetAlert2 module
import 'sweetalert2/dist/sweetalert2.min.css'; // Import the CSS file
import 'sweetalert2/dist/sweetalert2.min.js'; // Import the JavaScript file
import { selectCurrentUserId } from '../../auth/redux/authSelectors';
import useSocket from '../../../hooks/useSocket';

export default function SwipeableTemporaryDrawer() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const userId = useSelector(selectCurrentUserId);
  console.log(userId);
  const socket = useSocket();

  const handleAlert = async () => {
    try {
      const orderData = {
        user: userId,
        foods: cart.cartItems,
      };
      socket.emit('newOrder', orderData);

      dispatch(clearCart());

      Swal.fire({
        title: 'Order Placed!',
        text: 'Thank you for your order.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to place the order. Please try again later.',
        icon: 'error',
      });
    }
  };
  socket?.on('notification', (data) => {
    console.log(data);
  });
  useEffect(() => {
    dispatch(subTotal());
  }, [cart, dispatch]);

  const [state, setState] = React.useState({
    right: false,
    // top: false,
    // left: false,
    // bottom: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div className="container mx-auto ">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
              <th scope="col" className="px-6 py-3">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cart.cartItems) &&
              cart.cartItems.map((cartItem) => (
                <tr
                  key={cartItem.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {cartItem.name}
                  </th>
                  <td className="px-6 py-4">${cartItem.price}</td>
                  <td className="flex px-6 py-4">
                    <button
                      onClick={() => handleDecreaseCart(cartItem)}
                      className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      -
                    </button>
                    <span className="text-2xl">{cartItem.quantity}</span>
                    <button
                      onClick={() => handleAddToCart(cartItem)}
                      className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      +
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    ${cartItem.price * cartItem.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleRemoveFromCart(cartItem)}>
                      <i class="fas fa-trash text-red-500	"></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <button onClick={() => handleClearCart()} type="button" class=" mt-3 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Clear Cart</button> */}

      <div className="flex justify-between	">
        <button
          onClick={() => handleClearCart()}
          type="button"
          class=" mt-3  text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Clear Cart
        </button>
        <div className="mt-3">
          <span className="mt-3 text-xl  text-green-500">SubTotal</span>{' '}
          <span className="text-xl  text-red-500 mx-3 font-bold	">
            ${cart.cartTotalAmount}
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => handleAlert()}
          type="button"
          class=" mt-6 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          CheckOut
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* {['left', 'right', 'top', 'bottom'].map((anchor) => ( */}
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <i className="fas fa-shopping-cart text-3xl "></i>
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
