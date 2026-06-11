const productContainer = document.getElementById("product-details-container");
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"), 10);

// Specs mapping for the catalog
const productSpecs = {
    1: {
        "Processor": "Apple M4 Pro (14-core CPU, 20-core GPU)",
        "Memory": "24GB Unified Memory",
        "Storage": "512GB SSD",
        "Display": "14.2-inch Liquid Retina XDR (3024 x 1964)",
        "Battery": "Up to 22 hours",
        "OS": "macOS Sequoia"
    },
    2: {
        "Processor": "A18 Pro chip",
        "Camera": "Pro camera system (48MP Main, 48MP Ultra Wide, 12MP Telephoto)",
        "Display": "6.3-inch Super Retina XDR OLED",
        "Battery": "Up to 27 hours video playback",
        "Weight": "199 grams",
        "OS": "iOS 18"
    },
    3: {
        "Case Size": "49mm Aerospace-grade Titanium",
        "Display": "Always-On Retina OLED (up to 3000 nits)",
        "Battery": "Up to 36 hours (normal use)",
        "Water Resistance": "100m water resistant, swimproof",
        "GPS": "Precision dual-frequency GPS"
    },
    4: {
        "Audio Tech": "Adaptive Audio, Active Noise Cancellation, Transparency Mode",
        "Sensors": "Dual beamforming microphones, Inward-facing microphone",
        "Battery": "Up to 6 hours listening time (single charge)",
        "Connectivity": "Bluetooth 5.3",
        "Charging Case": "MagSafe (USB-C) with speaker"
    },
    5: {
        "Key Switch": "Perfect Stroke Keys (scissor switches)",
        "Connectivity": "Bluetooth Low Energy or Logi Bolt USB Receiver",
        "Backlight": "Smart backlighting (hand proximity sensors)",
        "Battery": "USB-C rechargeable, up to 10 days",
        "Multi-Device": "Easy-Switch keys (up to 3 devices)"
    },
    6: {
        "Processor": "13th Gen Intel Core i7-13700H",
        "Graphics": "NVIDIA GeForce RTX 4050 (6GB GDDR6)",
        "Memory": "16GB DDR5",
        "Storage": "512GB PCIe NVMe SSD",
        "Display": "15.6-inch FHD+ (1920 x 1200) InfinityEdge"
    }
};

// Default reviews to seed localStorage if empty
const defaultReviews = {
    1: [
        { name: "Sarah K.", rating: 5, comment: "Absolutely incredible performance. The M4 Pro compiles code at lightning speed and the battery lasts forever.", date: "2026-05-12" },
        { name: "Alex M.", rating: 4, comment: "Display is beautiful and performance is solid. The notch is still there, but you get used to it.", date: "2026-06-01" }
    ],
    2: [
        { name: "David L.", rating: 5, comment: "Camera control button is a game changer. The new desert titanium color looks premium.", date: "2026-05-20" }
    ],
    3: [
        { name: "Michael S.", rating: 5, comment: "Extremely durable. Took it diving and hiking in the Alps, battery life is phenomenal.", date: "2026-04-18" }
    ],
    4: [
        { name: "Emma W.", rating: 4, comment: "The noise cancellation is noticeably better than Gen 1. USB-C case is very convenient.", date: "2026-05-28" }
    ],
    5: [
        { name: "James P.", rating: 5, comment: "The most comfortable keyboard I've ever typed on. Battery lasts months with backlight off.", date: "2026-06-05" }
    ],
    6: [
        { name: "Elena R.", rating: 4, comment: "Excellent build quality and screen. Runs a bit hot under heavy rendering, but still a beast.", date: "2026-05-15" }
    ]
};

// Initialize reviews in localStorage
if (!localStorage.getItem("novashop_reviews")) {
    localStorage.setItem("novashop_reviews", JSON.stringify(defaultReviews));
}

async function loadProduct() {
    try {
        const response = await fetch("assets/data/products.json");
        const products = await response.json();
        const product = products.find(item => item.id == productId);
        if (!product) {
            productContainer.innerHTML = `<h2>Product Not Found</h2>`;
            return;
        }

        displayProduct(product);
        setupTabs();
        setupReviewForm();
        loadRelatedProducts(product, products);
    } catch (error) {
        console.error("Error loading product:", error);
    }
}

