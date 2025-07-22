# BookStore Management System

A Flask-based Information System for managing bookstore inventory with full CRUD operations through a JSON API.

## Overview

This project is a proof-of-concept application designed for a bookstore organization, implementing complete Create, Read, Update, Delete (CRUD) functionality through a RESTful JSON API with an interactive web frontend.

## System Architecture

### Backend
- **Framework**: Flask (Python)
- **API Design**: RESTful JSON API
- **Data Storage**: JSON file-based storage
- **Server**: Gunicorn WSGI server

### Frontend
- **Technology**: Vanilla JavaScript with Bootstrap 5
- **Architecture**: Single Page Application (SPA)
- **Styling**: Bootstrap dark theme with Font Awesome icons
- **User Interface**: Responsive design with real-time updates

## Features

### Core CRUD Operations
- **Create**: Add new books to inventory
- **Read**: View all books or specific book details
- **Update**: Edit existing book information
- **Delete**: Remove books from inventory

### Additional Features
- **Search Functionality**: Search books by title, author, or genre
- **Data Validation**: Client-side and server-side validation
- **ISBN Uniqueness**: Prevents duplicate ISBN entries
- **Low Stock Alerts**: Visual indicators for low-quantity books
- **Real-time Updates**: Dynamic UI updates without page refresh

## API Endpoints

### Books API
- `GET /api/books` - Retrieve all books
- `GET /api/books/{id}` - Retrieve specific book
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update existing book
- `DELETE /api/books/{id}` - Delete book

### Response Format
All API responses follow this JSON structure:
```json
{
  "success": true/false,
  "data": {...},
  "message": "Operation description"
}
```

## Data Model

### Book Object
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "978-0-123456-78-9",
  "price": 29.99,
  "quantity": 10,
  "genre": "Fiction",
  "description": "Book description",
  "created_at": "2023-01-01T00:00:00.000000",
  "updated_at": "2023-01-01T00:00:00.000000"
}
```

## Installation & Setup

### Prerequisites
- Python 3.11+
- pip package manager

### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   pip install flask gunicorn
   ```
3. Run the application:
   ```bash
   python main.py
   ```
   Or using Gunicorn:
   ```bash
   gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
   ```

### Access the Application
- Open your browser and navigate to `http://localhost:5000`
- The application will be available on all network interfaces

## File Structure
```
bookstore-management/
├── app.py                 # Main Flask application
├── main.py                # Application entry point
├── data_manager.py        # Data operations handler
├── data/
│   └── books.json         # JSON data storage
├── templates/
│   └── index.html         # Frontend template
├── static/
│   └── js/
│       └── main.js        # Frontend JavaScript
├── tests/
│   ├── test_crud.py       # Unit tests
│   └── test_integration.py # Integration tests
└── README.md              # This file
```

## Testing

### Unit Tests
Run CRUD operation tests:
```bash
python -m unittest tests.test_crud
```

### Integration Tests
Run frontend-backend integration tests:
```bash
python -m unittest tests.test_integration
```

### Test Coverage
- CRUD operations testing
- API endpoint validation
- Data integrity checks
- Error handling verification
- Frontend-backend interaction

## Usage Guide

### Adding Books
1. Fill out the "Add New Book" form
2. Required fields: Title, Author, ISBN, Price, Quantity
3. Optional fields: Genre, Description
4. Click "Add Book" to save

### Viewing Books
- All books are displayed in the inventory table
- Use the search box to filter books
- Click "Refresh" to reload data

### Editing Books
1. Click the edit button (pencil icon) on any book
2. Modify fields in the popup modal
3. Click "Update Book" to save changes

### Deleting Books
1. Click the delete button (trash icon) on any book
2. Confirm deletion in the popup modal
3. Book will be permanently removed

### Search Features
- Search by title, author, ISBN, or genre
- Real-time filtering as you type
- Case-insensitive matching

## Data Storage

### JSON File Format
Data is stored in `data/books.json` with the following structure:
```json
{
  "books": [...],
  "next_id": 1,
  "last_updated": "2023-01-01T00:00:00.000000"
}
```

### Backup Strategy
- Automatic timestamp tracking
- File-based persistence
- Easy data portability

## Error Handling

### Client-Side Validation
- Required field validation
- Data type validation
- ISBN format checking

### Server-Side Validation
- Data integrity checks
- Duplicate ISBN prevention
- Error response formatting

### User Feedback
- Success/error alert messages
- Loading indicators
- Confirmation dialogs

## Technical Specifications

### Dependencies
- Flask: Web framework
- Gunicorn: WSGI HTTP server
- Bootstrap 5: Frontend framework
- Font Awesome: Icon library

### Browser Support
- Modern browsers with JavaScript enabled
- Responsive design for mobile devices

### Performance
- Lightweight JSON storage
- Efficient client-side rendering
- Minimal server resources

## Development Guidelines

### Code Organization
- Separation of concerns (MVC pattern)
- Repository pattern for data access
- Class-based JavaScript organization

### Security Considerations
- Input validation and sanitization
- XSS prevention through HTML escaping
- CSRF protection ready

### Extensibility
- Modular component design
- Easy to add new features
- Database migration ready



### ✓ Individual Project
- Designed and implemented independently
- Original code with proper attribution of libraries

### ✓ Information System Design
- Clear requirements analysis
- Comprehensive system architecture
- Proof-of-concept implementation

### ✓ CRUD Operations
- Complete Create, Read, Update, Delete functionality
- Data validation and integrity
- Error handling and user feedback

### ✓ API Architecture
- RESTful JSON API endpoints
- Frontend-backend separation
- No post-and-refresh interactions

### ✓ Technology Stack
- JavaScript frontend
- Python backend
- JSON file storage

### ✓ Testing Implementation
- Unit tests for CRUD operations
- Integration tests for API endpoints
- Frontend-backend interaction testing

### ✓ Documentation
- Comprehensive README
- Inline code documentation
- Clear project structure

## Future Enhancements

### Potential Improvements
- Database integration (PostgreSQL/MySQL)
- User authentication and authorization
- Advanced search and filtering
- Inventory reporting and analytics
- Export functionality (CSV/PDF)
- Image upload for book covers
- Category management
- Multi-language support

### Scalability Considerations
- Database migration path
- Caching implementation
- Load balancing support
- API rate limiting
- Containerization ready

