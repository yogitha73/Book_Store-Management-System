class BookStoreApp {
    constructor() {
        this.currentEditingId = null;
        this.books = [];
        this.initializeEventListeners();
        this.loadBooks();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Edit form submission
        document.getElementById('updateBookBtn').addEventListener('click', () => {
            this.handleEditSubmit();
        });

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleDeleteConfirm();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterBooks(e.target.value);
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadBooks();
        });

        // Cancel edit button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.resetForm();
        });
    }

    async loadBooks() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/books');
            const result = await response.json();

            if (result.success) {
                this.books = result.data;
                this.renderBooks(this.books);
                this.showAlert('Books loaded successfully', 'success');
            } else {
                this.showAlert(result.message || 'Failed to load books', 'danger');
            }
        } catch (error) {
            console.error('Error loading books:', error);
            this.showAlert('Network error: Failed to load books', 'danger');
        } finally {
            this.showLoading(false);
        }
    }

    renderBooks(books) {
        const tbody = document.getElementById('booksTableBody');
        const noMessage = document.getElementById('noBooksMessage');
        const tableContainer = document.getElementById('booksTableContainer');

        if (books.length === 0) {
            tableContainer.style.display = 'none';
            noMessage.style.display = 'block';
            return;
        }

        tableContainer.style.display = 'block';
        noMessage.style.display = 'none';

        tbody.innerHTML = books.map(book => `
            <tr class="fade-in">
                <td><strong>#${book.id}</strong></td>
                <td>
                    <div class="book-info">
                        <strong>${this.escapeHtml(book.title)}</strong>
                        ${book.genre ? `<br><small class="text-muted"><i class="fas fa-tag"></i> ${this.escapeHtml(book.genre)}</small>` : ''}
                    </div>
                </td>
                <td>
                    <i class="fas fa-user"></i> ${this.escapeHtml(book.author)}
                </td>
                <td>
                    <code>${this.escapeHtml(book.isbn)}</code>
                </td>
                <td>
                    <strong style="color: #4facfe;">$${book.price.toFixed(2)}</strong>
                </td>
                <td>
                    <span class="badge ${book.quantity <= 5 ? 'bg-warning' : 'bg-success'}">
                        <i class="fas fa-${book.quantity <= 5 ? 'exclamation-triangle' : 'check-circle'}"></i>
                        ${book.quantity}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary" onclick="app.editBook(${book.id})" title="Edit Book">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="app.deleteBook(${book.id})" title="Delete Book">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Update statistics
        this.updateStatistics(books);
    }

    filterBooks(query) {
        if (!query.trim()) {
            this.renderBooks(this.books);
            return;
        }

        const filtered = this.books.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.isbn.toLowerCase().includes(query.toLowerCase()) ||
            (book.genre && book.genre.toLowerCase().includes(query.toLowerCase()))
        );

        this.renderBooks(filtered);
    }

    async handleFormSubmit() {
        const formData = new FormData(document.getElementById('bookForm'));
        const bookData = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            bookData[key] = value.trim();
        }

        // Validate required fields
        const requiredFields = ['title', 'author', 'isbn', 'price', 'quantity'];
        for (let field of requiredFields) {
            if (!bookData[field]) {
                this.showAlert(`Please fill in the ${field} field`, 'warning');
                return;
            }
        }

        try {
            const url = this.currentEditingId ? `/api/books/${this.currentEditingId}` : '/api/books';
            const method = this.currentEditingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert(result.message, 'success');
                this.resetForm();
                this.loadBooks();
            } else {
                this.showAlert(result.message || 'Operation failed', 'danger');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showAlert('Network error: Failed to submit form', 'danger');
        }
    }

    async handleEditSubmit() {
        const bookId = document.getElementById('editBookId').value;
        const bookData = {
            title: document.getElementById('editTitle').value.trim(),
            author: document.getElementById('editAuthor').value.trim(),
            isbn: document.getElementById('editIsbn').value.trim(),
            price: document.getElementById('editPrice').value,
            quantity: document.getElementById('editQuantity').value,
            genre: document.getElementById('editGenre').value.trim(),
            description: document.getElementById('editDescription').value.trim()
        };

        try {
            const response = await fetch(`/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert(result.message, 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                modal.hide();
                this.loadBooks();
            } else {
                this.showAlert(result.message || 'Failed to update book', 'danger');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            this.showAlert('Network error: Failed to update book', 'danger');
        }
    }

    async handleDeleteConfirm() {
        const bookId = document.getElementById('confirmDeleteBtn').dataset.bookId;

        try {
            const response = await fetch(`/api/books/${bookId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert(result.message, 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();
                this.loadBooks();
            } else {
                this.showAlert(result.message || 'Failed to delete book', 'danger');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            this.showAlert('Network error: Failed to delete book', 'danger');
        }
    }

    editBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) {
            this.showAlert('Book not found', 'danger');
            return;
        }

        // Populate edit form
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editIsbn').value = book.isbn;
        document.getElementById('editPrice').value = book.price;
        document.getElementById('editQuantity').value = book.quantity;
        document.getElementById('editGenre').value = book.genre || '';
        document.getElementById('editDescription').value = book.description || '';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    }

    deleteBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) {
            this.showAlert('Book not found', 'danger');
            return;
        }

        // Set up delete confirmation
        document.getElementById('deleteBookInfo').innerHTML = `
            <strong>Title:</strong> ${this.escapeHtml(book.title)}<br>
            <strong>Author:</strong> ${this.escapeHtml(book.author)}<br>
            <strong>ISBN:</strong> ${this.escapeHtml(book.isbn)}
        `;

        document.getElementById('confirmDeleteBtn').dataset.bookId = bookId;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    resetForm() {
        document.getElementById('bookForm').reset();
        this.currentEditingId = null;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Book';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" id="${alertId}" role="alert">
                ${this.escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('beforeend', alertHtml);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = show ? 'block' : 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

      updateStatistics(books) {
        // Total books
        document.getElementById('totalBooks').textContent = books.length;
        
        // Low stock count
        const lowStockCount = books.filter(book => book.quantity <= 5).length;
        document.getElementById('lowStockCount').textContent = lowStockCount;
        
        // Total value
        const totalValue = books.reduce((sum, book) => sum + (book.price * book.quantity), 0);
        document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
        
        // Unique authors
        const uniqueAuthors = [...new Set(books.map(book => book.author))].length;
        document.getElementById('uniqueAuthors').textContent = uniqueAuthors;
    }
}

// Initialize the application
const app = new BookStoreApp();
