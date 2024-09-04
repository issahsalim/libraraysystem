document.addEventListener('DOMContentLoaded', () => {
    const bookListContainer = document.getElementById('bookList');
    const searchInput = document.getElementById('searchInput');
    const borrowBookModal = new bootstrap.Modal(document.getElementById('borrowBookModal'));
    const borrowBookForm = document.getElementById('borrowBookForm');
    let currentBookISBN = '';

    // displaying books on page
    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        bookListContainer.innerHTML = ''; // Clear previous list

        if (books.length === 0) {
            bookListContainer.innerHTML = '<p class="text-center  fs-4 text-danger">No books available at the moment. Please check back later.</p>';
            return;
        }

        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('card', 'mb-3', 'col-md-3', 'm-2');
            bookCard.innerHTML = `
                <div class="card-body">  
                    <h5 class="card-title text-center">${book.title}</h5> 
                    <p class="card-text"><strong>Publisher:</strong> ${book.publisher}</p>
                    <p class="card-text"><strong>Copies Available:</strong> ${book.copiesAvailable}</p>
                    <p class="card-text"><strong>ISBN:</strong> ${book.isbn}</p>  
                    <button class="btn btn-primary borrow-btn" data-isbn="${book.isbn}">Borrow</button>
                </div>  
            `;
            bookListContainer.appendChild(bookCard);
        });

        // Add event listeners to borrow buttons
        document.querySelectorAll('.borrow-btn').forEach(button => {
            button.addEventListener('click', function () {
                currentBookISBN = this.getAttribute('data-isbn');
                showBorrowBookForm(currentBookISBN);
            });
        });
    }

    // Show borrow book form in modal
    function showBorrowBookForm(isbn) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(b => b.isbn === isbn);
        if (book && book.copiesAvailable > 0) {
            borrowBookForm.reset();
            borrowBookModal.show();
        } else {
            Swal.fire('Unavailable', 'No copies available.', 'warning');
        }
    }

    // Borrow book
    borrowBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('borrowUserId').value.trim();
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        const book = books.find(b => b.isbn === currentBookISBN);

        if (book && book.copiesAvailable > 0) {
            book.copiesAvailable -= 1;

            const returnDate = new Date(Date.now() +  1 * 24 * 60 * 60 * 1000);   //return date  
            borrowedBooks.push({ 
                userId,
                title: book.title,
                isbn: book.isbn,
                borrowDate: new Date().toISOString(),
                returnDate: returnDate.toISOString()
            });

            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            Swal.fire({
                icon: 'success',
                title: 'Book borrowed successfully.',
                html: `Please return the book by <strong>${returnDate.toLocaleDateString()}</strong>.`
            });

            loadBooks();
            borrowBookModal.hide();
        } else {
            Swal.fire('Error!', 'Unable to borrow book.', 'error');
        }
    });

    // Search books
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const books = JSON.parse(localStorage.getItem('books')) || [];
        // Clear previous list after search
        bookListContainer.innerHTML = '';

        const filteredBooks = books
            .filter(book => book.title.toLowerCase().includes(searchTerm) || book.isbn.includes(searchTerm));

        if (filteredBooks.length === 0) {
            bookListContainer.innerHTML = '<p class="text-center text-muted">No books match your search criteria.</p>';
            return;
        }

        filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('card', 'mb-3', 'col-md-4');
            bookCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text"><strong>Publisher:</strong> ${book.publisher}</p>
                    <p class="card-text"><strong>Copies Available:</strong> ${book.copiesAvailable}</p>
                    <button class="btn btn-success borrow-btn" data-isbn="${book.isbn}">Borrow</button>
                </div>
            `;
            bookListContainer.appendChild(bookCard);
        });

        // Add event listeners to borrow buttons
        document.querySelectorAll('.borrow-btn').forEach(button => {
            button.addEventListener('click', function () {
                currentBookISBN = this.getAttribute('data-isbn');
                showBorrowBookForm(currentBookISBN);
            });
        });
    });

    // Initial load
    loadBooks();
});
