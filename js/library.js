document.addEventListener('DOMContentLoaded', () => {
    // Add Book
    const addBookForm = document.getElementById('addBookForm');
    const bookList = document.getElementById('bookList');

    if (addBookForm) {
        addBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('bookTitle').value;
            const publisher = document.getElementById('bookPublisher').value;
            const isbn = document.getElementById('bookISBN').value;
            const copies = parseInt(document.getElementById('bookCopies').value);

            const books = JSON.parse(localStorage.getItem('books')) || [];
            books.push({ title, publisher, isbn, copiesAvailable: copies });
            localStorage.setItem('books', JSON.stringify(books));

            Swal.fire('Success!', 'Book has been added.', 'success');
            addBookForm.reset();
            displayBooks();
            updateAdminBookList(); // Update the admin book list
        });

        function displayBooks() {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            bookList.innerHTML = '';
            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className = 'card m-2';
                bookItem.innerHTML = `   
                    <div class="card-body text-center"> 
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><strong>Publisher:</strong> ${book.publisher}</p>
                        <p class="card-text"><strong>ISBN:</strong> ${book.isbn}</p>
                        <button class="btn btn-danger" onclick="deleteBook('${book.isbn}')">Delete</button>
                    </div>
                `;
                bookList.appendChild(bookItem);
            });
        }

        function updateAdminBookList() {
            const adminBookList = document.getElementById('adminBookList');
            if (adminBookList) {
                const books = JSON.parse(localStorage.getItem('books')) || [];
                adminBookList.innerHTML = '';
                books.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.className = 'card m-2';
                    bookItem.innerHTML = `   
                        <div class="card-body text-center"> 
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text"><strong>Publisher:</strong> ${book.publisher}</p>
                            <p class="card-text"><strong>ISBN:</strong> ${book.isbn}</p>
                            <p class="card-text"><strong>Copies Available:</strong> ${book.copiesAvailable}</p>
                        </div>
                    `;
                    adminBookList.appendChild(bookItem);
                });
            }
        }

        displayBooks();
        updateAdminBookList(); // Initialize admin book list
    }

    // Borrow Book
    const borrowBookForm = document.getElementById('borrowBookForm');
    const borrowBookModal = new bootstrap.Modal(document.getElementById('borrowBookModal'));
    const borrowUserId = document.getElementById('borrowUserId');
    const bookListContainer = document.getElementById('bookList');

    if (borrowBookForm) {
        borrowBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isbn = borrowBookForm.dataset.isbn;
            const userId = borrowUserId.value.trim();
            const borrowDate = new Date().toISOString().split('T')[0];
            const dueDate = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0];

            if (!userId) {
                Swal.fire('Error!', 'Please enter your User ID.', 'error');
                return;
            }

            const books = JSON.parse(localStorage.getItem('books')) || [];
            const book = books.find(b => b.isbn === isbn);
            if (!book) {
                Swal.fire('Error!', 'Book not found.', 'error');
                return;
            }

            const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
            borrowedBooks.push({
                bookId: isbn,
                bookTitle: book.title,
                userId: userId,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: null
            });

            book.copiesAvailable -= 1; // Decrease available copies
            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

            Swal.fire('Success!', 'Book has been borrowed.', 'success');
            borrowBookForm.reset();
            borrowBookModal.hide(); // Close the borrow modal  
            loadBooks(); // Reload book list
            updateAdminBorrowedList(); // Update admin borrowed list
        });

        function loadBooks() {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            bookListContainer.innerHTML = ''; // Clear previous list

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('card', 'mb-3', 'm-4');
                bookCard.innerHTML = `
                    <div class="card-body m-3"> 
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><strong>Publisher:</strong> ${book.publisher}</p>
                        <p class="card-text"><strong>Copies Available:</strong> ${book.copiesAvailable}</p>
                        <button class="btn btn-success borrow-btn" data-isbn="${book.isbn}">Borrow</button>
                    </div>
                `;
                bookListContainer.appendChild(bookCard);
            });

            document.querySelectorAll('.borrow-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const isbn = this.getAttribute('data-isbn');
                    showBorrowBookForm(isbn);
                });
            });
        }

        function showBorrowBookForm(isbn) {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            const book = books.find(b => b.isbn === isbn);
            if (book && book.copiesAvailable > 0) {
                borrowBookForm.dataset.isbn = isbn;
                borrowBookModal.show();
            } else {
                Swal.fire('Error!', 'No copies available for this book.', 'error');
            }
        }

        loadBooks();
    }

    // Return Book
    const returnBookForm = document.getElementById('returnBookForm');
    const returnUserId = document.getElementById('returnUserId');
    const returnBookId = document.getElementById('returnBookId');

    if (returnBookForm) {
        returnBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = returnUserId.value.trim();
            const isbn = returnBookId.value.trim();
            const returnDate = new Date().toISOString().split('T')[0];

            if (!userId || !isbn) {
                Swal.fire('Error!', 'Please fill out all fields.', 'error');
                return;
            }

            const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
            const bookIndex = borrowedBooks.findIndex(b => b.userId === userId && b.bookId === isbn && !b.returnDate);
            if (bookIndex === -1) {
                Swal.fire('Error!', 'Book not found or already returned.', 'error');
                return;
            }

            borrowedBooks[bookIndex].returnDate = returnDate;

            const books = JSON.parse(localStorage.getItem('books')) || [];
            const book = books.find(b => b.isbn === isbn);
            if (book) {
                book.copiesAvailable += 1; // Increase available copies
                localStorage.setItem('books', JSON.stringify(books));
            }

            const returnBooks = JSON.parse(localStorage.getItem('returnBooks')) || [];
            returnBooks.push({
                bookId: isbn,
                bookTitle: borrowedBooks[bookIndex].bookTitle,
                userId: userId,
                borrowDate: borrowedBooks[bookIndex].borrowDate,
                dueDate: borrowedBooks[bookIndex].dueDate,
                returnDate: returnDate
            });

            localStorage.setItem('returnBooks', JSON.stringify(returnBooks));

            const dueDate = new Date(borrowedBooks[bookIndex].dueDate);
            const returnDt = new Date(returnDate);
            if (returnDt > dueDate) {
                const fine = (returnDt - dueDate) / (1000 * 60 * 60 * 24) * 10; // $10 per day fine
                Swal.fire('Late Return', `You have a fine of $${fine} for late return.`, 'warning');
            } else {
                Swal.fire('Success!', 'Book has been returned.', 'success');
            }

            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            returnBookForm.reset();
            updateAdminBorrowedList(); // Update admin borrowed list
            updateAdminReturnedList(); // Update admin returned list
        });
    }

    // Admin Page
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    const returnedBooksList = document.getElementById('returnedBooksList');

    function updateAdminBorrowedList() {
        if (borrowedBooksList) {
            const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
            borrowedBooksList.innerHTML = '';
            borrowedBooks.forEach(book => {
                if (!book.returnDate) {
                    const bookItem = document.createElement('div');
                    bookItem.className = 'card mt-2';
                    bookItem.innerHTML = `
                        <div class="card-body">  
                            <h5 class="card-title">${book.bookTitle}</h5>
                            <p class="card-text"><strong>User ID:</strong> ${book.userId}</p>
                            <p class="card-text"><strong>Borrow Date:</strong> ${book.borrowDate}</p>
                            <p class="card-text"><strong>Due Date:</strong> ${book.dueDate}</p>
                        </div> 
                    `;
                    borrowedBooksList.appendChild(bookItem);
                }
            });
        }
    }

    function updateAdminReturnedList() {
        if (returnedBooksList) {
            const returnBooks = JSON.parse(localStorage.getItem('returnBooks')) || [];
            returnedBooksList.innerHTML = '';
            returnBooks.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className = 'card mt-2';
                bookItem.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${book.bookTitle}</h5>
                        <p class="card-text"><strong>User ID:</strong> ${book.userId}</p>
                        <p class="card-text"><strong>Borrow Date:</strong> ${book.borrowDate}</p>
                        <p class="card-text"><strong>Due Date:</strong> ${book.dueDate}</p>
                        <p class="card-text"><strong>Return Date:</strong> ${book.returnDate}</p>
                    </div>
                `;
                returnedBooksList.appendChild(bookItem);
            });
        }
    }

    // Initialize admin views
    updateAdminBorrowedList();
    updateAdminReturnedList();

    // Delete Book
    window.deleteBook = function (isbn) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const updatedBooks = books.filter(b => b.isbn !== isbn);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        Swal.fire('Deleted!', 'Book has been deleted.', 'success');
        displayBooks();
        updateAdminBookList();
    }
});




