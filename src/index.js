const BASE_URL = 'http://localhost:3000'

const quoteList = document.getElementById("quote-list");

function fetchQuotes() {

    return fetch(`${BASE_URL}/quotes?_embed=likes`)
        .then(res => res.json())
}

function createQuoteListItem(quoteObj) {
    const li = document.createElement('li');
    const h2 = document.createElement('h2')
    const h5 = document.createElement('h5')
    const br = document.createElement('br')

    const likeButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    h2.textContent = quoteObj.quote;
    h5.textContent = quoteObj.author;
    likeButton.textContent = `Likes: ${quoteObj.likes.length}`;
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener('click',() =>{
        deleteQuote(quoteObj);
    });

    likeButton.addEventListener('click', () => {
        likeQuote(quoteObj);
    });

    li.appendChild(h2);
    li.appendChild(h5);
    li.appendChild(likeButton);
    li.appendChild(br);
    li.appendChild(deleteButton);

    return li
}

function deleteQuote(quote) {
    configObj = {
        method: "DELETE",

    }
    fetch(`${BASE_URL}/quotes/${quote.id}/?_embed=likes`,configObj)
        .then(res => res.json())
        .then(() => fetchQuotes().then(appendQuotes))
}

function likeQuote(quote) {

    const likeData = {
        
        "quoteId": quote.id,
        "createdAt": new Date().getTime()
    }
    
    configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(likeData)
    }
    
    fetch(`${BASE_URL}/likes/`,configObj)
        .then(res => res.json())
        .then(() => fetchQuotes().then(appendQuotes))
        //.then(json => console.log(json))

}

function appendQuotes(quotes) {

    const quoteList = document.getElementById("quote-list");
    quoteList.innerHTML = "";
    quotes.forEach((quote) => {
        const quoteItem = createQuoteListItem(quote);
        quoteList.appendChild(quoteItem);
    });
}

function submitQuote() {
    const form = document.getElementById('new-quote-form');
    form.addEventListener('submit',(event) => {
        event.preventDefault();
        const newQuote = document.getElementById("new-quote").value;
        const author = document.getElementById("author").value;
        quote = {"quote": newQuote,
                "author": author
                };
        postQuote(quote)
        form.reset();
    })
}

function postQuote(quote) {
    configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(quote)
    };

    fetch(`${BASE_URL}/quotes`,configObj)
        .then(resp => resp.json())
        .then(() => {
            fetchQuotes().then(appendQuotes);
        })
}

function addSortButton(){
    const div = document.querySelector('div');
    const button = document.createElement('button');

    button.textContent = "Sort by Author"
    button.addEventListener('click',() => {
        sortQuotes();
        //console.log("It works")   
    })
    div.appendChild(button);
}

function sortQuotes(){
    fetchQuotes().then((quotes) => {
        appendQuotes(quotes.sort(compareAuthor));
    });
}

function compareAuthor(quote1,quote2) {
    author1 = quote1.author.toUpperCase();
    author2 = quote2.author.toUpperCase();

    if (author1 > author2){
        return 1;
    }
    else if (author2 > author1){
        return -1;
    }
    else {
        return 0;
    }
}


fetchQuotes().then(appendQuotes);
submitQuote();
addSortButton();