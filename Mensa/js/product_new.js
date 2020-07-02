import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let productTypes = [];
const additional = false;

document.addEventListener('DOMContentLoaded', () => {
    loadProductTypeKitchen(additional);

})

function initTableProducts(products) {
    $('#tableProducts').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        clickToSelect: true,
        height: 850,
        classes: 'table table-striped',
        columns: [
            {
                field: 'name',
                title: 'Name',
                sortable: true,

            },
            {
                field: 'description',
                title: 'Beschreibung',
                sortable: true,

            },
            {
                field: 'calorie',
                title: 'Kalorien',
                sortable: true,

            },
            {
                field: 'price',
                title: 'Preis',
                sortable: true,
                formatter: priceFormatter,

            },
            {
                field: 'producttypename',
                title: 'Produktart',
                sortable: true,

            },
        ],
        data: products,
    })
}
function priceFormatter(value, row, index) {
    return value.toFixed(2) + ' €';
};




$('#tableProducts').on('click-cell.bs.table', function (e, column, arg2, object, sender, arg5) {
    $('#modalProduct').data('product', object)
    $('#modalProduct').modal('show');
    console.log(e, column, arg2, object, sender, arg5);
});

function loadProductsKitchen(additional) {

    //  let table = document.getElementById('tbody');
    //  let urlString = '/product/' + additional;
    // if (productType) urlString += '/' + productType;
    // if (searchString) urlString += '/Filtered/' + searchString;
    // table.innerHTML = '';

    request.execute({
        method: 'GET',
        //url: urlString,
        url: '/product/' + additional,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            initTableProducts(response);
            //#region  old Table
            // for (let product of response) {

            //     let tr = document.createElement('tr');
            //     let tdName = document.createElement('td');
            //     let tdDescription = document.createElement('td');
            //     let tdType = document.createElement('td');
            //     let tdCalories = document.createElement('td');
            //     let tdPrice = document.createElement('td');
            //     tr.appendChild(tdName);
            //     tr.appendChild(tdDescription);

            //     tr.appendChild(tdType);
            //     tr.appendChild(tdCalories);
            //     tr.appendChild(tdPrice);

            //     tdName.innerHTML = product.name;
            //     tdDescription.innerHTML = product.description;
            //     tdType.innerHTML = product.producttypename; //request ändern join damit name kommt
            //     tdCalories.innerHTML = product.calorie;
            //     tdPrice.innerHTML = product.price.toFixed(2);

            //     tr.setAttribute('data-product', JSON.stringify(product));
            //     tr.setAttribute('data-toggle', 'modal');
            //     tr.setAttribute('data-target', '#modalProduct');
            //     tr.setAttribute('style', 'cursor: pointer')
            //     table.appendChild(tr);
            //     $('#btnCancel').click();

            // }
            //#endregion
            //addClickEventRow();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

function loadProductTypeKitchen(additional) {
    // let html = document.getElementById('productTypeSel');
    // html.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/producttype/' + additional,
        datatype: 'json',

        successCallback: function (response) {
            productTypes = response;
            loadProductsKitchen(additional);
            // let htmlProductType = document.createElement('option');
            // htmlProductType.setAttribute('value', 'all');
            // htmlProductType.innerHTML = 'Alle';
            // html.appendChild(htmlProductType);
            // for (let type of response) {

            //     let htmlProductType = document.createElement('option');
            //     htmlProductType.setAttribute('value', JSON.stringify(type));

            //     htmlProductType.innerHTML = type.name;
            //     html.appendChild(htmlProductType);

            // }
            // $('#productTypeSel').change();

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}

//#region  old type selection
// $('#productTypeSel').change(function () {
//     $('#inputSearch').val('');
//     if (document.getElementById('productTypeSel').value == 'all') {
//         loadProductsKitchen(null, null, additional);
//     }
//     else {
//         let selType = JSON.parse(document.querySelector('#productTypeSel').value);
//         console.log(selType.producttypeid)
//         loadProductsKitchen(selType.producttypeid, null, additional)
//     }

// })
//#endregion
//#region  old Searchfield
// $('#inputSearch').on('input', () => {
//     let searchString = document.querySelector('#inputSearch').value;
//     $('#productTypeSel').val('all');
//     loadProductsKitchen(null, searchString, additional);

// })

//#endregion

document.getElementById('upload').addEventListener('change', (event) => {
    readURL(event.currentTarget);
})

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        let filename = './productimage/' + input.files[0].name;
        console.log(filename);
        $('#image').data('path', filename);
        reader.onload = function (e) {
            $('#image').attr('src', e.target.result);
            $('#image').css("visibility", "visible");
        };

        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById('btnSave').addEventListener('click', () => {

    const product = { productid: null, name: null, description: null, calorie: null, image: null, price: null, deleted: null, producttypeid: null }
    const name = $('#productName').val();
    const description = $('#productDescription').val();
    const calorie = parseInt($('#productCalorie').val());
    const image = null;
    const price = parseFloat($('#productPrice').val());
    const deleted = false;
    const producttypeid = parseInt($('#productType').val());
    //
    product.name = name;
    product.description = description;
    product.calorie = calorie;
    console.log($('#image').data('path'));
    if ($('#image').data('path')) product.image = $('#image').data('path');

    else product.image = image;
    product.price = price;
    product.deleted = deleted;
    product.producttypeid = producttypeid;

    if ($('#modalProduct').data('product') === '') {
        product.productid = null;

    }
    else {
        product.productid = $('#modalProduct').data('product').productid;
    }
    console.log(product.image);
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
                    //alert("Produkt erfolgreich gespeichert");
                    loadProductsKitchen(additional);
                    $('#modalProduct').modal('hide');
                }
                else alert('Fehler beim Speichern');
            },
            errorCallback: function (s, t) {
                lblState.innerText = 'Fehler beim Speichern. Versuchen Sie es erneut';
                lblState.style.color = 'red';
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

})

//#region Open Modal
//#region  modal Old
// $('#modalProduct').on('show.bs.modal', (sender) => {

//     let productTypeSel = document.getElementById('productType');
//     productType.innerHTML = '';
//     if (sender.relatedTarget.id === "btnNewProduct") {
//         label.innerText = 'Zum Speichern müssen alle Felder ausgefüllt sein'
//         label.style.color = 'black';
//         btnSave.disabled = true;
//         document.querySelector('#modalHeader').innerText = 'Neues Produkt anlegen'
//         $('#productName').val('');
//         $('#productDescription').val('');
//         $('#productCalorie').val('');
//         $('#productPrice').val('');
//         for (let i = 0; i < productTypes.length; i++) {
//             let option = document.createElement('option');
//             option.innerHTML = productTypes[i].name;
//             option.value = productTypes[i].producttypeid;
//             productTypeSel.appendChild(option);
//         }
//         $('#modalProduct').data('product', '')

//     }
//     else if (sender.relatedTarget.nodeName === 'TR') {
//         document.querySelector('#modalHeader').innerText = 'Produkt ändern'
//         btnSave.disabled = false;
//         label.innerText = 'Produkt kann gespeichert werden';
//         label.style.color = 'green'
//         let row = $(sender.relatedTarget);
//         let productData = row.data('product');

//         for (let i = 0; i < productTypes.length; i++) {
//             let option = document.createElement('option');
//             option.innerHTML = productTypes[i].name;
//             option.value = productTypes[i].producttypeid;
//             productTypeSel.appendChild(option);
//         }
//         $('#productName').val(productData.name);
//         $('#productDescription').val(productData.description);
//         $('#productCalorie').val(productData.calorie);
//         $('#productPrice').val(productData.price.toFixed(2));
//         $('#productType').val(productData.producttypeid);
//         $('#modalProduct').data('product', productData)

//         console.log($('#modalProduct').data('product'))
//     }

// })
//#endregion
let productTypeSel = document.getElementById('productType');
$('#modalProduct').on('show.bs.modal', (sender) => {
    $('#image').attr('src', '');
    $('#image').css("visibility", "hidden");

    productType.innerHTML = '';
    if ($('#modalProduct').data('product')) {
        document.querySelector('#modalHeader').innerText = 'Produkt ändern'
        btnSave.disabled = false;
        label.innerText = 'Produkt kann gespeichert werden';
        label.style.color = 'green'
        let row = $(sender.relatedTarget);
        let productData = $('#modalProduct').data('product');

        for (let i = 0; i < productTypes.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = productTypes[i].name;
            option.value = productTypes[i].producttypeid;
            productTypeSel.appendChild(option);
        }
        $('#productName').val(productData.name);
        $('#productDescription').val(productData.description);
        $('#productCalorie').val(productData.calorie);
        $('#productPrice').val(productData.price.toFixed(2));
        $('#productType').val(productData.producttypeid);

        if (productData.image) {
            $('#image').attr('src', productData.image);
            $('#image').css("visibility", "visible");
            $('#image').data('path', productData.image);
        }
        //$('#modalProduct').data('product', productData)
    }

    else if (sender.relatedTarget.id === "btnNewProduct") {
        label.innerText = 'Zum Speichern müssen alle Felder ausgefüllt sein'
        label.style.color = 'black';
        btnSave.disabled = true;
        document.querySelector('#modalHeader').innerText = 'Neues Produkt anlegen'
        $('#productName').val('');
        $('#productDescription').val('');
        $('#productCalorie').val('');
        $('#productPrice').val('');
        for (let i = 0; i < productTypes.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = productTypes[i].name;
            option.value = productTypes[i].producttypeid;
            productTypeSel.appendChild(option);
        }
        $('#modalProduct').data('product', '')

    }
    $(productTypeSel).change();

    console.log($('#modalProduct').data('product'))


})
$('#modalProduct').on('hidden.bs.modal', function (e) {
    $('#modalProduct').data('product', '');

})
productTypeSel.onchange = showImageUpload;
function showImageUpload() {
    let x = parseInt($('#productType').val());
    if (x === 3 || x === 4 || x === 5) {
        document.getElementById('divUpload').style.display = 'block';
    }
    else document.getElementById('divUpload').style.display = 'none';
}
//#endregion


//check if no field is empty
const modal = document.getElementById('modalProduct');
const label = document.getElementById('lblState');
const emptyInput = [];
const btnSave = document.querySelector('#btnSave');
const inputs = modal.querySelectorAll('input');
$(inputs).on('input', () => {

    checkEmptyField();

})
function checkEmptyField() {
    emptyInput.length = 0;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            if (inputs[i].id !== 'upload') emptyInput.push(i);
        }
    }
    console.log(emptyInput.length);
    if (emptyInput.length === 0) {
        btnSave.disabled = false;
        label.innerText = 'Produkt kann gespeichert werden';
        label.style.color = 'green'
    }
    else if (emptyInput.length > 0) {
        btnSave.disabled = true;
        label.innerText = 'Zum Speichern müssen alle Felder ausgefüllt sein';
        label.style.color = 'black'

    }
}
