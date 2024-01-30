// api key 
const apikey = "42111173-a877c127734af95d5350e4bd2";

// api call 
async function apiCall(query) {
    const baseUrl = "https://pixabay.com/api/?key=" + apikey;
    const urlWithQuery = baseUrl + query;
    const result = await fetch(urlWithQuery); 
    const json = result.json;

    return json;
} 

// build query, meant to be passed as parameter to apiCall() 
function buildQuery(
    searchTerm,
    color,
    category,
    imageType,
    resultsPerPage,
    order
) {
    const urlSearchParams = new URLSearchParams({
        q: searchTerm,
        colors: color,
        category: category,
        image_type: imageType,
        per_page: resultsPerPage,
        order: order,
        safesearch: "true"
    })

    const urlWithQuery = "&" + urlSearchParams.toString();
    return urlWithQuery;
}


const form = document.getElementById("form");

form.onsubmit = (e) => {
    e.preventDefault();

    let searchString = document.getElementById("search").value;
    const color = document.getElementById("color").value;

    if (searchString != "") {
        // Build query
    } else {
        alert("Fel: Sökfältet är tomt.")
        return;
    }
    const query = `&q=${searchString}&colors=${color}&per_page=10`;
}

console.log(buildQuery());

console.log("yo")
