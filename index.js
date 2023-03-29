require("dotenv").config();


const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require("body-parser")

// Database
const database = require('./Database/db');
const { urlencoded } = require('express');

//Models
const BookModel = require("./Database/book");
const AuthorModel = require("./Database/author");
const PublicationModel = require("./Database/publication");

// Initialize express
const booky = express();
const port = 3000;

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// MongoDB
const mongoDB = process.env.MONGO_URL;

mongoose.connect(mongoDB).then(()=> console.log("Connection to database successful."));


//! GET 

/*
Route           /
Description     Get all the books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/", async (req,res)=> {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks)
});


/*
Route           /is
Description     Get a specific book on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/is/:isbn", async (req,res)=> {

    const getBook = await BookModel.findOne({ISBN: req.params.isbn});

    if (!getBook){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json(getBook);
});


/*
Route           /c
Description     Get a specific book on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category", async (req,res)=> {

    const getBook = await BookModel.findOne({category: req.params.category});

    if (!getBook){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }

    return res.json(getBook);
});


/*
Route           /lang
Description     Get a specific book on language
Access          PUBLIC
Parameter       language
Methods         GET
*/

booky.get("/lang/:language", async (req, res) => {

    const getBook = await BookModel.findOne({language: req.params.language});

    if (!getBook){
        return res.json({error: `No book found for the language ${req.params.language}`});
    }

    return res.json(getBool);
});


/*
Route           /authors
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/authors", async (req,res)=> {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});


/*
Route           /authors/n
Description     Get a specific author
Access          PUBLIC
Parameter       name
Methods         GET
*/

booky.get("/authors/n/:name", async (req,res)=> {

    const getAuthor = await AuthorModel.findOne({name: req.params.name});

    if (!getAuthor){
        return res.json({error: `No author found for the name of ${req.params.name}`})
    }

    return res.json(getAuthor);
});


/*
Route           /authors/book
Description     Get a list of authors based on books
Access          PUBLIC
Parameter       books
Methods         GET
*/

booky.get("/authors/books/:book", async (req,res)=> {
    const getAuthor = await AuthorModel.findOne({books: req.params.book});

    if (!getAuthor){
        return res.json({error: `No author found for the book of ${req.params.book}`})
    }

    return res.json(getAuthor);
});


/*
Route           /publications
Description     Get all publications
Access          PUBLIC
Parameter       books
Methods         GET
*/

booky.get("/publications" , async (req, res) =>{
    const getAllPublcations = await PublicationModel.find();
    return res.json(getAllPublcations);
});


/*
Route           /publications/p
Description     Get a specific publication
Access          PUBLIC
Parameter       name
Methods         GET
*/

booky.get("/publications/p/:name" , async (req, res) => {

    const getPub = await PublicationModel.findOne({name: req.params.name});

    if (!getPub){
        return res.json({error: `No publication found for the name of ${req.params.name}`});
    }
    
    return res.json(getPub);
    
});


/*
Route           /publications/books
Description     Get a list of authors based on books
Access          PUBLIC
Parameter       books
Methods         GET
*/

booky.get("/publications/books/:book", async (req, res) => {

    const getPub = await PublicationModel.findOne({books: req.params.book})

    if (!getPub){
        return res.json({error: `No publication of book found for the name of ${req.params.book}`});
    }
    
    return res.json(getPub);
});


//! POST

/*
Route           /book/new
Description     Add a new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", async (req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: 'Book added'
    });
});


/*
Route           /authors/new
Description     Add a new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/authors/new" , async (req, res) => {
    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        authors: addNewAuthor,
        message: "Author added"
    });
});


/*
Route           /publications/new
Description     Add a new publication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/publications/new", async (req,res) =>{
    const {newPub} = req.body;
    const addNewPub = PublicationModel.create(newPub);
    return res.json({
        publications: addNewPub,
        message: "Publication added"
    });
});



//! PUT

/*
Route           /book/update
Description     update book on isbn
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/book/update/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    );
    return res.json({
        books: updatedBook
    });
});


/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/book/author/update/:isbn", async (req, res) => {
    //? Update book Database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                authors: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    //? Update author Database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.params.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New Author added."
    });
});



/*
Route           /publications/update/book
Description     update/add new publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/publications/update/book/:isbn" , (req, res) => {

    //?Update the publications database

    database.publications.forEach((pub) => {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        } 
    });
    if(database.books.includes(req.params.isbn)){}
    //?Update the books database

    database.books.forEach((book) =>{
        if(book.isbn === req.body.isbn){
                book.publications = req.body.pubId;
                return;
            }
    });
    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successful!"
    })
});



//! DELETE

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", async (req, res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: updatedBookDatabase
    });

});


/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/

// booky.delete("/book/delete/:isbn", (req, res) => {
//     const updatedBookDatabase = database.books.filter(
//         (book) => book.ISBN !== req.params.isbn
//     );
//     database.books = updatedBookDatabase;

//     return res.json({books: database.books});
// });


/*
Route           /book/delete/auhtor
Description     delete an author from a book and vice versa
Access          PUBLIC
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) =>{
    //? Update the books database

    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
            (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    //? Update the author database

    database.author.forEach((eachAuthor) => {
        if (eachAuthor.id === parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!"
    });
});


booky.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

