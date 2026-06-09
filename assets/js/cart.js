document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    setupCheckoutModal();
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-view">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="products.html" class="btn">Shop Now</a>
            </div>
        `;
        return;
    }

    // Set up two-column layout grid
    cartContainer.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items-list" id="cart-items-list">
                <!-- Items will be injected here -->
            </div>
            <div class="order-summary" id="order-summary-container">
                <!-- Summary will be injected here -->
            </div>
        </div>
    `;

    const itemsList = document.getElementById("cart-items-list");
    let subtotal = 0;

    cart.forEach(product => {
        const qty = product.quantity || 1;
        const itemSubtotal = Number(product.price) * qty;
        subtotal += itemSubtotal;

        itemsList.innerHTML += `
            <div class="cart-item" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x500?text=No+Image';">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <span class="cart-item-category">${product.category}</span>
                    <span class="cart-item-price">$${product.price}</span>
                </div>
                <div class="cart-qty-control">
                    <button class="cart-qty-btn" onclick="changeQty(${product.id}, -1)">-</button>
                    <span class="cart-qty-value">${qty}</span>
                    <button class="cart-qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
                </div>
                <div class="cart-item-subtotal">
                    $${itemSubtotal}
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${product.id})" title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    // Calculate details
    const shipping = subtotal > 200 ? 0 : 15;
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + shipping + tax;

    const summaryContainer = document.getElementById("order-summary-container");
    summaryContainer.innerHTML = `
        <h3 class="summary-title">Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>
        <div class="summary-row">
            <span>Tax (8%)</span>
            <span>$${tax}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>$${total}</span>
        </div>
        <button class="btn checkout-btn" id="proceed-to-checkout-btn">Proceed To Checkout</button>
    `;

    // Bind event for Checkout
    document.getElementById("proceed-to-checkout-btn").addEventListener("click", () => {
        const modal = document.getElementById("checkout-modal-overlay");
        if (modal) {
            modal.classList.add("active");
        }
    });
}

// Global scope functions for inline template handlers
window.changeQty = function(id, delta) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;

    if (item.quantity <= 0) {
        // Remove item if quantity goes to 0
        cart = cart.filter(product => product.id !== id);
    }

    saveCartAndRefresh();
};

window.removeCartItem = function(id) {
    cart = cart.filter(product => product.id !== id);
    saveCartAndRefresh();
};

function saveCartAndRefresh() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }
}

function setupCheckoutModal() {
    const modal = document.getElementById("checkout-modal-overlay");
    const closeBtn = document.getElementById("close-modal-btn");
    const form = document.getElementById("checkout-form");
    const contentArea = document.getElementById("modal-content-area");

    if (!modal || !closeBtn) return;

    // Close button click
    closeBtn.addEventListener("click", closeModal);

    // Overlay click (outside the card)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove("active");
    }

    // Form Submission
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Loading Simulation
            const submitBtn = form.querySelector(".checkout-submit-btn");
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";

            setTimeout(() => {
                // Clear cart state
                cart = [];
                localStorage.removeItem("cart");
                if (typeof updateCartBadge === "function") {
                    updateCartBadge();
                }

                // Show success screen inside the modal
                const orderNum = `NS-${Math.floor(100000 + Math.random() * 900000)}`;
                contentArea.innerHTML = `
                    <div class="success-screen">
                        <div class="success-icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3>Order Placed Successfully!</h3>
                        <p>Thank you for your purchase. Your order number is <strong>${orderNum}</strong>.</p>
                        <button class="btn" id="success-close-btn" style="margin-top: 15px;">Continue Shopping</button>
                    </div>
                `;

                // Handle continue shopping click
                document.getElementById("success-close-btn").addEventListener("click", () => {
                    closeModal();
                    window.location.href = "products.html";
                });
            }, 1500);
        });
    }
}