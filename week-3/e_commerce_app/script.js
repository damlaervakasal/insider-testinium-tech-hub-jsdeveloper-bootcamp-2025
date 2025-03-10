function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const favoriteItemTemplate = $(`
    <div class="favorite-item">
        <img src="" alt="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
        <div class="favorite-item-info">
            <h4 class="favorite-title"></h4>
            <p class="favorite-price"></p>
        </div>
    </div>
`).hide();

const cartItemTemplate = $(`
    <div class="cart-item">
        <img src="" alt="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
        <div class="cart-item-info">
            <h4 class="cart-title"></h4>
            <p class="cart-price"></p>
            <div class="quantity-controls">
                <button class="decrease-quantity" type="button">-</button>
                <span class="quantity-badge"></span>
                <button class="increase-quantity" type="button">+</button>
                <button class="remove-from-cart" type="button">Remove</button>
            </div>
        </div>
    </div>
`).hide();

function getJeweleryProducts(products) {
  return products.filter((product) => product.category === "jewelery");
}

function showProductDetails(product) {
  const modal = $("#productDetailsModal");
  modal.hide();

  $("#modalProductTitle").text(product.title);
  $("#modalProductCategory").text(`Category: ${product.category}`);
  $("#modalProductImage").attr("src", product.image);
  $("#modalProductDescription").text(product.description);
  $("#modalProductPrice").text(`$${product.price}`);

  modal.fadeIn(300);

  Fancybox.show([
    {
      src: "#productDetailsModal",
      type: "inline",
      dragToClose: false,
      closeButton: false,
      click: null,
    },
  ]);
}

function updateFavoritesModal() {
  const favoritesList = $("#favoritesList");
  favoritesList.empty();

  const currentFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (currentFavorites.length === 0) {
    favoritesList.append("<p>There are no products in your favorites.</p>");
    return;
  }

  currentFavorites.forEach((product) => {
    const newFavoriteItem = favoriteItemTemplate.clone(true);

    newFavoriteItem.find("img").attr({
      src: product.image,
      alt: product.title,
    });
    newFavoriteItem.find(".favorite-title").text(product.title);
    newFavoriteItem.find(".favorite-price").text(`$${product.price}`);
    newFavoriteItem.find(".remove-from-cart").attr("data-id", product.id);

    newFavoriteItem.show();
    favoritesList.append(newFavoriteItem);
  });
}

function updateCartModal() {
  const cartList = $("#cartList");
  cartList.empty();

  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (currentCart.length === 0) {
    cartList.append("<p>There are no products in your cart.</p>");
    return;
  }

  currentCart.forEach((product) => {
    const newCartItem = cartItemTemplate.clone(true);

    newCartItem.find("img").attr({
      src: product.image,
      alt: product.title,
    });
    newCartItem.find(".cart-title").text(product.title);
    newCartItem.find(".cart-price").text(`$${product.price}`);
    newCartItem.find(".quantity-badge").text(product.quantity || 1);

    const buttons = newCartItem.find(
      ".decrease-quantity, .increase-quantity, .remove-from-cart"
    );
    buttons.attr("data-id", product.id);

    newCartItem.show();
    cartList.append(newCartItem);
  });

  const total = currentCart.reduce((sum, product) => {
    return sum + product.price * (product.quantity || 1);
  }, 0);

  cartList.append(`
        <div class="cart-total">
            <h3>Total: $${total.toFixed(2)}</h3>
            <button id="clear-cart">Clear Cart</button>
        </div>
    `);
}

$(".carousel").slick({
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  prevArrow:
    '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
  nextArrow:
    '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
});

function displaySlider(products) {
  const slider = $(".slider");
  slider.empty();

  products.forEach((product) => {
    const slide = `
            <div>
                <img src="${product.image}" alt="${product.title}" />
            </div>`;
    slider.append(slide);
  });

  $(".slider").slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    adaptiveHeight: true,
    prevArrow:
      '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
    nextArrow:
      '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
  });
}

