
const productsGrid = document.getElementById("products-grid");
const filterButtons = document.querySelectorAll(".category-filters button");
const toolbarSearchInput = document.getElementById("toolbar-search-input");

let allProducts = [];
let activeCategory = "All";
let activeSearchQuery = "";

async function loadProducts() {
    try {
        const response = await fetch("assets/data/products.json");
        const products = await response.json();
        allProducts = products;

        // Parse query parameters on load
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get("category");
        const searchParam = params.get("search");

        if (categoryParam) {
            activeCategory = categoryParam;
            filterButtons.forEach(btn => {
                if (btn.dataset.category.toLowerCase() === categoryParam.toLowerCase()) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        }
        
        if (searchParam) {
            activeSearchQuery = searchParam.trim();
            if (toolbarSearchInput) {
                toolbarSearchInput.value = activeSearchQuery;
            }
        }

        filterAndDisplayProducts();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function filterAndDisplayProducts() {
    let filtered = allProducts;

    // Filter by Category
    if (activeCategory !== "All") {
        filtered = filtered.filter(product => 
            product.category.toLowerCase() === activeCategory.toLowerCase()
        );
    }

    // Filter by Search Query
    if (activeSearchQuery !== "") {
        const query = activeSearchQuery.toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.category.toLowerCase().includes(query)
        );
    }

    displayProducts(filtered);
}

function displayProducts(products) {
    productsGrid.innerHTML = "";

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: var(--gray-color);">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 15px; display: block; color: var(--border-color);"></i>
                <h3>No products found</h3>
                <p>Try checking your spelling or search terms.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        productsGrid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x500?text=No+Image';">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <a href="product-details.html?id=${product.id}" class="btn">
                        View Product
                    </a>
                </div>
            </div>
        `;
    });
}

// Category filter clicks
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        activeCategory = button.dataset.category;
        
        // Sync URL parameter
        const url = new URL(window.location);
        if (activeCategory === "All") {
            url.searchParams.delete("category");
        } else {
            url.searchParams.set("category", activeCategory);
        }
        window.history.pushState({}, "", url);

        filterAndDisplayProducts();
    });
});

// Live search typing event
if (toolbarSearchInput) {
    toolbarSearchInput.addEventListener("input", (e) => {
        activeSearchQuery = e.target.value.trim();

        // Sync URL parameter
        const url = new URL(window.location);
        if (activeSearchQuery === "") {
            url.searchParams.delete("search");
        } else {
            url.searchParams.set("search", activeSearchQuery);
        }
        window.history.pushState({}, "", url);

        filterAndDisplayProducts();
    });
}

loadProducts();
