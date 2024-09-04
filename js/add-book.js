document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('addBookForm');
    const bookList = document.getElementById('bookList');

    // Load books from LocalStorage
    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        bookList.innerHTML = ''; // Clear previous list
        books.forEach(book => {
            const bookItem = document.createElement('li');
            bookItem.classList.add('list-group-item');
            bookItem.innerHTML = `
                        ${book.title} - ${book.publisher} (ISBN: ${book.isbn}) - Copies: ${book.copiesAvailable}
                        <button class="btn btn-danger btn-sm float-right delete-btn" data-isbn="${book.isbn}">Delete</button>
                    `;
            bookList.appendChild(bookItem);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const isbn = this.getAttribute('data-isbn');
                deleteBook(isbn);
            });
        });
    }

    // Add book to LocalStorage
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const publisher = document.getElementById('publisher').value.trim();
        const isbn = document.getElementById('isbn').value.trim();
        const copiesAvailable = parseInt(document.getElementById('copiesAvailable').value);

        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.push({ title, publisher, isbn, copiesAvailable });
        localStorage.setItem('books', JSON.stringify(books));

        Swal.fire('Success!', 'Book added successfully.', 'success');
        addBookForm.reset();
        loadBooks();
    });

    // Delete book from LocalStorage
    function deleteBook(isbn) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const updatedBooks = books.filter(book => book.isbn !== isbn);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        Swal.fire('Deleted!', 'Book has been deleted.', 'success');
        loadBooks();
    }

    // Initial load
    loadBooks();
});
