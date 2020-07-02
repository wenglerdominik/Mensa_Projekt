import WifiRequest from './wifiRequest.js';
let request = new WifiRequest();

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']

const btnNext = document.querySelector('#nextYear');
const btnPrev = document.querySelector('#prevYear');
const headYear = document.querySelector('#calendar-head-year');
const selectDate = document.querySelector('#selectDate');


document.addEventListener('DOMContentLoaded', () => {

    selectDate.value = `${months[currentMonth]}, ${currentYear}`;
    getMonthReport();
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

$("#Calendar").on("click", 'td', function (event) {
    const sender = $(event.target);
    const element = sender[0];
    let month = element.id;

    if (element.tagName === 'TD') {

        selectDate.value = `${months[month]}, ${currentYear}`
        $(selectDate).data('year', currentYear);
        $(selectDate).data('month', month);
        currentMonth = parseInt(month);
    }
    getMonthReport();
    $('#modalDate').modal('hide');
});


function getMonthReport() {

    request.execute({
        method: 'GET',
        url: '/order/billingmonth/' + currentYear + "/" + (currentMonth + 1) + "/" + 0,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            //fillTable(response);
            initTableReport(response);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
}
function initTableReport(orders) {
    $('#tableReport').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        height: 850,
        classes: 'table-striped',
        showFooter: true,
        columns:
            [{
                field: 'titel',
                title: 'Menü',
                sortable: true,
                width: 400,
                footerFormatter: TotalFormatter,
            },
            {
                field: 'count',
                title: 'Anzahl',
                width: 150,
                sortable: true,
                footerFormatter: CountTotalFormatter,
            },
            {
                field: 'singleprice',
                title: 'Einzelpreis',
                sortable: true,
                width: 150,
                formatter: singlePriceFormatter
            },
            {
                field: 'orderprice',
                title: 'Gesamtpreis',
                sortable: true,
                width: 150,
                formatter: priceFormatter,
                footerFormatter: priceTotalFormatter,
            },
            {
                field: 'servedate',
                title: 'Datum',
                sortable: true,
                width: 150,
                formatter: dateFormatter,
            }],
        data: orders,
    })

}
function dateFormatter(value, row, index) {
    let date = new Date(value);
    return date.toLocaleDateString();
};
function CountTotalFormatter(data) {
    var field = this.field
    return data.map(function (row) {
        let a = row[field];
        return +a
    }).reduce(function (sum, i) {
        return sum + i
    }, 0);
}
function TotalFormatter(value, row, index) {
    return 'Gesamt: ';
}
function priceTotalFormatter(data) {
    var field = this.field
    return '€' + data.map(function (row) {
        let a = row[field];
        return +a
    }).reduce(function (sum, i) {
        return sum + i
    }, 0).toFixed(2);
}

function priceFormatter(value, row, index) {
    return '€ ' + value.toFixed(2);
}
function singlePriceFormatter(value, row, index) {
    return '€ ' + value.toFixed(2);
}


function fillTable(monthReport) {
    const targetBody = document.querySelector('#tBody');
    const targetFoot = document.querySelector('#tableFoot');
    targetBody.innerHTML = '';
    targetFoot.innerHTML = '';
    let monthprice = 0;
    for (let menue of monthReport) {
        let tr = document.createElement('tr');
        let tdMenue = document.createElement('td');
        let tdCount = document.createElement('td');
        let tdSinglePrice = document.createElement('td');
        let tdMenueTotalPrice = document.createElement('td');
        tdMenue.innerText = menue.titel;
        tdCount.innerText = menue.count;
        tdSinglePrice.innerText = (menue.orderprice / menue.count).toFixed(2);
        tdMenueTotalPrice.innerText = menue.orderprice.toFixed(2);
        tr.append(tdMenue, tdCount, tdSinglePrice, tdMenueTotalPrice);
        targetBody.appendChild(tr);
        monthprice += menue.orderprice;
    }
    let tf = document.createElement('th');
    tf.innerText = `Gesamtkosten: ${monthprice.toFixed(2)} €`;
    targetFoot.appendChild(tf);
    console.log(monthprice)
}