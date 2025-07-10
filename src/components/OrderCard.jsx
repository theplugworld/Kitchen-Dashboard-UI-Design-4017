import React from 'react';
import { motion } from 'framer-motion';

const OrderCard = ({ order, userRole, onUpdateStatus, onUpdateETA, onOrderDetails, index }) => {
  const timeElapsedMinutes = (Date.now() - order.timestamp.toDate().getTime()) / (1000 * 60);
  const isOverdue = (order.status === 'pending' || order.status === 'preparing') && timeElapsedMinutes > 15;
  const isNewOrder = order.status === 'pending' && !order.seenByKitchen;
  
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

  const completionPercentage = getCompletionPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`order-card ${isOverdue ? 'order-overdue' : ''} ${isNewOrder ? 'new-order-highlight' : ''}`}
      onClick={() => onOrderDetails(order)}
    >
      <div className="order-card-header">
        <h3>Table: {order.tableNumber || 'N/A'} - Order ID: {order.id.substring(0, 6)}...</h3>
        <span className={`status status-${order.status.replace(/_/g, '-')}`}>
          {order.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
        </span>
      </div>
      
      <p className="text-sm text-gray-400">
        Placed by Waiter: {order.orderTakerName ? order.orderTakerName.substring(0, 8) + '...' : 'N/A'}
      </p>
      
      <p className="text-sm text-gray-400">
        Time Placed: {order.timestamp ? order.timestamp.toDate().toLocaleTimeString() : 'N/A'}
      </p>
      
      {isOverdue && (
        <p className="overdue-text text-sm">
          OVERDUE! ({Math.floor(timeElapsedMinutes)} min)
        </p>
      )}
      
      {order.kitchenEstimatedTime && (
        <p className="text-yellow-300 text-sm">
          Your ETA: {order.kitchenEstimatedTime} min
        </p>
      )}
      
      {order.notes && (
        <p className="text-sm text-yellow-200 font-semibold">
          Notes: {order.notes}
        </p>
      )}
      
      <p className="text-sm text-gray-300 mt-2">
        Progress: <span className="font-bold">{completionPercentage}%</span>
      </p>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <ul className="order-item-list">
        {order.orderItems.map((item, itemIndex) => (
          <li key={itemIndex}>
            <span>{item.quantity}x {item.name}</span>
            <span>₱{item.itemTotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      
      {(userRole === 'cook' || userRole === 'manager' || userRole === 'owner') && (
        <div className="order-card-actions">
          {order.status === 'pending' && (
            <button
              className="btn-start-prep"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'preparing');
              }}
            >
              Start Preparing
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button
              className="btn-mark-ready"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'ready_for_pickup');
              }}
            >
              Mark as Ready
            </button>
          )}
          
          {(order.status === 'pending' || order.status === 'preparing') && (
            <button
              className="btn-update-eta"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateETA(order.id, order.tableNumber || 'N/A');
              }}
            >
              Update ETA
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OrderCard;