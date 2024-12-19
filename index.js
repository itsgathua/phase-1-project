document.addEventListener("DOMContentLoaded", () => {
  const apiEndpoint = "https://fakestoreapi.com/products";
  const productContainer = document.getElementById("product-list");
  const categoryFilters = document.getElementById("category-filters");
  const cartItems = document.getElementById("cart-items");
  const checkoutButton = document.getElementById("checkout-button");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");
  const logoButton = document.getElementById("logo");

  let products = [];
  let cart = [];

  // Fetch products from API
  async function fetchProducts() {
      try {
          const response = await fetch(apiEndpoint);
          const data = await response.json();
          products = data.filter(item => item.category !== "electronics");
          displayProducts(products);
          generateCategoryFilters(products);
      } catch (error) {
          console.error("Error fetching products:", error);
      }
  }

  // Display products
  function displayProducts(items) {
      productContainer.innerHTML = "";
      items.forEach(product => {
          const productCard = document.createElement("div");
          productCard.classList.add("product-card");
          productCard.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p>$${product.price}</p>
              <button data-id="${product.id}">Add to Cart</button>
          `;
          productCard.querySelector("button").addEventListener("click", () => addToCart(product));
          productCard.addEventListener("click", (e) => {
              if (e.target.tagName !== "BUTTON") {
                  openModal(product);
              }
          });
          productContainer.appendChild(productCard);
      });
  }

  // Generate category filters
  function generateCategoryFilters(items) {
      const categories = [...new Set(items.map(item => item.category))];
      categoryFilters.innerHTML = "";
      categories.forEach(category => {
          const button = document.createElement("button");
          button.textContent = category;
          button.addEventListener("click", () => filterByCategory(category));
          categoryFilters.appendChild(button);
      });
  }

  // Filter by category
  function filterByCategory(category) {
      const filtered = products.filter(product => product.category === category);
      displayProducts(filtered);
  }

  // Add to cart
  function addToCart(product) {
      const existing = cart.find(item => item.id === product.id);
      if (existing) existing.quantity++;
      else cart.push({ ...product, quantity: 1 });
      updateCart();
  }

  // Update cart
  function updateCart() {
      cartItems.innerHTML = "";
      cart.forEach(item => {
          const listItem = document.createElement("li");
          listItem.textContent = `${item.title} x${item.quantity}`;
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.addEventListener("click", () => removeFromCart(item.id));
          listItem.appendChild(removeButton);
          cartItems.appendChild(listItem);
      });
  }

  // Remove from cart
  function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCart();
  }

  // Checkout
  checkoutButton.addEventListener("click", () => {
      if (cart.length > 0) {
          alert("Thank you for your purchase!");
          cart = [];
          updateCart();
      } else alert("Your cart is empty!");
  });

  // Modal
  function openModal(product) {
      modalContent.innerHTML = `
          <h3>${product.title}</h3>
          <img src="${product.image}" alt="${product.title}">
          <p>${product.description}</p>
          <p>$${product.price}</p>
      `;
      modal.classList.remove("hidden");
  }

  closeModal.addEventListener("click", () => modal.classList.add("hidden"));

  // Refresh page
  logoButton.addEventListener("click", () => location.reload());

  fetchProducts();
});
