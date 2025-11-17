// Debug helper to check cart state
function debugCart() {
    console.log('=== CART DEBUG INFO ===');
    console.log('LocalStorage cart:', localStorage.getItem('comicverse-cart'));
    console.log('Current cart array:', cart);
    console.log('Cart item count:', cart.reduce((sum, item) => sum + item.quantity, 0));
    console.log('========================');
}

// Call this in browser console if you need to debug
function clearCart() {
    cart = [];
    saveCart();
    console.log('Cart cleared');
}