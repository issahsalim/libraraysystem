document.addEventListener('DOMContentLoaded', () => {
    const returnBookForm = document.getElementById('returnBookForm');

    // Return book
    returnBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('returnUserId').value.trim();
        const isbn = document.getElementById('returnBookIsbn').value.trim();

        const books = JSON.parse(localStorage.getItem('books')) || [];
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        const returnedBooks = JSON.parse(localStorage.getItem('returnedBooks')) || [];

        const borrowedBookIndex = borrowedBooks.findIndex(b => b.userId === userId && b.isbn === isbn);
        if (borrowedBookIndex !== -1) {
            const borrowedBook = borrowedBooks[borrowedBookIndex];
            const bookIndex = books.findIndex(b => b.isbn === isbn);
            if (bookIndex !== -1) {
                books[bookIndex].copiesAvailable += 1;
            }

            const currentDate = new Date();
            const returnDate = new Date(borrowedBook.returnDate);
            let fine = 0; 

            if (currentDate > returnDate) {
                const lateDays = Math.ceil((currentDate - returnDate) / (1000 * 60 * 60 * 24));
                fine = lateDays * 10;        
                Swal.fire('Late Return', `You are ${lateDays} days late. Your fine is $${fine}.`, 'warning');
            } else { 
                Swal.fire('Returned!', 'Book returned successfully.', 'success');
            }

            returnedBooks.push({
                ...borrowedBook,
                actualReturnDate: currentDate.toISOString(), 
                fine
            });

            borrowedBooks.splice(borrowedBookIndex, 1);

            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            localStorage.setItem('returnedBooks', JSON.stringify(returnedBooks));

            returnBookForm.reset();
        } else {
            Swal.fire('Error', 'Book not found or not borrowed by this user.', 'error');
        }
    });
});
