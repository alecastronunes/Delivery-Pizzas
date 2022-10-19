let modalQtd = 1;
let cart = [];
let modalKey = 0;

//Atribuindo a função querySelector a variável "qs e qsa".
const qs = (elemento) => document.querySelector(elemento);
const qsa = (elemento) => document.querySelectorAll(elemento);

//Listagem das pizzas.
pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();//Remove o evento natural da tag "a".

        //Pega o "id" da pizza atual clicada.
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1
        modalKey = key;

        //Adicionando as informações no modal.
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].price.toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qs('.pizzaInfo--qt').innerHTML = modalQtd;

        //Cria a animação do modal de pizzas.
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            qs('.pizzaWindowArea').style.opacity = 1;
        },200);
    })
    

    //Preencher as informações com as pizzas.
    qs('.pizza-area').append(pizzaItem);
});

//Ações do modal.
function fechaModal(){
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', fechaModal);
});

//Ações dos botões de "+" e "-" do modal.
qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd > 1){
        modalQtd--;
        qs('.pizzaInfo--qt').innerHTML = modalQtd;
    }
    
})

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    qs('.pizzaInfo--qt').innerHTML = modalQtd;
})

//Seleciona os botões "Pequena" "Médio" "Grande".
qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Insere os dados no carrinho de compras.
qs('.pizzaInfo--addButton').addEventListener('click', () =>{
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1){
        cart[key].qt += modalQtd;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQtd
        });
    }
    updateCart()
    fechaModal();
});

//Exibe as informações no painel do carrinho.
function updateCart() {
    if(cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //Preenche as funções de "+" e "-" do carrinho.
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else {
                    cart.splice(i, 1);
                }
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();

                //Outra forma de fazer.
                /*if(modalQtd >= 1) {
                    modalQtd++;
                    cartItem.querySelector('.cart--item--qt').innerHTML = modalQtd;
                }
                */
            });

            qs('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        
        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else {
        qs('aside').classList.remove('show');
    }
}