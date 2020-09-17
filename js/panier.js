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
                                        loadTotalOfProducts();

                                        //reduction
                                        reductionPrix();

                                        //net a payer
                                        netaPayer(product[i]);

                                        //add to cart
                                        afficherLePanier();

                                        //remove from Cart
                                        removeFromPanier(product[i]);

                                }
                        })

                }

                // load the numbers of products
                function loadNumberOfProducts() {
                        let productNumbers = localStorage.getItem('panierNumbers')

                        if (productNumbers) {
                                nbrProduit.textContent = productNumbers;
                        }
                }

                //load the total of products
                function loadTotalOfProducts() {
                        let totalAvantReduction = document.getElementById('totalAvantReduction');

                        let totalPrix = localStorage.getItem('totalPrixProduits');

                        if (totalPrix) {
                                totalAvantReduction.textContent = totalPrix + ' €';
                        }

                }


                // cart Numbers in local storage
                let nbrProduit = document.getElementById('nbrProduit');

                function panierNumbers(product) {
                        let productNumbers = localStorage.getItem('panierNumbers')
                        productNumbers = parseInt(productNumbers);
                        if (productNumbers) {
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


                //total prix avant Réduction
                function totalPrix(product) {
                        let totalPrix = localStorage.getItem('totalPrixProduits');
                        if (totalPrix != null) {
                                totalPrix = +totalPrix;
                                console.log(typeof totalPrix);
                                console.log(totalPrix);

                                console.log('totalPrixProduits is : ', totalPrix);

                                localStorage.setItem('totalPrixProduits', totalPrix + product.prixProduit)

                        } else {
                                localStorage.setItem('totalPrixProduits', product.prixProduit)

                        }

                }

                function reductionPrix() {
                        let reduction = document.getElementById('reduction');

                        let totalPrix = localStorage.getItem('totalPrixProduits');

                        if (totalPrix < 200) {
                                reduction.textContent = '200€ pour bénéficier des 5%';

                        } else {
                                localStorage.setItem('Reduction', (totalPrix * 5) / 100);
                                let getReduction = localStorage.getItem('Reduction');
                                reduction.textContent = getReduction + ' €';
                        }

                }

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

                function afficherLePanier() {
                        let productInPanier = localStorage.getItem('PanierOfProducts');
                        let articles = JSON.parse(productInPanier);
                        let totalPrix = localStorage.getItem('totalPrixProduits');
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
                                                        <h3>${items.nomProduit}</h3>
                                                    </td>
                                                    <td>
                                                        <button class="btnMinus" data-id=“${items.idProduit}“>-</button>
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
                        }
                }
                //show my Cart Product
                afficherLePanier();


                //=============== remove an item from the Cart when button were cliked ==============================

                let removeBtns = document.getElementsByClassName('btnRemoveFromCart');

                function removeFromPanier() {

                        let productInPanier = localStorage.getItem('PanierOfProducts');
                        let articles = JSON.parse(productInPanier);
                        console.log(articles);

                        for (const courses in articles) {

                                const element = articles[courses];
                                console.log(element.nomProduit);

                        }

                        console.log(articles);
                        for (let i = 0; i < removeBtns.length; i++) {

                                let dataName = removeBtns[i].getAttribute('data-name');


                                removeBtns[i].addEventListener('click', () => {

                                });


                        }
                }



                // change quantity of an article, and get the button ids
                let btnPlus = document.getElementsByClassName('btnPlus');

                console.log(btnPlus);

                for (let i = 0; i < btnPlus.length; i++) {
                        console.log(product[i].nomProduit);
                        btnPlus[i].addEventListener('click', () => {
                                console.log("click btnPlus");
                        });

                }







                let btnMinus = document.getElementsByClassName('btnMinus');


                console.log(btnMinus);
                for (let i = 0; i < btnMinus.length; i++) {
                        btnMinus[i].addEventListener('click', () => {
                                console.log("cliked minus");

                        });

                }


                // ==================================================================================================


                loadNumberOfProducts();
                loadTotalOfProducts();
                reductionPrix();
                netaPayer();

                //remove from Cart
                removeFromPanier()

                //increase / decrease


        });






}