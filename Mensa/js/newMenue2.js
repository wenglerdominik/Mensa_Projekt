
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
let price = 0.00;
let cal = 0;
//let menueSelected = JSON.parse(sessionStorage.getItem('menueDetail'));
//let menueid = menueSelected.menueid;

//document.getElementById('menueTitle').innerHTML='Menü: '+sessionStorage.getItem('menueNo');
let datestring = sessionStorage.getItem('menueDate');
let date = new Date(datestring);
let day = date.getDay();
//document.getElementById('date').innerHTML= days[day]+', '+date.toLocaleDateString();


let products = [];
let productTypes = [];
let selProducts = [];
let newTab = false;
document.addEventListener('DOMContentLoaded', () => {
    if (productTypes.length === 0) loadProductType();

})

function loadProductType() {
    let html = document.getElementById('selectType');
    html.innerHTML = '';


    request.execute({
        method: 'GET',
        url: '/producttype/menuetype',
        datatype: 'json',

        successCallback: function (response) {
            productTypes = response;
            for (let type of response) {

                let htmlProductType = document.createElement('option');
                htmlProductType.setAttribute('value', JSON.stringify(type));

                htmlProductType.innerHTML = type.name;
                html.appendChild(htmlProductType);

            }
            createRadioButtonsForMenueType(response);
            // loadProducts();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}
function createRadioButtonsForMenueType(menuetypes) {
    const target = document.querySelector('#contNewMenue');
    let first = true;
    for (let type of menuetypes) {
        let formcheck = document.createElement('div');
        formcheck.classList = 'form-check';
        let input = document.createElement('input');
        input.classList = 'form-check-input';
        if (first) {
            input.checked = true;
            loadProducts(type.producttypeid);
        }
        first = false;
        input.type = 'radio';
        input.name = 'Type';
        input.id = type.producttypeid;
        input.value = type.producttypeid;
        let label = document.createElement('label');
        label.classList = 'form-check-label';
        label.for = type.producttypeid;
        label.innerText = type.name;
        input.onclick = menueTypeChanged;
        formcheck.append(input, label);
        target.appendChild(formcheck);
    }


}



function loadProducts(menueType) {

    
    //let type = JSON.parse(document.getElementById('selectType').value).producttypeid;
    let tbody = document.getElementById('tableBody');
    let price = 0.00;
    let cal = 0;
    //let htmlselect = document.getElementById('selProduct');
    let dataList = document.getElementById('products');
    let datainput = document.querySelector('#productsList');
    datainput.value = '';
    dataList.innerHTML = '';
    request.execute({
        method: 'GET',
        url: '/product/productsMenue/' + menueType,
        datatype: 'json',

        successCallback: function (response) {
            products = response;

            for (let product of products) {

                let htmlProducts = document.createElement('option');
                //htmlProducts.setAttribute('value', JSON.stringify(product));
                $(htmlProducts).data('product', JSON.stringify(product));
                htmlProducts.value = product.name;
                htmlProducts.id = product.productid;
                htmlProducts.innerHTML = product.description;
                dataList.appendChild(htmlProducts);

            }
            // $('#selProduct').change();

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}

// const productsList = document.querySelector('#productsList');
// $(productsList).change(() => {
//     target = document.querySelector('#rowSelectProduct');
//     console.log('select');
//     let product = productsList.sel
//     //addProductToTable(product);

// })

// $('#selectType').change(function () {
//     loadProducts();
//     document.getElementById('tableBody').innerHTML = '';
//     document.getElementById('totalCost').innerHTML = '0,00 €';
//     document.getElementById('totalCal').innerHTML = '0 kCal';
//     price = 0;
//     cal = 0;
// })

function menueTypeChanged(sender) {
    console.log(sender.target.id);
    loadProducts(sender.target.id);

}



// $('#selProduct').change(function () {
//     let product = JSON.parse(document.getElementById('selProduct').value);
//     document.getElementById('namePreview').innerHTML = product.name;
//     document.getElementById('descPreview').innerHTML = product.description;
//     document.getElementById('calPreview').innerHTML = product.calorie;
//     document.getElementById('pricePreview').innerHTML = product.price.toFixed(2);

// })

function addProductToTable(product) {

    let tbody = document.getElementById('tableBody');

    let tr = document.createElement('tr');
    tr.setAttribute('id', 'selProduct_' + (tbody.childElementCount + 1));
    tr.setAttribute('data-value', JSON.stringify(product));
    tr.classList = 'clickable-row';
    let th = document.createElement('th');
    th.setAttribute('id', '')
    let tdName = document.createElement('td');
    let tdDesc = document.createElement('td');
    let tdCal = document.createElement('td');
    let tdPrice = document.createElement('td');
    tr.appendChild(th);
    tr.appendChild(tdName);
    tr.appendChild(tdDesc);
    tr.appendChild(tdCal);
    tr.appendChild(tdPrice);
    th.innerHTML = tbody.childElementCount + 1;
    tdName.innerHTML = product.name;
    tdDesc.innerHTML = product.description;
    tdCal.innerHTML = product.calorie;
    tdPrice.innerHTML = (product.price).toFixed(2);
    tbody.appendChild(tr);
    price += product.price;
    cal += product.calorie;
    document.getElementById('totalCost').innerHTML = price.toFixed(2) + ' €';
    document.getElementById('totalCal').innerHTML = cal + ' kCal';

}

document.getElementById('btnSaveMenue').addEventListener('click', function () {

    let rows = document.getElementById('tableBody').childElementCount;

    for (let index = 1; index <= rows; index++) {
        let y = document.getElementById('selProduct_' + index);
        let pid = $(y).data('value');
        //console.log(x);

        selProducts.push(pid);
        console.log('ID: ', pid.productid, 'Objekt: ', pid);
    }
    saveMenue();

})

function saveMenue() {
    let response = null;
    let servedate = new Date(sessionStorage.getItem('menueDate'));
    let x = servedate.toJSON();
    let menueNo = parseInt(sessionStorage.getItem('menueNo'));
    let type = JSON.parse(document.getElementById('selectType').value).producttypeid;

    let y = new Date(servedate.getTime() - (servedate.getTimezoneOffset() * 60000)).toJSON();
    let menue = {
        menueid: null,
        servedate: y,
        type: type
    }

    console.log(x, '/', y);
    request.execute
        ({
            method: 'POST',
            url: '/menue',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(menue),
            successCallback: function (resp) {
                response = JSON.parse(resp);
                console.log(response);

                if (response) {
                    //alert("Menü Speichern erfolgreich");


                }
                else alert('Fehler beim Speichern');

                saveMenueDetail(selProducts, response.menue)
                window.open('calendar.html', '_self');
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });




}

function saveMenueDetail(selProducts, response) {

    console.log('Produkte für Menü: ', selProducts);
    console.log('Menü Objekt: ', response.menueid);
    let menueDetail = [];

    for (let i = 0; i < selProducts.length; i++) {
        menueDetail.push({
            menuedetailid: null,
            menueid: parseInt(response.menueid),
            productid: parseInt(selProducts[i].productid)
        });
    }

    console.log(menueDetail);

    request.execute
        ({
            method: 'POST',
            url: '/menuedetail',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(menueDetail),
            successCallback: (r) => {

            },
            errorCallback: (s, t) => { console.error(s, t); }
        });


}
