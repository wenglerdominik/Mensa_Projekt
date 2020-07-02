
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

let datestring = sessionStorage.getItem('menueDate');
let date = new Date(datestring);
let day = date.getDay();
//document.getElementById('date').innerHTML= days[day]+', '+date.toLocaleDateString();

let menueVeganName;

let products = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts(0);

})


function loadProducts(menueType) {
    const vorspeisevegan = document.querySelector('#vorspeisevegan');
    vorspeisevegan.innerHTML = '';
    const hauptspeisevegan = document.querySelector('#hauptspeisevegan');
    hauptspeisevegan.innerHTML = '';
    const nachspeisevegan = document.querySelector('#nachspeisevegan');
    nachspeisevegan.innerHTML = '';

    const vorspeiseN1 = document.querySelector('#vorspeiseN1');
    vorspeiseN1.innerHTML = '';
    const hauptspeiseN1 = document.querySelector('#hauptspeiseN1');
    hauptspeiseN1.innerHTML = '';
    const nachspeiseN1 = document.querySelector('#nachspeiseN1');
    nachspeiseN1.innerHTML = '';

    const vorspeiseN2 = document.querySelector('#vorspeiseN2');
    vorspeiseN2.innerHTML = '';
    const hauptspeiseN2 = document.querySelector('#hauptspeiseN2');
    hauptspeiseN2.innerHTML = '';
    const nachspeiseN2 = document.querySelector('#nachspeiseN2');
    nachspeiseN2.innerHTML = '';

    const vorspeisesuess = document.querySelector('#vorspeisesuess');
    vorspeisesuess.innerHTML = '';
    const hauptspeisesuess = document.querySelector('#hauptspeisesuess');
    hauptspeisesuess.innerHTML = '';
    const nachspeisesuess = document.querySelector('#nachspeisesuess');
    nachspeisesuess.innerHTML = '';
    //let type = JSON.parse(document.getElementById('selectType').value).producttypeid;

    request.execute({
        method: 'GET',
        url: '/product/productsMenue/' + menueType,
        datatype: 'json',

        successCallback: function (response) {
            products = response;

            for (let product of products) {

                let div = document.createElement('div');
                div.classList = 'form-check';


                let input = document.createElement('input');
                input.classList = 'form-check-input';
                input.type = 'checkbox';
                input.id = product.productid;
                input.setAttribute('data-description', JSON.stringify(product.description));
                input.setAttribute('data-price', JSON.stringify(product.price));
                input.setAttribute('data-calorie', JSON.stringify(product.calorie));
                input.setAttribute('data-name', JSON.stringify(product.name));
                let label = document.createElement('label');
                label.classList = 'form-check-label';
                label.for = product.productid;
                label.innerText = product.name;
                div.append(input, label);
                // <input id="my-input" class="form-check-input" type="checkbox" name="" value="true">
                // <label for="my-input" class="form-check-label">Text</label>
                //Vorspeisen
                if (product.producttypeid === 6) {
                    input.setAttribute('data-type', 'vorspeise');
                    vorspeisevegan.appendChild(div);
                    vorspeiseN1.innerHTML = vorspeisevegan.innerHTML;
                    vorspeiseN2.innerHTML = vorspeisevegan.innerHTML;
                    vorspeisesuess.innerHTML = vorspeisevegan.innerHTML;

                }
                //Hauptspeise Vegan
                if (product.producttypeid === 4) {
                    input.setAttribute('data-type', 'hauptspeise');
                    hauptspeisevegan.appendChild(div);
                }
                //Hauptspeise Normal
                if (product.producttypeid === 3) {
                    input.setAttribute('data-type', 'hauptspeise');
                    hauptspeiseN1.appendChild(div);
                    hauptspeiseN2.innerHTML = hauptspeiseN1.innerHTML;

                }
                //Hauptspeise Süßspeise
                if (product.producttypeid === 5) {
                    input.setAttribute('data-type', 'hauptspeise');

                    hauptspeisesuess.appendChild(div);

                }
                //Nachspeise
                if (product.producttypeid === 7) {
                    input.setAttribute('data-type', 'nachspeise');
                    nachspeisevegan.appendChild(div);
                    nachspeiseN1.innerHTML = nachspeisevegan.innerHTML;
                    nachspeiseN2.innerHTML = nachspeisevegan.innerHTML;
                    nachspeisesuess.innerHTML = nachspeisevegan.innerHTML;
                }

            }
            getCheckBoxes();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}


let productsVegan = [];
let productsN1 = [];
let productsN2 = [];
let productsSuess = [];
document.getElementById('btnSaveMenue').addEventListener('click', function () {
    productsVegan.length = 0;
    productsN1.length = 0;
    productsN2.length = 0;
    productsSuess.length = 0;
    let y = new Date(sessionStorage.getItem('menueDate'));
    let servedate = new Date(y.getTime() - (y.getTimezoneOffset() * 60000)).toJSON();
    let menueListContainer = [];
    for (let i = 0; i < checkBoxVegan.length; i++) {
        if (checkBoxVegan[i].checked) {
            let product = {
                menuedetailid: null,
                menueid: null,
                productid: checkBoxVegan[i].id
            }
            productsVegan.push(product);
        }
    }
    if (productsVegan.length > 0) {
        let menue = {
            menueid: null,
            servedate: servedate,
            type: 4,
        }
        let menueObject = {
            menue: menue,
            detaillist: productsVegan
        }
        menueListContainer.push(menueObject);
    }

    for (let i = 0; i < checkBoxN1.length; i++) {
        if (checkBoxN1[i].checked) {
            let product = {
                menuedetailid: null,
                menueid: null,
                productid: checkBoxN1[i].id
            }
            productsN1.push(product);
        }
    }
    if (productsN1.length > 0) {
        let menue = {
            menueid: null,
            servedate: servedate,
            type: 3,
        }
        let menueObject = {
            menue: menue,
            detaillist: productsN1
        }
        menueListContainer.push(menueObject);

    }

    for (let i = 0; i < checkBoxN2.length; i++) {
        if (checkBoxN2[i].checked) {
            let product = {
                menuedetailid: null,
                menueid: null,
                productid: checkBoxN2[i].id
            }
            productsN2.push(product);
        }
    }
    if (productsN2.length > 0) {
        let menue = {
            menueid: null,
            servedate: servedate,
            type: 3,
        }
        let menueObject = {
            menue: menue,
            detaillist: productsN2
        }
        menueListContainer.push(menueObject);

    }
    for (let i = 0; i < checkBoxNSuess.length; i++) {
        if (checkBoxNSuess[i].checked) {
            let product = {
                menuedetailid: null,
                menueid: null,
                productid: checkBoxNSuess[i].id
            }
            productsSuess.push(product);
        }
    }
    if (productsSuess.length > 0) {
        let menue = {
            menueid: null,
            servedate: servedate,
            type: 5,
            detaillist: productsSuess
        }
        let menueObject = {
            menue: menue,
            detaillist: productsSuess
        }
        menueListContainer.push(menueObject);

    }

    console.log(productsVegan);
    console.log(productsN1);
    console.log(productsN2);
    console.log(productsSuess);
    if (menueListContainer.length > 0) saveMenue(menueListContainer);

})

function saveMenue(menues) {
    let response = null;

    request.execute
        ({
            method: 'POST',
            url: '/menue',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(menues),
            successCallback: function (resp) {
                response = JSON.parse(resp);
                console.log(response);

                if (response) {
                    alert("Menü Speichern erfolgreich");
                    window.open('calendar.html', '_self');
                }

            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });
}

const menueVegan = document.getElementById('menueVegan');
const menueN1 = document.querySelector('#menueNormal1');
const menueN2 = document.querySelector('#menueNormal2');
const menueSuess = document.querySelector('#menueSuess');
let checkBoxVegan;
let checkBoxN1;
let checkBoxN2;
let checkBoxNSuess;
function getCheckBoxes() {
    checkBoxVegan = menueVegan.getElementsByClassName('form-check-input');
    checkBoxN1 = menueN1.querySelectorAll('.form-check-input');
    checkBoxN2 = menueN2.querySelectorAll('.form-check-input');
    checkBoxNSuess = menueSuess.querySelectorAll('.form-check-input');

    for (let i = 0; i < checkBoxVegan.length; i++) {
        checkBoxVegan[i].addEventListener('click', VeganClick);
    }
    for (let i = 0; i < checkBoxN1.length; i++) {
        checkBoxN1[i].addEventListener('click', N1Click);
    }
    for (let i = 0; i < checkBoxN2.length; i++) {
        checkBoxN2[i].addEventListener('click', N2Click);
    }
    for (let i = 0; i < checkBoxNSuess.length; i++) {
        checkBoxNSuess[i].addEventListener('click', SuessClick);
    }

}

function VeganClick(event) {
    let viewVorVegan = document.querySelector('#viewVorVegan');
    let viewHauptVegan = document.querySelector('#viewHauptVegan');
    let viewNachVegan = document.querySelector('#viewNachVegan');
    const viewHeaderVegan = document.querySelector('#viewHeaderVegan');
    appendItemToCard(viewVorVegan, viewHauptVegan, viewNachVegan);
    let price = 0;
    let calorie = 0;
    let footer = document.getElementById('viewFooterVegan');
    for (let i = 0; i < checkBoxVegan.length; i++) {
        if (checkBoxVegan[i].checked) {
            let productprice = parseFloat(checkBoxVegan[i].getAttribute('data-price'));
            let productcalorie = parseInt(checkBoxVegan[i].getAttribute('data-calorie'));
            price += productprice;
            calorie += productcalorie;
        }

    }
    footer.innerText = `${calorie} kCal / ${price.toFixed(2)} €`;
    if (viewHauptVegan.childElementCount === 0) {
        viewHeaderVegan.innerText = 'Vegan:';
    }
    else {
        viewHeaderVegan.innerText = 'Vegan: ' + viewHauptVegan.children[0].getAttribute('data-name').split('"').join(' ');
    }

}
function N1Click(event) {
    let viewVorN1 = document.querySelector('#viewVorN1');
    let viewHauptN1 = document.querySelector('#viewHauptN1');
    let viewNachN1 = document.querySelector('#viewNachN1');
    const viewHeaderN1 = document.querySelector('#viewHeaderN1');

    appendItemToCard(viewVorN1, viewHauptN1, viewNachN1);
    let price = 0;
    let calorie = 0;
    let footer = document.getElementById('viewFooterN1');
    for (let i = 0; i < checkBoxN1.length; i++) {
        if (checkBoxN1[i].checked) {
            let productprice = parseFloat(checkBoxN1[i].getAttribute('data-price'));
            let productcalorie = parseInt(checkBoxN1[i].getAttribute('data-calorie'));
            price += productprice;
            calorie += productcalorie;
        }
    }
    footer.innerText = `${calorie} kCal / ${price.toFixed(2)} €`;
    if (viewHauptN1.childElementCount === 0) {
        viewHeaderN1.innerText = 'Normal:';
    }
    else {
        viewHeaderN1.innerText = 'Normal: ' + viewHauptN1.children[0].getAttribute('data-name').split('"').join(' ');
    }
}
function N2Click(event) {
    let viewVorN2 = document.querySelector('#viewVorN2');
    let viewHauptN2 = document.querySelector('#viewHauptN2');
    let viewNachN2 = document.querySelector('#viewNachN2');
    const viewHeaderN2 = document.querySelector('#viewHeaderN2');

    appendItemToCard(viewVorN2, viewHauptN2, viewNachN2);
    let price = 0;
    let calorie = 0;
    let footer = document.getElementById('viewFooterN2');
    for (let i = 0; i < checkBoxN2.length; i++) {
        if (checkBoxN2[i].checked) {
            let productprice = parseFloat(checkBoxN2[i].getAttribute('data-price'));
            let productcalorie = parseInt(checkBoxN2[i].getAttribute('data-calorie'));
            price += productprice;
            calorie += productcalorie;
        }
    }
    footer.innerText = `${calorie} kCal / ${price.toFixed(2)} €`;
    if (viewHauptN2.childElementCount === 0) {
        viewHeaderN2.innerText = 'Normal:';
    }
    else {
        viewHeaderN2.innerText = 'Normal: ' + viewHauptN2.children[0].getAttribute('data-name').split('"').join(' ');
    }
}
function SuessClick(event) {
    let viewVorSuess = document.querySelector('#viewVorSuess');
    let viewHauptSuess = document.querySelector('#viewHauptSuess');
    let viewNachSuess = document.querySelector('#viewNachSuess');
    const viewHeaderSuess = document.querySelector('#viewHeaderSuess');

    appendItemToCard(viewVorSuess, viewHauptSuess, viewNachSuess);
    let price = 0;
    let calorie = 0;
    let footer = document.getElementById('viewFooterSuess');
    for (let i = 0; i < checkBoxNSuess.length; i++) {
        if (checkBoxNSuess[i].checked) {
            let productprice = parseFloat(checkBoxNSuess[i].getAttribute('data-price'));
            let productcalorie = parseInt(checkBoxNSuess[i].getAttribute('data-calorie'));
            price += productprice;
            calorie += productcalorie;
        }
    }
    footer.innerText = `${calorie} kCal / ${price.toFixed(2)} €`;
    if (viewHauptSuess.childElementCount === 0) {
        viewHeaderSuess.innerText = 'Süßspeise:';
    }
    else {
        viewHeaderSuess.innerText = 'Süßspeise: ' + viewHauptSuess.children[0].getAttribute('data-name').split('"').join(' ');
    }
}

function appendItemToCard(targetVorspeise, targetHauptspeise, targetNachspeise) {

    let sender = event.target;
    let type = sender.getAttribute('data-type');
    if (sender.checked == true) {
        console.log(event.target.id)
        let description = sender.getAttribute('data-description');
        let calorie = sender.getAttribute('data-calorie');
        let price = parseFloat(sender.getAttribute('data-price'));

        let li = document.createElement('li');
        li.style.listStyle = 'circle';
        let ul = document.createElement('ul');

        li.innerText = `${description}`.split('"').join(' ');
        ul.innerText = `${calorie}kCal / ${price.toFixed(2)} €`;
        li.appendChild(ul);
        if (type === 'vorspeise') {
            li.id = `${sender.id}_${targetVorspeise.id}`;
            targetVorspeise.appendChild(li);
        }
        if (type === 'hauptspeise') {
            li.id = `${sender.id}_${targetHauptspeise.id}`;
            li.setAttribute('data-name', sender.getAttribute('data-name'));
            targetHauptspeise.appendChild(li);
        }
        if (type === 'nachspeise') {
            li.id = `${sender.id}_${targetNachspeise.id}`;
            targetNachspeise.appendChild(li);
        }
    }
    else {
        let li;
        if (type === 'vorspeise') {
            li = document.getElementById(`${sender.id}_${targetVorspeise.id}`);
            targetVorspeise.removeChild(li);
        }
        if (type === 'hauptspeise') {
            li = document.getElementById(`${sender.id}_${targetHauptspeise.id}`);
            targetHauptspeise.removeChild(li);
        }
        if (type === 'nachspeise') {
            li = document.getElementById(`${sender.id}_${targetNachspeise.id}`);
            targetNachspeise.removeChild(li);
        }
    }
}


