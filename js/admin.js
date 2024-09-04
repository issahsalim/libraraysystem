document.addEventListener('DOMContentLoaded', () => {
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    const returnedBooksList = document.getElementById('returnedBooksList');

    // Load and display borrowed books
    function loadBorrowedBooks() {
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        borrowedBooksList.innerHTML = ''; // Clear previous list

        if (borrowedBooks.length === 0) {
            const noBooksMessage = document.createElement('li');
            noBooksMessage.classList.add('list-group-item', 'bg-danger', 'text-light', 'text-center');
            noBooksMessage.textContent = 'No books have been borrowed.';
            borrowedBooksList.appendChild(noBooksMessage);
        } else {
            borrowedBooks.forEach(book => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'bg-dark', 'text-white');
                listItem.innerHTML = `
                    <strong>${book.title}</strong> (ISBN: ${book.isbn})
                    <br>
                    <small>Borrowed by User ID: ${book.userId}</small>
                    <br>
                    <small>Borrow Date: ${new Date(book.borrowDate).toLocaleDateString()}</small>
                    <br>
                    <small>Return Date: ${new Date(book.returnDate).toLocaleDateString()}</small>
                `;
                borrowedBooksList.appendChild(listItem);
            });
        }
    }

    // Load and display returned books
    function loadReturnedBooks() {
        const returnedBooks = JSON.parse(localStorage.getItem('returnedBooks')) || [];
        returnedBooksList.innerHTML = ''; // Clear previous list

        if (returnedBooks.length === 0) {
            const noBooksMessage = document.createElement('li');
            noBooksMessage.classList.add( 'bg-danger', 'text-light','list-group-item','text-center');
            noBooksMessage.textContent = 'No books have been returned.';
            returnedBooksList.appendChild(noBooksMessage); 
        } else {
            returnedBooks.forEach(book => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'bg-dark', 'text-white');
                listItem.innerHTML = `
                    <strong>${book.title}</strong> (ISBN: ${book.isbn})
                    <br>
                    <small>Returned by User ID: ${book.userId}</small>
                    <br>
                    <small>Original Return Date: ${new Date(book.returnDate).toLocaleDateString()}</small>
                    <br>
                    <small>Actual Return Date: ${new Date(book.actualReturnDate).toLocaleDateString()}</small>
                    <br>
                    <small>Fine: $${book.fine}</small>
                `;
                returnedBooksList.appendChild(listItem);
            });
        }
    }

    // Initial load
    loadBorrowedBooks();
    loadReturnedBooks();
});
