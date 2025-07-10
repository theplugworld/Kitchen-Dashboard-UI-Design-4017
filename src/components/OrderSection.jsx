import React from 'react';
import { motion } from 'framer-motion';
import OrderCard from './OrderCard';

const OrderSection = ({ title, orders, userRole, onUpdateStatus, onUpdateETA, onOrderDetails }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800-o40 p-6 rounded-xl shadow-md mb-6"
    >
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-2 col-span-full">
            No orders in this category.
          </p>
        ) : (
          orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              userRole={userRole}
              onUpdateStatus={onUpdateStatus}
              onUpdateETA={onUpdateETA}
              onOrderDetails={onOrderDetails}
              index={index}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default OrderSection;