function displayProduct(product) {
    const reviews = getProductReviews(product.id);
    const avgRating = calculateAverageRating(reviews);

    productContainer.innerHTML = `
        <div class="product-details-content">
            <div class="product-details-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x500?text=No+Image';">
            </div>
            <div class="product-details-info">
                <h1>${product.name}</h1>
                <p class="product-category-tag">${product.category}</p>
                <div class="product-rating-badge">
                    <div class="rating-stars">${renderStars(avgRating)}</div>
                    <span>(${reviews.length} reviews)</span>
                </div>
                <p class="product-price">$${product.price}</p>
                <p class="product-description">
                    ${product.description || 'Premium technology product designed for elite performance, incredible reliability, and everyday professional productivity.'}
                </p>
                <button class="btn add-to-cart-btn">Add To Cart</button>
            </div>
        </div>

        <div class="product-tabs-container">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="description">Description</button>
                <button class="tab-btn" data-tab="specs">Specifications</button>
                <button class="tab-btn" data-tab="reviews">Reviews (${reviews.length})</button>
            </div>
            
            <div class="tab-content active" id="tab-description">
                <p class="tab-paragraph">
                    ${product.longDescription || 'This premium tech device is built with high-quality components and state-of-the-art materials. Designed to seamlessly fit into your daily workflow, it offers unmatched reliability, industry-leading performance, and an elegant, sleek design.'}
                </p>
                <p class="tab-paragraph">
                    Experience state-of-the-art engineering tailored to your professional needs. With optimized efficiency and modern features, this device is engineered to power your digital life.
                </p>
            </div>

            <div class="tab-content" id="tab-specs">
                <table class="specs-table">
                    <tbody>
                        ${renderSpecsRows(product.id)}
                    </tbody>
                </table>
            </div>

            <div class="tab-content" id="tab-reviews">
                <div class="reviews-section-layout">
                    <div class="reviews-summary-card">
                        <h3>Customer Ratings</h3>
                        <div class="rating-average">
                            <span class="rating-num">${avgRating.toFixed(1)}</span>
                            <div class="rating-stars">${renderStars(avgRating)}</div>
                            <span class="rating-count">Based on ${reviews.length} reviews</span>
                        </div>
                        
                        <div class="write-review-form">
                            <h4>Write a Review</h4>
                            <div class="rating-selector">
                                <label>Your Rating: </label>
                                <div class="star-rating-input" id="star-rating-input">
                                    <i class="fa-regular fa-star" data-rating="1"></i>
                                    <i class="fa-regular fa-star" data-rating="2"></i>
                                    <i class="fa-regular fa-star" data-rating="3"></i>
                                    <i class="fa-regular fa-star" data-rating="4"></i>
                                    <i class="fa-regular fa-star" data-rating="5"></i>
                                </div>
                            </div>
                            <div class="form-group-sm">
                                <input type="text" id="review-reviewer" placeholder="Your Name" required>
                            </div>
                            <div class="form-group-sm">
                                <textarea id="review-comment" placeholder="What did you think about this product?" rows="3" required></textarea>
                            </div>
                            <button class="btn btn-sm" id="submit-review-btn">Submit Review</button>
                        </div>
                    </div>
                    
                    <div class="reviews-list" id="reviews-list-container">
                        ${renderReviewsList(reviews)}
                    </div>
                </div>
            </div>
        </div>

        <div class="related-products-section">
            <h2 class="related-title">Related Products</h2>
            <div class="products-grid" id="related-products-grid">
                <!-- Injected dynamically -->
            </div>
        </div>
    `;

    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", () => {
        addToCart(product);
    });
}

// Helper: Fetch reviews from localStorage
function getProductReviews(id) {
    const allReviews = JSON.parse(localStorage.getItem("novashop_reviews")) || {};
    return allReviews[id] || [];
}

// Helper: Calculate average rating
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, r) => total + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
}

