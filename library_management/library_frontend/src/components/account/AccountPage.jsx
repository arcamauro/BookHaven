import React, { useEffect, useState } from 'react';
import { fetchUserAccount, toggleWishlist } from '../../services/api';
import Skeleton from '@mui/material/Skeleton';
import './AccountPage.css';
import { Link } from 'react-router-dom';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { Button, Snackbar, Alert } from '@mui/material';

// Skeleton component for the account information
const AccountInfoSkeleton = () => (
  <div className="rh-account-card">
    <div className="rh-account-info">
      <Skeleton variant="text" width="60%" height={60} className="rh-account-title-skeleton" />
      
      <div className="rh-account-details">
        <div>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={150} height={24} />
        </div>
        <div>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={150} height={24} />
        </div>
        <div>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={200} height={24} />
        </div>
      </div>

      <Skeleton variant="text" width="40%" height={40} className="rh-section-title-skeleton" />
      <div className="rh-book-list">
        {[...Array(2)].map((_, index) => (
          <div key={`borrowed-${index}`} className="rh-book-item">
            <Skeleton variant="rectangular" width={80} height={120} className="rh-book-cover-skeleton" />
            <div className="rh-book-details">
              <Skeleton variant="text" width="80%" height={28} />
              <div className="rh-book-meta">
                <div>
                  <Skeleton variant="text" width={150} height={20} />
                  <Skeleton variant="text" width={150} height={20} />
                </div>
                <Skeleton variant="rectangular" width={100} height={36} className="rh-copies-skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Skeleton variant="text" width="40%" height={40} className="rh-section-title-skeleton" />
      <div className="rh-book-list">
        {[...Array(2)].map((_, index) => (
          <div key={`wishlist-${index}`} className="rh-book-item">
            <Skeleton variant="rectangular" width={80} height={120} className="rh-book-cover-skeleton" />
            <div className="rh-book-details">
              <Skeleton variant="text" width="80%" height={28} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// AccountPage component to display the user's account information
export default function AccountPage() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    const getAccountInfo = async () => {
      try {
        const data = await fetchUserAccount();
        setAccountInfo(data);
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false);
      }
    };

    getAccountInfo();
  }, []);

  // Function to remove a book from the wishlist
  const handleRemoveFromWishlist = async (isbn) => {
    try {
      await toggleWishlist(isbn);
      
      setAccountInfo(prev => ({
        ...prev,
        wishlist: prev.wishlist.filter(item => item.book.isbn !== isbn)
      }));

      setNotification({
        open: true,
        message: 'Removed from wishlist successfully!',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to remove from wishlist.',
        severity: 'error'
      });
    }
  };

  // Function to close the notification about the success or failure of an action
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <div className="rh-account-page">
        <AccountInfoSkeleton />
      </div>
    );
  }

  if (!accountInfo) {
    return (
      <div className="rh-account-error">
        <span className="rh-error-text">Unable to load account information. Please try again later.</span>
      </div>
    );
  }

  // Render the account information such as first name, last name, email, borrowed books, and wishlist and allows the user to change their password
  return (
    <div className="rh-account-page">
      <div className="rh-account-card">
        <div className="rh-account-info">
          <h1 className="rh-account-title">
            Account of <span className="rh-username">{accountInfo.username}</span>
          </h1>
          <div className="rh-account-details">
            <p><strong>First Name:</strong> {accountInfo.first_name}</p>
            <p><strong>Last Name:</strong> {accountInfo.last_name}</p>
            <p><strong>Email:</strong> {accountInfo.email}</p>
            <Link to="/change-password" className="rh-auth-link">
              Change Password
            </Link>
          </div>
          
          <h2 className="rh-section-title">Borrowed Books</h2>
          {accountInfo.borrowed_books.length > 0 ? (
            <ul className="rh-book-list">
              {accountInfo.borrowed_books.map(item => (
                <li key={item.book.isbn} className="rh-book-item">
                  {item.book.cover && (
                    <img 
                      src={item.book.cover} 
                      alt={item.book.title} 
                      className="rh-book-cover"
                    />
                  )}
                  <div className="rh-book-details">
                    <strong>{item.book.title}</strong><br />
                    <div className="rh-book-meta">
                      <div>
                        <span className="rh-borrowed-on">Borrowed On: {new Date(item.borrowed_on).toLocaleDateString()}</span><br />
                        <span className="rh-return-on">Return On: {item.return_on ? new Date(item.return_on).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="rh-copies-borrowed">
                        <span className="rh-number">{item.number}</span>
                        <span className="rh-copies-text">copies borrowed</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))} 
            </ul>
          ) : (
            <p className="rh-no-books">No borrowed books</p>
          )}

          <h2 className="rh-section-title">Wishlist</h2>
          {accountInfo.wishlist.length > 0 ? (
            <ul className="rh-book-list">
              {accountInfo.wishlist.map(item => (
                <li key={item.book.isbn} className="rh-book-item">
                  {item.book.cover && (
                    <img 
                      src={item.book.cover} 
                      alt={item.book.title} 
                      className="rh-book-cover"
                    />
                  )}
                  <div className="rh-book-details">
                    <strong>{item.book.title}</strong>
                    {item.book.authors && (
                      <div className="rh-authors">
                        by {item.book.authors.map(author => author.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRemoveFromWishlist(item.book.isbn)}
                    startIcon={<BookmarkRemoveIcon />}
                    color="error"
                    variant="outlined"
                    size="small"
                  >
                    Remove
                  </Button>
                </li>
              ))} 
            </ul>
          ) : (
            <p className="rh-no-books">No books in wishlist</p>
          )}
        </div>
      </div>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
