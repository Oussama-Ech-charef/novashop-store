

const productContainer = document.getElementById("product-details-container");


const params = new URLSearchParams(window.location.search);

const productId = params.get("id");
async function loadProduct() {
    try {
        const response = await fetch("assets/data/products.json");
        const products = await response.json();
        const product = products.find(item => item.id == productId);
        if (!product) {
            productContainer.innerHTML = `

                <h2>Product Not Found</h2>

            `;
            return;
        }

        displayProduct(product);

    } catch (error) {
        console.error(error);
    }
}

function displayProduct(product) {

    productContainer.innerHTML = `

        <div class="product-details-content">

            <div class="product-details-image">

                <img src="${product.image}" alt="${product.name}">

            </div>

            <div class="product-details-info">

                <h1>${product.name}</h1>

                <p class="product-price">
                    $${product.price}
                </p>

                <p class="product-description">

                    Premium technology product designed
                    for performance, reliability and
                    everyday productivity.

                </p>

                <button class="btn add-to-cart-btn">
                    Add To Cart
                </button>

            </div>

        </div>

    `;
    const addToCartBtn = document.querySelector(".add-to-cart-btn");

        addToCartBtn.addEventListener("click", () => {

            addToCart(product);

        });
}

loadProduct();

function addToCart(product) {

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Product added to cart!");

}
