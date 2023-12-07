import { Navbar } from '../layout/NavBar';
import { SideBar } from '../layout/SideBar';
import {
  useConfirmOrderMutation,
  useGetAllOrdersQuery,
} from '../../order/redux/orderApiSlice';
import Swal from 'sweetalert2';
import React, { useEffect } from 'react';
import io from 'socket.io-client';
import useSocket from '../../../hooks/useSocket';

// import { useState } from "react";

export const Dashboard = () => {
  const socket = useSocket();
  const { data } = useGetAllOrdersQuery();
  const [confirmOrder] = useConfirmOrderMutation();
  // const [notification, setNotification] = useState(null);

  socket?.on('notification', (data) => {
    console.log(data);
    Swal.fire({
      title: 'New Order has been created!',
      text: 'The order has been created .',
      icon: 'success',
    });
  });


  if (!data) {
    return <p>Loading...</p>;
  }
  const handleConfirmOrder = async (orderId) => {
    try {
      const result = await confirmOrder({ params: { _id: orderId } });

      console.log(orderId);
      console.log('Order confirmed successfully', result);
      Swal.fire({
        title: 'Order Confirmed!',
        text: 'The order has been confirmed and is ready for pickup.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Failed to confirm order', error);

      Swal.fire({
        title: 'Error',
        text: 'Failed to confirm order. Please try again later.',
        icon: 'error',
      });
    }
  };
  //   console.log("xx",data.pendingOrders);

  return (
    <div>
      <Navbar />
      <main className="flex flex-col md:flex-row">
        <SideBar />

        <section className="flex-1">
          <div
            id="main"
            className="main-content bg-gray-100 mt-12 md:mt-12 pb-24 md:pb-5"
          >
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Order</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Restaurant</th>
                    <th className="px-6 py-3">Food</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Confirm and pick up</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pendingOrders?.map((product) => (
                    <React.Fragment key={product.id}>
                      {product.food.map((f, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                          }
                        >
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">
                            {product.user.firstName}
                          </td>

                          <td className="px-6 py-3">
                            {f.restaurant && f.restaurant.address}
                          </td>
                          <td className="px-6 py-3">{f.name}</td>
                          <td className="px-6 py-3">{index + 2}</td>
                          <td className="px-6 py-3">{f.price}</td>
                          {/* <td className="px-6 py-3">{product.price}</td> */}

                          <td className="px-6 py-3">
                            <button
                              onClick={() => handleConfirmOrder(product._id)}
                              href="#"
                              className="font-medium text-orange-600 dark:text-orange-500 hover:underline"
                            >
                              confirm and pickup
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
