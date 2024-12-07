import React, { useState, useEffect } from 'react';
import { searchUserBooks, returnBook, fetchAllBorrowedBooks } from '../../services/api';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './LibrarianPage.css';

// Skeleton component for the book item
const BookItemSkeleton = () => (
  <li className="rh-librarian-book-item">
    <Skeleton 
      variant="rectangular" 
      width={120} 
      height={180} 
      className="rh-book-cover-skeleton" 
    />
    <div className="rh-book-info-section">
      <Skeleton variant="text" width="80%" height={28} className="rh-book-title-skeleton" />
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton 
        variant="rectangular" 
        width={100} 
        height={32} 
        className="rh-copies-badge-skeleton" 
      />
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={40} 
        className="rh-return-btn-skeleton" 
      />
    </div>
  </li>
);

//Main component for the librarian page
const LibrarianPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [allBorrowedBooks, setAllBorrowedBooks] = useState([]);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  //useEffect hook to load all the borrowed books
  useEffect(() => {
    loadAllBorrowedBooks();
  }, []);

  const loadAllBorrowedBooks = async () => {
    try {
      const response = await fetchAllBorrowedBooks();
      setAllBorrowedBooks(response.books);
    } catch (error) {
      console.error('Error loading borrowed books:', error);
    } finally {
      setTableLoading(false);
    }
  };

  //Function to search for the books by the username of the borrower or the title of the book
  const handleSearch = async () => {
    try {
      setLoading(true);
      const books = await searchUserBooks(searchQuery);
      setSearchedBooks(books);
    } catch (error) {
      console.error('Error searching user books:', error);
    } finally {
      setLoading(false);
    }
  };

  //Function to return the book
  const handleReturnBook = async (bookId, username) => {
    try {
      await returnBook(bookId, username, 1);
      setNotification('Book returned successfully!');
      setTimeout(() => setNotification(''), 3000);
      loadAllBorrowedBooks();
      if (searchQuery) {
        handleSearch();
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setNotification('Failed to return book');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  //Function to check if the book is overdue by comparing the current date with the return date
  const isOverdue = (returnDate) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    return today > dueDate;
  };

  //Function to sort the books by the key passed in
  const sortBooks = (books) => {
    if (!sortConfig.key) return books;

    return [...books].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  //Function to handle the sorting of the books by the key passed in
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  //Main part of the librarian page where the search and the table with all borrowed books are displayed
  return (
    <div className="rh-librarian-wrapper">
      <h1 className="rh-librarian-header">Librarian Dashboard</h1>
      
      {/* Search Section */}
      <div className="rh-librarian-search-section">
        <h2>Search Books</h2>
        <div className="rh-librarian-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or book title..."
            className="rh-librarian-search-input"
          />
          <button onClick={handleSearch} className="rh-librarian-search-button">
            Search
          </button>
        </div>

        {searchQuery && (
          <ul className="rh-librarian-book-collection">
            {loading ? (
              [...Array(6)].map((_, index) => <BookItemSkeleton key={index} />)
            ) : (
              searchedBooks.map((book) => (
                <li 
                  key={book.id} 
                  className={`rh-librarian-book-item ${isOverdue(book.return_date) ? 'overdue' : ''}`}
                >
                  <img src={book.cover} alt={book.title} className="rh-book-cover-image" />
                  <div className="rh-book-info-section">
                    <div className="rh-book-title-text">{book.title}</div>
                    <div className="rh-book-author-text">by {book.authors}</div>
                    <div className="rh-book-borrower-text">Borrowed by {book.borrower}</div>
                    <div className={`rh-book-return-date ${isOverdue(book.return_date) ? 'overdue' : ''}`}>
                      Return by: {new Date(book.return_date).toLocaleDateString()}
                    </div>
                    <div className="rh-book-copies-badge">
                      <span className="rh-copies-number">{book.lended}</span>
                      <span className="rh-copies-text">copies borrowed</span>
                    </div>
                    <button 
                      onClick={() => handleReturnBook(book.isbn, book.borrower)} 
                      className="rh-return-btn"
                    >
                      Return Book
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="rh-librarian-table-section">
        <h2>All Borrowed Books</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  className="rh-sortable-header"
                  onClick={() => handleSort('title')}
                >
                  Title {sortConfig.key === 'title' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableCell>
                <TableCell 
                  className="rh-sortable-header"
                  onClick={() => handleSort('authors')}
                >
                  Author(s) {sortConfig.key === 'authors' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableCell>
                <TableCell 
                  className="rh-sortable-header"
                  onClick={() => handleSort('borrower')}
                >
                  Borrower {sortConfig.key === 'borrower' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableCell>
                <TableCell 
                  className="rh-sortable-header"
                  onClick={() => handleSort('borrowed_on')}
                >
                  Borrowed On {sortConfig.key === 'borrowed_on' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableCell>
                <TableCell 
                  className="rh-sortable-header"
                  onClick={() => handleSort('return_date')}
                >
                  Return Date {sortConfig.key === 'return_date' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableLoading ? (
                [...Array(6)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width="100%" height={28} /></TableCell>
                    <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
                  </TableRow>
                ))
              ) : (
                sortBooks(allBorrowedBooks).map((book) => (
                  <TableRow 
                    key={book.id}
                    className={isOverdue(book.return_date) ? 'overdue-row' : ''}
                  >
                    <TableCell data-label="Title">{book.title}</TableCell>
                    <TableCell data-label="Author(s)">{book.authors}</TableCell>
                    <TableCell data-label="Borrower">{book.borrower}</TableCell>
                    <TableCell data-label="Borrowed On">{new Date(book.borrowed_on).toLocaleDateString()}</TableCell>
                    <TableCell 
                      data-label="Return Date" 
                      className={isOverdue(book.return_date) ? 'overdue-status' : 'active-status'}
                    >
                      {new Date(book.return_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell data-label="Actions">
                      <button 
                        onClick={() => handleReturnBook(book.isbn, book.borrower)} 
                        className="rh-return-btn"
                      >
                        Return Book
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LibrarianPage;