// Helper: Render FontAwesome stars
function renderStars(rating) {
    let starsHtml = "";
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += `<i class="fa-solid fa-star"></i>`;
        } else if (i === fullStars + 1 && hasHalf) {
            starsHtml += `<i class="fa-solid fa-star-half-stroke"></i>`;
        } else {
            starsHtml += `<i class="fa-regular fa-star"></i>`;
        }
    }
    return starsHtml;
}

// Helper: Render specifications rows
function renderSpecsRows(id) {
    const specs = productSpecs[id];
    if (!specs) {
        return `<tr><td colspan="2">No specs available for this product.</td></tr>`;
    }
    
    return Object.entries(specs)
        .map(([key, value]) => `
            <tr>
                <td class="spec-label">${key}</td>
                <td class="spec-value">${value}</td>
            </tr>
        `).join("");
}

// Helper: Render reviews HTML
function renderReviewsList(reviews) {
    if (reviews.length === 0) {
        return `<p class="no-reviews">No reviews yet. Be the first to review this product!</p>`;
    }
    
    return reviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer-name">${r.name}</span>
                <span class="review-date">${r.date}</span>
            </div>
            <div class="review-stars">${renderStars(r.rating)}</div>
            <p class="review-text">${r.comment}</p>
        </div>
    `).join("");
}

// Tab switcher setup
function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const tabName = btn.dataset.tab;
            const contents = document.querySelectorAll(".tab-content");
            contents.forEach(content => {
                if (content.id === `tab-${tabName}`) {
                    content.classList.add("active");
                } else {
                    content.classList.remove("active");
                }
            });
        });
    });
}

// Reviews input rating selection & form submission
let selectedRating = 0;
function setupReviewForm() {
    const stars = document.querySelectorAll("#star-rating-input i");
    const submitBtn = document.getElementById("submit-review-btn");
    
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.dataset.rating, 10);
            
            // Highlight stars
            stars.forEach((s, idx) => {
                if (idx < selectedRating) {
                    s.classList.replace("fa-regular", "fa-solid");
                    s.classList.add("active-star");
                } else {
                    s.classList.replace("fa-solid", "fa-regular");
                    s.classList.remove("active-star");
                }
            });
        });
    });
    
    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("review-reviewer");
            const commentInput = document.getElementById("review-comment");
            
            const name = nameInput.value.trim();
            const comment = commentInput.value.trim();
            
            if (selectedRating === 0) {
                alert("Please select a star rating.");
                return;
            }
            if (!name) {
                alert("Please enter your name.");
                return;
            }
            if (!comment) {
                alert("Please enter a review comment.");
                return;
            }
            
            // Add review
            const allReviews = JSON.parse(localStorage.getItem("novashop_reviews")) || {};
            if (!allReviews[productId]) {
                allReviews[productId] = [];
            }
            
            const today = new Date().toISOString().split('T')[0];
            allReviews[productId].push({
                name,
                rating: selectedRating,
                comment,
                date: today
            });
            
            localStorage.setItem("novashop_reviews", JSON.stringify(allReviews));
            
            // Show Success toast or alert
            if (typeof showToast === "function") {
                showToast("Review submitted successfully!");
            } else {
                alert("Review submitted successfully!");
            }
            
            // Refresh details display to show new review
            loadProduct();
            
            // Reset rating
            selectedRating = 0;
        });
    }
}

// Load category-matching related products
function loadRelatedProducts(currentProduct, allProducts) {
    const relatedGrid = document.getElementById("related-products-grid");
    if (!relatedGrid) return;
    
    // Filter other products of same category
    const related = allProducts.filter(p => 
        p.category === currentProduct.category && p.id !== currentProduct.id
    );
    
    if (related.length === 0) {
        relatedGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-color);">No related products found in this category.</p>`;
        return;
    }
    
    relatedGrid.innerHTML = "";
    // Show up to 4 related products
    related.slice(0, 4).forEach(product => {
        relatedGrid.innerHTML += `
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

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }

    if (typeof showToast === "function") {
        showToast(`${product.name} added to cart!`);
    } else {
        alert(`${product.name} added to cart!`);
    }
}

loadProduct();
