// Enhanced Cart Functions for cart.html
function renderCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) {
        console.error('Cart content element not found');
        return;
    }
    
    // Make sure cart is loaded
    loadCart();
    
    console.log('Rendering cart with items:', cart);
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p style="color: #999; margin-bottom: 2rem;">Add some comics to get started!</p>
                <a href="browse.html" class="hero-btn">Browse Comics</a>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.cover}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3>${item.title}</h3>
                        <p style="color: #e90606ff;">${item.publisher} - ${item.issue}</p>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (8%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-total">Total:</span>
                <span class="summary-total">$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        </div>
    `;
    
    // Update cart count after rendering
    updateCartCount();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function checkout() {
    const modal = document.getElementById('modal');
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity * 1.08), 0).toFixed(2);
    
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="modal-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p style="color: #c40909ff; margin-top: 1rem;">Thank you for your simulated order!</p>
            <p style="color: #c40909ff; margin-top: 0.5rem;">Order Total: $${orderTotal}</p>
            <button class="modal-close" onclick="completeCheckout()">Continue Shopping</button>
        `;
        modal.classList.add('active');
    }
}

function completeCheckout() {
    cart = [];
    saveCart();
    updateCartCount();
    closeModal();
    window.location.href = 'index.html';
}