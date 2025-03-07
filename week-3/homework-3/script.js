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
  let userLimit = 10;
  let isLoading = false;
  let allUsersLoaded = false;
  let errorDisplayed = false;
  let isUserListVisible = false;
  let isSliderInitialized = false;

  $("#toggleUsers").on("click", function () {
    if (!isUserListVisible) {
      if ($("#userList").children().length === 0) {
        getUsers();
      }
      $("#userList").show();
      isUserListVisible = true;
      $("#toggleUsers").text("Hide Users");
    } else {
      $("#userList").hide();
      isUserListVisible = false;
      $("#toggleUsers").text("Load Users");
    }
  });

  function getUsers() {
    if (isLoading || allUsersLoaded) return;
    isLoading = true;
    $("#loading").show();

    console.time(`https://randomuser.me/api/?results=${userLimit}`);
    $.get(`https://randomuser.me/api/?results=${userLimit}`, function (data) {
      console.timeEnd(`https://randomuser.me/api/?results=${userLimit}`);

      if (data.results.length === 0) {
        allUsersLoaded = true;
        $("#userList").after(
          "<p id='endMessage' style='text-align:center;'>All users loaded</p>"
        );
      } else {
        displayUsers(data);
        start += userLimit;
      }
      isLoading = false;
      $("#loading").hide();
    }).fail(function (error) {
      if (!errorDisplayed) {
        console.error("Error:", error);
        isLoading = false;
        $("#loading").hide();

        $("body").append(
          `<p style="color: red; text-align: center;">Error: ${
            error.responseJSON?.error || "Unknown error"
          }</p>`
        );

        errorDisplayed = true;
        $(window).off("scroll");
      }
    });
  }

  function displayUsers(data) {
    const userList = $("#userList");
    const userSlider = $(".user-slider");

    data.results.forEach((user) => {
      userList.append(`
        <li data-fancybox data-src="#user-details-${user.login.uuid}">
          <img src="${user.picture.thumbnail}" alt="User">
          <div class="user-info">
            <span>${user.name.first} ${user.name.last}</span>
            <div class="contact-info">
              <span>${user.email}</span>
              <span>${user.phone}</span>
            </div>
          </div>
        </li>
      `);

      const modalContent = `
        <div id="user-details-${user.login.uuid}" style="display:none;max-width:500px;">
          <h2>${user.name.first} ${user.name.last}</h2>
          <img src="${user.picture.large}" alt="User" style="border-radius:50%;">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
          <p><strong>Location:</strong> ${user.location.city}, ${user.location.country}</p>
        </div>
      `;

      $("body").append(modalContent);

      if (userSlider.children().length < 4) {
        userSlider.append(`
          <div class="slider-item">
            <img src="${user.picture.large}" alt="${user.name.first}">
            <p>${user.name.first} ${user.name.last}</p>
          </div>
        `);
      }
    });

    Fancybox.bind("[data-fancybox]", {
      Animation: "zoom",
      closeButton: true,
      on: {
        reveal: (instance, slide) => {
          $(slide.$content).hide().fadeIn(2000);
        },
        close: (instance, slide) => {
          $(slide.$content).fadeOut(2000);
        },
      },
    });

    if (!isSliderInitialized && userSlider.children().length > 0) {
      userSlider.slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
      });
      isSliderInitialized = true;
    }
  }

  $(document)
    .on("mouseover", "#userList li", function () {
      $(this).fadeTo(200, 0.8);
      $(this).addClass("hover-effect");
    })
    .on("mouseout", "#userList li", function () {
      $(this).fadeTo(200, 1);
      $(this).removeClass("hover-effect");
    });

  $("#toggleUsers")
    .on("mouseover", function () {
      $(this).addClass("button-hover");
    })
    .on("mouseout", function () {
      $(this).removeClass("button-hover");
    });

  $(window).on(
    "scroll",
    debounce(function () {
      const scrollPosition = $(window).scrollTop() + $(window).height();
      const documentHeight = $(document).height();

      if (scrollPosition >= documentHeight - 10 && !isLoading) {
        getUsers();
      }
    }, 100)
  );
});
