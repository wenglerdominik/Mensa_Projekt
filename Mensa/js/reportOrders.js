import WifiRequest from './wifiRequest.js';
let request = new WifiRequest();


let selectedLocation = parseInt(sessionStorage.getItem('selectedLocation'));

const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

document.querySelector('#headerDate').innerText = 'Datum: ' + today.toLocaleDateString();
document.querySelector('#headerLocationName').innerText = sessionStorage.getItem('selectedLocationName');

document.addEventListener('DOMContentLoaded', () => {
    dateInput.value = today.toLocaleDateString();
    getOrders(today, selectedLocation);
})

const dateInput = document.querySelector('#dateInput');
createTable(currentYear, currentMonth)

//#region Calendar
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

dateInput.addEventListener('click', () => {
    document.querySelector('#modalCalenderTitle').innerText = 'Datum auswählen'
    $('#modal-Calender').modal();
    $('#modal-Calender').data('sender', 'startDate');

})
$("#Calendar").on("click", 'td', function (event) {
    const sender = $(event.target);
    const element = sender[0];
    const senderDate = $('#modal-Calender').data('sender');
    let date = new Date(element.id)

    if (element.className === 'days inactive') return;
    let x = document.querySelectorAll('.days.active')
    if (element.tagName === 'TD') {

        dateInput.value = date.toLocaleDateString();;
        $(dateInput).data('date', date);
    }
    getOrders(date, selectedLocation);
    $('#modal-Calender').modal('hide');

});

//#endregion



function getOrders(date, locationid) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    request.execute({
        method: 'GET',
        url: '/order/orderReportOutput/' + year + "/" + (month + 1) + "/" + day + "/" + locationid,
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
    $('#tableOrderReport').bootstrapTable('destroy').bootstrapTable({

        locale: 'de-DE',
        showFooter: true,
        classes: 'table table-striped',
        columns: [
            {
                field: 'servedate',
                title: 'Datum',
                sortable: true,
                formatter: dateformatter,
                footerFormatter: TotalFormatter,

            },
            {
                field: 'menuetitel',
                title: 'Menü',
                sortable: true,
            },

            {
                field: 'totalcount',
                title: '#Bestellungen',
                sortable: true,
                footerFormatter: CountTotalFormatter,

            },
            {
                field: 'consumedcount',
                title: '#Konsumiert',
                sortable: true,
                footerFormatter: CountTotalFormatter,

            },
            {
                field: 'singleprice',
                title: 'Einzelpreis',
                sortable: true,
                formatter: priceFormatter,
            },
            {
                field: 'totalprice',
                title: 'Gesamtpreis',
                sortable: true,
                formatter: priceFormatter,
                footerFormatter: priceTotalFormatter,

            },

            {
                field: 'opencosts',
                title: 'Offene Kosten',
                sortable: true,
                formatter: priceFormatter,
                footerFormatter: priceTotalFormatter,
            },
        ],
        data: orders,
    })

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
function CountTotalFormatter(data) {
    var field = this.field
    return data.map(function (row) {
        let a = row[field];
        return +a
    }).reduce(function (sum, i) {
        return sum + i
    }, 0);
}

function priceFormatter(value, row, index) {
    return value.toFixed(2) + ' €';
};
function dateformatter(value, row, index) {
    let date = new Date(value);
    return date.toLocaleDateString();
};
function TotalFormatter(value, row, index) {
    return 'Gesamt: '
};