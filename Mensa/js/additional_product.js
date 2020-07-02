import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let productTypes = [];
const additional = true;
let locationid;
if (parseInt(sessionStorage.getItem('selectedLocation'))) {
    let role = JSON.parse(sessionStorage.getItem('user')).role;
    if (role === 3) locationid = 0
    else locationid = parseInt(sessionStorage.getItem('selectedLocation'));
}
else locationid = 0;

const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const inputStartDate = document.querySelector('#dateStart');
const inputEndDate = document.querySelector('#dateEnd');

document.addEventListener('DOMContentLoaded', () => {
    loadProductType(additional);
    let html = document.querySelector('#location');
    let htmlLocation = document.createElement('option');
    htmlLocation.value = locationid;

    // htmlLocation.innerHTML = locationname;
    html.appendChild(htmlLocation);
})
function initTableAddProduct(products) {
    $('#tableAddProduct').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        clickToSelect: true,
        classes: 'table table-striped',
        height: 850,
        pageList: [10, 25, 50, 100, 'all'],
        columns: [
            {
                field: 'productname',
                title: 'Produktname',
                sortable: true,

            },
            {
                field: 'productdescription',
                title: 'Beschreibung',
                sortable: true,

            },
            {
                field: 'productcalorie',
                title: 'Kalorien',
                sortable: true,

            },
            {
                field: 'productprice',
                title: 'Preis',
                sortable: true,
                formatter: priceFormatter,

            },
            {
                field: 'locationname',
                title: 'Ausgabestelle',
                sortable: true,
            },
            {
                field: 'expiry',
                title: 'Gültigkeit',
                sortable: true,
                formatter: expiryFormatter,
            },

        ],
        data: products,
    })
}
function priceFormatter(value, row, index) {
    return value.toFixed(2) + ' €';
};

function expiryFormatter(value, row, index) {
    const end = new Date(row.expirydateend);
    const validityStart = new Date(row.expirydatestart).toLocaleDateString();
    const validityEnd = new Date(row.expirydateend).toLocaleDateString();
    let string = `${validityStart} bis ${validityEnd}`;
    let p1 = `<span style="color:red; font-weight:bolder">${string}</span>`;
    let p2 = `<span style="color:darkorange; font-weight:bolder">${string}</span>`
    if (end < today.setHours(0, 0, 0, 0)) return p1;
    if (end > today.setHours(0, 0, 0, 0)) return string;
    else return p2;
}

$('#tableAddProduct').on('click-cell.bs.table', function (e, column, arg2, object, sender, arg5) {
    $('#modalProduct').data('product', object)
    $('#modalProduct').modal('show');
    console.log(e, column, arg2, object, sender, arg5);
});


