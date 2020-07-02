
import WifiRequest from './wifiRequest.js';
import Message from './message.js';
let userid = JSON.parse(sessionStorage.getItem('user')).userid;



let request = new WifiRequest();
console.clear();
const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let orderedMenues = [];
let menuesMonth = [];
import Calender from "../../Class_Calender.js";
//import { currentYear, currentMonth } from "../../Class_Calender.js";
let calender = new Calender();
const target = document.querySelector('#containerCalender');
//calender.createCalender(target);
//loadMenuesForMonth()

document.addEventListener('DOMContentLoaded', () => {
    createTable(currentYear, currentMonth);
})

$('body').on("click", function (event) {
    const sender = $(event.target);
    const element = sender[0];
    let date;

    if (element.className === 'days inactive') return;
    else if (element.tagName === 'TD') {
        const selectedDate = new Date(element.id);
        const date = selectedDate.toDateString();
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();
        // window.open(`day.html?date=${year}-${month}-${day}`, '_self')
        window.open(`day.html?date=${date}`, '_self')

    }
    else if (element.className === 'menu-icon-td-app') {
        const selectedDate = new Date(element.offsetParent.id);
        const date = selectedDate.toDateString();
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();
        // window.open(`day.html?date=${year}-${month}-${day}`, '_self')
        window.open(`day.html?date=${date}`, '_self')

    }

});

function loadMenuesForMonth(currentYear, currentMonth) {
    request.execute({
        method: 'GET',
        url: '/menue/monthList/' + currentYear + "/" + (currentMonth + 1) + "/" + 0,
        datatype: 'json',
        successCallback: function (response) {
            menuesMonth = response;
            //createMenuesForDay(response);
            loadOrderedMenuForUser(currentYear, currentMonth);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}
//loadOrderedMenuForUser(currentYear, currentMonth);
function loadOrderedMenuForUser(currentYear, currentMonth) {
    let id = JSON.parse(sessionStorage.getItem('user')).userid;
    request.execute({
        method: 'GET',
        url: '/order/' + currentYear + "/" + (currentMonth + 1) + "/" + 0 + "/" + id,
        datatype: 'json',
        successCallback: function (response) {
            orderedMenues = response;
            createMenuesForDay(menuesMonth, orderedMenues);
            Message(userid);

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}

function createMenuesForDay(menuesMonth, orderedMenues) {
    const calendarBody = document.getElementById('calendar-body');
    const tdDay = calendarBody.querySelectorAll('td');

    for (let i = 0; i < tdDay.length; i++) {
        let set = true;
        if (tdDay[i].id) {
            const menueListDay = [];
            for (let x = 0; x < menuesMonth.length; x++) {
                const menue = menuesMonth[x];
                const menueDate = new Date(menue.servedate).toDateString();
                const actDay = new Date(tdDay[i].id).toDateString();
                if (menueDate === actDay) {
                    menueListDay.push(menue);

                    const ul = tdDay[i].querySelector('ul');
                    const li = document.createElement('li');
                    const count = ul.childElementCount + 1;
                    li.classList = "menu-icon-td-app"
                    li.innerText = 'Menü ' + menue.titel;
                    $(li).data('menue', menue);
                    $(li).data('menueNo', count);
                    switch (menue.type) {
                        case 3:
                            li.style.backgroundColor = 'darkred';
                            break;
                        case 4:
                            li.style.backgroundColor = 'green';
                            break;
                        case 5:
                            li.style.backgroundColor = 'goldenrod';
                            li.style.color = 'black';
                            li.style.fontWeight = '700';
                            break;
                        default:
                    }
                    if (set === true) {
                        for (let x = 0; x < orderedMenues.length; x++) {
                            if (menue.menueid === orderedMenues[x].menueid) {
                                tdDay[i].classList.add('ordered');
                                set = false;

                            }
                        }
                    }
                    ul.appendChild(li);

                    $(tdDay[i]).data('menue', menueListDay);
                    //console.log(tdDay[i], menueListDay);
                }

            }

        }

    }
}




function createTable(currentYear, currentMonth, orderedMenues) {

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
        tr.classList = 'tr-calendar'
        for (let tdCount = 0; tdCount < 5; tdCount++) {
            let dayOfWeek = new Date(currentYear, currentMonth, dayCounter).getDay();
            let date = new Date(currentYear, currentMonth, dayCounter).toString();
            const td = document.createElement('td');
            td.classList = 'days active'
            //td.setAttribute('data-target', 'modalMenue');
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
                if (dayCounter === today.getDate() && currentMonth === today.getMonth()) {
                    td.style.color = 'red';
                }
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
    loadMenuesForMonth(currentYear, currentMonth);

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




