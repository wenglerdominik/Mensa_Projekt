import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
let day = today.getDate();
document.querySelector('#headerLocationName').innerText = sessionStorage.getItem('selectedLocationName');
document.querySelector('#headerDate').innerText = 'Datum: ' + today.toLocaleDateString();
//#region 
// let locations = [];
// let selectedLocation;
// let role = JSON.parse(sessionStorage.getItem('user')).role;
// if (role === 3) {
//     LoadLocation();
// }

// else if (!sessionStorage.getItem('shown-modal')) {
//     LoadLocation();
// }
// else {
//     selectedLocation = parseInt(sessionStorage.getItem('selectedLocation'));
//     document.querySelector('#headerLocationName').innerText = sessionStorage.getItem('selectedLocationName');
//     loadOrders(selectedLocation);
// }
// document.querySelector('#headerDate').innerText = 'Datum: ' + today.toLocaleDateString();


// const modalBody = document.querySelector('#modalSetLocationBody');
// const modal = document.querySelector('#modalSetLocation');
// const buttonSetLocation = document.querySelector('#btnSetLocation');
// function LoadLocation() {

//     request.execute({
//         method: 'GET',
//         url: '/location',
//         datatype: 'json',

//         successCallback: function (response) {
//             locations = response;
//             for (let i = 0; i < locations.length; i++) {
//                 let formCheck = document.createElement('div');
//                 formCheck.classList = 'form-check';
//                 let input = document.createElement('input');
//                 input.classList = 'form-check-input';
//                 input.type = 'radio';
//                 let label = document.createElement('label');
//                 label.classList = 'form-check-label';
//                 if (i === 0) input.checked = true;
//                 input.id = locations[i].locationid;
//                 input.name = 'Locations';
//                 label.htmlFor = locations[i].locationid;
//                 input.setAttribute('data-name', locations[i].name);
//                 label.innerText = locations[i].name;
//                 input.value = locations[i].locationid;
//                 formCheck.append(input, label);
//                 modalBody.appendChild(formCheck);
//                 $(modal).modal();
//             }
//         },
//         errorCallback: function (s, t) {
//             console.log('fehler!!!');
//             console.error(s + ': ' + t);

//         }

//     })

// }

// buttonSetLocation.addEventListener('click', (event) => {
//     let radios = modalBody.getElementsByTagName('input');
//     for (let i = 0; i < radios.length; i++) {
//         if (radios[i].checked) {
//             selectedLocation = radios[i].id;
//             sessionStorage.setItem('selectedLocation', radios[i].id);
//             sessionStorage.setItem('selectedLocationName', radios[i].getAttribute('data-name'));
//             document.querySelector('#headerLocationName').innerText = radios[i].getAttribute('data-name');
//         }
//     }
//     $(modal).modal('hide');
//     sessionStorage.setItem('shown-modal', 'true');
//     loadOrders(selectedLocation);

// })
//#endregion


//loadOrders();
let selectedLocation = sessionStorage.getItem('selectedLocation');
loadOrders(selectedLocation);

function loadOrders(selectedLocation) {

    request.execute({
        method: 'GET',
        url: `/order/orderedMenues/${year}/${month + 1}/${day}/${selectedLocation}/${false}`,
        // url: `/order/orderedMenues/${year}/${6 + 1}/${1}/${selectedLocation}/${false}`,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            initTableOrder(response);


        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }

    })

}

//initTable();
function initTableOrder(orders) {
    $('#tableOrder').bootstrapTable('destroy').bootstrapTable({
        height: 800,
        locale: 'de-DE',
        classes: 'table-striped',
        detailFormatter: detailFormatter,
        icons: {
            detailOpen: 'mdi-arrow-down-circle',
            detailClose: 'mdi-arrow-up-circle'
        },
        columns: [
            {
                field: 'usernumber',
                title: 'Kundennummer',
                sortable: true,
            },
            {
                field: 'lastname',
                title: 'Nachname',
                sortable: true,
            },
            {
                field: 'firstname',
                title: 'Vorname',
                sortable: true,
            },
            {
                field: 'menuetitel',
                title: 'Bestelltes Menü',
                sortable: true,
            },
            {
                field: 'consumed',
                title: 'Bestätigung Konsum',
                align: 'center',
                formatter: btnConsumedFormatter
            }],
        data: orders,
    })

}
function initTableSellUser(user) {
    $('#tableSellUser').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        height: 350,
        singleSelect: true,
        classes: 'table-striped',
        clickToSelect: true,
        columns: [
            // [{
            //     title: 'Kunde auswählen',
            //     colspan: 4,
            //     align: 'center',
            // }],
            [{
                field: 'usernumber',
                title: 'Kundennummer',
                sortable: true,
                width: 50
            },
            {
                field: 'lastname',
                title: 'Nachname',
                sortable: true,
            },
            {
                field: 'firstname',
                title: 'Vorname',
                sortable: true,
            },
            {
                field: 'status',
                checkbox: true,
                display: false
            }],
        ],
        data: user,
    });

}

function initTableSellProducts(products) {
    $('#tableSellProducts').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        height: 400,
        classes: 'table-striped',
        clickToSelect: true,
        columns: [
            // [{
            //     title: 'Produkt auswählen',
            //     colspan: 5,
            //     align: 'center'
            // }],
            [{
                field: 'productname',
                title: 'Produkt',
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
                formatter: calFormatter
            },
            {
                field: 'productprice',
                title: 'Preis',
                sortable: true,
                formatter: priceFormatter
            },
            {
                field: 'status',
                checkbox: true,


            }]
        ],
        data: products,
    })

}

