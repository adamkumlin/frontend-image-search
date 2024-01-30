// api key 
const apikey = "42111173-a877c127734af95d5350e4bd2";

// api call, returns json 
async function apiCallJSON(query) {
    const url = "https://pixabay.com/api/?key=" +
        apikey +
        query;
    const result = await fetch(url);
    const json = await result.json();

    return json;
}

// build query, return value is meant to be passed as parameter to apiCall() 
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

    const query = "&" + urlSearchParams.toString();
    return query;
}

function submitForm(e) {
    e.preventDefault();

    let searchString = document.getElementById("search").value;
    const color = document.getElementById("color").value;

    if (searchString != "") {
        // Build query
        console.log(buildQuery(searchString));
        console.log(apiCallJSON(buildQuery(searchString)));
    }
    else {
        alert("Fel: Sökfältet är tomt.")
        return;
    }
}

const mainForm = document.getElementById("form");
mainForm.addEventListener("submit", submitForm);