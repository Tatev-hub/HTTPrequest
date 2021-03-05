const listElement = document.querySelector(".posts");
const postTempalte = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchBtn = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");
var closebtns = document.getElementsByClassName("close");

function sendHTTPRequest(method, url, data) {
  const httpRq = new XMLHttpRequest();
  return fetch(url, {
    method: method,
    body: data,
    
  })
    .then((response) => {
      
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        response.json().then((errData) => {
          console.log(errData);
          throw new Error("Somthing went worng - in server side");
        });
      }
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Somthing went worng");
    });
}

async function fetchPosts() {
  try {
    const respnonsData = await sendHTTPRequest(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );

    const listOfPosts = respnonsData;
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTempalte.content, true);
      postEl.querySelector("h2").textContent = post.title.toUpperCase();
      postEl.querySelector("p").textContent = post.body;
      postEl.querySelector("li").id = post.id;
      listElement.append(postEl);
      var i;
      for (i = 0; i < closebtns.length; i++) {
       closebtns[i].addEventListener("click", function() {
       this.parentElement.style.display = 'none';
      });
      }
    }
  } catch (err) {
    alert(err.message);
  }
}


async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: userId,
  };

  const fd = new FormData(form);
 
  fd.append("userId", userId);

  sendHTTPRequest("POST", "https://jsonplaceholder.typicode.com/posts", fd);
}

fetchBtn.addEventListener("click", fetchPosts);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;
  createPost(enteredTitle, enteredContent);
 
});


postList.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN") {
    const postId = event.target.closest("li").id;
    sendHTTPRequest(
      "DELETE",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});