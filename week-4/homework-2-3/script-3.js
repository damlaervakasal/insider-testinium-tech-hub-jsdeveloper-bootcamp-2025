// // Homework - 3
(function () {
  var startingTime = new Date().getTime();

  var script = document.createElement("script");
  script.src =
    "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);

  var checkReady = function (callback) {
    if (window.jQuery) {
      callback(jQuery);
    } else {
      window.setTimeout(function () {
        checkReady(callback);
      }, 20);
      if (!window.jQuery) {
        debugger;
      }
    }
  };

  checkReady(function ($) {
    $(document).ready(function () {
      const appendLocation = ".ins-api-users";
      let hasUsedSessionStorage = false;

      document.body.setAttribute(
        "style",
        "height: 100%; margin:0; padding:20px; background-color: #f0f0f0; "
      );

      const container = document.createElement("div");
      const userContent = document.createElement("div");
      userContent.classList.add(appendLocation.replace(".", ""));

      container.appendChild(userContent);
      document.body.appendChild(container);

      container.setAttribute(
        "style",
        "margin: 0 auto; width: 70%; padding: 20px; border-radius: 10px;"
      );

      const reloadButton = document.createElement("button");
      reloadButton.textContent = "Reload Users";
      reloadButton.classList.add("reload-button");

      reloadButton.setAttribute(
        "style",
        "padding: 10px; border: none; background-color: #4CAF50; color: #fff; border-radius: 5px; cursor: pointer; margin-top: 10px; display: none;"
      );

      container.appendChild(reloadButton);

      reloadButton.addEventListener("click", function () {
        localStorage.removeItem("users");
        sessionStorage.setItem("useSessionStorage", "true");
        hasUsedSessionStorage = true;
        getUsers();
        reloadButton.style.display = "none";
      });

      checkStorageAndFetchData();

      async function checkStorageAndFetchData() {
        const currentTime = new Date().getTime();
        const storedData = localStorage.getItem("users");
        const useSessionStorage = sessionStorage.getItem("useSessionStorage");

        if (!localStorage.getItem("users")) debugger;

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const storedTimestamp = parsedData.timestamp;

          if (currentTime - storedTimestamp < 24 * 60 * 60 * 1000) {
            displayUsers(parsedData.data);
          } else {
            localStorage.removeItem("users");
            if (useSessionStorage === "true" || hasUsedSessionStorage) {
              showErrorMessage("Veriler silindi, yeni veri yüklenemez.");
            } else {
              getUsers();
            }
          }
        } else if (useSessionStorage === "true" || hasUsedSessionStorage) {
          showErrorMessage("Veriler silindi, yeni veri yüklenemez.");
        } else {
          getUsers();
        }
      }

      async function getUsers() {
        try {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
          );

          if (!response.ok) {
            debugger;
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const currentTime = new Date().getTime();
          const dataToStore = {
            timestamp: currentTime,
            data: data,
          };

          if (sessionStorage.getItem("useSessionStorage") === "true") {
            sessionStorage.setItem("users", JSON.stringify(data));
          } else {
            localStorage.setItem("users", JSON.stringify(dataToStore));
          }
          displayUsers(data);
        } catch (error) {
          debugger;
          showErrorMessage(
            "Kullanıcı verileri yüklenirken bir hata oluştu: " + error.message
          );
        }
      }

      function showErrorMessage(message) {
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error-message");
        errorDiv.textContent = message;
        errorDiv.setAttribute(
          "style",
          "background-color: #f00; color: #fff; padding: 10px; margin: 10px 0; border-radius: 5px;"
        );

        container.insertBefore(errorDiv, container.firstChild);

        setTimeout(() => {
          errorDiv.remove();
        }, 5000);
      }

      function displayUsers(users) {
        const usersList = $(appendLocation);
        usersList.empty();

        if (!Array.isArray(users)) {
          debugger;
        }

        $.each(users, function (index, user) {
          const userCard = document.createElement("div");
          userCard.classList.add("user-card");

          userCard.innerHTML = `
            <h3 style="margin: 0 0 5px 0;">${user.name}</h3>
            <p style="margin: 2px 0;">${user.email}</p>
            <p style="margin: 2px 0;">${user.address.street}, ${user.address.suite}, ${user.address.city}</p>
            <button class= "delete-button" data-id="${user.id}">Delete</button>
            `;

          userCard.setAttribute(
            "style",
            "display: flex; flex-direction: column; align-items: flex-start; background-color: #f0f0f0; padding: 20px; border: 1px solid #ccc; border-radius: 10px; margin-bottom: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);"
          );
          usersList.append(userCard);

          const deleteButton = userCard.querySelector(".delete-button");
          deleteButton.addEventListener("click", function () {
            userCard.remove();
            deleteUser(user.id);
          });

          deleteButton.setAttribute(
            "style",
            "align-self: flex-end; padding: 10px; border: none; background-color: #f00; color: #fff; border-radius: 5px; cursor: pointer;"
          );
        });
      }

      function deleteUser(userId) {
        const storedData = localStorage.getItem("users");
        const sessionData = sessionStorage.getItem("users");
        const useSessionStorage = sessionStorage.getItem("useSessionStorage");

        if (useSessionStorage === "true" && sessionData) {
          const parsedData = JSON.parse(sessionData);
          const updatedUsers = parsedData.filter((user) => user.id !== userId);

          if (updatedUsers.length === 0) {
            sessionStorage.removeItem("users");
            sessionStorage.removeItem("useSessionStorage");
            hasUsedSessionStorage = true;
          } else {
            sessionStorage.setItem("users", JSON.stringify(updatedUsers));
          }

          if (!sessionStorage.getItem("users")) {
            showErrorMessage("Veriler silindi, yeni veri yüklenemez.");
          }

          displayUsers(updatedUsers);
          return;
        }

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const updatedUsers = parsedData.data.filter(
            (user) => user.id !== userId
          );

          if (updatedUsers.length === 0) {
            localStorage.removeItem("users");
          } else {
            const currentTime = new Date().getTime();
            const dataToStore = {
              timestamp: currentTime,
              data: updatedUsers,
            };
            localStorage.setItem("users", JSON.stringify(dataToStore));
          }

          displayUsers(updatedUsers);
        }
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const userCards = userContent.querySelectorAll(".user-card");
            if (
              userCards.length === 0 &&
              !localStorage.getItem("users") &&
              !hasUsedSessionStorage &&
              !sessionStorage.getItem("useSessionStorage")
            ) {
              reloadButton.style.display = "block";
            } else {
              reloadButton.style.display = "none";
            }
          }
        });
      });

      observer.observe(userContent, {
        childList: true,
        subtree: true,
      });
    });
  });
})();