function priceFormatter(value, row, index) {
    return value.toFixed(2) + ' €';
}

function calFormatter(value) {
    return value + ' kCal';
}

function btnConsumedFormatter(data) {

    return [
        '<button type="button" class="btn btn-success consumed"><span class="mdi mdi-check-bold"</span></button>',
    ];
}
function detailFormatter(index, row) {
    let html = [];

    html.push('<p><b>Gebuchte Zusatzprodukte:</b></p>')
    for (let product of row.listadditional) {
        html.push('<p>' + product.addproductname + '</p>')
    }
    return html.join('')
}



$('#tableOrder').on('click-cell.bs.table', function (e, column, arg2, object, sender, arg5) {
    if (column === 'consumed') {
        setOrderConsumed(object.orderid);
    }

    console.log(e, column, arg2, object, sender, arg5);
});

function setOrderConsumed(orderid) {
    const consumed = true;
    request.execute({
        method: 'POST',
        url: '/order/updateOrderConsumed/' + orderid + '/' + consumed,
        contentHeader: 'application/json; charset=utf-8',
        // data: JSON.stringify(orderid, canceled, consumed),
        datatype: 'json',

        successCallback: function (response) {

            loadOrders(selectedLocation);

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

document.querySelector('#btnSellProduct').addEventListener('click', (event) => {
    $('#modalSellProduct').modal();
})


$('#modalSellProduct').on('shown.bs.modal', (event) => {
    console.log('modal show');
    loadUser();
})
$('#modalSellProduct').on('hide.bs.modal', () => {

    $('#tableSellUser').bootstrapTable('uncheckAll');
    $('#tableSellProducts').bootstrapTable('uncheckAll');
})
function loadUser() {


    request.execute({
        method: 'GET',
        url: '/user',
        datatype: 'json',

        successCallback: function (response) {
            initTableSellUser(response);
            loadAddProducts(selectedLocation);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

function loadAddProducts(selectedLocation) {
    request.execute({
        method: 'GET',
        url: '/additionalproduct/extended/' + selectedLocation,
        datatype: 'json',
        successCallback: function (response) {
            console.log(response);
            initTableSellProducts(response);

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}

$('#tableSellProducts').on('click-row.bs.table', () => {

})


const button = document.querySelector('#btnOrderAdditional');

$('#tableSellUser').on('check.bs.table', function (row, element, arg1) {
    let allTr = row.currentTarget.rows;
    for (let row of allTr) {
        row.classList.remove('tr-bg');
    }
    let tr = arg1[0].offsetParent.parentElement;
    tr.classList.add('tr-bg');
    enableSubmitButton();
});
$('#tableSellProducts').on('check.bs.table', function (row, element, arg1) {
    let tr = arg1[0].offsetParent.parentElement;

    tr.classList.add('tr-bg');
    enableSubmitButton();
});
$('#tableSellUser').on('uncheck.bs.table', function (row, element, arg1) {
    let tr = arg1[0].offsetParent.parentElement;
    tr.classList.remove('tr-bg');
    enableSubmitButton();
});
$('#tableSellProducts').on('uncheck.bs.table', function (row, element, arg1) {
    let tr = arg1[0].offsetParent.parentElement;
    tr.classList.remove('tr-bg');
    enableSubmitButton();
});
$('#tableSellProducts').on('check-all.bs.table', function (row, element, arg1) {
    let tr = row.currentTarget.rows;
    for (let row of tr) {
        row.classList.add('tr-bg');
    }

    enableSubmitButton();
});
$('#tableSellProducts').on('uncheck-all.bs.table', function (row, element, arg1) {
    let tr = row.currentTarget.rows;
    for (let row of tr) {
        row.classList.remove('tr-bg');
    }
    enableSubmitButton();
});
$('#tableSellUser').on('uncheck-all.bs.table', function (row, element, arg1) {
    let tr = row.currentTarget.rows;
    for (let row of tr) {
        row.classList.remove('tr-bg');
    }
});


let selectUser;
let selectedProducts;
function enableSubmitButton() {
    selectUser = $('#tableSellUser').bootstrapTable('getSelections');
    selectedProducts = $('#tableSellProducts').bootstrapTable('getSelections');
    if (selectUser.length === 0 || selectedProducts.length === 0) button.disabled = true
    else button.disabled = false;
}
button.addEventListener('click', () => {

    let date = new Date();
    let orderprice = 0;
    let orderContainer = {
        order: null,
        detaillist: [],
    }
    for (let product of selectedProducts) {

        let productObject = {
            orderdetailid: null,
            orderid: null,
            name: product.productname,
            description: product.productdescription,
            calorie: product.productcalorie,
            price: product.productprice,
            menueid: null,
        };
        orderprice += product.productprice,
            orderContainer.detaillist.push(productObject);
    }

    let orderObj = {
        orderid: null,
        userid: selectUser[0].userid,
        locationid: 1,
        orderdate: date,
        consumed: true,
        totalcost: orderprice,
        barcode: null,
        canceled: false,
        servedate: date,
        menueid: null,
    }
    orderContainer.order = orderObj;
    requestOrder(orderContainer);
})


function requestOrder(orderContainer) {

    request.execute({
        method: 'POST',
        url: '/order',
        contentHeader: 'application/json; charset=utf-8',
        data: JSON.stringify(orderContainer),
        successCallback: function (resp) {
            let response = JSON.parse(resp);
            console.log(response);
            $('#modalSellProduct').modal('hide');

        },
        errorCallback: function (s, t) {
            console.log('error on ordersave')
        }
    })
}