// The Saffron Plate - Homepage Menu Highlights
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("signature-grid");
  if (!grid) return;

  try {
    const response = await fetch("menu.json");
    if (!response.ok) {
      throw new Error(`Menu request failed with status ${response.status}`);
    }

    const menuItems = await response.json();
    if (!Array.isArray(menuItems)) {
      throw new Error("Menu data must be a JSON array");
    }

    const featuredIds = ["thali-01", "chaap-02", "rasmalai-10"];
    const featuredItems = featuredIds.map(id => menuItems.find(item => item.id === id));
    if (featuredItems.some(item => !item)) {
      throw new Error("One or more featured menu items are missing");
    }

    grid.replaceChildren();
    featuredItems.forEach(item => {
      const card = document.createElement("article");
      card.className = "signature-card";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.name;
      image.loading = "lazy";

      const body = document.createElement("div");
      body.className = "signature-card-body";

      const badge = document.createElement("span");
      badge.className = "card-category-badge";
      badge.textContent = item.badge;

      const title = document.createElement("h3");
      title.textContent = item.name;

      const description = document.createElement("p");
      description.textContent = item.description;

      const footer = document.createElement("div");
      footer.className = "signature-card-footer";

      const price = document.createElement("span");
      price.className = "price";
      price.textContent = `₹${item.price}`;

      const orderLink = document.createElement("a");
      orderLink.href = "order.html";
      orderLink.className = "btn solid";
      orderLink.style.cssText = "padding: 8px 18px; font-size: 11px;";
      orderLink.textContent = "Order Dish";

      footer.append(price, orderLink);
      body.append(badge, title, description, footer);
      card.append(image, body);
      grid.append(card);
    });
  } catch (error) {
    console.error("Homepage menu load error:", error);
    grid.textContent = "Signature creations could not be loaded. Please try again later.";
  }
});
