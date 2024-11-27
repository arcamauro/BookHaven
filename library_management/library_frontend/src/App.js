import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BookList from './components/books/BookList';
import AccountPage from './components/account/AccountPage';
import BorrowPage from './components/borrow/BorrowPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/borrow" element={<BorrowPage />} />
      </Routes>
    </Router>
  );
}

export default App;
