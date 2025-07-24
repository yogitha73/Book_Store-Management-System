import os
import logging
from flask import Flask, request, jsonify, render_template
from data_manager import DataManager

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Initialize data manager
data_manager = DataManager()

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books"""
    try:
        books = data_manager.get_all_books()
        return jsonify({
            'success': True,
            'data': books,
            'message': 'Books retrieved successfully'
        })
    except Exception as e:
        app.logger.error(f"Error getting books: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve books'
        }), 500

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book by ID"""
    try:
        book = data_manager.get_book_by_id(book_id)
        if book:
            return jsonify({
                'success': True,
                'data': book,
                'message': 'Book retrieved successfully'
            })
        else:
            return jsonify({ 
                       'success': False,
                'error': 'Book not found',
                'message': f'Book with ID {book_id} does not exist'
            }), 404
    except Exception as e:
        app.logger.error(f"Error getting book {book_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve book'
        }), 500

@app.route('/api/books', methods=['POST'])
def create_book():
    """Create a new book"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'author', 'isbn', 'price', 'quantity']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}',
                    'message': 'Please provide all required fields'
                }), 400
        
        # Validate data types
 try:
            data['price'] = float(data['price'])
            data['quantity'] = int(data['quantity'])
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid data type',
                'message': 'Price must be a number and quantity must be an integer'
            }), 400
            # Check for duplicate ISBN
        if data_manager.book_exists_by_isbn(data['isbn']):
            return jsonify({
                'success': False,
                'error': 'ISBN already exists',
                'message': f'A book with ISBN {data["isbn"]} already exists'
            }), 400
        
        book = data_manager.create_book(data)
        return jsonify({
            'success': True,
            'data': book,
            'message': 'Book created successfully'
        }), 201
        
    except Exception as e:
        app.logger.error(f"Error creating book: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to create book'
        }), 500

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Update an existing book"""
    try:
        data = request.get_json()
        
        # Check if book exists
        if not data_manager.get_book_by_id(book_id):
            return jsonify({
                'success': False,
                'error': 'Book not found',
                'message': f'Book with ID {book_id} does not exist'
            }), 404
        
        # Validate data types if provided
        if 'price' in data and data['price'] is not None:
            try:
                data['price'] = float(data['price'])
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid price format',
                    'message': 'Price must be a number'
                }), 400
        
        if 'quantity' in data and data['quantity'] is not None:
            try:
                data['quantity'] = int(data['quantity'])
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid quantity format',
                    'message': 'Quantity must be an integer'
                }), 400
        
        # Check for duplicate ISBN if ISBN is being updated
        if 'isbn' in data and data['isbn']:
            existing_book = data_manager.get_book_by_isbn(data['isbn'])
            if existing_book and existing_book['id'] != book_id:
                return jsonify({
                    'success': False,
                    'error': 'ISBN already exists',
                    'message': f'A book with ISBN {data["isbn"]} already exists'
                }), 400
        
        book = data_manager.update_book(book_id, data)
        return jsonify({
            'success': True,
            'data': book,
            'message': 'Book updated successfully'
        })
        
    except Exception as e:
        app.logger.error(f"Error updating book {book_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to update book'
        }), 500

