//This is the first project that i've downloaded and used the prettify app to auto adjust my code everytime i save the file.
//This function fetches the URL and returns a promise to parse the JSON into a JS object
async function fetch(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      resolve(JSON.parse(xhr.responseText));
    });
    xhr.addEventListener("error", (err) => {
      reject(err);
    });
    xhr.open("GET", url);
    xhr.send();
  });
}

//This function immediately calls itself after awaiting to fetch the 12 random users
//It then dynamically displays the users along with a search bar
//then depending on what you type in the search bar, those results will now be displayed.
(async function () {
  try {
    const response = await fetch(
      "https://randomuser.me/api/?results=12&nat=us"
    );
    displayPeople(null, response.results);
    const searchContainerDiv = document.getElementsByClassName(
      "search-container"
    )[0];
    searchContainerDiv.insertAdjacentHTML(
      "beforeend",
      `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `
    );
    searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
      displayPeople(searchInput.value, response.results);
    });
  } catch (e) {
    console.log(e);
  }
})();

//This function dynmaically displays a larger, in depth profile of each person after clicking on the person
//Then it allows you to click the next and back bottons to go through all the profiles.
//Once you get to the end of the list, it loops back to the beginning of the list and vice versa.
//Also when clicking the X in the Modal window, it exits/removes the modal view
function showModal(results, i) {
  const result = results[i];
  const dob = new Date(result.dob.date);
  let modalContainer = document.getElementsByClassName("modal-container")[0];
  if (modalContainer) {
    modalContainer.remove();
  }
  galleryDiv.insertAdjacentHTML(
    "afterend",
    `
              <div class="modal-container">
                  <div class="modal">
                      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                      <div class="modal-info-container">
                          <img class="modal-img" src="${
                            result.picture.large
                          }" alt="profile picture">
                          <h3 id="name" class="modal-name cap">${
                            result.name.first
                          } ${result.name.last}</h3>
                          <p class="modal-text">${result.email}</p>
                          <p class="modal-text cap">${result.location.city}</p>
                          <hr>
                          <p class="modal-text">${result.cell}</p>
                          <p class="modal-text">${
                            result.location.street.number
                          } ${result.location.street.name}, ${
      result.location.city
    }, ${result.location.state} ${result.location.postcode}</p>
                          <p class="modal-text">Birthday: ${
                            dob.getMonth() + 1
                          }/${dob.getDate()}/${dob.getFullYear()}</p>
                      </div>
                  </div>
                  <div class="modal-btn-container">
                      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                      <button type="button" id="modal-next" class="modal-next btn">Next</button>
                  </div>
              </div>
          `
  );
  modalContainer = document.getElementsByClassName("modal-container")[0];
  const prev = document.getElementById("modal-prev");
  const next = document.getElementById("modal-next");
  prev.addEventListener("click", () => {
    if (i === 0) {
      i = results.length - 1;
    }
    showModal(results, i - 1);
  });
  next.addEventListener("click", () => {
    i = i + 1;
    if (i === results.length) {
      i = 0;
    }
    showModal(results, i);
  });
  const closeBtn = document.getElementById("modal-close-btn");
  closeBtn.addEventListener("click", () => {
    modalContainer.remove();
  });
}

//This function displays the people by first name and last name depending on what you type in the search bar
//it puts everything  you type to lowercase
//Depending on what you type it will remove everything but the results.
function displayPeople(filter, results) {
  if (filter) {
    results = results.filter((result) => {
      return (
        result.name.first.toLowerCase().includes(filter.toLowerCase()) ||
        result.name.last.toLowerCase().includes(filter.toLowerCase())
      );
    });
  }
  console.log(results);
  galleryDiv = document.getElementById("gallery");
  while (galleryDiv.firstChild) {
    galleryDiv.removeChild(galleryDiv.firstChild);
  }
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    galleryDiv.insertAdjacentHTML(
      "beforeend",
      `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${result.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${result.name.first} ${result.name.last}</h3>
                <p class="card-text">${result.email}</p>
                <p class="card-text cap">${result.location.city}, ${result.location.state}</p>
            </div>
        </div>
        `
    );
    galleryDiv.children[i].addEventListener("click", () => {
      showModal(results, i);
    });
  }
}
