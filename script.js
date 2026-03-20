// Product Database - Complete Collection
const products = [
  {
    id: 1,
    name: "Golden Heritage Collar",
    price: 89.99,
    description: "Handcrafted Italian leather with 24K gold-plated hardware",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
    category: "accessory"
  },
  {
    id: 2,
    name: "Royal Velvet Bed",
    price: 199.99,
    description: "Plush velvet orthopedic bed with memory foam",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1bc0?w=400",
    category: "care"
  },
  {
    id: 3,
    name: "Diamond Crystal Leash",
    price: 129.99,
    description: "Premium leather leash with Swarovski crystal accents",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    category: "accessory"
  },
  {
    id: 4,
    name: "Gold Leaf Feeding Set",
    price: 79.99,
    description: "Ceramic bowls with 24K gold leaf detailing",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400",
    category: "care"
  },
  {
    id: 5,
    name: "Cashmere Dog Coat",
    price: 149.99,
    description: "Luxurious cashmere blend winter coat",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
    category: "accessory"
  },
  {
    id: 6,
    name: "Aromatherapy Spa Set",
    price: 59.99,
    description: "Calming essential oils and grooming brushes",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    category: "care"
  },
  {
    id: 7,
    name: "Pearl Embellished Harness",
    price: 109.99,
    description: "Adjustable harness with genuine pearl accents",
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400",
    category: "accessory"
  },
  {
    id: 8,
    name: "Organic Grooming Kit",
    price: 84.99,
    description: "Natural shampoo, conditioner, and brush set",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400",
    category: "care"
  }
];

// Cart array with localStorage
let cart = JSON.parse(localStorage.getItem('elysianCart')) || [];

// DOM Elements
let productsGrid, cartItems, cartTotal, cartCount, cartSidebar, cartOverlay, toast;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  productsGrid = document.getElementById('productsGrid');
  cartItems = document.getElementById('cartItems');
  cartTotal = document.getElementById('cartTotal');
  cartCount = document.getElementById('cartCount');
  cartSidebar = document.getElementById('cartSidebar');
  cartOverlay = document.getElementById('cartOverlay');
  toast = document.getElementById('toast');

  // Render products
  renderProducts();
  
  // Update cart UI
  updateCartUI();
  
  // Setup navigation
  setupNavigation();
  
  // Setup cart events
  setupCartEvents();
  
  // Setup contact form
  setupContactForm();
  
  // Setup mobile menu
  setupMobileMenu();
  
  // Setup search functionality
  setupSearch();
  
  // Setup newsletter
  setupNewsletter();
  
  // Show home section by default
  showSection('home');
  
  // Handle banner background fallback
  handleImageFallback();
});

function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <p class="product-description">${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to all add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      showToast('Added to cart ✨');
    });
  });
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }
  
  updateCartUI();
  localStorage.setItem('elysianCart', JSON.stringify(cart));
}

function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  
  // Update cart items list
  if (!cartItems) return;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: #888;">Your cart is empty<br><span style="font-size: 0.9rem;">Add some luxury to your bag ✨</span></div>';
    if (cartTotal) cartTotal.textContent = '$0.00';
    return;
  }
  
  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${product.image}" alt="${product.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${product.name}</div>
          <div class="cart-item-price">$${product.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="decrease-qty" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="increase-qty" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }).join('');
  
  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
  
  // Add event listeners for cart controls
  document.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, -1);
    });
  });
  
  document.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, 1);
    });
  });
  
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
    });
  });
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    updateCartUI();
    localStorage.setItem('elysianCart', JSON.stringify(cart));
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  localStorage.setItem('elysianCart', JSON.stringify(cart));
  showToast('Item removed');
}

function setupNavigation() {
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      showSection(section);
      
      // Update active nav link
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
      });
      if (link.classList.contains('nav-links')) {
        link.classList.add('active');
      } else {
        const correspondingNavLink = document.querySelector(`.nav-links a[data-section="${section}"]`);
        if (correspondingNavLink) correspondingNavLink.classList.add('active');
      }
      
      // Close mobile menu if open
      const navLinks = document.querySelector('.nav-links');
      if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      }
    });
  });
}

