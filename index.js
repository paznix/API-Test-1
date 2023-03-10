const express = require('express');

// Database
const database = require('./db');

// Initialize express
const booky = express();
const port = 3000;


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



booky.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

