const modalContainer = document.querySelector(".modal-container");
const modalOverlay = document.querySelector(".modal-overlay");

const cartBtn = document.querySelector(".cart-btn");
const cartCounter = document.querySelector(".cart-counter");


const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    const modalHeader = document.createElement("div");

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);




        if (cart.length > 0) {
        cart.forEach((product) => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            modalBody.innerHTML = `
        <div class="product">
        <img class="product-img" src="${product.img}">
        <div class="product-info">
        <h4>${product.productName}	</h4>
        </div>
        <div class="quantity">
        <span class="quantity-btn-decrese">-</span>
        <span class="quantity-input">${product.quanty}</span>
        <span class="quantity-btn-increse">+</span>
        </div>
        <div class="price">$${product.price * product.quanty}</div>
        <div class="delete-product">❌</div>
        </div>
        `;

            modalContainer.append(modalBody);

            const decrese = modalBody.querySelector(".quantity-btn-decrese");
            decrese.addEventListener("click", () => {
                if (product.quanty !== 1) {
                    product.quanty--;
                    displayCart();
                }
                displayCartCounter();
            });

            const increse = modalBody.querySelector(".quantity-btn-increse");
            increse.addEventListener("click", () => {
                product.quanty++;
                displayCart();
                displayCartCounter();
            });

            const deleteProduct = modalBody.querySelector(".delete-product");
            deleteProduct.addEventListener("click", () => {
                deleteCartProduct(product.id)
            });
        });


            const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);

            const modalFooter = document.createElement("div");
            modalFooter.className = "modal-footer";
            modalFooter.innerHTML = `
            <div class="total-price">Total : ${total}</div>
            <button class="btn-primary" id="checkout-btn">go to checkout</button>
            <div id="wallet_container"></div>
     `;
            modalContainer.append(modalFooter);

        const mp = new MercadoPago("APP_USR-1589310844045442-080822-4cb40ca4d0be25699b59b8fe8860cc2f-299264870",{
            locale: "es-AR",
            site_id: "MLA"
        });

        const generateCartDescription = () => {
            return cart.map((product) => `${product.productName} (x${product.quanty})`).join(", ");
            };


        
        document.getElementById("checkout-btn").addEventListener("click", async () => {
        try {
            const orderData = {
                title: generateCartDescription(),
                quantity: 1,
                price: total,
            };
            const response = await fetch("https://localhost:3000/create_prefernece",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const preference = await response.json();
            createCheckoutButton(preference.id);
        } catch (error) {
            aler("error");
        } 
    });

    const createCheckoutButton = (preferenceId) => {
        
        const bricksBuilder = mp.bricks();

        const renderComponent = async () => {
            if (window.checkoutButton) window.checkoutButton.unmount();

            await bricksBuilder.create("wallet", "wallet-container", {
                initialization: {
                    preferenceId: preferenceId,
                }
            })
    };

    renderComponent();

    };

 
    }else {
            const modalText = document.createElement("h2");
            modalText.className = "modal-body";
            modalText.innerText = "Your cart is empty";
            modalContainer.append(modalText);
        }
};
        
    



    cartBtn.addEventListener("click", displayCart);

    const deleteCartProduct = (id) => {
        const foundId = cart.findIndex((element) => element.id === id);
        cart.splice(foundId, 1);
        displayCart();
        displayCartCounter();
    }

    const displayCartCounter = () => {
        const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
        if (cartLength > 0) {
            cartCounter.style.display = "block";
            cartCounter.innerText = cartLength;
        } else {
            cartCounter.style.display = "none";
        }
    }