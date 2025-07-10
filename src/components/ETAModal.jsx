import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ETAModal = ({ show, orderId, tableNumber, onSave, onClose }) => {
  const [etaMinutes, setETAMinutes] = useState('');

  const handleSave = () => {
    const minutes = parseInt(etaMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      alert('Please enter a valid estimated time in minutes.');
      return;
    }
    onSave(orderId, minutes);
    setETAMinutes('');
  };

  const handleClose = () => {
    setETAMinutes('');
    onClose();
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
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Update Order ETA</h2>
            <p className="text-center text-gray-300 mb-4">
              Order ID: {orderId.substring(0, 8)}... (Table: {tableNumber})
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-300 font-semibold mb-2">
                Estimated Time to Ready (minutes):
              </label>
              <input
                type="number"
                value={etaMinutes}
                onChange={(e) => setETAMinutes(e.target.value)}
                min="1"
                placeholder="e.g., 10"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Update ETA
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ETAModal;