import React, { useEffect, useState } from 'react';
import { fetchUserAccount } from '../../services/api';
import './AccountPage.css';

function AccountPage() {
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    const getAccountInfo = async () => {
      try {
        const data = await fetchUserAccount();
        console.log(data);
        setAccountInfo(data);
      } catch (error) {
        console.error('Error fetching account info:', error);
      }
    };

    getAccountInfo();
  }, []);

  if (!accountInfo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-page">
      <div className="account-card">
        <div className="account-info">
          <h1 className="account-title">
            Account of <span className="username">{accountInfo.username}</span>
          </h1>
          <div className="account-details">
            <p><strong>First Name:</strong> {accountInfo.first_name}</p>
            <p><strong>Last Name:</strong> {accountInfo.last_name}</p>
            <p><strong>Email:</strong> {accountInfo.email}</p>
          </div>
          
          <h2 className="section-title">Borrowed Books</h2>
          {accountInfo.borrowed_books.length > 0 ? (
            <ul className="book-list">
              {accountInfo.borrowed_books.map(item => (
                <li key={item.book.isbn} className="book-item">
                  {item.book.cover && (
                    <img 
                      src={item.book.cover} 
                      alt={item.book.title} 
                      className="book-cover"
                    />
                  )}
                  <div className="book-details">
                    <strong>{item.book.title}</strong><br />
                    <div className="book-meta">
                      <div>
                        <span className="borrowed-on">Borrowed On: {new Date(item.borrowed_on).toLocaleString()}</span><br />
                        <span className="return-on">Return On: {item.return_on ? new Date(item.return_on).toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="copies-borrowed">
                        <span className="number">{item.number}</span>
                        <span className="copies-text">copies borrowed</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))} 
            </ul>
          ) : (
            <p className="no-books">No borrowed books</p>
          )}

          <h2 className="section-title">Wishlist</h2>
          {accountInfo.wishlist.length > 0 ? (
            <ul className="book-list">
              {accountInfo.wishlist.map(item => (
                <li key={item.book.isbn} className="book-item">
                  {item.book.cover && (
                    <img 
                      src={item.book.cover} 
                      alt={item.book.title} 
                      className="book-cover"
                    />
                  )}
                  <div className="book-details">
                    <strong>{item.book.title}</strong>
                    {item.book.authors && (
                      <div className="authors">
                        by {item.book.authors.map(author => author.name).join(', ')}
                      </div>
                    )}
                  </div>
                </li>
              ))} 
            </ul>
          ) : (
            <p className="no-books">No books in wishlist</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