/*

Ödevi yaparken, console.log kullandığım noktaları dikkatlice inceledim ve potansiyel 
hata olabilecek yerlere debugger eklemenin geliştiriciler için kolaylık sağlayacağını düşündüm.
Kodu yazarken console'da aldığım hataları analiz ederek, olası hataları daha hızlı tespit etmek
için belirli noktalara debugger ekledim.

Kodu adım adım oluştururken ve test ederken, hem kendi kod hatalarımı hem de dışarıdan 
kaynaklanabilecek hataları ayıklamayı kolaylaştırmak amacıyla debugger kullandım. 
Bu sayede, kodun belirli aşamalarında hata olup olmadığını daha sistematik bir şekilde 
kontrol edebileceğimi düşündüm.

Aldığım hatalar doğrultusunda, kodumun şu kısımlarına debugger eklemenin doğru olacağını düşündüm:

- jQuery yüklenirken herhangi bir hata meydana gelirse, hatayı tespit etmek için.
- İlk sayfa yüklendiğinde LocalStorage'dan veri gelmiyorsa, bunu kontrol etmek ve olası bir sorunu saptamak için.
- catch ve throw ile dönen hatalarda, geliştiricinin hatayı daha hızlı fark edebilmesi için. 
Ancak, SessionStorage boş olduğunda ekrana gösterilen hata mesajında debugger kullanmadım, çünkü burada kullanıcıyı bilgilendirmem gerekiyor, geliştiriciyi değil.
- Veri listesinde dönen user değişkeninin bir dizi olup olmadığını kontrol etmek için. 
Eğer dizi değilse, kullanıcılar listelenmeyecek ve hata oluşacak. Bu tür bir durumda, hatayı hızla bulabilmek için debugger eklemenin faydalı olacağını düşündüm.

*/
