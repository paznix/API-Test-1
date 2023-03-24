const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require("body-parser")

// Database
const database = require('./db');
const { urlencoded } = require('express');

// Initialize express
const booky = express();
const port = 3000;

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// MongoDB
const mongoDB = "mongodb+srv://paznic:Shadowkingg%409@clustercp.1n4ssbm.mongodb.net/Booky?retryWrites=true&w=majority";

mongoose.connect(mongoDB).then(()=> console.log("Connection to database successful."));


//! GET 

/*
Route           /
Description     Get all the books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/", (req,res)=> {
    return res.json({books: database.books})
});


/*
Route           /is
Description     Get a specific book on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/is/:isbn", (req,res)=> {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if (getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook});
});


/*
Route           /c
Description     Get a specific book on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category", (req,res)=> {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if (getSpecificBook.length === 0){
        return res.json({error: `No book found for the category ${req.params.category}`})
    }

    return res.json({book: getSpecificBook})
});


/*
Route           /lang
Description     Get a specific book on language
Access          PUBLIC
Parameter       language
Methods         GET
*/

booky.get("/lang/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language);

    if (getSpecificBook.length === 0){
        return res.json({error: `No book found for the language ${req.params.language}`});
    }

    return res.json({book: getSpecificBook});
});


/*
Route           /authors
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/authors", (req,res)=> {
    return res.json({author: database.author})
});


/*
Route           /authors/n
Description     Get a specific author
Access          PUBLIC
Parameter       name
Methods         GET
*/

booky.get("/authors/n/:name", (req,res)=> {
    const getSpecificAuthor = database.author.filter(
        (author) => author.name == req.params.name
    );

    if (getSpecificAuthor.length === 0){
        return res.json({error: `No author found for the name of ${req.params.name}`})
    }

    return res.json({author: getSpecificAuthor});
});


/*
Route           /authors/book
Description     Get a list of authors based on books
Access          PUBLIC
Parameter       books
Methods         GET
*/

booky.get("/authors/book/:books", (req,res)=> {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.books)
    );

    if (getSpecificAuthor.length === 0){
        return res.json({error: `No author found for the book of ${req.params.book}`})
    }

    return res.json({author: getSpecificAuthor});
});


/*
Route           /publications
Description     Get all publications
Access          PUBLIC
Parameter       books
Methods         GET
*/

booky.get("/publications" , (req, res) =>{
    return res.json({publications: database.publications});
});


/*
Route           /publications/p
Description     Get a specific publication
Access          PUBLIC
Parameter       name
Methods         GET
*/

booky.get("/publications/p/:name" , (req, res) => {
    const getSpecificPub = database.publications.filter(
        (publication) => publication.name === req.params.name);

    if (getSpecificPub.length === 0){
        return res.json({error: `No publication found for the name of ${req.params.name}`});
    }
    
    return res.json({publications: getSpecificPub});
    
});


/*
Route           /publications/books
Description     Get a list of authors based on books
Access          PUBLIC
Parameter       books
Methods         GET
*/

booky.get("/publications/books/:book", (req, res) => {
    const getSpecificPub = database.publications.filter(
        (publication) => publication.books.includes(req.params.book));

    if (getSpecificPub.length === 0){
        return res.json({error: `No publication of book found for the name of ${req.params.book}`});
    }
    
    return res.json({publicaitons: getSpecificPub});
});


//! POST

/*
Route           /book/new
Description     Add a new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});


/*
Route           /authors/new
Description     Add a new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/authors/new" , (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});


/*
Route           /publications/new
Description     Add a new publication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/publications/new", (req,res) =>{
    const newPub = req.body;
    database.publications.push(newPub);
    return res.json(database.publications);
});



//! PUT

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

booky.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});


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

