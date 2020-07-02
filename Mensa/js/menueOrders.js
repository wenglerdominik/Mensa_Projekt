import WifiRequest from './wifiRequest.js';
let request = new WifiRequest();
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    LoadLocation();
    dateInput.value = today.toLocaleDateString();;
})


const dateInput = document.querySelector('#dateInput');

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
    loadMenuesForDate(date);
    $('#modal-Calender').modal('hide');

});
let locations = [];

function LoadLocation() {

    locations.length = 0;
    request.execute({
        method: 'GET',
        url: '/location',
        datatype: 'json',

        successCallback: function (response) {
            loadMenuesForDate(today);

            locations = response;

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

let menues = [];
function loadMenuesForDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    console.log(year, month, day);

    request.execute({
        method: 'GET',
        url: '/menue/menuedetail/' + year + "/" + (month + 1) + "/" + day,
        datatype: 'json',
        successCallback: function (response) {
            menues = response;
            getLocationCount(year, month, day);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}

function getLocationCount(year, month, day) {


    request.execute({
        method: 'GET',
        url: '/order/countReportLocation/' + year + "/" + (month + 1) + "/" + day,
        datatype: 'json',

        successCallback: function (response) {
            console.log(response)
            fillTableOrderCount(menues, response);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
}


function fillTableOrderCount(menueList, LocationCount) {
    const target = document.querySelector('#tableOrderCount');
    const targetHead = document.querySelector('#trHead');
    const th = document.createElement('th');
    th.innerText = '';
    th.id = 'status';
    targetHead.innerHTML = '';
    targetHead.appendChild(th);
    target.innerHTML = '';

    if (LocationCount.length === 0) {
        let th = document.getElementById('status');
        th.innerText = 'Keine Bestellungen vorhanden';
    }


    for (let location of locations) {
        let thLocationName = document.createElement('th');
        thLocationName.style.width = '200px';
        thLocationName.innerText = location.name;
        targetHead.appendChild(thLocationName);
    }

    // for (let menueLocation of LocationCount) {
    //     let lastname;
    //     if (lastname !== menueLocation.location) {
    //         let thLocationName = document.createElement('th');
    //         thLocationName.style.width = '30px';
    //         thLocationName.innerText = menueLocation.location;
    //         targetHead.appendChild(thLocationName);
    //         lastname = menueLocation.location;
    //     }

    // }
    let thTotal = document.createElement('th');
    thTotal.style.width = '25px';
    thTotal.innerText = '#Gesamt';
    targetHead.appendChild(thTotal);

    for (let menue of menueList) {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let btnCollapse = document.createElement('button');
        btnCollapse.classList = 'btn btn-link';
        btnCollapse.setAttribute('data-target', '#collapse' + menue.menueid);
        btnCollapse.setAttribute('data-toggle', 'collapse');
        btnCollapse.setAttribute('aria-expanded', 'false');
        btnCollapse.setAttribute('aria-controls', 'collapse' + menue.menueid);
        btnCollapse.style.textAlign = 'left';
        btnCollapse.innerText = `Menü ${menue.titel}`;
        let collapse = document.createElement('div');
        collapse.classList = 'collapse';
        collapse.id = 'collapse' + menue.menueid;
        for (let x = 0; x < menue.detaillist.length; x++) {
            let p = document.createElement('p');
            p.innerText = `${menue.detaillist[x].description}`;
            collapse.appendChild(p);
        }
        tdName.append(btnCollapse, collapse);
        tr.appendChild(tdName);
        let count = 0;
        for (let i = 0; i < locations.length; i++) {
            let tdCount = document.createElement('td');
            tdCount.id = menue.menueid + locations[i].name;
            tdCount.style.textAlign = "center";
            tdCount.innerText = '0';
            tr.appendChild(tdCount);
        }
        target.appendChild(tr);
        for (let menueLocation of LocationCount) {
            if (menueLocation.menueid === menue.menueid) {
                let td = document.getElementById(menueLocation.menueid + menueLocation.location);
                td.innerText = menueLocation.count;
                count += menueLocation.count;
            }
        }
        let tdTotalCount = document.createElement('td');

        tdTotalCount.innerText = count;
        tr.appendChild(tdTotalCount);



    }
}

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