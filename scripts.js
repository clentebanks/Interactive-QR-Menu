 // Initialize QR code
        document.addEventListener('DOMContentLoaded', function() {
            // Generate QR code
            QRCode.toCanvas(document.getElementById('qrCode'), 'https://gourmetexpress.com/menu/1234', {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, function(error) {
                if (error) console.error(error);
            });
            
            // QR modal functionality
            const qrBtn = document.getElementById('qrBtn');
            const qrModal = document.getElementById('qrModal');
            const closeQrModal = document.getElementById('closeQrModal');
            
            qrBtn.addEventListener('click', () => {
                qrModal.classList.remove('hidden');
            });
            
            closeQrModal.addEventListener('click', () => {
                qrModal.classList.add('hidden');
            });
            
            // Order sidebar functionality
            const viewOrderBtn = document.getElementById('viewOrderBtn');
            const orderSidebar = document.getElementById('orderSidebar');
            const closeOrderSidebar = document.getElementById('closeOrderSidebar');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            viewOrderBtn.addEventListener('click', () => {
                orderSidebar.classList.remove('translate-x-full');
            });
            
            closeOrderSidebar.addEventListener('click', () => {
                orderSidebar.classList.add('translate-x-full');
            });
            
            checkoutBtn.addEventListener('click', () => {
                alert('Order submitted! Thank you for dining with us.');
                // In a real implementation, you would send the order to the server
                orderItems = [];
                updateOrderUI();
                orderSidebar.classList.add('translate-x-full');
            });
            
            // Category filtering
            const categoryBtns = document.querySelectorAll('.category-btn');
            
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active button
                    categoryBtns.forEach(b => {
                        b.classList.remove('bg-amber-600', 'text-white');
                        b.classList.add('bg-white', 'text-amber-700', 'border', 'border-amber-200', 'hover:bg-amber-50');
                    });
                    
                    btn.classList.add('bg-amber-600', 'text-white');
                    btn.classList.remove('bg-white', 'text-amber-700', 'border', 'border-amber-200', 'hover:bg-amber-50');
                    
                    // Filter items
                    const category = btn.dataset.category;
                    const sections = document.querySelectorAll('section');
                    
                    if (category === 'all') {
                        sections.forEach(section => {
                            section.classList.remove('hidden');
                        });
                    } else {
                        sections.forEach(section => {
                            if (section.id === category) {
                                section.classList.remove('hidden');
                            } else {
                                section.classList.add('hidden');
                            }
                        });
                    }
                    
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            });
            
            // Order functionality
            let orderItems = [];
            const addToOrderBtns = document.querySelectorAll('.add-to-order');
            
            addToOrderBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const menuItem = this.closest('.menu-item');
                    const itemName = menuItem.querySelector('h3').textContent.trim();
                    const itemPrice = parseFloat(menuItem.querySelector('.price-tag').textContent.replace('$', ''));
                    
                    // Check if item already exists in order
                    const existingItem = orderItems.find(item => item.name === itemName);
                    
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        orderItems.push({
                            name: itemName,
                            price: itemPrice,
                            quantity: 1
                        });
                    }
                    
                    updateOrderUI();
                    
                    // Show order button if it's hidden
                    if (viewOrderBtn.classList.contains('hidden')) {
                        viewOrderBtn.classList.remove('hidden');
                    }
                    
                    // Animation feedback
                    this.innerHTML = '<i class="fas fa-check"></i> Added!';
                    setTimeout(() => {
                        this.innerHTML = 'Add to Order <i class="fas fa-plus ml-1"></i>';
                    }, 1000);
                });
            });
            
            function updateOrderUI() {
                const orderItemsContainer = document.getElementById('orderItems');
                const orderCount = document.getElementById('orderCount');
                const subtotalElement = document.getElementById('subtotal');
                const taxElement = document.getElementById('tax');
                const totalElement = document.getElementById('total');
                
                // Update order count
                const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
                orderCount.textContent = totalItems;
                
                // Update order items list
                if (orderItems.length === 0) {
                    orderItemsContainer.innerHTML = `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-shopping-basket text-4xl mb-2"></i>
                            <p>Your order is empty</p>
                        </div>
                    `;
                } else {
                    let itemsHTML = '';
                    let subtotal = 0;
                    
                    orderItems.forEach(item => {
                        subtotal += item.price * item.quantity;
                        
                        itemsHTML += `
                            <div class="flex justify-between items-center py-3 border-b border-gray-100">
                                <div>
                                    <p class="font-medium">${item.name}</p>
                                    <div class="flex items-center mt-1">
                                        <button class="decrease-quantity text-gray-500 hover:text-amber-600 w-6 h-6 flex items-center justify-center rounded-full" data-name="${item.name}">
                                            <i class="fas fa-minus text-xs"></i>
                                        </button>
                                        <span class="mx-2">${item.quantity}</span>
                                        <button class="increase-quantity text-gray-500 hover:text-amber-600 w-6 h-6 flex items-center justify-center rounded-full" data-name="${item.name}">
                                            <i class="fas fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                                    <button class="remove-item text-xs text-red-500 hover:text-red-700 mt-1" data-name="${item.name}">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    
                    orderItemsContainer.innerHTML = itemsHTML;
                    
                    // Add event listeners to quantity buttons
                    document.querySelectorAll('.decrease-quantity').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const itemName = this.dataset.name;
                            const item = orderItems.find(item => item.name === itemName);
                            
                            if (item.quantity > 1) {
                                item.quantity--;
                            } else {
                                orderItems = orderItems.filter(item => item.name !== itemName);
                            }
                            
                            updateOrderUI();
                        });
                    });
                    
                    document.querySelectorAll('.increase-quantity').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const itemName = this.dataset.name;
                            const item = orderItems.find(item => item.name === itemName);
                            item.quantity++;
                            updateOrderUI();
                        });
                    });
                    
                    document.querySelectorAll('.remove-item').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const itemName = this.dataset.name;
                            orderItems = orderItems.filter(item => item.name !== itemName);
                            updateOrderUI();
                            
                            if (orderItems.length === 0) {
                                viewOrderBtn.classList.add('hidden');
                            }
                        });
                    });
                }
                
                // Update totals
                const tax = subtotal * 0.08;
                const total = subtotal + tax;
                
                subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
                taxElement.textContent = `$${tax.toFixed(2)}`;
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
            
            // Scroll animations
            const menuItems = document.querySelectorAll('.menu-item');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            menuItems.forEach(item => {
                item.style.opacity = 0;
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.5s ease';
                observer.observe(item);
            });
        });