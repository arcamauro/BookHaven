import React, { useEffect, useState } from 'react';
import { fetchUserAccount } from '../../services/api'; // Import the API function

function AccountPage() {
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    const getAccountInfo = async () => {
      try {
        const data = await fetchUserAccount();
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
      <h1>Account Information</h1>
      <p>Username: {accountInfo.username}</p>
      <p>First Name: {accountInfo.first_name}</p>
      <p>Last Name: {accountInfo.last_name}</p>
      <p>Email: {accountInfo.email}</p>
      
      <h2>Borrowed Books</h2>
      {accountInfo.borrowed_books.length > 0 ? (
        <ul>
          {accountInfo.borrowed_books.map(book => (
            <li key={book.isbn}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: 'italic', fontSize: '0.8em' }}>No borrowed books</p>
      )}

      <h2>Wishlist</h2>
      {accountInfo.wishlist.length > 0 ? (
        <ul>
          {accountInfo.wishlist.map(book => (
            <li key={book.isbn}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: 'italic', fontSize: '0.8em' }}>No books in wishlist</p>
      )}
    </div>
  );
}

export default AccountPage;
