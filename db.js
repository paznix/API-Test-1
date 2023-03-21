const books = [
    {
        ISBN: "1234Book",
        title: "Harry Potter",
        pubDate: "2022-05-12",
        language: "en",
        numPage: 250, 
        author: [1,2],
        publications: 1,
        category: ["education", "fantasy"]
    }
];

const author = [
    {
        id: 1,
        name: "J K Rowling",
        books: ["1234Book", "Cursed Child"]
    },
    {
        id: 2,
        name: "Kunal Saini",
        books: ["1234Book"]
    }
];

const publications = [
    {
        id: 1,
        name: "writex",
        books: ["1234Books"]
    },
    {
        id: 2,
        name: "Rizzards",
        books: []
    }
];

module.exports = {books, author, publications};