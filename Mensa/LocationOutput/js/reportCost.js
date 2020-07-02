import WifiRequest from '../../js/wifiRequest.js';
let request = new WifiRequest();
let selectedLocation = parseInt(sessionStorage.getItem('selectedLocation'));

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
    getOrders(currentYear, currentMonth, selectedLocation);
})

//#region Calendar
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
    getOrders(currentYear, currentMonth, selectedLocation);
    $('#modalDate').modal('hide');
});

//#endregion

function getOrders(year, month, locationid) {

    request.execute({
        method: 'GET',
        url: '/order/orderReportOutputMonth/' + year + "/" + (month + 1) + "/" + locationid,
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

function initTableOrder(orders) {
    $('#tableCostReport').bootstrapTable('destroy').bootstrapTable({
        clickToSelect: true,
        height: 850,
        pageList: [10, 25, 50, 100, 'all'],
        locale: 'de-DE',
        columns: [
            {
                field: 'type',
                title: '',
                formatter: typeFormatter,
                footerFormatter: TotalFormatter,
            },

            {
                field: 'totalcount',
                title: '#Konsumierte Bestellungen',
                footerFormatter: CountTotalFormatter,
            },

            {
                field: 'totalprice',
                title: 'Gesamtpreis',
                formatter: priceFormatter,
                footerFormatter: priceTotalFormatter,

            },


        ],
        data: orders,
    })

}
function priceFormatter(value, row, index) {
    return value.toFixed(2) + ' €';
};
function dateformatter(value, row, index) {
    let date = new Date(value);
    return date.toLocaleDateString();
};
function typeFormatter(value, row, index) {
    if (value === 'additional') return 'Zusatzprodukte'
    else return 'Menüs';
};

function TotalFormatter(value, row, index) {
    return 'Gesamt: '
};
function priceTotalFormatter(data) {
    var field = this.field
    return '€' + data.map(function (row) {
        let a = row[field];
        return +a
    }).reduce(function (sum, i) {
        return sum + i
    }, 0).toFixed(2);
}
function CountTotalFormatter(data) {
    var field = this.field
    return data.map(function (row) {
        let a = row[field];
        return +a
    }).reduce(function (sum, i) {
        return sum + i
    }, 0);
}
