$(document).ready(function () {
  document.body.setAttribute(
    "style",
    "height: 100%; margin:0; padding:20px; background-color: #f0f0f0; "
  );

  const container = document.createElement("div");
  const userContent = document.querySelector(".ins-api-users");

  userContent.parentNode.insertBefore(container, userContent);
  container.appendChild(userContent);

  container.setAttribute(
    "style",
    "margin: 0 auto; width: 70%; padding: 20px; border-radius: 10px;"
  );

  getUsersFromLocalStorage();

  function getUsersFromLocalStorage() {
    const currentTime = new Date().getTime();
    const storedData = localStorage.getItem("users");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const storedTimestamp = parsedData.timestamp;

      if (currentTime - storedTimestamp < 24 * 60 * 60 * 1000) {
        console.log("local storage'dan gelen veri", parsedData.data);
        displayUsers(parsedData.data);
        return parsedData.data;
      } else {
        console.log("local storage'dan gelen veri süresi dolmuştur");
        localStorage.removeItem("users");
        getUsers();
      }
    } else {
      console.log("LocalStorage'de veri bulunamadı, yeni veriler alınıyor");
      getUsers();
    }
  }

  async function getUsers() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("api'dan gelen veri", data);

      const currentTime = new Date().getTime();
      const dataToStore = { timestamp: currentTime, data: data };
      localStorage.setItem("users", JSON.stringify(dataToStore));
      console.log("local storage'a veri kaydedildi", dataToStore);

      displayUsers(data);
    } catch (error) {
      showErrorMessage(
        "Kullanıcı verileri yüklenirken bir hata oluştu: " + error.message
      );
      console.log("An error has occurred.", error.message);
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
    const usersList = $(".ins-api-users");
    usersList.empty();

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
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const updatedUsers = parsedData.data.filter((user) => user.id !== userId);

      const currentTime = new Date().getTime();
      const dataToStore = { timestamp: currentTime, data: updatedUsers };
      localStorage.setItem("users", JSON.stringify(dataToStore));

      console.log(
        "Kullanıcı silindi, güncellenmiş veri local storage'a kaydedildi",
        updatedUsers
      );

      displayUsers(updatedUsers);
    }
  }
});
