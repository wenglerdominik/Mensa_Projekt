import WifiRequest from './wifiRequest.js';
import Message from './message.js';
let userid = JSON.parse(sessionStorage.getItem('user')).userid;

let request = new WifiRequest();
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']

const btnNext = document.querySelector('#nextYear');
const btnPrev = document.querySelector('#prevYear');
const headYear = document.querySelector('#calendar-head-year');
const selectDate = document.querySelector('#selectDate');
let consumed = false;

document.addEventListener('DOMContentLoaded', () => {
    loadUserOrders(true);
    selectDate.value = `${months[currentMonth]}, ${currentYear}`
})

headYear.innerHTML = currentYear;

btnNext.addEventListener('click', () => {
    currentYear += 1;
    headYear.innerHTML = currentYear;
})
btnPrev.addEventListener('click', () => {
    currentYear -= 1;
    headYear.innerHTML = currentYear;
})

selectDate.addEventListener('click', () => {
    $('#modalDate').modal();

})

//#region get clicked Element in Calendar
//if element is li => open Menuedetail, if Element is td open Modal Menue
$("#Calendar").on("click", 'td', function (event) {
    const sender = $(event.target);
    const element = sender[0];
    let month = element.id;
    if (checkBox.checked) $(checkBox).click();

    if (element.tagName === 'TD') {

        selectDate.value = `${months[month]}, ${currentYear}`
        $(selectDate).data('year', currentYear);
        $(selectDate).data('month', month);
        currentMonth = parseInt(month);

    }
    $('#modalDate').modal('hide');
    loadUserOrders(true);
});


function loadUserOrders(consumed) {
    $('#tableOrders').bootstrapTable('destroy');

    if (!navigator.onLine) {
        let p = document.getElementById('totalCostMobile');
        p.style.color = 'red';
        p.innerText = 'Sie sind Offline!!';
    }
    let id = JSON.parse(sessionStorage.getItem('user')).userid;

    request.execute({
        method: 'GET',
        url: '/order/userReport/' + currentYear + "/" + (currentMonth + 1) + "/" + id + "/" + consumed,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            initTableUser(response);
            //fillTable(response, consumed);
            Message(userid);

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
}
const target = document.querySelector('#tbody');

function fillTable(response, consumed) {

    const tdTotalCost = document.querySelector('#totalCost');
    let totalCost = 0;
    target.innerHTML = '';
    let menue = [];
    let orderlist = [];

    for (let item of response) {
        let exist = false;
        if (orderlist.length === 0) {
            let order = { orderid: null, products: [], additional: false, servedate: null, totalCost: 0 };
            order.orderid = item.orderid;
            order.servedate = new Date(item.servedate).toLocaleDateString();
            if (!item.menueid) order.additional = true;
            order.totalCost += item.productprice;
            order.products.push(item);
            orderlist.push(order);
        }
        else {
            let i = 0;
            for (i = 0; i < orderlist.length; i++) {
                if (orderlist[i].orderid === item.orderid) {
                    exist = true;
                    break;
                }
                else exist = false;

            }
            if (exist) {
                orderlist[i].products.push(item);
                orderlist[i].totalCost += item.productprice;

            }
            else {
                let order = { orderid: null, products: [], additional: false, servedate: null, totalCost: 0 };
                order.orderid = item.orderid;
                order.servedate = new Date(item.servedate).toLocaleDateString();
                if (!item.menueid) order.additional = true;
                order.totalCost += item.productprice;
                order.products.push(item);
                orderlist.push(order);

            }

        }


    }

    for (let order of orderlist) {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdPrice = document.createElement('td');
        let tdDate = document.createElement('td');
        for (let i = 0; i < order.products.length; i++) {
            if (order.products[i].menuetitel) tdName.innerText = 'Menü ' + order.products[i].menuetitel;
            else if (i === order.products.length - 1) tdName.innerText += order.products[i].productname;
            else tdName.innerText += order.products[i].productname + '/';
        }
        tdPrice.innerText = order.totalCost.toFixed(2) + '€';
        tdDate.innerText = order.servedate;
        if (order.products.length > 1) $(tr).data('order', order);
        tr.append(tdName, tdPrice, tdDate);
        target.appendChild(tr);
        totalCost += order.totalCost;
    }

    console.log(orderlist);
    if (consumed) tdTotalCost.innerText = 'Gesamtkosten: ' + totalCost.toFixed(2) + ' €';
    else tdTotalCost.innerText = 'Gesamtkosten: ' + '0.00 €';

}

function initTableUser(orders) {
    $('#tableOrders').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        //height: 300,
        clickToSelect: true,
        mobileResponsive: true,
        // checkOnInit: true,
        classes: 'table table-striped',
        showFooter: true,
        pageList: [10, 25, 50, 100, 'all'],
        columns: [
            {
                field: 'name',
                title: 'Name',
                formatter: nameFormatter,
                footerFormatter: TotalFormatter,

            },
            {
                field: 'orderprice',
                title: 'Preis',
                sortable: true,
                formatter: priceFormatter,
                footerFormatter: priceTotalFormatter,

            },
            {
                field: 'servedate',
                title: 'Datum',
                sortable: true,
                formatter: dateFormatter

            },
        ],
        data: orders,

    })
}
function priceFormatter(value, row, index) {
    return '€ ' + value.toFixed(2);
};
function dateFormatter(value, row, index) {
    let date = new Date(value);
    return date.toLocaleDateString();
};

