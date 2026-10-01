/* ==========================================
   SHOPNOVA FRONTEND
   Connected to Spring Boot backend
========================================== */

const API_URL = "https://shopnova-backend-8a8u.onrender.com/api";

let products = [];
let cart = [];


/* ==========================================
   INITIAL LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();
    loadCart();

});


/* ==========================================
   LOAD PRODUCTS
========================================== */

async function loadProducts() {

    const status = document.getElementById("productStatus");

    try {

        const response = await fetch(
            `${API_URL}/products`
        );

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        status.textContent =
            `${products.length} products available`;

        displayProducts(products);

    } catch (error) {

        console.error(error);

        status.textContent =
            "Unable to connect to store";

        document.getElementById("productsGrid").innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    ⚠️
                </div>

                <h3>
                    Store unavailable
                </h3>

                <p>
                    Please make sure the backend is running.
                </p>

            </div>

        `;

    }

}


/* ==========================================
   DISPLAY PRODUCTS
========================================== */

function displayProducts(productList) {

    const container =
        document.getElementById("productsGrid");

    if (!productList.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🔎
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = productList
        .map(product => {

            const icon =
                getProductIcon(product.name);

            return `

                <article class="product-card">

                    <div class="product-image">
                        ${icon}
                    </div>

                    <div class="product-info">

                        <span class="product-category">
                            Electronics
                        </span>

                        <h3 class="product-name">
                            ${escapeHTML(product.name)}
                        </h3>

                        <p class="product-description">
                            Quality product designed
                            for everyday use.
                        </p>

                        <div class="product-bottom">

                            <span class="product-price">
                                $${Number(product.price).toFixed(2)}
                            </span>

                            <button
                                class="add-button"
                                onclick="addToCart('${product.id}')"
                            >
                                Add to Cart
                            </button>

                        </div>

                    </div>

                </article>

            `;

        })
        .join("");

}


/* ==========================================
   PRODUCT ICON
========================================== */

function getProductIcon(name) {

    const value = name.toLowerCase();

    if (value.includes("mouse")) {
        return "🖱️";
    }

    if (
        value.includes("keyboard")
    ) {
        return "⌨️";
    }

    if (
        value.includes("hub") ||
        value.includes("usb")
    ) {
        return "🔌";
    }

    if (
        value.includes("phone") ||
        value.includes("mobile")
    ) {
        return "📱";
    }

    if (
        value.includes("headphone") ||
        value.includes("earphone")
    ) {
        return "🎧";
    }

    if (value.includes("laptop")) {
        return "💻";
    }

    return "📦";
}


/* ==========================================
   ADD PRODUCT
========================================== */

async function addToCart(productId) {

    try {

        const response = await fetch(
            `${API_URL}/cart/add?productId=${encodeURIComponent(productId)}&quantity=1`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Could not add product");
        }

        await loadCart();

        showToast("Added to your cart");

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to add product"
        );

    }

}


/* ==========================================
   LOAD CART
========================================== */

async function loadCart() {

    try {

        const response = await fetch(
            `${API_URL}/cart`
        );

        if (!response.ok) {
            throw new Error("Could not load cart");
        }

        const data = await response.json();

        cart = data.items || [];

        displayCart();

        updateCartCount();

    } catch (error) {

        console.error(error);

    }

}


/* ==========================================
   DISPLAY CART
========================================== */

function displayCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you love.
                </p>

            </div>

        `;

        totalElement.textContent =
            "$0.00";

        return;
    }


    container.innerHTML = cart
        .map(item => {

            const product =
                item.product;

            const quantity =
                item.quantity;

            const subtotal =
                item.subtotal ??
                (
                    Number(product.price) *
                    Number(quantity)
                );


            return `

                <div class="cart-item">

                    <div class="cart-item-image">

                        ${getProductIcon(product.name)}

                    </div>


                    <div class="cart-item-info">

                        <div class="cart-item-name">
                            ${escapeHTML(product.name)}
                        </div>

                        <div class="cart-item-price">

                            $${Number(product.price).toFixed(2)}
                            each

                        </div>


                        <div class="quantity-controls">

                            <button
                                onclick="changeQuantity(
                                    '${product.id}',
                                    ${quantity - 1}
                                )"
                            >
                                −
                            </button>

                            <span class="quantity">
                                ${quantity}
                            </span>

                            <button
                                onclick="changeQuantity(
                                    '${product.id}',
                                    ${quantity + 1}
                                )"
                            >
                                +
                            </button>

                        </div>


                        <button
                            class="remove-item"
                            onclick="removeFromCart(
                                '${product.id}'
                            )"
                        >
                            Remove
                        </button>

                    </div>


                    <strong>

                        $${Number(subtotal).toFixed(2)}

                    </strong>

                </div>

            `;

        })
        .join("");


    calculateCartTotal();

}


/* ==========================================
   CALCULATE TOTAL
========================================== */

async function calculateCartTotal() {

    try {

        const response = await fetch(
            `${API_URL}/cart`
        );

        const data =
            await response.json();

        const total =
            data.total ?? 0;

        document.getElementById(
            "cartTotal"
        ).textContent =
            `$${Number(total).toFixed(2)}`;

    } catch (error) {

        console.error(error);

    }

}


/* ==========================================
   CHANGE QUANTITY
========================================== */

async function changeQuantity(
    productId,
    quantity
) {

    if (quantity <= 0) {

        await removeFromCart(productId);

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/cart/update?productId=${encodeURIComponent(productId)}&quantity=${quantity}`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Could not update quantity"
            );
        }


        await loadCart();

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to update quantity"
        );

    }

}


/* ==========================================
   REMOVE FROM CART
========================================== */

async function removeFromCart(productId) {

    try {

        const response = await fetch(
            `${API_URL}/cart/remove/${encodeURIComponent(productId)}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Could not remove product"
            );
        }


        await loadCart();

        showToast(
            "Product removed"
        );

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to remove product"
        );

    }

}


/* ==========================================
   UPDATE CART COUNT
========================================== */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );

    document.getElementById(
        "cartCount"
    ).textContent = count;

}


/* ==========================================
   OPEN CART
========================================== */

function openCart() {

    document
        .getElementById("cartSidebar")
        .classList.add("active");

    document
        .getElementById("cartOverlay")
        .classList.add("active");

    document.body.style.overflow =
        "hidden";

}


/* ==========================================
   CLOSE CART
========================================== */

function closeCart() {

    document
        .getElementById("cartSidebar")
        .classList.remove("active");

    document
        .getElementById("cartOverlay")
        .classList.remove("active");

    document.body.style.overflow =
        "";

}


/* ==========================================
   CONFIRM ORDER
========================================== */

async function confirmOrder() {

    if (!cart.length) {

        showToast(
            "Your cart is empty"
        );

        return;
    }


    const confirmed =
        confirm(
            "Confirm your order?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/order/confirm`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Order confirmation failed"
            );
        }


        closeCart();

        await loadCart();

        showToast(
            "Order confirmed successfully!"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Unable to confirm order"
        );

    }

}


/* ==========================================
   SEARCH
========================================== */

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const search =
        input.value
            .trim()
            .toLowerCase();


    if (!search) {

        displayProducts(products);

        return;
    }


    const filtered =
        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(search)

            ||

            product.id
                .toLowerCase()
                .includes(search)

        );


    displayProducts(filtered);

}


/* ==========================================
   LIVE SEARCH
========================================== */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        searchProducts
    );


/* ==========================================
   SCROLL
========================================== */

function scrollToProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   TOAST
========================================== */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* ==========================================
   HTML SAFETY
========================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
