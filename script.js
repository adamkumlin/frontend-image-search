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

// eventListener and it's associated function below
const mainForm = document.getElementById("form");
mainForm.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    const image = document.querySelector("h1 img");
    image.classList.add("animated");
    // For the search animation, add class with name "animated" to the image in the h1

    // TODO: remove class when displaying images, can be done later

    const searchText = document.getElementById("search").value;
    const color = document.getElementById("color").value;
    const category = document.getElementById("category").value;
    const imageType = document.getElementById("imageType").value;
    const resultsPerPage = document.getElementById("resultsPerPage").value;
    let order = "popular"; // using let so we can override in if-statement

    if (document.getElementById("popular").checked) {
        order = document.getElementById("popular").value;
    }
    if (document.getElementById("latest").checked) {
        order = document.getElementById("latest").value;
    }

    if (searchText != "") {
        // Build query
        const testQuery = 
            buildQuery(
                searchText, color, category, imageType, resultsPerPage, order
            );
        const testApiCallJSON = apiCallJSON(testQuery);
        console.log(testQuery);
        console.log(testApiCallJSON);
    }
    else {
        alert("Fel: Sökfältet är tomt.")
        return;
    }
}

