
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
let price = 0.00;
let cal = 0;
let menues;
if (sessionStorage.getItem('menuesEdit')) {
    menues = JSON.parse(sessionStorage.getItem('menuesEdit'));
}
let selMenue;
if (sessionStorage.getItem('selMenue')) {
    selMenue = JSON.parse(sessionStorage.getItem('selMenue'));
}
console.log(menues);


//let menueSelected = JSON.parse(sessionStorage.getItem('menueDetail'));
//let menueid = menueSelected.menueid;

//document.getElementById('menueTitle').innerHTML='Menü: '+sessionStorage.getItem('menueNo');
let datestring = sessionStorage.getItem('menueDate');
let date = new Date(datestring);
document.getElementById('headerPreview').innerText = 'Menü Vorschau für ' + date.toLocaleDateString();
let day = date.getDay();
//document.getElementById('date').innerHTML= days[day]+', '+date.toLocaleDateString();

let compareVegan = [];
let compareN1 = [];
let compareN2 = [];
let compareSuess = [];

let products = [];
let selProducts = [];
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(0);
})

const vorspeisevegan = document.querySelector('#vorspeisevegan');
const hauptspeisevegan = document.querySelector('#hauptspeisevegan');
const nachspeisevegan = document.querySelector('#nachspeisevegan');

const vorspeiseN1 = document.querySelector('#vorspeiseN1');
const hauptspeiseN1 = document.querySelector('#hauptspeiseN1');
const nachspeiseN1 = document.querySelector('#nachspeiseN1');

const vorspeiseN2 = document.querySelector('#vorspeiseN2');
const hauptspeiseN2 = document.querySelector('#hauptspeiseN2');
const nachspeiseN2 = document.querySelector('#nachspeiseN2');

const vorspeisesuess = document.querySelector('#vorspeisesuess');
const hauptspeisesuess = document.querySelector('#hauptspeisesuess');
const nachspeisesuess = document.querySelector('#nachspeisesuess');