function loadProducts() {

    //  let table = document.getElementById('tbody');
    // let locationId = 0
    // let urlString = '/product/' + additional;
    // if (productType) urlString += '/' + productType;
    // if (searchString) urlString += '/Filtered/' + searchString;
    // table.innerHTML = '';
    request.execute({
        method: 'GET',
        url: '/additionalproduct/extendedManage/' + locationid,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            initTableAddProduct(response);
            //#region old Table
            // for (let product of response) {
            //     const validityStart = new Date(product.expirydatestart).toLocaleDateString();
            //     const validityEnd = new Date(product.expirydateend).toLocaleDateString();
            //     let tr = document.createElement('tr');
            //     let tdName = document.createElement('td');
            //     let tdDescription = document.createElement('td');
            //     //let tdType = document.createElement('td');
            //     let tdCalories = document.createElement('td');
            //     let tdPrice = document.createElement('td');
            //     let tdLocation = document.createElement('td');
            //     let tdValidity = document.createElement('td');
            //     // tr.appendChild(tdName);
            //     // tr.appendChild(tdDescription);
            //     // //tr.appendChild(tdType);
            //     // tr.appendChild(tdCalories);
            //     // tr.appendChild(tdPrice);
            //     tr.append(tdName, tdDescription, tdCalories, tdPrice, tdLocation, tdValidity);

            //     tdName.innerText = product.productname;
            //     tdDescription.innerText = product.productdescription;
            //     //tdType.innerHTML = product.producttypename; //request ändern join damit name kommt
            //     tdCalories.innerText = product.productcalorie;
            //     tdPrice.innerText = product.productprice.toFixed(2);
            //     tdLocation.innerText = product.locationname
            //     tdValidity.innerText = `${validityStart} bis ${validityEnd}`;

            //     tr.setAttribute('data-product', JSON.stringify(product));
            //     tr.setAttribute('data-toggle', 'modal');
            //     tr.setAttribute('data-target', '#modalProduct');
            //     tr.setAttribute('style', 'cursor: pointer')
            //     table.appendChild(tr);
            //     $('#btnCancel').click();

            // }
            //#endregion
            loadLocation();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

function loadProductType(additional) {
    //let html = document.getElementById('productTypeSel');
    //html.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/producttype/' + additional,
        datatype: 'json',

        successCallback: function (response) {
            productTypes = response;
            loadProducts();
            // if (response.length > 1) {
            //     let htmlProductType = document.createElement('option');
            //     htmlProductType.setAttribute('value', 'all');
            //     htmlProductType.innerHTML = 'Alle';
            //     html.appendChild(htmlProductType);
            // }
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

function loadLocation() {
    let html = document.querySelector('#location');
    html.innerHTML = '';
    request.execute({
        method: 'GET',
        url: '/location',
        datatype: 'json',

        successCallback: function (response) {
            for (let location of response) {
                let htmlLocation = document.createElement('option');
                htmlLocation.value = JSON.stringify(location.locationid);
                htmlLocation.innerHTML = location.name;

                if (locationid === 0) {
                    html.appendChild(htmlLocation);
                }
                else {
                    if (locationid === location.locationid) html.appendChild(htmlLocation);
                }

            }


        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
}
//#region  old TypeSelect
// $('#productTypeSel').change(function () {
//     $('#inputSearch').val('');
//     if (document.getElementById('productTypeSel').value == 'all') {
//         loadProducts(null, null, additional);
//     }
//     else {
//         let selType = JSON.parse(document.querySelector('#productTypeSel').value);
//         console.log(selType.producttypeid)
//         loadProducts(selType.producttypeid, null, additional)
//     }

// })

// $('#inputSearch').on('input', () => {
//     let searchString = document.querySelector('#inputSearch').value;
//     $('#productTypeSel').val('all');
//     loadProducts(null, searchString, additional);

// })
//#endregion


document.getElementById('btnSave').addEventListener('click', () => {

    const product = {
        productid: null,
        name: null,
        description: null,
        calorie: null,
        image: null,
        price: null,
        deleted: null,
        producttypeid: null
    }

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
    product.image = image;
    product.price = price;
    product.deleted = deleted;
    product.producttypeid = producttypeid;

    if ($('#modalProduct').data('product') === '') {
        product.productid = null;

    }
    else {
        product.productid = $('#modalProduct').data('product').productid;
    }

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
                    saveAdditionalProduct(response.product);
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
function saveAdditionalProduct(product) {
    const addproduct = {
        additionalproductid: null,
        locationid: null,
        productid: null,
        available: null,
        expirydatestart: null,
        expirydateend: null,
    }
    const locationId = parseInt($('#location').val());
    const expiryDateStart = new Date($('#dateStart').data('date').getTime() - ($('#dateStart').data('date').getTimezoneOffset() * 60000)).toJSON();
    const expiryDateEnd = new Date($('#dateEnd').data('date').getTime() - ($('#dateEnd').data('date').getTimezoneOffset() * 60000)).toJSON();

    if ($('#modalProduct').data('product') === '') {
        addproduct.additionalproductid = null;
    }
    else {
        addproduct.additionalproductid = $('#modalProduct').data('product').additionalproductid;
    }
    addproduct.locationid = locationId;
    addproduct.productid = product.productid;
    addproduct.expirydatestart = expiryDateStart;
    addproduct.expirydateend = expiryDateEnd;

    request.execute
        ({
            method: 'POST',
            url: '/additionalproduct',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(addproduct),
            successCallback: function (response) {
                console.log(response);
                if (response) {
                    // alert("Zusatzartikel erfolgreich gespeichert");
                    loadProducts();
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

}



//#region Open Modal
$('#modalProduct').on('show.bs.modal', (sender) => {
    checkEmptyField();
    let productTypeSel = document.getElementById('productType');
    productType.innerHTML = '';

    if ($('#modalProduct').data('product')) {
        document.querySelector('#modalHeader').innerText = 'Produkt ändern'
        btnSave.disabled = false;
        label.innerText = 'Produkt kann gespeichert werden';
        label.style.color = 'green'
        //let row = $(sender.relatedTarget);
        let productData = $('#modalProduct').data('product');//row.data('product');
        let datestart = new Date(productData.expirydatestart);
        let dateend = new Date(productData.expirydateend);

        for (let i = 0; i < productTypes.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = productTypes[i].name;
            option.value = productTypes[i].producttypeid;
            productTypeSel.appendChild(option);
        }
        $('#location').val(productData.locationid);
        $('#productName').val(productData.productname);
        $('#productDescription').val(productData.productdescription);
        $('#productCalorie').val(productData.productcalorie);
        $('#productPrice').val(productData.productprice.toFixed(2));
        $('#productType').val(productData.producttypeid);
        $('#dateStart').val(datestart.toLocaleDateString());
        $('#dateStart').data('date', datestart);
        $('#dateEnd').val(dateend.toLocaleDateString());
        $('#dateEnd').data('date', dateend);

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
        $('#dateStart').val('');
        $('#dateEnd').val('');

        // $('#location').val(distance[0].name)
        for (let i = 0; i < productTypes.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = productTypes[i].name;
            option.value = productTypes[i].producttypeid;
            productTypeSel.appendChild(option);
        }
        $('#modalProduct').data('product', '')

    }

})
$('#modalProduct').on('hidden.bs.modal', function (e) {
    $('#modalProduct').data('product', '');
    //loadUser();
})
//#region  old Modal
// $('#modalProduct').on('show.bs.modal', (sender) => {
//     checkEmptyField();
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
//         $('#dateStart').val('');
//         $('#dateEnd').val('');

//         // $('#location').val(distance[0].name)
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
//         let datestart = new Date(productData.expirydatestart);
//         let dateend = new Date(productData.expirydateend);

//         for (let i = 0; i < productTypes.length; i++) {
//             let option = document.createElement('option');
//             option.innerHTML = productTypes[i].name;
//             option.value = productTypes[i].producttypeid;
//             productTypeSel.appendChild(option);
//         }
//         $('#productName').val(productData.productname);
//         $('#productDescription').val(productData.productdescription);
//         $('#productCalorie').val(productData.productcalorie);
//         $('#productPrice').val(productData.productprice.toFixed(2));
//         $('#productType').val(productData.producttypeid);
//         $('#dateStart').val(datestart.toLocaleDateString());
//         $('#dateStart').data('date', datestart);
//         $('#dateEnd').val(dateend.toLocaleDateString());
//         $('#dateEnd').data('date', dateend);

//         $('#modalProduct').data('product', productData)

//         console.log($('#modalProduct').data('product'))
//     }

// })
//#endregion
//#endregion


//check if no field is empty
const modal = document.getElementById('modalProduct');
const inputs = modal.querySelectorAll('input');
const label = document.getElementById('lblState');
const emptyInput = [];
const btnSave = document.querySelector('#btnSave');
$(inputs).on('input', () => {

    checkEmptyField();

})
function checkEmptyField() {
    emptyInput.length = 0;
    const productStart = new Date($(inputStartDate).data('date'));
    const productEnd = new Date($(inputEndDate).data('date'));

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            emptyInput.push(i);
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
    if (productStart > productEnd) {
        btnSave.disabled = true;
        label.innerText = 'Startdatum kann darf nicht kleiner sein als Ablaufdatum';
        label.style.color = 'black'

    }
}





/////////////////////////////////////
/////////////////////////////////////




createTable(currentYear, currentMonth)

function createTable(currentYear, currentMonth) {

    let calendarBody = document.querySelector('#calendar-body');
    let head = document.querySelector('#calendar-head-month');
    let br = document.createElement('br');
    //const targetElement = document.querySelector('#calendar-body')
    head.innerHTML = months[currentMonth];
    head.append(br, currentYear)
    const getdDaysInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let firstday = new Date(currentYear, currentMonth).getDay();
    const daysInMonth = getdDaysInMonth(new Date(currentYear, currentMonth));
    calendarBody.innerHTML = ''
    let dayCounter = 1;
    let rowMax = 5;
    for (let row = 0; row < rowMax; row++) {
        const tr = document.createElement('tr');
        tr.classList = 'tr-calendar-modal'
        for (let tdCount = 0; tdCount < 5; tdCount++) {
            let dayOfWeek = new Date(currentYear, currentMonth, dayCounter).getDay();
            let date = new Date(currentYear, currentMonth, dayCounter).toString();
            const td = document.createElement('td');
            td.classList = 'days active';
            td.style.height = 'auto';
            //td.setAttribute('data-toggle', 'modal');
            if ((firstday === 0 || firstday === 6) && row === 0) {
                dayCounter++;
                rowMax = 6;
                break;
            }
            if (tdCount + 1 < firstday && row === 0) {
                td.innerText = ''
                td.classList = 'days inactive'
                tr.appendChild(td);
            }
            else if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCounter++;
                tdCount--;
            }
            else if (dayCounter > daysInMonth) {
                row = 6;
                break;
            }
            else {
                const ul = document.createElement('ul');
                td.innerText = dayCounter;
                td.setAttribute('id', date);
                $(td).data('date', date);
                dayCounter++;
                td.appendChild(ul);
                tr.appendChild(td);
            }
            if (dayCounter < daysInMonth) {
                calendarBody.appendChild(tr);
            }

        }

    }

}
document.getElementById('nextMonth').addEventListener('click', () => {

    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;

    createTable(currentYear, currentMonth);
})
document.getElementById('prevMonth').addEventListener('click', () => {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;

    createTable(currentYear, currentMonth);
})





inputStartDate.addEventListener('click', () => {
    document.querySelector('#modalCalenderTitle').innerText = 'Startdatum'
    $('#modal-Calender').modal();
    $('#modal-Calender').data('sender', 'startDate');

})
inputEndDate.addEventListener('click', () => {
    document.querySelector('#modalCalenderTitle').innerText = 'Enddatum'
    $('#modal-Calender').modal();
    $('#modal-Calender').data('sender', 'endDate');

})

//#region get clicked Element in Calendar
//if element is li => open Menuedetail, if Element is td open Modal Menue
$("#Calendar").on("click", 'td', function (event) {
    const sender = $(event.target);
    const element = sender[0];
    const senderDate = $('#modal-Calender').data('sender');
    let date = new Date(element.id)

    if (element.className === 'days inactive') return;
    let x = document.querySelectorAll('.days.active')
    if (element.tagName === 'TD') {
        if (senderDate === 'startDate') {
            inputStartDate.value = date.toLocaleDateString();;
            $(inputStartDate).data('date', date);
        }
        else if (senderDate === 'endDate') {
            inputEndDate.value = date.toLocaleDateString();;
            $(inputEndDate).data('date', date);

        }

    }
    $('#modal-Calender').modal('hide');
    checkEmptyField();
});