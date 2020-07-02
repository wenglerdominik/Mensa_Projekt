import WifiRequest from './wifiRequest.js';
import Message from './message.js';
let userid = JSON.parse(sessionStorage.getItem('user')).userid;
let request = new WifiRequest();

const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']

//import Calender from "../../Class_Calender.js";
//import { currentYear, currentMonth } from "../../Class_Calender.js";
//let calender = new Calender();


let parameters = new URLSearchParams(window.location.search);
let date = new Date(parameters.get('date'));
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let currentDay = date.getDate();
let today = new Date();
let daysInMonth;
let dayOfWeek;
let actDate;
day(currentYear, currentMonth, currentDay);


function day(currentYear, currentMonth, currentDay) {
    actDate = new Date(currentYear, currentMonth, currentDay);
    dayOfWeek = actDate.getDay();
    let firstday = new Date(currentYear, currentMonth).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) console.log('weekend');
    const getdDaysInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    daysInMonth = getdDaysInMonth(new Date(currentYear, currentMonth));

    const calenderHead = document.querySelector('#calendar-head-day');


    console.log(actDate, days[dayOfWeek]);
    // calenderBody.innerHTML = '';
    calenderHead.innerHTML = '';
    //calenderTableHead.innerHTML = '';
    let br = document.createElement('br');
    calenderHead.innerHTML = days[dayOfWeek];
    calenderHead.append(br, `${currentDay}.${currentMonth + 1}.${currentYear}`);
    loadMenuesForDay();
}

document.getElementById('nextDay').addEventListener('click', nextDay);
function nextDay() {
    if (currentDay === daysInMonth) {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
        currentDay = 1;
    }
    else currentDay += 1;
    actDate = new Date(currentYear, currentMonth, currentDay);
    let x = actDate.getDay();
    if (x === 6 || x === 0) nextDay();
    window.open(`day.html?date=${actDate.toDateString()}`, '_self');
    //window.open(`day.html?date=${date}`, '_self')
    //history.pushState(null, '', `/wifi.mensa/customer/day.html?date=${actDate.toDateString()}`);
    day(currentYear, currentMonth, currentDay);
};

