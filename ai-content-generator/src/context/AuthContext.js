import React, { createContext, useState, useContext, useEffect } from 'react';
// Updated import for Auth
import { Amplify } from 'aws-amplify';
import { signIn, signUp, confirmSignUp, signOut, getCurrentUser } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(username, password) {
    try {
      const user = await signIn({ username, password });
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function handleSignUp(username, password, email) {
    try {
      const { user } = await signUp({
        username,
        password,
        attributes: { email }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function handleConfirmSignUp(username, code) {
    try {
      await confirmSignUp({ username, confirmationCode: code });
    } catch (error) {
      throw error;
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};