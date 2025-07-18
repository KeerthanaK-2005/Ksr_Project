import axios from 'axios';

const API_BASE_URL = 'http://172.16.2.108:3000';

export const authService = {
  
  login: async (email, password) => {
    const response = await fetch('http://172.16.2.108:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { status: response.status, data };
  },

  

  // NEW REGISTER API - with automatic login after successful registration
  register: async (firstName, lastName, email, password, phoneNo) => {
    try {
      // Step 1: Register the user
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        phoneNo,
        roleId: 2,
      });

      // Step 2: If registration succeeds, automatically login
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      // Step 3: Return both registration and login data
      return {
        registration: registerResponse.data,
        login: loginResponse.data
      };
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // New register function
  registerUser: async (userData) => {
    const response = await fetch('http://172.16.2.108:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  }
}; 