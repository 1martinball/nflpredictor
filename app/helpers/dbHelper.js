
let findBookByTitleAndAuthor = (title, author) => {
	
	return new Promise((resolve, reject) => {
		db.bookModel.findOne({title: title, author: author}, (error, book) => {
			if (error) {
				reject(error);
			} else {
				resolve(book);
			}
		});
	});
}

// The ES6 promisified version of findById
let findById = id => {
	return new Promise((resolve, reject) => {
		db.userModel.findById(id, (error, user) => {
			if (error) {
				reject(error);
			} else {
				resolve(user);
			}
		});
	});
}

let addBookData = request => {
	console.log(request.user.firstname);
	let foundBook = findBookByTitleAndAuthor(req.body.title, req.body.author);
	return new Promise((resolve, reject) => {
		let newBook = new db.bookModel({
			user: "1martinball",
			title: request.body.title,
			author: request.body.author,
			isbn: 'isbn',
			fiction: request.body.fiction,
			genre: request.body.genre,
			date: request.body.year
		});


		newBook.save(error => {
			if (error) {
				reject(new Error("Error saving book to repository"));
			} else {
				resolve(newBook);
			}
		});
	});
}


let findBookData = req => {

	return new Promise((resolve, reject) => {
		let read = req.query.read;
		let fiction = req.query.fiction;
		let genre = req.query.genre;
		let year = req.query.year;
		let findQuery = constructFindQuery(read, fiction, genre, year);
		console.log("Read : " + read + ", Fiction : " + fiction + ", Genre : " + genre + ", Year : " + year);
		let books = db.bookModel.find(findQuery, (err, books) => {
			if (err) {
				reject(err);
			} else {
				resolve(books);
			}
		});
	});
}