function nameFormatter(value, row, index) {
    if (row.menuetitel) return row.menuetitel
    else return row.additionaltext;

};
function TotalFormatter(value, row, index) {
    return 'Gesamt: ';
}

function priceTotalFormatter(data) {
    let p = document.getElementById('totalCostMobile');
    p.style.color = 'black';
    var field = this.field;
    let total = data.map(function (row) {
        let a = row[field];
        return +a
    }).reduce(function (sum, i) {
        return sum + i
    }, 0).toFixed(2);
    p.innerText = 'Gesamtkosten: €' + total;
    return '€' + total;


}

$('#tableOrders').on('click-row.bs.table', function (value, row, index) {
    console.log(value);
    console.log(row);
    console.log(index);

    loadOrderDetail(row.orderid);

})
function loadOrderDetail(orderid) {

    request.execute({
        method: 'GET',
        url: '/order/userReportDetail/' + orderid,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            const modal = document.querySelector('#modalInfo');
            const target = document.querySelector('#modalInfoBody');
            target.innerHTML = '';
            for (let product of response) {
                let p = document.createElement('p');
                p.innerText = `${product.description} / ${product.orderprice.toFixed(2)}€`;
                target.appendChild(p);
            }
            $(modal).modal();

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
}

//#region Old Table
// function fillTable(response, consumed) {

//     const tdTotalCost = document.querySelector('#totalCost');
//     let totalCost = 0;
//     target.innerHTML = '';
//     let menue = [];
//     let lastid;
//     for (let item of response) {
//         let tr;
//         let price = 0;
//         if (item.menueid) {
//             price += item.productprice;

//             if (lastid !== item.menueid) {
//                 tr = document.createElement('tr');
//                 let tdName = document.createElement('td');
//                 tdName.style.width = '40%';
//                 let tdPrice = document.createElement('td');
//                 let tdDate = document.createElement('td');
//                 tdName.innerText = `Menü ${item.menuetitel}`;
//                 tdDate.innerText = new Date(item.servedate).toLocaleDateString();
//                 tdPrice.innerText = price.toFixed(2);
//                 tr.append(tdName, tdPrice, tdDate);
//                 tr.id = item.menueid;
//                 target.appendChild(tr);
//             }
//             menue.push(item);
//             let row = document.getElementById(item.menueid);
//             $(row).data('detail', JSON.stringify(menue));
//             lastid = item.menueid;

//         }
//         else {
//             menue.length = 0;
//             tr = document.createElement('tr');
//             let tdName = document.createElement('td');
//             tdName.style.width = '40%';

//             let tdPrice = document.createElement('td');
//             let tdDate = document.createElement('td');
//             tdName.innerText = item.productname;
//             tdPrice.innerText = item.productprice.toFixed(2);
//             tdDate.innerText = new Date(item.servedate).toLocaleDateString();

//             $(tr).data('detail', JSON.stringify(item));
//             tr.append(tdName, tdPrice, tdDate);
//             target.appendChild(tr);

//         }
//         totalCost += item.productprice;



//     }
//     tdTotalCost.innerText = totalCost.toFixed(2) + ' €';

// }

// target.addEventListener('click', (event) => {
//     const modal = document.querySelector('#modalInfo');
//     const target = document.querySelector('#modalInfoBody');
//     target.innerHTML = '';
//     let sender = event.target.parentElement;
//     let order = $(sender).data('order');
//     console.log(order);
//     for (let product of order.products) {
//         let p = document.createElement('p');
//         p.innerText = product.productdescription;
//         target.appendChild(p);
//     }
//     $(modal).modal();
// })
//#endregion

const checkBox = document.querySelector('#chkConsumed');
checkBox.addEventListener('click', () => {
    if (checkBox.checked) {
        loadUserOrders(false);
    }
    else loadUserOrders(true);
})

