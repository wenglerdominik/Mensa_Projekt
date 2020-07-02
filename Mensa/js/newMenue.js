import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let products = [];
let productTypes = [];
let selProducts = [];
let newTab=false;
document.addEventListener('DOMContentLoaded', () => {
    if (productTypes.length === 0) loadProductType();



})

$('#selectType').change(function () {
    loadProducts();
    //fillProductInfo();
})
function fillProductInfo() {
    let count = document.getElementById('myTabContent').childElementCount;
    if(newTab==false && count>0)
    {
        for (let index = 1; index <= count; index++) {
            let htmlselect = document.getElementById('selProduct_' + index);
            
            
            htmlselect.innerHTML = '';
            for (let product of products) {
    
                let htmlProducts = document.createElement('option');
                htmlProducts.setAttribute('value', JSON.stringify(product));
    
                htmlProducts.innerHTML = product.name + ' / ' + product.description;
                htmlselect.appendChild(htmlProducts);
               
    
            }
            
        }
    }
    else if(newTab==true && count>0){
        let htmlselectnew = document.getElementById('selProduct_' + count);            
        htmlselectnew.innerHTML = '';
        for (let product of products) {

            let htmlProducts = document.createElement('option');
            htmlProducts.setAttribute('value', JSON.stringify(product));

            htmlProducts.innerHTML = product.name + ' / ' + product.description;
            htmlselectnew.appendChild(htmlProducts);
           

        }
    }
    newTab=false;
}


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

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

function loadProducts() {
    // let id = document.getElementById('myTabContent').childElementCount;
    // let html = document.getElementById('selProduct_' + id);
    // html.innerHTML = '';
    let type = JSON.parse(document.getElementById('selectType').value).producttypeid;

    request.execute({
        method: 'GET',
        url: '/product/productsMenue/' + type,
        datatype: 'json',

        successCallback: function (response) {
            products = response;
            // let html = document.getElementById('productNameSel');

            // for (let product of response) {

            //     let test = parseFloat(product.price).toFixed(2);
            //     let test33 = product.price;
            //     console.log(product.name, test, test33);
            //     let htmlProducts = document.createElement('option');
            //     htmlProducts.setAttribute('value', JSON.stringify(product));

            //     htmlProducts.innerHTML = product.name + ' / ' + product.description;
            //     html.appendChild(htmlProducts);

            // }
            fillProductInfo();

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}


document.getElementById('btnAddGang').addEventListener('click', function () {
    newTab=true;
    let navlink = document.getElementById('myTab');
    let tabContent = document.getElementById('myTabContent');
    navlink.appendChild(createNavLink());
    tabContent.appendChild(createTabContent());

    let id = document.getElementById('myTabContent').childElementCount;
    document.getElementById('selProduct').setAttribute('id', 'selProduct_' + id);
    document.getElementById('lblProductName').setAttribute('id', 'lblProductName_' + id);
    document.getElementById('lblProductDescription').setAttribute('id', 'lblProductDescription_' + id);
    document.getElementById('lblProductCalories').setAttribute('id', 'lblProductCalories_' + id);
    document.getElementById('lblProductPrice').setAttribute('id', 'lblProductPrice_' + id)

    if (products.length === 0) {
        loadProducts();
    }
    else {
         let id = document.getElementById('myTabContent').childElementCount;
        // let html = document.getElementById('selProduct_' + id);
        // html.innerHTML = '';
        // for (let product of products) {

        //     let htmlProducts = document.createElement('option');
        //     htmlProducts.setAttribute('value', JSON.stringify(product));

        //     htmlProducts.innerHTML = product.name + ' / ' + product.description;
        //     html.appendChild(htmlProducts);
        // }
        
    }
    $('#tab_' + id).trigger('click');
    fillProductInfo();

})

document.getElementById('btnSaveMenue').addEventListener('click', function () {

    let html = document.getElementById('myTabContent').childElementCount;

    for (let index = 1; index <= html; index++) {
        let y = document.getElementById('selProduct_' + index);
        let x = y.value;
        let pid = JSON.parse(x);
        selProducts.push(pid);
        console.log('ID: ', pid.productid, 'Objekt: ', pid);
    }
    saveMenue();

})

function saveMenue() {
    let response = null;
    let servedate = sessionStorage.getItem('menueDate');
    let menueNo = parseInt(sessionStorage.getItem('menueNo'));
    let type = JSON.parse(document.getElementById('selectType').value).producttypeid;
    let menue = {
        menueid: null,
        menuenumber: menueNo,
        servedate: servedate,
        type: type
    }
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
                window.open('menue.html', '_self');
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


