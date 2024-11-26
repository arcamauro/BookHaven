import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Base URL for your Django API
  withCredentials: true, // Include cookies for authentication
});

// Function to fetch the list of books
export const fetchBooks = async () => {
  try {
    const response = await api.get('books/');
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

// Add more API functions as needed
