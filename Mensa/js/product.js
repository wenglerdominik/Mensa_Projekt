import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

let products = [];
let productTypes = [];
document.addEventListener('DOMContentLoaded', () => {
    //loadProducts();
    //$('#productNameSel').change();

})


function loadProducts() {

    let html = document.getElementById('productNameSel');
    html.innerHTML = '';


    request.execute({
        method: 'GET',
        url: '/product',
        datatype: 'json',

        successCallback: function (response) {
            products = response;
            // let html = document.getElementById('productNameSel');

            for (let product of response) {

                let test = parseFloat(product.price).toFixed(2);
                let test33 = product.price;
                console.log(product.name, test, test33);
                let htmlProducts = document.createElement('option');
                htmlProducts.setAttribute('value', JSON.stringify(product));

                htmlProducts.innerHTML = product.name + ' / ' + product.description;
                html.appendChild(htmlProducts);

            }
            loadProductType();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}

function loadProductType() {
    let html = document.getElementById('productTypeSel');
    html.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/producttype',
        datatype: 'json',

        successCallback: function (response) {
            productTypes = response;
            let htmlProductType = document.createElement('option');
            htmlProductType.setAttribute('value', 'all');
            htmlProductType.innerHTML = 'Alle';
            html.appendChild(htmlProductType);
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
    // trigger Change event für NameSelektion damit die Input Felder gefüllt werden
    $('#productNameSel').change();

}


document.getElementById('productTypeSel').addEventListener('change', () => {
    let html = document.getElementById('productNameSel');
    html.innerHTML = '';
    let filterd = [null];
    if (document.getElementById('productTypeSel').value == 'all') filterd = products;
    else {
        let typeSelect = JSON.parse(document.getElementById('productTypeSel').value);

        filterd = products.filter(function (test) {
            if (test.producttypeid == typeSelect.producttypeid) return test;
        })
        console.log(filterd);
    }
    for (let product of filterd) {

        let test = parseFloat(product.price).toFixed(2);
        let test33 = product.price;
        let htmlProducts = document.createElement('option');
        htmlProducts.setAttribute('value', JSON.stringify(product));

        htmlProducts.innerHTML = product.name + ' / ' + product.description;
        html.appendChild(htmlProducts);

    }

    $('#productNameSel').change();

})
$('#productNameSel').change(function () {
    let html = document.getElementById('productNameSel');
    let name = document.getElementById('editProductName');
    let producttype = document.getElementById('editProductType');
    let desc = document.getElementById('editProductDesc');
    let cal = document.getElementById('editProductCal');
    let price = document.getElementById('editProductPrice');
    if (!html.value) {
        name.value = '';
        producttype.value = '';
        desc.value = '';
        cal.value = '';
        price.value = '';
    }
    else {
        let selProduct = JSON.parse(html.value);
        producttype.innerHTML = '';

        name.value = selProduct.name;
        desc.value = selProduct.description;
        cal.value = selProduct.calorie;
        price.value = selProduct.price;

        for (let item of productTypes) {
            let htmlProductType = document.createElement('option');
            htmlProductType.setAttribute('value', JSON.stringify(item));

            htmlProductType.innerHTML = item.name;
            producttype.appendChild(htmlProductType);
        }
        let select = productTypes.filter(function (filter) {
            if (filter.producttypeid == selProduct.producttypeid) return filter;
        });
        producttype.value = JSON.stringify(select[0]);
    }

})

//////////////////////////////////////////////////////////////////////////////////////////////


//#region save Product

document.getElementById('btnSaveProduct').addEventListener('click', () => {

    let Selproduct = JSON.parse(document.getElementById('productNameSel').value);

    let productName = document.getElementById('editProductName');
    let productDesc = document.getElementById('editProductDesc');
    let productCal = document.getElementById('editProductCal');
    let productPrice = document.getElementById('editProductPrice');
    let productType = document.getElementById('editProductType');

    let product = {
        productid: Selproduct.productid,
        name: productName.value,
        description: productDesc.value,
        calorie: parseInt(productCal.value),
        image: null,
        price: parseFloat(productPrice.value),
        deleted: false,
        producttypeid: (JSON.parse(productType.value)).producttypeid
    }
    console.log(product);
    saveProductRequest(product);

});
document.getElementById('btnSaveNewProduct').addEventListener('click', () => {
    let productName = document.getElementById('newProductName');
    let productDesc = document.getElementById('newProductDesc');
    let productCal = document.getElementById('newProductCal');
    let productPrice = document.getElementById('newProductPrice');
    let productType = document.getElementById('newProductType');

    let product = {
        productid: null,
        name: productName.value,
        description: productDesc.value,
        calorie: parseInt(productCal.value),
        image: null,
        price: parseFloat(productPrice.value),
        deleted: false,
        producttypeid: (JSON.parse(productType.value)).producttypeid

    }
    saveProductRequest(product);
})

function saveProductRequest(product) {
    request.execute
        ({
            method: 'POST',
            url: '/product',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(product),
            successCallback: function (resp) {
                let response = JSON.parse(resp);
                console.log(response);

                if (response) {
                    //alert("Speichern erfolgreich");
                    //sessionStorage.setItem('user', JSON.stringify(response));
                    //window.open('main.html', '_self');
                    // productName.value = '';
                    // productDesc.value = '';
                    // productCal.value = '';
                    // productPrice.value = '';
                    // productType.value = '';

                }
                else alert('Fehler beim Speichern');
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

}

//#endregion Save product



document.getElementById('btnEdit').addEventListener('click', () => {
    loadProducts();
    $('#ContNewProduct').collapse('hide');
    $('#ContEditProduct').collapse('show');
    $('#navSaveNewProduct').collapse('hide');
    $('#navSaveProduct').collapse('show');

    document.getElementById('btnEdit').setAttribute('class', 'btn btn-info');
    document.getElementById('btnNew').setAttribute('class', 'btn btn-outline-dark');

})
document.getElementById('btnNew').addEventListener('click', () => {
    $('#ContEditProduct').collapse('hide');
    $('#ContNewProduct').collapse('show');
    $('#navSaveProduct').collapse('hide');
    $('#navSaveNewProduct').collapse('show');

    document.getElementById('btnNew').setAttribute('class', 'btn btn-info');
    document.getElementById('btnEdit').setAttribute('class', 'btn btn-outline-dark');


    let html = document.getElementById('newProductType');
    html.innerHTML = '';

    if (productTypes.length == 0) {
        request.execute({
            method: 'GET',
            url: '/producttype',
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
    else {
        for (let type of productTypes) {

            let htmlProductType = document.createElement('option');
            htmlProductType.setAttribute('value', JSON.stringify(type));

            htmlProductType.innerHTML = type.name;
            html.appendChild(htmlProductType);

        }
    }


})