document.getElementById('prevDay').addEventListener('click', prevDay);
function prevDay() {
    if (currentDay === 1) {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;

        const getdDaysInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        currentDay = getdDaysInMonth(new Date(currentYear, currentMonth));
    }
    else currentDay -= 1;
    actDate = new Date(currentYear, currentMonth, currentDay);
    let x = actDate.getDay();
    if (x === 6 || x === 0) prevDay();
    window.open(`day.html?date=${actDate.toDateString()}`, '_self');
    //history.pushState(null, '', `/wifi.mensa/customer/day.html?date=${actDate.toDateString()}`);
    day(currentYear, currentMonth, currentDay);
    //currentDay = (currentDay - 1 < 1) ?  : currentDay - 1;
}
//Lade Menüs für den Tag
let menuesDay = [];
function loadMenuesForDay() {

    request.execute({
        method: 'GET',
        url: '/menue/menuedetail/' + currentYear + "/" + (currentMonth + 1) + "/" + currentDay,
        datatype: 'json',
        successCallback: function (response) {
            console.log(response);
            menuesDay = response;
            loadOrderedMenuForUser(currentYear, currentMonth, currentDay);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}
let orderedMenue;
function loadOrderedMenuForUser(currentYear, currentMonth, currentDay) {
    let id = JSON.parse(sessionStorage.getItem('user')).userid;
    request.execute({
        method: 'GET',
        url: '/order/' + currentYear + "/" + (currentMonth + 1) + "/" + currentDay + "/" + id,
        datatype: 'json',
        successCallback: function (response) {
            orderedMenue = response;
            createMenueCards(menuesDay, orderedMenue);
            Message(userid);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}

function createMenueCards(menueList, orderedMenueList) {
    console.log(orderedMenue);
    const calenderBody = document.querySelector('#calendar-body');
    calenderBody.innerHTML = '';
    const row = document.createElement('div');

    //const button = ` <button id="btnOrder" type=" button" class="btn btn-success float-right">Bestellen</button>`;
    row.classList = 'row';
    calenderBody.appendChild(row);
    for (let menue of menueList) {
        let buttonOrder = document.createElement('button');
        buttonOrder.id = 'btnOrder';
        buttonOrder.type = 'button';
        buttonOrder.classList = 'btn btn-success mx-auto pt-0 pb-0';
        let spanicon = document.createElement('span');
        spanicon.classList = 'mdi mdi-cart pr-3 pl-1';
        spanicon.style.fontSize = '1.8rem';
        spanicon.style.verticalAlign = 'middle';
        buttonOrder.appendChild(spanicon);
        let count = document.querySelector('#calendar-body .row').childElementCount;
        console.log(count);

        let col = document.createElement('div');
        col.classList = 'col-12 col-md-4 mt-2';
        let card = document.createElement('div');
        card.classList = 'card';
        card.id = menue.menueid;
        let cardHeader = document.createElement('div');
        if (menue.menuetypename === 'Vegan') cardHeader.classList = 'card-header h5 header-green';
        else if (menue.menuetypename === 'Normal') cardHeader.classList = 'card-header h5 header-red';
        else if (menue.menuetypename === 'Süßspeise') cardHeader.classList = 'card-header h5 header-yellow';

        let image = document.createElement('img');
        image.classList = 'card-img-top';

        let cardBody = document.createElement('div');
        cardBody.classList = 'card-body';
        let cardFooter = document.createElement('div');
        cardFooter.classList = 'card-footer text-center';


        cardHeader.innerText = menue.titel;
        let menueprice = 0;
        let menuecalorie = 0;
        for (let product of menue.detaillist) {

            if (product.producttypename === 'Normal' || product.producttypename === 'Süßspeise' || product.producttypename === 'Vegan') {
                if (product.image) {
                    image.setAttribute('src', '.' + product.image);
                    card.appendChild(image);
                }
            }

            let title = document.createElement('h6');
            title.classList = 'card-title';
            let content = document.createElement('p');
            const hr = document.createElement('hr');
            content.classList = 'card-text';
            title.innerText = product.name;
            content.innerText = product.description;
            // cardBody.append(title, content, hr);

            //cardBody.append(title, content);
            cardBody.append(content);
            menueprice += product.price;
            menuecalorie += product.calorie;
        }
        buttonOrder.appendChild(spanicon);
        buttonOrder.innerHTML += ` ${menueprice.toFixed(2)} € / ${menuecalorie} kCal`;

        if (orderedMenueList.length > 0) {
            for (let orderedMenue of orderedMenueList) {
                if (menue.menueid === orderedMenue.menueid) {
                    if (orderedMenue.consumed === true) {
                        cardFooter.innerHTML = `<span class="mdi mdi-check-circle" style="color:green; font-size:2.2rem"></span>
                        <span style="color:green; font-size:1.2rem; vertical-align:super">Menü konsumiert</span>`;
                        cardFooter.classList.add('p-0');
                    }
                    else {
                        cardFooter.innerHTML = `<span class="mdi mdi-calendar-check" style="color:green; font-size:2.2rem"></span>
                        <span style="color:green; font-size:1.2rem; vertical-align:super">Menü bestellt</span>`;
                        cardFooter.classList.add('p-0');
                    }
                }
                else if (date.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0) && cardFooter.childElementCount === 0) cardFooter.appendChild(buttonOrder);
            }
        }
        else if (date.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)) cardFooter.appendChild(buttonOrder);

        cardFooter.id = menue.menueid;
        card.append(cardHeader, cardBody, cardFooter);

        col.appendChild(card);
        row.append(col);

    }
}
let selectedMenue = [];
document.addEventListener('click', (event) => {
    let sender = event.target;

    if (sender.id === 'btnOrder') {
        selectedMenue = menuesDay.filter(y => y.menueid == sender.parentElement.id);

        console.log(sender.parentElement.id);
        console.log(selectedMenue);
        sessionStorage.setItem('orderMenue', JSON.stringify(selectedMenue));
        window.open('order.html', '_self');
    }

})

document.querySelector('#btnBackToMonth').addEventListener('click', () => {
    window.open('../customer/month.html', '_self');
})

