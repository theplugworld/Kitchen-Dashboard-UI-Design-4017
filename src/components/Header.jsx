import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX } = FiIcons;

const Header = ({ employeeDisplayName, userRole, mobileMenuOpen, setMobileMenuOpen, onLogout }) => {
  const navItems = [
    { label: 'Kitchen Dashboard', href: '#', active: true },
    { label: 'Kitchen Inventory', href: '/kitchen_inventory_management.html', roles: ['owner', 'manager', 'cook'] },
    { label: 'Main Dashboard', href: '/main_dashboard_landing_page.html', roles: ['owner', 'manager', 'general_staff', 'security'] }
  ];

  return (
    <header className="bg-gray-900 shadow-md py-4 px-6 md:px-12 rounded-b-xl">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://placehold.co/40x40/000000/ffffff?text=P" 
            alt="The Plug Logo" 
            className="h-10 w-10 mr-3 rounded-full border border-gray-700"
          />
          <span className="text-2xl font-bold text-white">The Plug</span>
          <span className="ml-4 text-lg font-semibold text-green-300">
            ({employeeDisplayName})
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => {
            if (item.roles && !item.roles.includes(userRole)) return null;
            return (
              <a
                key={index}
                href={item.href}
                className={`${
                  item.active 
                    ? 'text-green-400 font-bold' 
                    : 'text-gray-300 hover:text-green-400'
                } transition duration-300 font-medium`}
              >
                {item.label}
              </a>
            );
          })}
          <button 
            onClick={onLogout}
            className="text-gray-300 hover:text-red-500 transition duration-300 font-medium bg-transparent border-none cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-green-400 focus:outline-none"
          >
            <SafeIcon icon={FiMenu} className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: mobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="mobile-nav-menu"
      >
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-nav-close"
        >
          <SafeIcon icon={FiX} />
        </button>
        
        {navItems.map((item, index) => {
          if (item.roles && !item.roles.includes(userRole)) return null;
          return (
            <a
              key={index}
              href={item.href}
              className={`${
                item.active 
                  ? 'text-green-400 font-bold' 
                  : 'text-gray-300 hover:text-green-400'
              } transition duration-300 font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
        
        <button 
          onClick={() => {
            setMobileMenuOpen(false);
            onLogout();
          }}
          className="text-gray-300 hover:text-red-500 transition duration-300 font-medium bg-transparent border-none cursor-pointer"
        >
          Logout
        </button>
      </motion.div>
    </header>
  );
};

export default Header;