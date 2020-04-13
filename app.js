let log = console.log;


const initPage = data => {
    // Getting and setting cart details to Session storage
    const appState = JSON.parse(sessionStorage.getItem('appState'));
    let productsInCart = appState ? appState.cart : [], wishListArr = appState ? appState.wishlist : [];

    const saveState = () => {
        sessionStorage.setItem('appState', JSON.stringify({cart: productsInCart, wishlist: wishListArr}));
    };

    // Init of variables 
    const arrivals = document.querySelector('.arrivals-content');
    const arrivalTabsNode = document.querySelector('.arrivals-tabs');
    const cartCont = document.querySelector('.cart-cont');
    const cartQuantityNode = cartCont.querySelector('.cart-qty .total');
    const cartSumNode = cartCont.querySelector('.amount');
    const cartHeader = document.querySelector('.actions-header .cart');
    const wshLHeader = document.querySelector('.actions-header .wishlist');
    const wishListCont = document.querySelector('.wishlist-cont');
    const msgCont = document.querySelector('.msg-container');
    const dealsCont = document.querySelector('.deals-cont');

    // Bubbling effect of Add to Cart btn on click
    function materializeEffect(event) {
        const circle = document.createElement('div');
        const x = event.layerX;
        const y = event.layerY;
        circle.classList.add('circle');
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        this.appendChild(circle);
    }

    //Fade in & out effect of Shopping cart and Wish list
    const addFadInEffect = (node) => {
        node.style.opacity = 0;
        node.style.display = "block";

        setTimeout(() => {
            node.style.opacity = 1;
        });
    };

    const addFadeOutEffect = (node) => {
        node.style.opacity = 0;
        setTimeout(() => node.style.display = "none", 1000);
    };

    // Calculating days, hours, mins, seconds left till end of deal
    const getDateDetails = (ts) => {
        const SECONDS_IN_DAY = 60 * 60 * 24;

        let diff = ts - Math.floor(Date.now() / 1000);
        const days = Math.floor(diff / SECONDS_IN_DAY);
        diff -= days * SECONDS_IN_DAY;

        const hours = Math.floor(diff / 3600);
        diff -= hours * 3600;

        const mins = Math.floor(diff / 60);
        diff -= mins * 60;

        return {days, hours, mins, secs: diff};
    };

    // Function fetching templates
    function renderTemplate(templateId, data) {
        let template = document.getElementById(templateId).innerHTML;

        Object.keys(data).forEach(key => {
            template = template.replace(new RegExp(`__${key}__`, 'g'), data[key]);
        });

        return template;
    }

    // Function showing the feedback after adding the product to cart
    const showFeedback = (message) => {
        const divNode = document.createElement('div');
        divNode.classList.add('msg-info');

        divNode.innerHTML = message;
        msgCont.appendChild(divNode);

        setTimeout(() => divNode.style.opacity = 1);
        setTimeout(() => divNode.style.opacity = 0, 6000);
        setTimeout(() => divNode.remove(), 10000);
    };

    // Slideshow
    // function sliding the banner images
    const renderSlideshow = () => {
        let current = 0, zIndex = 0;
        let slideImages = document.querySelectorAll('.organic-slideshow div img');

        function getNextSlide(prev, next) {
            // Manipulation with z-index allows next slide to stay always on top
            prev.style.zIndex = zIndex++;
            next.style.zIndex = zIndex++;

            next.style.transform = 'translate(0)';

            // In 3s the prev slide returns to initial position
            setTimeout(() => {
                prev.style.transform = 'translate(100%)';
            }, 3000);
        }

        // Wrapping of getNextSlide call in setInterval to make an infinite slideshow
        setInterval(() => {
            const next = current === slideImages.length - 1 ? 0 : current + 1;
            getNextSlide(slideImages[current], slideImages[next]);
            current = next;

        }, 4000);
    };

    // Populating categories from data.categories to render Categories component
    const renderCategoryTiles = (arr) => {
        const ctgCont = document.querySelector('.categories-cont');
        ctgCont.innerHTML = arr.reduce((html, curr) => html +
            `<div><div class="item-wrap">
                <a class="${curr.image}" href="javascript:"></a><div class="content-wrap"><h2>${curr.label}</h2><span>${curr.qty} products</span></div>
            </div></div>`,
            '');
    };

    // Populating newArrivals tabs from data.products to render newArrivals tiles
    const renderCategoryTabs = (categories) => {
        const catIds = data.products.map(({catId}) => catId);
        // find categories with at least one product
        const categoriesWithProducts = categories.filter(catObj => catIds.includes(catObj.id));
        arrivalTabsNode.innerHTML = categoriesWithProducts.reduce((html, catObj) =>
            html + `<li data-id="${catObj.id}">
                        <a href="javascript:">
                            <img src="./assets/${catObj.icon}.jpg" alt="${catObj.label}">
                            <span>${catObj.label}</span>
                        </a>
                    </li>`, '');

        const firstCategory = categoriesWithProducts[0];

        // render first category if it's available
        if (firstCategory) {
            renderNewArrivals(firstCategory.id);
        }
    };

    // Activates category tab and populates product items
    const renderNewArrivals = (categoryId) => {
        arrivalTabsNode.querySelectorAll('li').forEach(el => {
            el.querySelector('span').style.color = '';
            el.classList.remove('active');
            if (el.getAttribute('data-id') === categoryId) {
                el.querySelector('span').style.color = '#124a2f';
                el.classList.add('active');
            }
        });

        arrivals.innerHTML = data.products.reduce((html, product) => {
            if (categoryId === product.catId) {
                let price = `$${product.price}`;
                let oldPrice = '';

                if (data.deals && data.deals.length) {
                    const dealProd = data.deals.filter(deal => deal.prodId === product.id)[0];
                    if (dealProd) {
                        price = `$${product.price - dealProd.discount}`;
                        oldPrice = `$${product.price}`;
                    }
                }

                html += renderTemplate('product-template', {
                    id: product.id,
                    img: `<img src="./assets/${product.label.toLowerCase().replace(/\s/g, '')}.jpg">`,
                    productName: product.label,
                    productPrice: price,
                    oldPrice: oldPrice,
                    wlClass: wishListArr.includes(product.id) ? ' added' : ''
                });
            }

            return html;
        }, '');
    };

    // Function adding product to Shopping cart
    const addToCart = (productId) => {
        const product = data.products.filter(el => el.id === productId)[0];

        if (!product) {
            console.warn('Product not found!');
            return;
        }

        // get product if it's already in cart
        const productInCart = productsInCart.filter(el => el.id === productId)[0];
        let price = product.price;

        if (data.deals && data.deals.length) {
            const dealProd = data.deals.filter(el => el.prodId === productId)[0];
            if (dealProd) {
                price = product.price - dealProd.discount;
            }
        }

        // if already in cart increase quantity
        if (productInCart) {
            productInCart.qty++;
            saveState();
            // Showing feedback message
            showFeedback(`One more <span class="outline">${product.label}</span> was added to your cart!`);
        } else {
            productsInCart.push({id: productId, qty: 1, price, name: product.label});
            saveState();
            // Showing feedback mesage
            showFeedback(`<span class="outline">${product.label}</span> was added to your cart!`);
        }
    };


    // renders the HTML for shopping cart
    const renderCart = () => {
        const productsUl = cartCont.querySelector('.products');
        const headerCart = cartHeader.querySelector('.cart-qty');

        productsUl.innerHTML = productsInCart.reduce((html, curr) => html +
            renderTemplate('cart-product-template', {
                dataId: curr.id,
                productName: curr.name,
                img: `<img alt="${curr.name}" title="${curr.name}" src="./assets/${curr.name.toLowerCase().replace(/\s/g, '')}.jpg"></img>`,
                productPrice: curr.price,
                productQty: curr.qty
            }), '');

        // Adding checkout btn only if there is at least 1 product in cart
        const btn = document.getElementById('chk-btn');
        if (productsInCart.length === 0 && btn) {
            btn.remove();
        }

        if (productsInCart.length > 0 && !btn) {
            const divNode = document.createElement('div');
            divNode.innerHTML = '<button id="chk-btn" type="button" class="tocart checkout-btn" title="Proceed to Checkout">Proceed to Checkout</button>';
            cartCont.appendChild(divNode.firstChild);
        }

        const amountTotal = productsInCart.reduce((sum, el) => sum + parseInt(el.qty), 0);
        cartQuantityNode.innerHTML = amountTotal;
        headerCart.innerHTML = amountTotal;
        cartSumNode.innerHTML = productsInCart.reduce((sum, curr) => sum + (curr.price * curr.qty), 0);

    };

    // Renders Wish list
    const renderWishList = () => {
        const wishListHeaderQty = document.querySelector('.actions-header .wishlist .cart-qty');
        const wishListUl = wishListCont.querySelector('.products');

        wishListHeaderQty.innerHTML = wishListArr.length;
        wishListCont.querySelector('.total').innerHTML = wishListArr.length;

        wishListUl.innerHTML = wishListArr.reduce((html, currId) => {
            const product = data.products.filter(el => el.id === currId)[0];
            return html + renderTemplate('wish-list-template', {
                dataId: currId,
                productName: product.label,
                img: `<img alt="${product.label}" title="${product.label}" src="./assets/${product.label.toLowerCase().replace(/\s/g, '')}.jpg"></img>`
            })
        }, '');
    };

    // Adding or removing the product from Wish list
    const addOrRemoveForWishList = (productId) => {
        let result = false;

        if (wishListArr.includes(productId)) {
            wishListArr = wishListArr.filter(el => el !== productId);
        } else {
            wishListArr.push(productId);
            result = true;
        }

        saveState();
        renderWishList();

        return result;
    };


    // Updating timer
    const startTimer = (deal) => {
        const daysD = document.querySelector('.countdown-amount-days b');
        const hoursD = document.querySelector('.countdown-amount-hours b');
        const minsD = document.querySelector('.countdown-amount-mins b');
        const secsD = document.querySelector('.countdown-amount-secs b');

        setInterval(() => {
            const {days, hours, mins, secs} = getDateDetails(deal.expDate);
            daysD.innerHTML = days;
            hoursD.innerHTML = hours;
            minsD.innerHTML = mins;
            secsD.innerHTML = secs;
        }, 1000);
    };

    // selects and renders one random deal
    const renderDeals = () => {
        const dealsCont = document.querySelector('.deals-cont');

        if (data.deals && data.deals.length > 0) {
            const deal = data.deals[Math.floor(Math.random() * data.deals.length)];
            const dealData = getDateDetails(deal.expDate);

            const product = data.products.filter(product => product.id === deal.prodId)[0];
            dealData.img = `<img alt="${product.label}" title="${product.label}" src="./assets/${product.label.toLowerCase().replace(/\s/g, '')}.jpg"></img>`;
            dealData.productName = product.label;
            dealData.productDesc = deal.dealdescrip;
            dealData.productPriceNow = product.price - deal.discount;
            dealData.productPriceBef = product.price;

            dealsCont.innerHTML = renderTemplate('deals-template', {
                dataId: deal.prodId,
                img: dealData.img,
                days: dealData.days,
                hours: dealData.hours,
                mins: dealData.mins,
                secs: dealData.secs,
                productName: dealData.productName,
                productPriceNow: dealData.productPriceNow,
                productPriceBef: dealData.productPriceBef,
                productDesc: dealData.productDesc
            });

            startTimer(deal);
        }
    };

    // Call of functions
    renderSlideshow();
    renderCategoryTiles(data.categories);
    renderCategoryTabs(data.categories);
    renderCart();
    renderWishList();
    renderDeals();



    
    // Rendering of the appropriate arrivals' product listing on click of the specific category tab
    arrivalTabsNode.addEventListener('click', (e) => {
        const dataId = e.target.closest('li').getAttribute('data-id');
        renderNewArrivals(dataId);
    });

    // Event delegates and handlers
    arrivals.addEventListener('click',  (e) => {
        const node = e.target;
        let productId;

        if (node.classList.contains('tocart')) {
            // Make sure that Wish list cart is closed before the shopping cart appears
            addFadeOutEffect(wishListCont);
            wshLHeader.classList.remove('active-wsl');

            productId = node.closest('.product-item').getAttribute('id');
            materializeEffect.call(node, e);
            addToCart(productId);
            renderCart();
            addFadInEffect(cartCont);
        }

        if (node.classList.contains('lnr-heart')) {
            const product = node.closest('.product-item');
            productId = product.getAttribute('id');

            if (addOrRemoveForWishList(productId)) {
                product.classList.add('added');
            } else {
                product.classList.remove('added');
            }
        }
    });

    cartCont.addEventListener('change', (e) => {
        const node = e.target;
        const productId = node.closest('li').getAttribute('data-id');
        const product = productsInCart.filter(el => el.id === productId)[0];
        product.qty = node.value;
        saveState();
        renderCart();
    });

    cartCont.addEventListener('click', (e) => {
        const node = e.target;

        if (node.classList.contains('del')) {
            const productId = node.closest('li').getAttribute('data-id');
            productsInCart = productsInCart.filter(el => el.id !== productId);
            saveState();
            renderCart();
        }

        if (node.classList.contains('close-icon')) {
            addFadeOutEffect(node.closest('section'));
        }
    });

    dealsCont.addEventListener('click',  (e) => {
        const node = e.target;
        if (node.classList.contains('tocart')) {
             // Make sure that Wish list cart is closed before the shopping cart appears
             addFadeOutEffect(wishListCont);
             wshLHeader.classList.remove('active-wsl');
             
            const productId = node.closest('.product-deal').getAttribute('data-id');
            materializeEffect.call(node, e);
            addToCart(productId);
            renderCart();
            addFadInEffect(cartCont);
        }
    });

    cartHeader.addEventListener('click',  () => {
        addFadeOutEffect(wishListCont);
        wshLHeader.classList.remove('active-wsl');
        addFadInEffect(cartCont);
    });

    wshLHeader.addEventListener('click', function() {
        addFadeOutEffect(cartCont);
        addFadInEffect(wishListCont);
        this.classList.add('active-wsl');
    });

    wishListCont.addEventListener('click', (e) => {
        const node = e.target;
        if (node.classList.contains('close-icon')) {
            addFadeOutEffect(node.closest('section'));
            wshLHeader.classList.remove('active-wsl');
        }
        if (node.classList.contains('del')) {
            const productId = node.closest('li').getAttribute('data-id');
            wishListArr = wishListArr.filter(el => el !== productId);

            if (document.getElementById(productId)) {
                document.getElementById(productId).classList.remove('added');
            }
            saveState();
            renderWishList();
        }
    });

    window.addEventListener("scroll", function (event) {
        const menu = document.querySelector('header .menu');
        const header = document.querySelector('header');

        if (this.scrollY > header.offsetHeight) {
            header.classList.add('slide');

            menu.style.transform = cartCont.style.transform = `translateY(-${menu.offsetHeight}px)`;

            setTimeout(() => {
                menu.style.transition = cartCont.style.transition = 'transform .5s ease-in-out, opacity .5s ease-in';
                menu.style.transform = cartCont.style.transform = 'translateY(0)';
            });

        } else {
            header.classList.remove('slide');
            cartCont.style.transform = "";
            cartCont.style.transition = "";
            menu.style = {};
        }

    });
};

initPage(data);



