import React, { useEffect, useState } from 'react';
import { fetchUserAccount } from '../../services/api';

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account's of <span style={{ color: 'blue' }}>{accountInfo.username}</span></h1>
      <p>First Name: {accountInfo.first_name}</p>
      <p>Last Name: {accountInfo.last_name}</p>
      <p>Email: {accountInfo.email}</p>
      
      <h2>Borrowed Books</h2>
      {accountInfo.borrowed_books.length > 0 ? (
        <ul>
          {accountInfo.borrowed_books.map(item => (
            <li key={item.book.isbn}>
              <strong>{item.book.title}</strong><br />
              Borrowed On: {new Date(item.borrowed_on).toLocaleString()}<br />
              Return On: {item.return_on ? new Date(item.return_on).toLocaleString() : 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: 'italic', fontSize: '0.8em' }}>No borrowed books</p>
      )}

      <h2>Wishlist</h2>
      {accountInfo.wishlist.length > 0 ? (
        <ul>
          {accountInfo.wishlist.map(item => (
            <li key={item.book.isbn}><strong>{item.book.title}</strong></li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: 'italic', fontSize: '0.8em' }}>No books in wishlist</p>
      )}
    </div>
  );
}

export default AccountPage;
