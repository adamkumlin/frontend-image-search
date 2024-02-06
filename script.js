// api key
const apikey = "42111173-a877c127734af95d5350e4bd2";
let middlePageButton = 4; // <-- 4 being the default value

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

  if (searchText != "" && searchText.length > 0 && searchText.length <= 100) {
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
    if (searchText.length > 100) {
      alert("Sökfältet får inte innehålla mer än 100 tecken.");
    } else {
      alert("Sökfältet får inte vara tomt.");
    }
    return;
  }
}

async function getJsonFromApi(apiCall) {
  if (apiCall === undefined) {
    return;
  }

  let result = fetch(apiCall).then((resp) => resp.json());
  return result;
}

// renders images + tags + user on the website
async function displayImages(imageJson) {
  if (imageJson === undefined) {
    return;
  }
  generatePageButtons(imageJson.totalHits);
  const main = document.querySelector("body main");
  imageJson.hits.forEach((hit) => {
    let imageContainer = document.createElement("div");

    let image = document.createElement("img");
    image.src = hit.webformatURL;
    image.alt = hit.tags;

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.onclick = () => {
      downloadImage(hit.webformatURL);
    };

    // When user clicks on an image we want to render the
    // .largeImageURL as an enlarged version of the image
    // along with a minimize button and a download button
    image.addEventListener("click", (e) => {
      if (e.ctrlKey) {
        window.open(hit.pageURL, "_blank");
      } else {
        imageContainer.id = "enlarged-image-div";
        image.id = "enlarged-image";
        image.src = hit.largeImageURL;

        const backAndDownloadButtonContainer = document.createElement("div");
        backAndDownloadButtonContainer.id =
          "back-and-download-button-container";

        const downloadButton = document.createElement("button");
        downloadButton.alt = "Ladda ner vald bild";
        downloadButton.type = "button";
        downloadButton.onclick = () => {
          downloadImage(hit.webformatURL);
        };

        // go back to search results button
        let backButton = document.createElement("button");
        backButton.textContent = "Minimera";
        backButton.alt = "Knapp som minimerar stor bild";
        backButton.id = "enlarged-image-go-back-button";

        backButton.addEventListener("click", () => {
          imageContainer.removeAttribute("id");
          image.removeAttribute("id");

          const backAndDownloadButtonDiv = document.getElementById(
            "back-and-download-button-container"
          );
          backAndDownloadButtonDiv.parentNode.removeChild(
            backAndDownloadButtonDiv
          );
        });

        // check if imageContainer has the minimize button, if not,
        // add it & the download button
        if (!imageContainer.querySelector("enlarged-image-go-back-button")) {
          backAndDownloadButtonContainer.append(backButton);
          backAndDownloadButtonContainer.append(downloadButton);
          imageContainer.append(backAndDownloadButtonContainer);
        }
      }
    });

    let tags = document.createElement("p");
    const tagsArray = hit.tags.split(", ");

    for (let i = 0; i < tagsArray.length; i++) {
      const tagElement = document.createElement("a");
      const searchText = document.getElementById("search");
      const submitButton = document.getElementById("submit");
      tagElement.addEventListener("click", () => {
        // Reset all values of the search form before tag search
        activateResetButton(true); // Activate button so that it is "click-able"
        resetButton.click(); // Manually click reset button

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
    imageContainer.append(image, tags, usernameContainer);
    main.append(imageContainer);
  });
}

function downloadImage(url) {
  // Because of security concerns, using the download attribute, you can only download files from the same origin/server
  // (e.g localhost, http://127.0.0.1:5500/index.html and not https://pixabay.com), which means we have to host the image on our own
  // local server. This can be solved using blob URLs (see below)

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = URL.createObjectURL(blob);
      // Create an object URL (our machine's hostname (localhost) followed by the image's relative URL)

      const downloadLink = document.createElement("a");

      const date = new Date();
      const today =
        date.getFullYear() +
        "-" +
        date.getMonth() +
        "-" +
        date.getDate() +
        "_" +
        date.getHours() +
        "." +
        date.getMinutes() +
        "." +
        date.getSeconds() +
        ".jpg";

      downloadLink.href = blobUrl;
      downloadLink.innerHTML = `<img src=${blobUrl} alt=""/>`;
      downloadLink.download = today;
      downloadLink.click();

      URL.revokeObjectURL(blobUrl);
      // Release the blobUrl
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

function searchAndDisplayImages(imageJson) {
  let main = document.querySelector("body main");

  // removes all children in main (i.e. removes all images)
  // before adding result from new search
  main.replaceChildren();

  // below code runs on new search vvvvvvvvvv
  // start shutter icon animation
  searchAnimation(true);
  // renders the images on search,
  // .then stops shutter icon animation
  displayImages(imageJson)
    .then(
      setTimeout(() => {
        searchAnimation(false);
      }, 800)
    )
    .then(activateResetButton(true)); // <-- load reset button

  return;
}

// activateResetButton, true = button is active, false = button is removed
function activateResetButton(buttonActive) {
  const resetButton = document.getElementById("resetButton");
  if (buttonActive) {
    resetButton.classList.add("active");
  } else {
    resetButton.classList.remove("active");
  }
}

// eventListener and it's associated function below
const mainForm = document.getElementById("form");
mainForm.addEventListener("submit", submitForm);

async function submitForm(e) {
  e.preventDefault();

  const apiCall = buildApiCallWithUserInput();
  if (apiCall) {
    const imageJsonNewSearch = await getJsonFromApi(apiCall).then((response) =>
      searchAndDisplayImages(response)
    );

    // a second api call here is ugly and probably bad practice
    // but i can not access totalHits otherwise
    const imageJsonTotalHits = await getJsonFromApi(apiCall).then(
      (response) => response.totalHits
    );

    const pageQuery = "&page=";

    // previous button event
    // ==================================================
    const prevButton = document.getElementById("previous");
    if (middlePageButton === 4) {
      prevButton.classList.add("grayed-out-button");
    }

    // variable needed to check if next button should be visible
    const resultsPerPage = document.getElementById("resultsPerPage").value;

    prevButton.onclick = async () => {
      if (middlePageButton > 4) {
        middlePageButton = middlePageButton - 1;
        const newApiCall = apiCall + pageQuery + middlePageButton;
        await getJsonFromApi(newApiCall).then((response) =>
          searchAndDisplayImages(response)
        );

        // disable previous button again if we are on page 1
        if (middlePageButton === 4) {
          prevButton.classList.remove("visible-button");
          prevButton.classList.add("grayed-out-button");
        }
        // enable next button again after pressing previous
        // button on last page
        if (imageJsonTotalHits - resultsPerPage * middlePageButton > resultsPerPage) {
          nextButton.classList.remove("grayed-out-button");
          nextButton.classList.add("visible-button");
        }
      }
    };
    // ==================================================

    // next button event
    // ==================================================
    const nextButton = document.getElementById("next");
    if (imageJsonTotalHits - resultsPerPage * middlePageButton > resultsPerPage) {
      nextButton.classList.add("visible-button");
    }

    nextButton.onclick = async () => {
      if (imageJsonTotalHits - resultsPerPage * middlePageButton > resultsPerPage) {
        // Display previous button after pressing next
        prevButton.classList.remove("grayed-out-button");
        prevButton.classList.add("visible-button");

        middlePageButton = middlePageButton + 1;
        const newApiCall = apiCall + pageQuery + middlePageButton;
        await getJsonFromApi(newApiCall).then((response) =>
          searchAndDisplayImages(response)
        );

        // disable next button if we are on last page
        if (
          !(imageJsonTotalHits - resultsPerPage * middlePageButton > resultsPerPage)
        ) {
          nextButton.classList.remove("visible-button");
          nextButton.classList.add("grayed-out-button");
        }
      }
    };
    // ==================================================
  }
}

function generatePageButtons(totalHits) {
  const resultsPerPage = document.getElementById("resultsPerPage").value;
  const totalPages = Math.ceil(totalHits / resultsPerPage);
  // Get the total amount of pages, rounded up

  let firstPageShown = middlePageButton - 3;
  let lastPageShown = middlePageButton + 3;

  if (lastPageShown >= totalPages) {
    return;
  }

  const pageButtonsContainer = document.getElementById("pageButtons");
  pageButtonsContainer.replaceChildren();

  if (firstPageShown != 1) {
    const startOfPageButtonsMarker = document.createElement("span");
    startOfPageButtonsMarker.textContent = "...";
    pageButtonsContainer.append(startOfPageButtonsMarker);
  }

  for (let i = firstPageShown; i <= lastPageShown; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    const apiCall = buildApiCallWithUserInput() + "&page=" + i;
    // Create new API-call for each button

    pageButton.onclick = () => {
      getJsonFromApi(apiCall).then((response) =>
        searchAndDisplayImages(response)
      );
      if (i === lastPageShown && lastPageShown != totalPages) {
        middlePageButton++;
      } else if (i === firstPageShown && firstPageShown != 1) {
        middlePageButton--;
      }
      // So that the pageNumber doesn't get out of range of available pages
    };
    pageButtonsContainer.append(pageButton);
  }

  if (lastPageShown != totalPages) {
    const endOfPageButtonsMarker = document.createElement("span");
    endOfPageButtonsMarker.textContent = "...";
    pageButtonsContainer.append(endOfPageButtonsMarker);
  }
}

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
  activateResetButton(false);
});
