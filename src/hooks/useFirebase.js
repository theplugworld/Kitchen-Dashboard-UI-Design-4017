import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as Tone from 'tone';

// Firebase configuration (you'll need to replace with your actual config)
const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const useFirebase = () => {
  const [allFoodOrders, setAllFoodOrders] = useState([]);
  const [currentNewOrderIds, setCurrentNewOrderIds] = useState(new Set());

  useEffect(() => {
    const appId = 'default-app-id'; // Replace with your app ID
    const ordersCollectionRef = collection(db, `artifacts/${appId}/public/data/orders`);
    
    const unsubscribe = onSnapshot(
      query(ordersCollectionRef, where('type', '==', 'food')),
      (snapshot) => {
        const fetchedOrders = [];
        const incomingNewOrderIds = new Set();
        
        snapshot.forEach(doc => {
          const order = { id: doc.id, ...doc.data() };
          fetchedOrders.push(order);
          if (order.status === 'pending') {
            incomingNewOrderIds.add(order.id);
          }
        });

        // Detect new orders for notification
        const newlyAddedOrders = fetchedOrders.filter(order => 
          order.status === 'pending' && !currentNewOrderIds.has(order.id)
        );

        if (newlyAddedOrders.length > 0) {
          playNewOrderSound();
          // You can add additional notification logic here
        }

        setCurrentNewOrderIds(incomingNewOrderIds);
        setAllFoodOrders(fetchedOrders);
      },
      (error) => {
        console.error('Error listening to food orders:', error);
      }
    );

    return () => unsubscribe();
  }, [currentNewOrderIds]);

  const playNewOrderSound = () => {
    try {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("C4", "8n");
    } catch (e) {
      console.warn('Tone.js not available or error playing sound:', e);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, userId) => {
    const appId = 'default-app-id'; // Replace with your app ID
    const orderRef = doc(db, `artifacts/${appId}/public/data/orders`, orderId);
    
    const updateData = {
      status: newStatus,
      lastUpdatedBy: userId,
      lastUpdatedTime: Timestamp.now()
    };

    if (newStatus === 'preparing') {
      updateData.preparedByCookId = userId;
      updateData.timeStartedPreparing = Timestamp.now();
      updateData.seenByKitchen = true;
    }

    if (newStatus === 'ready_for_pickup') {
      updateData.timeReady = Timestamp.now();
    }

    await updateDoc(orderRef, updateData);
  };

  const updateOrderETA = async (orderId, etaMinutes) => {
    const appId = 'default-app-id'; // Replace with your app ID
    const orderRef = doc(db, `artifacts/${appId}/public/data/orders`, orderId);
    
    await updateDoc(orderRef, {
      kitchenEstimatedTime: etaMinutes,
      kitchenResponseTimestamp: Timestamp.now()
    });
  };

  return {
    allFoodOrders,
    updateOrderStatus,
    updateOrderETA
  };
};