function loadProducts(menueType) {
    vorspeisevegan.innerHTML = '';
    hauptspeisevegan.innerHTML = '';
    nachspeisevegan.innerHTML = '';

    vorspeiseN1.innerHTML = '';
    hauptspeiseN1.innerHTML = '';
    nachspeiseN1.innerHTML = '';

    vorspeiseN2.innerHTML = '';
    hauptspeiseN2.innerHTML = '';
    nachspeiseN2.innerHTML = '';

    vorspeisesuess.innerHTML = '';
    hauptspeisesuess.innerHTML = '';
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
                input.classList = 'form-check-input checkProduct';
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

let menueVeganObject = { menueid: null, servedate: null, type: null, titel: null };
let menueN1Object = { menueid: null, servedate: null, type: null, titel: null };
let menueN2Object = { menueid: null, servedate: null, type: null, titel: null };
let menueSuessObject = { menueid: null, servedate: null, type: null, titel: null };

//#region Save without ProductCompare
// document.getElementById('btnSaveMenue').addEventListener('click', function () {
//     productsVegan.length = 0;
//     productsN1.length = 0;
//     productsN2.length = 0;
//     productsSuess.length = 0;
//     let y = new Date(sessionStorage.getItem('menueDate'));
//     let servedate = new Date(y.getTime() - (y.getTimezoneOffset() * 60000)).toJSON();
//     let menueListContainer = [];
//     for (let i = 0; i < checkBoxVegan.length; i++) {
//         if (checkBoxVegan[i].checked) {
//             let product = {
//                 menuedetailid: null,
//                 menueid: null,
//                 productid: checkBoxVegan[i].id
//             }
//             productsVegan.push(product);
//         }
//     }
//     let checkVegan = [];
//     for (let product of productsVegan) {
//         checkVegan.push(parseInt(product.productid));
//     }
//     let difference = checkVegan
//         .filter(x => !testMenü.includes(x))
//         .concat(testMenü.filter(x => !checkVegan.includes(x)))
//     console.clear();
//     console.log('testmenü', testMenü);
//     console.log('menüedit', checkVegan);
//     testMenü.sort(); checkVegan.sort();
//     if (testMenü === checkVegan) alert('gleich');
//     if (productsVegan.length > 0) {
//         menueVeganObject = {
//             menueid: menueVeganObject.menueid,
//             servedate: servedate,
//             type: 4,
//             titel: viewHeaderVegan.innerText,
//         }
//         let menueObject = {
//             menue: menueVeganObject,
//             detaillist: productsVegan
//         }
//         menueListContainer.push(menueObject);
//     }

//     for (let i = 0; i < checkBoxN1.length; i++) {
//         if (checkBoxN1[i].checked) {
//             let product = {
//                 menuedetailid: null,
//                 menueid: null,
//                 productid: checkBoxN1[i].id
//             }
//             productsN1.push(product);
//         }
//     }
//     if (productsN1.length > 0) {
//         menueN1Object = {
//             menueid: menueN1Object.menueid,
//             servedate: servedate,
//             type: 3,
//             titel: viewHeaderN1.innerText
//         }
//         let menueObject = {
//             menue: menueN1Object,
//             detaillist: productsN1
//         }
//         menueListContainer.push(menueObject);

//     }

//     for (let i = 0; i < checkBoxN2.length; i++) {
//         if (checkBoxN2[i].checked) {
//             let product = {
//                 menuedetailid: null,
//                 menueid: null,
//                 productid: checkBoxN2[i].id
//             }
//             productsN2.push(product);
//         }
//     }
//     if (productsN2.length > 0) {
//         menueN2Object = {
//             menueid: menueN2Object.menueid,
//             servedate: servedate,
//             type: 3,
//             titel: viewHeaderN2.innerText
//         }
//         let menueObject = {
//             menue: menueN2Object,
//             detaillist: productsN2
//         }
//         menueListContainer.push(menueObject);

//     }
//     for (let i = 0; i < checkBoxNSuess.length; i++) {
//         if (checkBoxNSuess[i].checked) {
//             let product = {
//                 menuedetailid: null,
//                 menueid: null,
//                 productid: checkBoxNSuess[i].id
//             }
//             productsSuess.push(product);
//         }
//     }
//     if (productsSuess.length > 0) {
//         menueSuessObject = {
//             menueid: menueSuessObject.menueid,
//             servedate: servedate,
//             type: 5,
//             titel: viewHeaderSuess.innerText
//         }
//         let menueObject = {
//             menue: menueSuessObject,
//             detaillist: productsSuess
//         }
//         menueListContainer.push(menueObject);

//     }

//     console.log(productsVegan);
//     console.log(productsN1);
//     console.log(productsN2);
//     console.log(productsSuess);
//     if (menueListContainer.length > 0) {

//         // saveMenue(menueListContainer);
//     }
// })

//#endregion

//#region  Save with ProductCompare
let titelVeganOld;
let titelN1Old;
let titelN2Old;
let titelSuessOld;
let differenceVegan;
let differenceN1;
let differenceN2;
let differenceSuess;
document.getElementById('btnSaveMenue').addEventListener('click', function () {
    productsVegan.length = 0;
    productsN1.length = 0;
    productsN2.length = 0;
    productsSuess.length = 0;
    let y = new Date(sessionStorage.getItem('menueDate'));
    let servedate = new Date(y.getTime() - (y.getTimezoneOffset() * 60000)).toJSON();
    let menueListContainer = [];
    //#region Vegan
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
    let checkVegan = [];
    for (let product of productsVegan) {
        checkVegan.push(parseInt(product.productid));
    }
    differenceVegan = checkVegan
        .filter(x => !compareVegan.includes(x))
        .concat(compareVegan.filter(x => !checkVegan.includes(x)));

    if (differenceVegan.length > 0) {
        menueVeganObject = {
            menueid: menueVeganObject.menueid,
            servedate: servedate,
            type: 4,
            titelold: menueVeganObject.titel,
            titel: viewHeaderVegan.innerText,

        }
        let menueObject = {
            menue: menueVeganObject,
            detaillist: productsVegan
        }
        menueListContainer.push(menueObject);
    }
    //#endregion Vegan

    //#region 1. Normal
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
    let checkN1 = [];
    for (let product of productsN1) {
        checkN1.push(parseInt(product.productid));
    }
    differenceN1 = checkN1
        .filter(x => !compareN1.includes(x))
        .concat(compareN1.filter(x => !checkN1.includes(x)));
    if (differenceN1.length > 0) {
        menueN1Object = {
            menueid: menueN1Object.menueid,
            servedate: servedate,
            type: 3,
            titelold: menueN1Object.titel,
            titel: viewHeaderN1.innerText
        }
        let menueObject = {
            menue: menueN1Object,
            detaillist: productsN1
        }
        menueListContainer.push(menueObject);

    }
    //#endregion 1. Normal

    //#region  2. Normal
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
    let checkN2 = [];
    for (let product of productsN2) {
        checkN2.push(parseInt(product.productid));
    }
    differenceN2 = checkN2
        .filter(x => !compareN2.includes(x))
        .concat(compareN2.filter(x => !checkN2.includes(x)));
    if (differenceN2.length > 0) {
        menueN2Object = {
            menueid: menueN2Object.menueid,
            servedate: servedate,
            type: 3,
            titelold: menueN2Object.titel,
            titel: viewHeaderN2.innerText
        }
        let menueObject = {
            menue: menueN2Object,
            detaillist: productsN2
        }
        menueListContainer.push(menueObject);

    }
    //#endregion 2. Normal

    //#region Süßspeise
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
    let checkSuess = [];
    for (let product of productsSuess) {
        checkSuess.push(parseInt(product.productid));
    }
    differenceSuess = checkSuess
        .filter(x => !compareSuess.includes(x))
        .concat(compareSuess.filter(x => !checkSuess.includes(x)));
    if (differenceSuess.length > 0) {
        menueSuessObject = {
            menueid: menueSuessObject.menueid,
            servedate: servedate,
            type: 5,
            titelold: menueSuessObject.titel,
            titel: viewHeaderSuess.innerText
        }
        let menueObject = {
            menue: menueSuessObject,
            detaillist: productsSuess
        }
        menueListContainer.push(menueObject);
    }
    //#endregion Süßspeiße

    console.log('Diff Vegan', differenceVegan);
    console.log('Diff N1', differenceN1);
    console.log('Diff N2', differenceN2);
    console.log('Diff Suess', differenceSuess);

    if (menueListContainer.length > 0) {
        saveMenue(menueListContainer);
    }
    else $('#modalNoChange').modal();
})

//#endregion

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
                    //alert("Menü Speichern erfolgreich");
                    //window.history.back();
                    window.open('calendar.html', '_self');
                }

            },
            errorCallback: function (s, t) {
                $('#modalErrorOnSave').modal();
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
    loadProductsofMenue(menues);
}

