import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

export const useAuth = (allowedRoles = []) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [employeeDisplayName, setEmployeeDisplayName] = useState('Unknown Employee');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Get user profile from Firestore
        const appId = 'default-app-id'; // Replace with your app ID
        const userProfileRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile/user_data`);
        
        try {
          const docSnap = await getDoc(userProfileRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            const role = profileData.role;
            const displayName = profileData.email ? profileData.email.split('@')[0] : 'Unknown Employee';
            
            setUserRole(role);
            setEmployeeDisplayName(displayName);
            
            // Check if user has required role
            if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
              redirectToCorrectDashboard(role);
              return;
            }
          } else {
            console.error('User profile not found');
            window.location.href = '/bar-landing-page.html';
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          window.location.href = '/bar-landing-page.html';
        }
      } else {
        // Try to sign in anonymously
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error('Authentication failed:', error);
          window.location.href = '/bar-landing-page.html';
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRoles]);

  const redirectToCorrectDashboard = (role) => {
    switch (role) {
      case 'owner':
      case 'manager':
      case 'general_staff':
      case 'security':
        window.location.href = '/main_dashboard_landing_page.html';
        break;
      case 'bartender':
      case 'barback':
        window.location.href = '/bartender_dashboard.html';
        break;
      case 'server':
        window.location.href = '/waiter_dashboard.html';
        break;
      case 'cook':
        window.location.href = '/kitchen_dashboard.html';
        break;
      default:
        window.location.href = '/unauthorized.html';
        break;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      window.location.href = '/bar-landing-page.html';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    user,
    userRole,
    employeeDisplayName,
    loading,
    logout
  };
};