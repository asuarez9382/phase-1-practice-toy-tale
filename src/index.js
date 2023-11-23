let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Puts the toys on the DOM
function renderToys(data) {
  toyCollection = document.querySelector("#toy-collection");

  // Clear the existing toys in the collection
  toyCollection.innerHTML = "";

  // Check if there are multiple toys or a single new toy
  if (Array.isArray(data)) {
    for (const toy of data) {
      renderToy(toy);
    }
  } else {
    renderToy(data);
  }
}

// Renders a single toy and adds it to the toy collection
function renderToy(toy) {
  const toyDiv = document.createElement("div");
  
  toyDiv.innerHTML = `
    <div class="card">
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>Likes: ${toy.likes}</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    </div>
  `;
  toyCollection.appendChild(toyDiv);
  
  //Add event listener to like button
  let toyLike = document.querySelector(`[data-id="${toy.id}"]`)
  toyLike.addEventListener("click", () => {
    toy.likes += 1
    toyDiv.querySelector("p").textContent = `Likes: ${toy.likes}`
    patchToys(toy.id, toy.likes)
  })

}


//Handles submit passes inputed data to postToys function
function handleSubmit(e) {
  e.preventDefault()
  const toyName = document.querySelector("input[name='name']")
  const toyUrl = document.querySelector("input[name='image']")
  postToys(toyName, toyUrl)
}

//Fetch
//GET toys from db.json
function fetchToys() {
  const toyCollection = document.querySelector("#toy-collection")
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(data => renderToys(data))
}

//POST toys to db.json
function postToys(toyName, toyUrl) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": toyName.value,
      "image": toyUrl.value,
      "likes": 0
    })
  })
  .then(res => res.json())
  .then(data => renderToy(data))
  
}

//PATCH
function patchToys(toyId, toyLikes){
  
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": toyLikes
    })
  })
}

//Adds an event listener to the toy form
function renderNewToys() {
  const toyForm = document.querySelector(".add-toy-form")
  toyForm.addEventListener("submit", handleSubmit)
}

//Starts the process
function initialize() {
  fetchToys()
  renderNewToys()
}

initialize()

//fetch("http://localhost:3000/toys/20", {
//method: "DELETE",
 // headers:{
 //   'Content_Type':'application/json'
 // }
//}).then(res => res.json())
//.then(data => console.log(data))