const viewHeaderVegan = document.querySelector('#viewHeaderVegan');
const viewHeaderN1 = document.querySelector('#viewHeaderN1');
const viewHeaderN2 = document.querySelector('#viewHeaderN2');
const viewHeaderSuess = document.querySelector('#viewHeaderSuess');

function VeganClick(event) {
    let viewVorVegan = document.querySelector('#viewVorVegan');
    let viewHauptVegan = document.querySelector('#viewHauptVegan');
    let viewNachVegan = document.querySelector('#viewNachVegan');

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

        li.innerText = `${description}`;
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

function setCheckboxes(menueVegan, menueN1, menueN2, menueSuess) {
    if (menueVegan) {
        for (let product of menueVegan.detaillist) {
            let id = product.productid;
            for (let i = 0; i < checkBoxVegan.length; i++) {
                if (checkBoxVegan[i].id == id) {
                    checkBoxVegan[i].click();
                }
                //checkBoxVegan[i].disabled = true;
            }
        }

    }
    if (menueN1) {
        for (let product of menueN1.detaillist) {
            let id = product.productid;
            for (let i = 0; i < checkBoxN1.length; i++) {
                if (checkBoxN1[i].id == id) {
                    checkBoxN1[i].click();
                }

            }
        }
    }
    if (menueN2) {
        for (let product of menueN2.detaillist) {
            let id = product.productid;
            for (let i = 0; i < checkBoxN2.length; i++) {
                if (checkBoxN2[i].id == id) {
                    checkBoxN2[i].click();
                }


            }
        }
    }
    if (menueSuess) {
        for (let product of menueSuess.detaillist) {
            let id = product.productid;
            for (let i = 0; i < checkBoxNSuess.length; i++) {
                if (checkBoxNSuess[i].id == id) {
                    checkBoxNSuess[i].click();
                }


            }

        }
    }

}

const collapseVegan = document.getElementById('collapseOne');
const collapseN1 = document.getElementById('collapseTwo');
const collapseN2 = document.getElementById('collapseThree');
const collapseSuess = document.getElementById('collapseFour');

function loadProductsofMenue(menues) {
    const date = new Date(sessionStorage.getItem('menueDate'));
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDay = date.getDate();
    request.execute({
        method: 'GET',
        url: '/menue/menuedetail/' + currentYear + "/" + (currentMonth + 1) + "/" + currentDay,
        datatype: 'json',
        successCallback: function (response) {
            console.log(response);
            let menueVegan = null;
            let menueN1 = null;
            let second = false;
            let menueN2 = null;
            let menueSuess = null;

            for (let menue of response) {
                if (menue.type === 4) {
                    menueVegan = menue;

                    menueVeganObject = { menueid: menue.menueid, titel: menue.titel };
                    for (let product of menueVegan.detaillist) {
                        compareVegan.push(product.productid);
                    }
                    if (selMenue) if (menue.menueid === selMenue.menueid) cardVegan.click();
                }
                else if (menue.type === 3 && second == false) {
                    menueN1 = menue;
                    second = true;
                    menueN1Object = { menueid: menue.menueid, titel: menue.titel };
                    for (let product of menueN1.detaillist) {
                        compareN1.push(product.productid);
                    }
                    if (selMenue) if (menue.menueid === selMenue.menueid) cardN1.click();
                }
                else if (menue.type === 3 && second == true) {
                    menueN2 = menue;
                    menueN2Object = { menueid: menue.menueid, titel: menue.titel };
                    for (let product of menueN2.detaillist) {
                        compareN2.push(product.productid);
                    }
                    if (selMenue) if (menue.menueid === selMenue.menueid) cardN2.click();
                }
                else if (menue.type === 5) {
                    menueSuess = menue;
                    menueSuessObject = { menueid: menue.menueid, titel: menue.titel };
                    for (let product of menueSuess.detaillist) {
                        compareSuess.push(product.productid);
                    }
                    if (selMenue) if (menue.menueid === selMenue.menueid) cardSuess.click();
                }

            }
            setCheckboxes(menueVegan, menueN1, menueN2, menueSuess);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}


const cardVegan = document.getElementById('cardVegan');
const cardN1 = document.getElementById('cardN1');
const cardN2 = document.getElementById('cardN2');
const cardSuess = document.getElementById('cardSuess');


cardVegan.addEventListener('click', () => {
    $(collapseVegan).collapse('show');
});
cardN1.addEventListener('click', () => {
    $(collapseN1).collapse('show');
});
cardN2.addEventListener('click', () => {
    $(collapseN2).collapse('show');
});
cardSuess.addEventListener('click', () => {
    $(collapseSuess).collapse('show');
});

$(collapseVegan).on('show.bs.collapse', function () {
    cardVegan.classList.add('active');
    cardN1.classList.remove('active');
    cardN2.classList.remove('active');
    cardSuess.classList.remove('active');
});
$(collapseN1).on('show.bs.collapse', function () {
    cardVegan.classList.remove('active');
    cardN1.classList.add('active');
    cardN2.classList.remove('active');
    cardSuess.classList.remove('active');
});
$(collapseN2).on('show.bs.collapse', function () {
    cardVegan.classList.remove('active');
    cardN1.classList.remove('active');
    cardN2.classList.add('active');
    cardSuess.classList.remove('active');
});
$(collapseSuess).on('show.bs.collapse', function () {
    cardVegan.classList.remove('active');
    cardN1.classList.remove('active');
    cardN2.classList.remove('active');
    cardSuess.classList.add('active');
});