function showSection(sectionId) {
  const sections = ['home', 'shop', 'about', 'contact'];
  sections.forEach(id => {
    const section = document.getElementById(`${id}-section`);
    if (section) {
      if (id === sectionId) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    }
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupCartEvents() {
  const cartIcon = document.getElementById('cartIcon');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
  }
  
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
      }
      const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      alert(`✨ Thank you for your order! ✨\n\nTotal: $${total.toFixed(2)}\n\nA confirmation email will be sent to you shortly.\n\nÉLYSIAN - Where elegance meets devotion.`);
      cart = [];
      updateCartUI();
      localStorage.setItem('elysianCart', JSON.stringify(cart));
      closeCart();
      showToast('Order placed successfully!');
    });
  }
}

function openCart() {
  if (cartSidebar) cartSidebar.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (cartSidebar) cartSidebar.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✨ Message sent! Our concierge will respond within 24 hours');
      form.reset();
    });
  }
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenu');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--black-light)';
        navLinks.style.padding = '2rem';
        navLinks.style.gap = '1rem';
        navLinks.style.zIndex = '999';
        navLinks.style.borderBottom = '1px solid var(--gold)';
      }
    });
  }
}

function setupSearch() {
  const searchIcon = document.getElementById('searchIcon');
  if (searchIcon) {
    searchIcon.addEventListener('click', () => {
      const searchTerm = prompt('Search ÉLYSIAN products:', '');
      if (searchTerm && searchTerm.trim()) {
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
          showToast(`Found ${filtered.length} products matching "${searchTerm}"`);
          showSection('shop');
          setTimeout(() => {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
              if (!filtered.find(p => p.name === products[index].name)) {
                card.style.display = 'none';
              } else {
                card.style.display = 'block';
              }
            });
          }, 100);
        } else {
          showToast(`No products found matching "${searchTerm}"`);
        }
      } else if (searchTerm === '') {
        // Reset all products
        document.querySelectorAll('.product-card').forEach(card => {
          card.style.display = 'block';
        });
      }
    });
  }
}

function setupNewsletter() {
  const newsletterBtn = document.querySelector('.newsletter-form button');
  const newsletterInput = document.querySelector('.newsletter-form input');
  
  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
      const email = newsletterInput.value.trim();
      if (email && email.includes('@')) {
        showToast('✨ Subscribed! Welcome to the ÉLYSIAN circle');
        newsletterInput.value = '';
      } else if (email) {
        showToast('Please enter a valid email address');
      } else {
        showToast('Enter your email to get 10% off');
      }
    });
  }
}

function handleImageFallback() {
  // Handle logo fallback
  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.onerror = () => {
      logoImg.style.display = 'none';
    };
  }
  
  // Handle banner fallback
  const bannerDiv = document.querySelector('.hero-banner');
  if (bannerDiv) {
    const img = new Image();
    img.src = bannerDiv.style.backgroundImage.slice(5, -2);
    img.onerror = () => {
      bannerDiv.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
    };
  }
  
  // Handle footer logo fallback
  const footerLogo = document.querySelector('.footer-logo-img');
  if (footerLogo) {
    footerLogo.onerror = () => {
      footerLogo.style.display = 'none';
    };
  }
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Add window resize handler to reset mobile menu on resize
window.addEventListener('resize', () => {
  const navLinks = document.querySelector('.nav-links');
  if (window.innerWidth > 768 && navLinks) {
    navLinks.style.display = '';
    navLinks.style.flexDirection = '';
    navLinks.style.position = '';
    navLinks.style.top = '';
    navLinks.style.left = '';
    navLinks.style.right = '';
    navLinks.style.background = '';
    navLinks.style.padding = '';
    navLinks.style.gap = '';
    navLinks.style.zIndex = '';
    navLinks.style.borderBottom = '';
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});