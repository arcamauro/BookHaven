import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Ensure this matches your server's address
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

// Function to logout a user
export const logoutUser = async () => {
  try {
    const response = await api.post('logout/');
    window.location.href = '/';
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

// Function to search for books
export const searchBooks = async (query) => {
  try {
    const response = await api.get('search/', { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Search books error:', error);
    throw error;
  }
};

// Function to check if the user is staff
export const checkStaffStatus = async () => {
  try {
    const response = await api.get('check_staff/');
    return response.data.is_staff;
  } catch (error) {
    console.error('Check staff status error:', error);
    throw error;
  }
};

export const searchUserBooks = async (query) => {
  try {
    const response = await api.get('search_user/', { params: { query } });
    return response.data.books;
  } catch (error) {
    console.error('Error searching user books:', error);
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('register/', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    if (error.response?.data) {
      // Create a new Error instance with the backend error message
      throw new Error(JSON.stringify(error.response.data));
    } else {
      // Create a new Error instance for network/other errors
      throw new Error('Registration failed. Please try again.');
    }
  }
};

// Function to verify email
export const verifyEmail = async (uidb64, token) => {
  try {
    const response = await api.get(`verify-email/${uidb64}/${token}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// Function to return a book
export const returnBook = async (bookId, username, quantity) => {
  try {
    const response = await api.post(`return_book/${bookId}/${username}/`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Return book error:', error);
    throw error;
  }
};

// Function to fetch all borrowed books
export const fetchAllBorrowedBooks = async () => {
  try {
    const response = await api.get('borrowed_books/');
    return response.data;
  } catch (error) {
    console.error('Fetch borrowed books error:', error);
    throw error;
  }
};

// Function to delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`review/${reviewId}/`);
    return response.data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// Function to request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('password-reset/', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

// Function to confirm password reset
export const confirmPasswordReset = async (uidb64, token, newPassword) => {
  try {
    const response = await api.post(`password-reset-confirm/${uidb64}/${token}/`, {
      new_password: newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    throw error;
  }
};

// Add more API functions as needed
