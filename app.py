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
