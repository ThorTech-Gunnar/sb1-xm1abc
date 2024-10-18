import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// ... (keep existing imports and interfaces)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (keep existing state and functions)

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (user) {
        let isTrialExpired;
        if (window.electronAPI) {
          isTrialExpired = await window.electronAPI.checkTrialStatus(user.id);
        } else {
          const response = await api.get('/auth/check-trial-status');
          isTrialExpired = response.data.isTrialExpired;
        }
        setUser({ ...user, isTrialExpired });
      }
    };

    checkTrialStatus();
    const intervalId = setInterval(checkTrialStatus, 24 * 60 * 60 * 1000); // Check every 24 hours

    return () => clearInterval(intervalId);
  }, [user]);

  // ... (keep existing return statement)
};