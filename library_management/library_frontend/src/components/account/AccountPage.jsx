import React, { useEffect, useState } from 'react';
import { fetchUserAccount } from '../../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import './AccountPage.css';

function AccountPage() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="rh-account-loading">
        <CircularProgress size={40} />
        <span className="rh-loading-text">Loading your account information...</span>
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
                        <span className="rh-borrowed-on">Borrowed On: {new Date(item.borrowed_on).toLocaleString()}</span><br />
                        <span className="rh-return-on">Return On: {item.return_on ? new Date(item.return_on).toLocaleString() : 'N/A'}</span>
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
                </li>
              ))} 
            </ul>
          ) : (
            <p className="rh-no-books">No books in wishlist</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
