function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

$(document).ready(function () {
  let start = 0;
  let postLimit = 5;
  let isLoading = false;
  let allPostsLoaded = false;
  let errorDisplayed = false;

  $("body").append(
    "<p id='loading' style='display: none; text-align:center;'>Loading...</p>"
  );

  function getPosts() {
    if (isLoading || allPostsLoaded) {
      return;
    }
    isLoading = true;
    $("#loading").show();

    $.get(
      `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${postLimit}`,
      function (data) {
        if (data.length === 0) {
          allPostsLoaded = true;
          $("#postList").after(
            "<p id='endMessage' style='text-align:center;'>All posts loaded</p>"
          );
        } else {
          displayPosts(data);
          start += postLimit;
        }
        isLoading = false;
        $("#loading").hide();
      }
    ).fail(function (error) {
      if (!errorDisplayed) {
        console.log("Error:", error);
        isLoading = false;
        $("#loading").hide();

        $("body").append(
          `<p style="color: red; text-align: center;">Error: ${error}</p>`
        );

        errorDisplayed = true;
        $(window).off("scroll");
      }
    });
  }

  function displayPosts(posts) {
    const cardList = $("#postList");
    posts.forEach(function (post) {
      const card = `
            <li class="card">
                <p><strong>User ID:</strong> ${post.userId}</p>
                <p><strong>Post ID:</strong> ${post.id}</p>
                <h5>Post title: ${post.title}</h5>
                <p>${post.body}</p>
            </li>
            `;
      cardList.append(card);
    });
  }

  getPosts();

  $(window).on(
    "scroll",
    debounce(function () {
      const scrollPosition = $(window).scrollTop() + $(window).height();
      const documentHeight = $(document).height();

      if (scrollPosition >= documentHeight - 10 && !isLoading) {
        getPosts();
      }
    }, 200)
  );
});