function displayProducts(products) {
  const productList = $("#productList");
  productList.empty();

  $.each(products, function (index, product) {
    const productCard = `
            <div class="product-card" data-product='${JSON.stringify(
              product
            ).replace(/'/g, "&#39;")}'>
                <div class="card-header">
                    <i class="fas fa-heart" data-id="${product.id}"></i>
                    <i class="fas fa-shopping-cart add-to-cart" data-id="${
                      product.id
                    }"></i>
                </div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" />
                </div>
                <div class="product-info">
                    <h5>${product.title}</h5>
                    <p>$${product.price}</p>
                </div>
                <div class="card-footer">
                    <button class="show-details">Show details</button>
                </div>
            </div>`;
    productList.append(productCard);
  });

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.forEach((product) => {
    $(`.fa-heart[data-id="${product.id}"]`).addClass("active");
  });
}

$(document).ready(function () {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let products = [];

  $.get(`https://fakestoreapi.com/products`, function (data) {
    products = data;
    const jeweleryProducts = getJeweleryProducts(data);
    displayProducts(data);
    displaySlider(jeweleryProducts);
    populateCategories(data);
  });

  const debounceSearch = debounce(function (searchTerm) {
    filterProducts();
  }, 300);

  function populateCategories(products) {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    const categorySelect = $("#categoryFilter");

    categories.forEach((category) => {
      categorySelect.append(`<option value="${category}">${category}</option>`);
    });
  }

  function filterProducts() {
    const searchTerm = $("#searchInput").val().toLowerCase();
    const selectedCategory = $("#categoryFilter").val();
    const sortOption = $("#sortOptions").val();

    let filteredProducts = [...products];

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    switch (sortOption) {
      case "rating_asc":
        filteredProducts.sort((a, b) => a.rating.rate - b.rating.rate);
        break;
      case "rating_desc":
        filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "price_asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
    }

    displayProducts(filteredProducts);
  }

  $("#favoritesIcon").click(function () {
    updateFavoritesModal();
    Fancybox.show([
      {
        src: "#favoritesModal",
        type: "inline",
        dragToClose: false,
        closeButton: false,
      },
    ]);
  });

  $("#cartIcon").click(function () {
    updateCartModal();
    Fancybox.show([
      {
        src: "#cartModal",
        type: "inline",
        dragToClose: false,
        closeButton: false,
      },
    ]);
  });

  $("#searchInput").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    debounceSearch(searchTerm);
  });

  $("#categoryFilter").change(function () {
    filterProducts();
  });

  $("#sortOptions").change(function () {
    filterProducts();
  });

  $("#sortOptions").change(function () {
    currentSort = $(this).val();
    filterAndSortProducts();
  });

  $(document).on("mouseover", ".fa-heart, .fa-shopping-cart", function () {
    $(this).css({
      transform: "scale(1.2)",
      transition: "transform 0.3s ease",
    });

    if ($(this).hasClass("fa-heart")) {
      if ($(this).hasClass("active")) {
        $(this).css("color", "#e74c3c");
      } else {
        $(this).css("color", "#ff7675");
      }
    }

    if ($(this).hasClass("fa-shopping-cart")) {
      $(this).css("color", "#2ecc71");
    }
  });

  $(document).on("mouseout", ".fa-heart, .fa-shopping-cart", function () {
    $(this).css({
      transform: "scale(1)",
      transition: "transform 0.3s ease",
    });

    if ($(this).hasClass("fa-heart")) {
      if ($(this).hasClass("active")) {
        $(this).css("color", "#ff4757");
      } else {
        $(this).css("color", "#555");
      }
    }

    if ($(this).hasClass("fa-shopping-cart")) {
      $(this).css("color", "#555");
    }
  });

  $(document).on("mouseover", ".show-details", function () {
    $(this).css({
      transform: "scale(1.1)",
      transition: "all 0.3s ease",
      "box-shadow": "0 5px 15px rgba(0,0,0,0.2)",
    });
  });

  $(document).on("mouseout", ".show-details", function () {
    $(this).css({
      transform: "scale(1)",
      transition: "all 0.3s ease",
      "box-shadow": "none",
    });
  });

  $(".brand").on("click", function () {
    window.location.reload();
  });

  $(document).on("click", ".fa-heart", function () {
    const productCard = $(this).closest(".product-card");
    const productData = productCard.attr("data-product");

    if (!productData) {
      console.error("Product data not found!");
      return;
    }

    try {
      const product = JSON.parse(productData.replace(/&#39;/g, "'"));
      const productId = product.id;

      if (!productId) {
        console.error("Product ID not found!");
        return;
      }

      if ($(this).hasClass("active")) {
        favorites = favorites.filter((item) => item.id !== productId);
        $(this).removeClass("active");
      } else {
        favorites.push(product);
        $(this).addClass("active");
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("JSON Parse Error:", error);
    }
  });

  $(document).on("click", ".add-to-cart", function () {
    const productCard = $(this).closest(".product-card");
    const productData = productCard.attr("data-product");

    if (!productData) {
      console.error("Product data not found!");
      return;
    }

    try {
      const product = JSON.parse(productData.replace(/&#39;/g, "'"));
      const productId = product.id;

      let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = currentCart.findIndex(
        (item) => item.id === productId
      );

      if (existingProductIndex === -1) {
        currentCart.push({
          ...product,
          quantity: 1,
        });
        alert("Product added to cart!");
      } else {
        currentCart[existingProductIndex].quantity += 1;
        alert("Product quantity updated in cart!");
      }

      cart = currentCart;
      localStorage.setItem("cart", JSON.stringify(currentCart));
      updateCartModal();
    } catch (error) {
      console.error("JSON Parse Error ", error);
      alert("An error occurred while adding the product to the cart.");
    }
  });

  $(document).on("click", ".show-details", function () {
    const productData = $(this).closest(".product-card").attr("data-product");

    try {
      const product = JSON.parse(productData);
      showProductDetails(product);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      alert("An error occurred while showing the product details.");
    }
  });

  $(document).on("click", ".remove-from-cart", function () {
    const productId = $(this).data("id");
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartModal();
  });

  $(document).on("click", "#clear-cart", function () {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartModal();
  });

  $(document).on("click", ".increase-quantity", function () {
    const productId = $(this).data("id");
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    const productIndex = currentCart.findIndex((item) => item.id === productId);
    if (productIndex !== -1) {
      currentCart[productIndex].quantity =
        (currentCart[productIndex].quantity || 1) + 1;
      localStorage.setItem("cart", JSON.stringify(currentCart));
      cart = currentCart;
      updateCartModal();
    }
  });

  $(document).on("click", ".decrease-quantity", function () {
    const productId = $(this).data("id");
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    const productIndex = currentCart.findIndex((item) => item.id === productId);
    if (productIndex !== -1) {
      const currentQuantity = currentCart[productIndex].quantity || 1;

      if (currentQuantity > 1) {
        currentCart[productIndex].quantity = currentQuantity - 1;
      } else {
        currentCart = currentCart.filter((item) => item.id !== productId);
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));
      cart = currentCart;
      updateCartModal();
    }
  });

  $("#productIdSearch").on("input", function () {
    const productId = $(this).val().trim();

    if (productId) {
      $.get(`https://fakestoreapi.com/products/${productId}`)
        .done(function (product) {
          console.log("Product found:", product);
          displayProducts([product]);
        })
        .fail(function (error) {
          console.log("API Error:", error);
          alert("Product not found!");
        });
    } else {
      displayProducts(products);
    }
  });

  $(document).on("click", ".close-modal", function () {
    Fancybox.close();
  });
});
