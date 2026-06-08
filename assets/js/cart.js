const cartContainer = document.getElementById("cart-container");

const cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

let total = 0;

if (cart.length === 0) {

    cartContainer.innerHTML = `
        <h3>Your cart is empty.</h3>
    `;

} else {

    cart.forEach(product => {

        total += Number(product.price);

        cartContainer.innerHTML += `

            <div class="cart-item">

                <img src="${product.image}"
                     alt="${product.name}">

                <div class="cart-info">

                    <h3>${product.name}</h3>

                    <p class="cart-price">
                        $${product.price}
                    </p>

                </div>

            </div>

        `;
    });

    cartContainer.innerHTML += `

        <div class="cart-total">

            Total: $${total}

        </div>

    `;
}