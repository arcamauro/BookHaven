import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Base URL for your Django API
  withCredentials: true, // Include cookies for authentication
});

// Add a request interceptor to include the CSRF token
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
  config.headers['X-CSRFToken'] = csrfToken;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Function to fetch the list of books
export const fetchBooks = async (query) => {
  try {
    const response = await api.get(`search/?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Fetch books error:', error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('login/', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Function to logout a user
export const logoutUser = async () => {
  try {
    const response = await api.post('logout/');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Function to fetch the user's account information
export const fetchUserAccount = async () => {
  try {
    const response = await api.get('account/');
    return response.data;
  } catch (error) {
    console.error('Fetch user account error:', error);
    throw error;
  }
};

// Function to borrow a book
export const borrowBook = async (isbn) => {
  try {
    const response = await api.post('borrow/', { isbn });
    return response.data;
  } catch (error) {
    console.error('Borrow book error:', error);
    throw error;
  }
};

// Function to toggle the wishlist
export const toggleWishlist = async (isbn) => {
  try {
    const response = await api.post('wishlist/', { isbn });
    return response.data;
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    throw error;
  }
};

// Function to leave a review
export const leaveReview = async (isbn, rating, content) => {
  try {
    const response = await api.post('review/', { isbn, rating, content });
    return response.data;
  } catch (error) {
    console.error('Leave review error:', error);
    throw error;
  }
};

// Function to fetch reviews for a book
export const fetchReviews = async (isbn) => {
  try {
    const response = await api.get(`reviews/${isbn}/`);
    return response.data;
  } catch (error) {
    console.error('Fetch reviews error:', error);
    throw error;
  }
};

// Add more API functions as needed
