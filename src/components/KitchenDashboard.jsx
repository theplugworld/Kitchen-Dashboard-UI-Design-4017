import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Header from './Header';
import FilterSortControls from './FilterSortControls';
import OrderSection from './OrderSection';
import MessageModal from './MessageModal';
import ConfirmationModal from './ConfirmationModal';
import ETAModal from './ETAModal';
import OrderDetailsModal from './OrderDetailsModal';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../hooks/useAuth';

const { FiMenu, FiX } = FiIcons;

const KitchenDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [sortBy, setSortBy] = useState('timestamp_desc');
  const [messageModal, setMessageModal] = useState({ show: false, message: '', isSuccess: true });
  const [confirmationModal, setConfirmationModal] = useState({ show: false, title: '', message: '', callback: null });
  const [etaModal, setETAModal] = useState({ show: false, orderId: '', tableNumber: '' });
  const [orderDetailsModal, setOrderDetailsModal] = useState({ show: false, order: null });
  
  const { user, userRole, employeeDisplayName, logout } = useAuth(['cook', 'manager', 'owner']);
  const { allFoodOrders, updateOrderStatus, updateOrderETA } = useFirebase();

  const showMessage = (message, isSuccess = true) => {
    setMessageModal({ show: true, message, isSuccess });
  };

  const showConfirmation = (title, message, callback) => {
    setConfirmationModal({ show: true, title, message, callback });
  };

  const openETAModal = (orderId, tableNumber) => {
    setETAModal({ show: true, orderId, tableNumber });
  };

  const openOrderDetails = (order) => {
    setOrderDetailsModal({ show: true, order });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, user.uid);
      showMessage(`Order ${orderId.substring(0, 6)}... status updated to "${newStatus.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}"!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      showMessage('Failed to update order status. Please try again.', false);
    }
  };

  const handleUpdateETA = async (orderId, etaMinutes) => {
    try {
      await updateOrderETA(orderId, etaMinutes);
      showMessage(`ETA for order ${orderId.substring(0, 8)}... updated to ${etaMinutes} minutes.`);
      setETAModal({ show: false, orderId: '', tableNumber: '' });
    } catch (error) {
      console.error('Error updating ETA:', error);
      showMessage('Failed to update ETA. Please try again.', false);
    }
  };

  const applyFiltersAndSort = () => {
    let filteredOrders = [...allFoodOrders];

    if (filterOverdue) {
      filteredOrders = filteredOrders.filter(order => {
        const timeElapsedMinutes = (Date.now() - order.timestamp.toDate().getTime()) / (1000 * 60);
        return (order.status === 'pending' || order.status === 'preparing') && timeElapsedMinutes > 15;
      });
    }

    filteredOrders.sort((a, b) => {
      if (sortBy === 'timestamp_desc') {
        return b.timestamp.toDate() - a.timestamp.toDate();
      } else if (sortBy === 'timestamp_asc') {
        return a.timestamp.toDate() - b.timestamp.toDate();
      } else if (sortBy === 'eta_asc') {
        const etaA = a.kitchenEstimatedTime || Infinity;
        const etaB = b.kitchenEstimatedTime || Infinity;
        return etaA - etaB;
      }
      return 0;
    });

    return {
      newOrders: filteredOrders.filter(order => order.status === 'pending'),
      inProgressOrders: filteredOrders.filter(order => order.status === 'preparing'),
      readyOrders: filteredOrders.filter(order => order.status === 'ready_for_pickup')
    };
  };

  const { newOrders, inProgressOrders, readyOrders } = applyFiltersAndSort();

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter relative">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('https://placehold.co/1200x800/000000/00FF00?text=THE+PLUG+NEON')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          employeeDisplayName={employeeDisplayName}
          userRole={userRole}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={logout}
        />

        <main className="flex-grow container mx-auto p-6 md:p-8">
          {/* Page Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900-o40 rounded-xl shadow-lg p-8 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kitchen Dashboard</h1>
            <p className="text-lg text-gray-300">
              Manage food orders and update their preparation status.
            </p>
          </motion.div>

          {/* Filter and Sort Controls */}
          <FilterSortControls 
            filterOverdue={filterOverdue}
            setFilterOverdue={setFilterOverdue}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Order Sections */}
          <OrderSection
            title="New Food Orders"
            orders={newOrders}
            userRole={userRole}
            onUpdateStatus={(orderId, newStatus) => 
              showConfirmation(
                `Confirm ${newStatus === 'preparing' ? 'Start Preparing' : 'Mark as Ready'}`,
                `Are you sure you want to ${newStatus === 'preparing' ? 'start preparing' : 'mark as ready'} order ${orderId.substring(0, 6)}...?`,
                () => handleUpdateStatus(orderId, newStatus)
              )
            }
            onUpdateETA={openETAModal}
            onOrderDetails={openOrderDetails}
          />

          <OrderSection
            title="Food Orders In Progress"
            orders={inProgressOrders}
            userRole={userRole}
            onUpdateStatus={(orderId, newStatus) => 
              showConfirmation(
                `Confirm ${newStatus === 'preparing' ? 'Start Preparing' : 'Mark as Ready'}`,
                `Are you sure you want to ${newStatus === 'preparing' ? 'start preparing' : 'mark as ready'} order ${orderId.substring(0, 6)}...?`,
                () => handleUpdateStatus(orderId, newStatus)
              )
            }
            onUpdateETA={openETAModal}
            onOrderDetails={openOrderDetails}
          />

          <OrderSection
            title="Food Orders Ready for Pickup"
            orders={readyOrders}
            userRole={userRole}
            onUpdateStatus={(orderId, newStatus) => 
              showConfirmation(
                `Confirm ${newStatus === 'preparing' ? 'Start Preparing' : 'Mark as Ready'}`,
                `Are you sure you want to ${newStatus === 'preparing' ? 'start preparing' : 'mark as ready'} order ${orderId.substring(0, 6)}...?`,
                () => handleUpdateStatus(orderId, newStatus)
              )
            }
            onUpdateETA={openETAModal}
            onOrderDetails={openOrderDetails}
          />
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-6 px-6 md:px-12 mt-8 rounded-t-xl mx-4 md:mx-auto max-w-7xl w-full">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 The Plug. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <MessageModal 
        show={messageModal.show}
        message={messageModal.message}
        isSuccess={messageModal.isSuccess}
        onClose={() => setMessageModal({ show: false, message: '', isSuccess: true })}
      />

      <ConfirmationModal 
        show={confirmationModal.show}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={() => {
          if (confirmationModal.callback) confirmationModal.callback();
          setConfirmationModal({ show: false, title: '', message: '', callback: null });
        }}
        onCancel={() => setConfirmationModal({ show: false, title: '', message: '', callback: null })}
      />

      <ETAModal 
        show={etaModal.show}
        orderId={etaModal.orderId}
        tableNumber={etaModal.tableNumber}
        onSave={handleUpdateETA}
        onClose={() => setETAModal({ show: false, orderId: '', tableNumber: '' })}
      />

      <OrderDetailsModal 
        show={orderDetailsModal.show}
        order={orderDetailsModal.order}
        onClose={() => setOrderDetailsModal({ show: false, order: null })}
      />
    </div>
  );
};

export default KitchenDashboard;