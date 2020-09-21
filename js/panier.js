window.addEventListener('DOMContentLoaded', loadProducts);

function loadProducts() {

        //AJAX function
        function readTextFile(file, callback) {
                var rawFile = new XMLHttpRequest();
                rawFile.overrideMimeType("application/json");
                rawFile.open("GET", file, true);
                rawFile.onreadystatechange = function () {
                        if (rawFile.readyState === 4 && rawFile.status == "200") {
                                callback(rawFile.responseText);
                        }
                }

                rawFile.send(null);
        }

        // call the readTextFile function for getting all item from JSON file.
        let ourCourses = document.getElementById('ourCourses');

        readTextFile("./js/products.json", function (produit) {
                var product = JSON.parse(produit);
                product.forEach(element => {
                        ourCourses.innerHTML += `
                                <article class="card" style="width: 18rem;">
                                    <img src="${element.imageProduit}" class="img-top reactAngularImg" alt="">
                                    <div class="card-body">
                                        <h3 class="card-title">${element.nomProduit}</h3>
                                        <h4>Prix : ${element.prixProduit} € </h4>
                                        <p class="card-text">${element.textProduit}</p>
                                        <button href="#" data-id="${element.idProduit}" class="btn">Ajouter panier</button>
                                    </div>
                                </article>
                            `
                });


                //get All buttons className loop through it and assing an eventListener on it.
                let buttons = document.getElementsByClassName('btn');
                //add an element to localStorage when clicked
                for (let i = 0; i < buttons.length; i++) {
                        let dataId = buttons[i].getAttribute('data-id');
                        buttons[i].addEventListener('click', (e) => {
                                if (dataId == product[i].idProduit) {
                                        panierNumbers(product[i]);
                                        totalPrix(product[i]);

                                        window.location.href = 'https://panierjs.netlify.app/';
                                }
                        })

                }

                // load the numbers of products called at the bottom of the page. loadNumberOfProducts()
                function loadNumberOfProducts() {
                        let productNumbers = localStorage.getItem('panierNumbers')

                        if (productNumbers) {
                                nbrProduit.textContent = productNumbers;
                        }
                }

                //load the total of products total avant reduction
                function loadTotalOfProducts() {
                        let totalAvantReduction = document.getElementById('totalAvantReduction');

                        let totalPrix = localStorage.getItem('totalPrixProduits');

                        if (totalPrix) {
                                totalAvantReduction.textContent = totalPrix + ' €';
                        }

                }


                // cart Numbers in local storage
                let nbrProduit = document.getElementById('nbrProduit');

                function panierNumbers(product, action) {
                        let productNumbers = localStorage.getItem('panierNumbers')
                        productNumbers = parseInt(productNumbers);

                        if (action) {
                                localStorage.setItem('panierNumbers', productNumbers - 1);
                                nbrProduit.textContent = productNumbers - 1;
                        } else if (productNumbers) {
                                localStorage.setItem('panierNumbers', productNumbers + 1);
                                nbrProduit.textContent = productNumbers + 1;
                        } else {
                                localStorage.setItem('panierNumbers', 1);
                                nbrProduit.textContent = 1;
                        }

                        setProductsInLocalStorage(product);
                }


                //Set all our Products in local storage
                function setProductsInLocalStorage(product) {
                        let panierItems = localStorage.getItem('PanierOfProducts');
                        panierItems = JSON.parse(panierItems);

                        if (panierItems != null) {

                                if (panierItems[product.nomProduit] == undefined) {
                                        panierItems = {
                                                ...panierItems,
                                                [product.nomProduit]: product
                                        }
                                }

                                panierItems[product.nomProduit].quantity += 1;
                        } else {
                                ++product.quantity;

                                panierItems = {
                                        [product.nomProduit]: product
                                }
                        }

                        localStorage.setItem('PanierOfProducts', JSON.stringify(panierItems));
                }


                //TOTAL PRIX AVANT REDUCTION
                function totalPrix(product, action) {
                        let totalPrix = localStorage.getItem('totalPrixProduits');
                        if (action) {
                                totalPrix = +totalPrix;
                                localStorage.setItem("totalPrixProduits", totalPrix - product.prixProduit);

                        } else if (totalPrix != null) {
                                totalPrix = +totalPrix;
                                console.log('totalPrixProduits is : ', totalPrix);
                                localStorage.setItem('totalPrixProduits', totalPrix + product.prixProduit)

                        } else {
                                localStorage.setItem('totalPrixProduits', product.prixProduit)
                        }

                }

                //REDUCTION DES PRIX DANS LE LOCALSTORAGE
                function reductionPrix() {
                        let reduction = document.getElementById('reduction');

                        let totalPrix = localStorage.getItem('totalPrixProduits');

                        if (totalPrix < 200) {
                                reduction.textContent = '200€ pour bénéficier des 5%';
                                localStorage.setItem('Reduction', 0);

                        } else {
                                localStorage.setItem('Reduction', (totalPrix * 5) / 100);
                                let getReduction = localStorage.getItem('Reduction');
                                reduction.textContent = getReduction + ' €';
                        }

                }

                //NET A PAYER DANS LE LOCALSTORAGE
                function netaPayer() {
                        let getReduction = localStorage.getItem('Reduction');
                        let totalPrix = localStorage.getItem('totalPrixProduits');
                        let result = totalPrix - getReduction;

                        localStorage.setItem('NetApayer', result);

                        let getNetaPayer = localStorage.getItem('NetApayer');
                        // get the document id of a netapayer .
                        let netaPayer = document.getElementById('netaPayer');
                        netaPayer.textContent = getNetaPayer + ' €';
                }


                // afficher mon panier
                function afficherLePanier() {
                        let productInPanier = localStorage.getItem('PanierOfProducts');
                        let articles = JSON.parse(productInPanier);

                        let totalPrix = localStorage.getItem('totalPrixProduits');
                        totalPrix = +totalPrix
                        let achats = document.getElementById('achats');

                        if (articles && achats) {
                                achats.innerHTML = '';
                                Object.values(articles).map(items => {
                                        achats.innerHTML += `
                                        <table border="1" class="tableAchat">
                                            <thead>
                                                <tr>
                                                    <th>Article</th>
                                                    <th>Quantité</th>
                                                    <th>Prix unitaire</th>
                                                    <th>Sous-total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="tdArticle">
                                                        <img class="imgArticlePanier" src="${items.imageProduit}">
                                                        <h3 class=“nomDuProduit“>${items.nomProduit}</h3>
                                                    </td>
                                                    <td>
                                                        <button data-name="${items.nomProduit}" class="btnMinus" data-id=“${items.idProduit}“>-</button>
                                                        <span class="increment">${items.quantity}</span>
                                                        <button class="btnPlus">+</button>
                                                    </td>
                                                    <td>${items.prixProduit} €</td>
                                                    <td>
                                                        ${items.quantity * items.prixProduit} €
                                                        <button data-name="${items.nomProduit}" class="btnRemoveFromCart">X</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    `
                                });


                                buttonsEffacer();
                                gererlaQuantite();
                        }
                }
                //show my Cart Product
                afficherLePanier();


                //=============== remove an item from the Cart when button were cliked ==============================

                function buttonsEffacer() {
                        let removeBtns = document.getElementsByClassName('btnRemoveFromCart');
                        let productNumbers = localStorage.getItem('panierNumbers');
                        let cartCost = localStorage.getItem("totalPrixProduits");
                        let cartItems = localStorage.getItem('PanierOfProducts');
                        cartItems = JSON.parse(cartItems);
                        let productName;
                        console.log(cartItems);

                        for (let i = 0; i < removeBtns.length; i++) {
                                removeBtns[i].addEventListener('click', () => {
                                        productName = removeBtns[i].getAttribute('data-name'); //removeBtns[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g, '').trim();

                                        localStorage.setItem('panierNumbers', productNumbers - cartItems[productName].quantity);
                                        localStorage.setItem('totalPrixProduits', cartCost - (cartItems[productName].prixProduit * cartItems[productName].quantity));

                                        delete cartItems[productName];
                                        localStorage.setItem('PanierOfProducts', JSON.stringify(cartItems));

                                        afficherLePanier();
                                        loadNumberOfProducts();
                                        loadTotalOfProducts();
                                        reductionPrix();
                                        netaPayer();

                                })
                        }
                }


                // INCREASE AND DECREASE BUTTONS
                function gererlaQuantite() {
                        let increaseButtons = document.querySelectorAll('.btnPlus');
                        let decreaseButtons = document.querySelectorAll('.btnMinus');
                        let increment = document.querySelectorAll('.increment');
                        let nomduProduit = document.querySelectorAll('.“nomDuProduit“');

                        let currentQuantity = 0;
                        let currentProduct = '';

                        let produitsPanier = localStorage.getItem('PanierOfProducts');
                        produitsPanier = JSON.parse(produitsPanier);

                        for (let i = 0; i < increaseButtons.length; i++) {
                                //décrementer via le bouton qui a la class minus
                                decreaseButtons[i].addEventListener('click', () => {
                                        currentQuantity = increment[i].textContent;
                                        currentProduct = nomduProduit[i].textContent;

                                        if (produitsPanier[currentProduct].quantity <= 1){
                                                let productNumbers = localStorage.getItem('panierNumbers');
                                                let cartCost = localStorage.getItem("totalPrixProduits");
                                                let cartItems = localStorage.getItem('PanierOfProducts');
                                                cartItems = JSON.parse(cartItems);
                                                let productName;
                                                console.log(cartItems);

                                                
                                                productName = decreaseButtons[i].getAttribute('data-name');

                                                localStorage.setItem('panierNumbers', productNumbers - cartItems[productName].quantity);
                                                localStorage.setItem('totalPrixProduits', cartCost - (cartItems[productName].prixProduit * cartItems[productName].quantity));

                                                delete cartItems[productName];
                                                localStorage.setItem('PanierOfProducts', JSON.stringify(cartItems));

                                                afficherLePanier();
                                                loadNumberOfProducts();
                                                loadTotalOfProducts();
                                                reductionPrix();
                                                netaPayer();

                                        
                                        } else {
                                                produitsPanier[currentProduct].quantity -= 1;
                                                panierNumbers(produitsPanier[currentProduct], "decrease");
                                                totalPrix(produitsPanier[currentProduct], "decrease");
                                                localStorage.setItem('PanierOfProducts', JSON.stringify(produitsPanier));

                                                afficherLePanier();
                                                reductionPrix();
                                                netaPayer();

                                        }
                                });
                                //incrementer via le bouton plus.
                                increaseButtons[i].addEventListener('click', () => {
                                        currentQuantity = increment[i].textContent;
                                        currentProduct = nomduProduit[i].textContent;

                                        produitsPanier[currentProduct].quantity += 1;
                                        panierNumbers(produitsPanier[currentProduct]);
                                        totalPrix(produitsPanier[currentProduct]);
                                        localStorage.setItem('PanierOfProducts', JSON.stringify(produitsPanier));
                                        afficherLePanier();
                                        reductionPrix();
                                        netaPayer();

                                });
                        }
                }


                //exécuter mes functions ici.
                loadNumberOfProducts();
                afficherLePanier();
                loadTotalOfProducts()
                reductionPrix();
                netaPayer();


        });






}