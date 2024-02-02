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

  if (searchText != "" 
    && searchText.length > 0
    && searchText.length <= 100) {
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
  } 
  else {
    const main = document.querySelector("body main");
    let h2 = document.createElement("h2");

    if (searchText.length > 100) {
      h2.textContent = "Sökfältet får inte innehålla mer än 100 tecken."
    }
    else {
      h2.textContent = "Sökfältet får inte vara tomt."
    }

    main.append(h2);

    return;
  }
}

async function getJsonFromApi() {
  const apiCall = buildApiCallWithUserInput();

  if (apiCall == undefined) {
    return;
  }

  let result = fetch(apiCall).then((resp) => resp.json());
  return result;
}

// renders images + tags + user on the website
async function displayImages() {
  const imageJson = await getJsonFromApi();

  if (imageJson == undefined) {
    return;
  }

  const main = document.querySelector("body main");

  imageJson.hits.forEach((hit) => {
    let imageContainer = document.createElement("div");
    const detailsContainer = document.createElement("div");

    let image = document.createElement("img");
    image.src = hit.webformatURL;
    image.alt = hit.tags;

    let tags = document.createElement("p");
    const tagsArray = hit.tags.split(", ");

    for (let i = 0; i < tagsArray.length; i++) {
      const tagElement = document.createElement("a");
      const searchText = document.getElementById("search");
      const submitButton = document.getElementById("submit");
      tagElement.addEventListener("click", () => {
        searchText.value = tagsArray[i];
        main.replaceChildren();

        submitButton.click();
        // To avoid recursion, essentially making a new search without clicking the submit button
      });
      // Assign the value of the search box to that of the tag that was clicked

      tagElement.href = "#";
      // Make the a-element behave like a link, also scrolls to the top of the page
      // when clicked

      if (i === tagsArray.length - 1) {
        tagElement.textContent = "#" + tagsArray[i];
      } else {
        tagElement.textContent = "#" + tagsArray[i] + ", ";
      }
      // Add a hashtag (#) before and a comma followed by a space (, ) after each tagElement, except for the last element which only receives a hashtag before

      tags.append(tagElement);
    }

    const usernameContainer = document.createElement("p");
    let username = document.createElement("a");

    const HOST_URL = "https://pixabay.com";
    const userProfileUrl = new URL(
      `/users/${hit.user}-${hit.user_id}`,
      HOST_URL
    );
    // Build URL to user profile

    username.textContent = hit.user;
    username.href = userProfileUrl;
    username.target = "_blank";

    usernameContainer.textContent = "Av: ";
    usernameContainer.append(username);
    detailsContainer.append(tags, usernameContainer);
    imageContainer.append(image, detailsContainer);
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

  let main = document.querySelector("body main");

  // removes all children in main (i.e. removes all images)
  // before adding result from new search
  main.replaceChildren();

  // set searchAnimation(false);
  // When data has been fetched/displayed
  searchAnimation(true);

  // renders the images on search, 
  // .then handles shutter icon animation 
  displayImages()
    .then(
      setTimeout(() => {
        searchAnimation(false)
      }, 800));
}

// previous button event
const prevButton = document.getElementById("previous");
prevButton.onclick = (e) => {
  displayImages("previous-page");
  console.log("prev button pressed");
};

// next button event
const nextButton = document.getElementById("next");
nextButton.onclick = (e) => {
  console.log("next button pressed");
};
