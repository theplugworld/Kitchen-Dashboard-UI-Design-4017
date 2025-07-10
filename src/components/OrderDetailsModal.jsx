import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailsModal = ({ show, order, onClose }) => {
  if (!order) return null;

  const getCompletionPercentage = () => {
    switch (order.status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 50;
      case 'ready_for_pickup':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Order Details</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Order ID:</span>
                <span className="text-white">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Table Number:</span>
                <span className="text-white">{order.tableNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Status:</span>
                <span className="text-white">{order.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Progress:</span>
                <span className="text-white">{getCompletionPercentage()}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Placed By:</span>
                <span className="text-white">{order.orderTakerName || (order.bartenderId ? order.bartenderId.substring(0, 8) + '...' : 'N/A')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Time Placed:</span>
                <span className="text-white">{order.timestamp ? order.timestamp.toDate().toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Preparation Started:</span>
                <span className="text-white">{order.timeStartedPreparing ? order.timeStartedPreparing.toDate().toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Ready Time:</span>
                <span className="text-white">{order.timeReady ? order.timeReady.toDate().toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Kitchen ETA:</span>
                <span className="text-white">{order.kitchenEstimatedTime ? `${order.kitchenEstimatedTime} minutes` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-semibold">Total Amount:</span>
                <span className="text-green-400 font-bold">₱{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Items:</h3>
              <ul className="space-y-1 text-gray-200">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₱{item.price ? item.price.toFixed(2) : '0.00'} each</span>
                    </li>
                  ))
                ) : (
                  <li>No items listed.</li>
                )}
              </ul>
            </div>
            
            <div className="mb-6">
              <span className="text-gray-300 font-semibold">Special Notes:</span>
              <p className="text-yellow-300 italic mt-1">{order.notes || 'None'}</p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;