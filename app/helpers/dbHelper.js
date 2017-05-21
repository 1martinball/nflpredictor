let findBookByTitleAndAuthor = (title, author) => {

	return new Promise((resolve, reject) => {
		db.bookModel.findOne({
			title: title,
			author: author
		}, (error, book) => {
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


var opt = new Option(result[i], result[i]);
$(opt).html(result[i]);
$('#selectPlayer').append(opt);








{
	"gsisId": "2016090800",
	"seasonYear": 2016,
	"startTime": "20160909T003000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Thursday",
	"gameKey": "56901",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 0,
		"turnovers": 1,
		"scoreQ2": 7,
		"score": 21,
		"team": "DEN",
		"scoreQ1": 0,
		"scoreQ4": 14
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 0,
		"turnovers": 0,
		"scoreQ2": 10,
		"score": 20,
		"team": "CAR",
		"scoreQ1": 7,
		"scoreQ4": 3
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091100",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56902",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 8,
		"turnovers": 0,
		"scoreQ2": 3,
		"score": 24,
		"team": "ATL",
		"scoreQ1": 10,
		"scoreQ4": 3
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 14,
		"turnovers": 2,
		"scoreQ2": 14,
		"score": 31,
		"team": "TB",
		"scoreQ1": 3,
		"scoreQ4": 0
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091101",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56903",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 0,
		"turnovers": 1,
		"scoreQ2": 7,
		"score": 13,
		"team": "BAL",
		"scoreQ1": 3,
		"scoreQ4": 3
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 0,
		"turnovers": 0,
		"scoreQ2": 7,
		"score": 7,
		"team": "BUF",
		"scoreQ1": 0,
		"scoreQ4": 0
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091102",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56904",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 3,
		"turnovers": 0,
		"scoreQ2": 10,
		"score": 23,
		"team": "HOU",
		"scoreQ1": 0,
		"scoreQ4": 10
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 0,
		"turnovers": 0,
		"scoreQ2": 7,
		"score": 14,
		"team": "CHI",
		"scoreQ1": 7,
		"scoreQ4": 0
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091103",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56905",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 3,
		"turnovers": 0,
		"scoreQ2": 10,
		"score": 23,
		"team": "JAC",
		"scoreQ1": 7,
		"scoreQ4": 3
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 3,
		"turnovers": 0,
		"scoreQ2": 14,
		"score": 27,
		"team": "GB",
		"scoreQ1": 7,
		"scoreQ4": 3
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091104",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56906",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 7,
		"turnovers": 1,
		"scoreQ2": 0,
		"score": 33,
		"team": "KC",
		"scoreQ1": 3,
		"scoreQ4": 17
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 3,
		"turnovers": 1,
		"scoreQ2": 14,
		"score": 27,
		"team": "SD",
		"scoreQ1": 7,
		"scoreQ4": 3
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091105",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56907",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 7,
		"turnovers": 0,
		"scoreQ2": 14,
		"score": 34,
		"team": "NO",
		"scoreQ1": 3,
		"scoreQ4": 10
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 3,
		"turnovers": 0,
		"scoreQ2": 0,
		"score": 35,
		"team": "OAK",
		"scoreQ1": 10,
		"scoreQ4": 22
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091106",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56908",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 0,
		"turnovers": 0,
		"scoreQ2": 9,
		"score": 22,
		"team": "NYJ",
		"scoreQ1": 7,
		"scoreQ4": 6
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 7,
		"turnovers": 2,
		"scoreQ2": 10,
		"score": 23,
		"team": "CIN",
		"scoreQ1": 3,
		"scoreQ4": 3
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091107",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56909",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 9,
		"turnovers": 2,
		"scoreQ2": 6,
		"score": 29,
		"team": "PHI",
		"scoreQ1": 7,
		"scoreQ4": 7
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 3,
		"turnovers": 2,
		"scoreQ2": 7,
		"score": 10,
		"team": "CLE",
		"scoreQ1": 0,
		"scoreQ4": 0
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091108",
	"seasonYear": 2016,
	"startTime": "20160911T170000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56910",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 0,
		"turnovers": 2,
		"scoreQ2": 7,
		"score": 16,
		"team": "TEN",
		"scoreQ1": 3,
		"scoreQ4": 6
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 12,
		"turnovers": 2,
		"scoreQ2": 0,
		"score": 25,
		"team": "MIN",
		"scoreQ1": 0,
		"scoreQ4": 13
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091109",
	"seasonYear": 2016,
	"startTime": "20160911T200500.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56911",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 0,
		"turnovers": 1,
		"scoreQ2": 3,
		"score": 12,
		"team": "SEA",
		"scoreQ1": 3,
		"scoreQ4": 6
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 0,
		"turnovers": 0,
		"scoreQ2": 3,
		"score": 10,
		"team": "MIA",
		"scoreQ1": 0,
		"scoreQ4": 7
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091110",
	"seasonYear": 2016,
	"startTime": "20160911T202500.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56912",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 7,
		"turnovers": 0,
		"scoreQ2": 6,
		"score": 19,
		"team": "DAL",
		"scoreQ1": 3,
		"scoreQ4": 3
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 0,
		"turnovers": 2,
		"scoreQ2": 13,
		"score": 20,
		"team": "NYG",
		"scoreQ1": 0,
		"scoreQ4": 7
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091111",
	"seasonYear": 2016,
	"startTime": "20160911T202500.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56913",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 8,
		"turnovers": 1,
		"scoreQ2": 10,
		"score": 35,
		"team": "IND",
		"scoreQ1": 0,
		"scoreQ4": 17
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 7,
		"turnovers": 0,
		"scoreQ2": 14,
		"score": 39,
		"team": "DET",
		"scoreQ1": 7,
		"scoreQ4": 11
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091112",
	"seasonYear": 2016,
	"startTime": "20160912T003000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Sunday",
	"gameKey": "56914",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 7,
		"turnovers": 1,
		"scoreQ2": 7,
		"score": 21,
		"team": "ARI",
		"scoreQ1": 0,
		"scoreQ4": 7
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 7,
		"turnovers": 0,
		"scoreQ2": 0,
		"score": 23,
		"team": "NE",
		"scoreQ1": 10,
		"scoreQ4": 6
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091200",
	"seasonYear": 2016,
	"startTime": "20160912T231000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Monday",
	"gameKey": "56915",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 3,
		"turnovers": 1,
		"scoreQ2": 0,
		"score": 16,
		"team": "WAS",
		"scoreQ1": 6,
		"scoreQ4": 7
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 10,
		"turnovers": 3,
		"scoreQ2": 14,
		"score": 38,
		"team": "PIT",
		"scoreQ1": 0,
		"scoreQ4": 14
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}, {
	"gsisId": "2016091201",
	"seasonYear": 2016,
	"startTime": "20160913T022000.000Z",
	"timeInserted": "20160907T204104.909Z",
	"dayOfWeek": "Monday",
	"gameKey": "56916",
	"finished": true,
	"homeTeam": {
		"scoreQ3": 0,
		"turnovers": 1,
		"scoreQ2": 7,
		"score": 28,
		"team": "SF",
		"scoreQ1": 7,
		"scoreQ4": 14
	},
	"timeUpdate": "20161004T201022.311Z",
	"awayTeam": {
		"scoreQ3": 0,
		"turnovers": 3,
		"scoreQ2": 0,
		"score": 0,
		"team": "LA",
		"scoreQ1": 0,
		"scoreQ4": 0
	},
	"week": "NflWeek1",
	"seasonType": "Regular"
}
