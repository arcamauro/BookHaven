import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BookList from './components/books/BookList';
import AccountPage from './components/account/AccountPage';
import Searching from './components/books/Searching';
import LibrarianPage from './components/librarian/LibrarianPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/search" element={<Searching />} />
        <Route path="/librarian-page" element={<LibrarianPage />} />
      </Routes>
    </Router>
  );
}

export default App;
