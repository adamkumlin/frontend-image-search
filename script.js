// api key
const apikey = "42111173-a877c127734af95d5350e4bd2";

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
    safesearch: "true",
  });

  const query = "&" + urlSearchParams.toString();
  return query;
}

// api call, returns json
function buildApiCall(query) {
  const url = "https://pixabay.com/api/?key=" + apikey + query;

  return url;
}

function buildApiCallWithUserInput() {
  // get all of the info the user has submitted
  const searchText = document.getElementById("search").value;
  const color = document.getElementById("color").value;
  const category = document.getElementById("category").value;
  const imageType = document.getElementById("imageType").value;
  const resultsPerPage = document.getElementById("resultsPerPage").value;
  const order = document.getElementById("order").value;

  if (searchText != "") {
    // Build query & retrieve json from api
    const query = buildQuery(
      searchText,
      color,
      category,
      imageType,
      resultsPerPage,
      order
    );
    const apiCall = buildApiCall(query);

    return apiCall;
  } else {
    alert("Fel: Sökfältet är tomt.");
    return;
  }
}

async function getJsonFromApi() {
  const apiCall = buildApiCallWithUserInput();
  let result = fetch(apiCall).then((resp) => resp.json());

  return result;
}

// renders images + tags + user on the website
async function displayImages() {
  const imageJson = await getJsonFromApi();
  const main = document.querySelector("body main");

  imageJson.hits.forEach((hit) => {
    let imageContainer = document.createElement("div");

    let image = document.createElement("img");
    image.src = hit.webformatURL;
    image.alt = hit.tags;

    let tags = document.createElement("p");
    const tagsArray = hit.tags.split(", ");

    for (let i = 0; i < tagsArray.length; i++) {
      const tagElement = document.createElement("span");
      const searchText = document.getElementById("search");
      const submitButton = document.getElementById("submit");
      
      tagElement.addEventListener("click", () => {
        searchText.value = tagsArray[i];
        displayImages();
      });

      if (i == tagsArray.length - 1) {
        tagElement.textContent = "#" + tagsArray[i];
      } else {
        tagElement.textContent = "#" + tagsArray[i] + ", ";
      }

      tags.append(tagElement);
    }

    let username = document.createElement("p");
    username.textContent = "Taken by: " + hit.user;

    imageContainer.append(image, tags, username);
    main.append(imageContainer);
  });
}

function searchAnimation(animate) {
  // Boolean determines when to start and stop the animation
  // For the search animation, add class with name "animated" to the image in the h1
  const image = document.querySelector("h1 img");

  if (animate) {
    image.classList.add("animated");
  } else {
    image.classList.remove("animated");
  }
  // Add and remove class, respectively
}

// eventListener and it's associated function below
const mainForm = document.getElementById("form");
mainForm.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  // set searchAnimation(false);
  // When data has been fetched/displayed
  searchAnimation(true);

  displayImages();
}
