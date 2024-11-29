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
    return <div style={{ textAlign: 'center', marginTop: '20%' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
        <div style={{ padding: '20px' }}>
          <h1 style={{ color: '#333', borderBottom: '2px solid #FFBA08', paddingBottom: '10px' }}>
            Account of <span style={{ color: '#FFBA08' }}>{accountInfo.username}</span>
          </h1>
          <div style={{ marginBottom: '20px' }}>
            <p><strong>First Name:</strong> {accountInfo.first_name}</p>
            <p><strong>Last Name:</strong> {accountInfo.last_name}</p>
            <p><strong>Email:</strong> {accountInfo.email}</p>
          </div>
          
          <h2 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Borrowed Books</h2>
          {accountInfo.borrowed_books.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              {accountInfo.borrowed_books.map(item => (
                <li key={item.book.isbn} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <strong>{item.book.title}</strong><br />
                  <span style={{ color: '#555' }}>Borrowed On: {new Date(item.borrowed_on).toLocaleString()}</span><br />
                  <span style={{ color: '#555' }}>Return On: {item.return_on ? new Date(item.return_on).toLocaleString() : 'N/A'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', fontSize: '0.9em', color: '#777' }}>No borrowed books</p>
          )}

          <h2 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Wishlist</h2>
          {accountInfo.wishlist.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              {accountInfo.wishlist.map(item => (
                <li key={item.book.isbn} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <strong>{item.book.title}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', fontSize: '0.9em', color: '#777' }}>No books in wishlist</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
