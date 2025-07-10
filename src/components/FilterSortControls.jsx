import React from 'react';
import { motion } from 'framer-motion';

const FilterSortControls = ({ filterOverdue, setFilterOverdue, sortBy, setSortBy }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="filter-sort-controls"
    >
      <div className="flex items-center">
        <label htmlFor="filterOverdue" className="text-gray-300 font-semibold mr-2">
          Show Overdue Only:
        </label>
        <input
          type="checkbox"
          id="filterOverdue"
          checked={filterOverdue}
          onChange={(e) => setFilterOverdue(e.target.checked)}
          className="w-4 h-4"
        />
      </div>
      
      <div className="flex items-center">
        <label htmlFor="sortBy" className="text-gray-300 font-semibold mr-2">
          Sort By:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
        >
          <option value="timestamp_desc">Time Placed (Newest First)</option>
          <option value="timestamp_asc">Time Placed (Oldest First)</option>
          <option value="eta_asc">ETA (Soonest First)</option>
        </select>
      </div>
    </motion.div>
  );
};

export default FilterSortControls;