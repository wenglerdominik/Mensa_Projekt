
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

let selectMonth = document.getElementById("month");
let months = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
let days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let menuesMonth = [];

function createCalendarCards(month, year) {

    let container = document.getElementById('containerCal');
    container.innerHTML = '';
    document.getElementById('actMonth').innerText = months[month] + ' ' + year;
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    document.getElementById('header').innerHTML = `
    <div class="row mb-3">
            <h5 class="col-12 text-center">Menü Übersicht</h5>
        </div>`;

    //create Cards

    let date = 1;

    for (let x = 0; x < 5; x++) {
        let row = document.createElement('div');
        row.classList = 'row mb-3';


        for (let i = 0; i < 5; i++) {
            let day = new Date(year, month, date).getDay();

            if ((i + 1) < firstDay && x == 0) {
                let col = document.createElement('div');
                col.classList = 'calendar-col';
                row.appendChild(col);
            }

            else if (day == 0 || day == 6) {
                date++;
                i--;
            }
            else if (date > daysInMonth) {
                break;
            }
            else {
                let id = createDateId(year, (month + 1), date);


                let col = document.createElement('div');
                col.classList = 'calendar-col';

                let card = document.createElement('div');
                card.classList = 'card bg-light';
                card.setAttribute('id', 'cardId_' + id);

                let cardHeader = document.createElement('div');
                cardHeader.classList = 'card-header';
                cardHeader.setAttribute('style', 'padding:0')
                //cardHeader.setAttribute('onclick', 'createMenu(this)')
                //cardHeader.setAttribute('id', id);
                //cardHeader.setAttribute('style', 'vertical-align:middle')
                //span.classList = 'mdi mdi-food mdi-input-icon';
                //span.setAttribute('style', 'font-size: 1.5rem;');
                //span.setAttribute('style', 'vertical-align: middle')

                let btn = document.createElement('button');
                btn.setAttribute('id', id);
                btn.setAttribute('type', 'button');
                btn.setAttribute('style', "padding: 0rem;");
                btn.setAttribute('onclick', 'createMenu(this)');
                btn.classList = 'btn btn-block btn-sm btn-light ';
                let span = '<span class="ml-5 mdi mdi-dots-vertical-circle-outline" style="font-size:1.5rem; vertical-align:middle"></span>'

                let cardBody = document.createElement('div');
                cardBody.classList = 'card-body';
                cardBody.classList.add('cardBody-menue')

                //cardBody.style.height = "50px";
                cardBody.setAttribute('id', 'cardBodyId_' + id);

                cardBody.innerHTML = 'Kein Menü angelegt';
                //cardHeader.innerHTML = days[day] + ', ' + date + '.' + (month + 1) + '.' + year;
                btn.innerHTML = days[day] + ', ' + date + '.' + (month + 1) + '.' + year + span;

                row.appendChild(col);
                card.appendChild(cardHeader);
                cardHeader.appendChild(btn);
                card.appendChild(cardBody);

                col.appendChild(card);
                date++;
            }
        }
        container.appendChild(row);
    }
    loadMenues(currentYear, currentMonth + 1);
}
function createDateId(year, month, day) {
    let d = (day < 10 ? '0' : '') + day;
    let m = (month < 10 ? '0' : '') + month;
    return (year + '-' + m + '-' + d);

}

document.addEventListener('DOMContentLoaded', () => {
    // loadMenues(currentYear, currentMonth + 1);

})

function loadMenues(currentYear, currentMonth) {


    request.execute({
        method: 'GET',
        url: '/menue/monthList/' + currentYear + '?month=' + currentMonth,
        datatype: 'json',

        successCallback: function (response) {
            menuesMonth = response;
            // let html = document.getElementById('productNameSel');

            for (let menue of response) {


            } //console.log('Menüs im Monat', response);
            sessionStorage.setItem('menuesMonth', JSON.stringify(menuesMonth));
            //console.log(sessionStorage.getItem('menuesMonth'));
            createMenueDayforCard();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}

createCalendarCards(currentMonth, currentYear);

document.getElementById('nextMonth').addEventListener('click', () => {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    createCalendarCards(currentMonth, currentYear);
    //loadMenues(currentYear, currentMonth + 1);
})

document.getElementById('prevMonth').addEventListener('click', () => {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    createCalendarCards(currentMonth, currentYear);
    //loadMenues(currentYear, currentMonth + 1);
})

//************************************ */
//Finde alle Cards in der Ansicht, erstelle
//für jede Card die Menübuttons         //
//************************************* */
function createMenueDayforCard() {
    let body = document.querySelectorAll('.card-body');
    //console.log(body);
    for (let i = 0; i < body.length; i++) {
        //body[i].addEventListener('click', showMenueDay);
        let date = new Date(body[i].id.replace('cardBodyId_', '')).toLocaleDateString();
        showMenueDay(body[i].id, date);
    }
    addClickEventToDelButtons();
}

//************************************ */
//Dropdown Buttons für Kalenderansicht erstellen
//
//************************************* */
function showMenueDay(id, dateCard) {
    let menueArray = [];
    let btnDelAll = document.createElement('button');

    for (let i = 0; i < menuesMonth.length; i++) {
        let serveDate = new Date(menuesMonth[i].servedate).toLocaleDateString();
        if (dateCard == serveDate) {
            let btnId = id.replace('cardBodyId_', 'btnMenuCard_');
            let headerId = id.replace('cardBodyId_', '');
            let row = document.createElement('div');
            row.classList = 'row';
            btnDelAll.setAttribute('id', 'btnDelAllMenues');
            btnDelAll.setAttribute('type', 'button');
            btnDelAll.setAttribute('style', "padding: 0.15rem;");
            btnDelAll.classList = 'btn btn-block btn-sm btn-secondary ';
            btnDelAll.innerHTML = ' Alle Menüs löschen <span class="mdi mdi-delete-circle" style="font-size:1.5rem; vertical-align:middle"></span>'
            //btnDelAll.setAttribute('data-menue', JSON.stringify(menuesMonth[i]))
            menueArray.push(menuesMonth[i]);
            let button = document.createElement('button');
            let body = document.getElementById(id);
            body.setAttribute('style', 'padding: 0.25rem')
            let count = body.childElementCount + 1;

            //Neu*************
            let btnGroup = document.createElement('div');
            btnGroup.classList = 'btn-group mb-1';
            btnGroup.setAttribute('value', JSON.stringify(menuesMonth[i]))
            btnGroup.setAttribute('style', 'display:flex');

            let divDropdown = document.createElement('div');
            divDropdown.classList = 'dropdown-menu';
            let itemDetail = document.createElement('a');
            itemDetail.classList = 'dropdown-item';
            itemDetail.setAttribute('onclick', 'showMenueDetail(this)');
            itemDetail.setAttribute('data-menue', JSON.stringify(menuesMonth[i]))
            itemDetail.setAttribute('data-menueno', count);
            itemDetail.setAttribute('data-menueDate', btnId);
            itemDetail.innerHTML = 'Menü Details'
            let itemDel = document.createElement('a');
            itemDel.classList = 'dropdown-item';
            itemDel.innerHTML = 'Menü löschen'
            itemDel.setAttribute('id', 'btnDropdownDelSingleMenue');
            itemDel.setAttribute('data-menuedel', JSON.stringify(menuesMonth[i]))
            //itemDel.setAttribute('onclick', 'test()');

            let div = document.createElement('div');
            div.classList = 'dropdown-divider';

            btnGroup.appendChild(button);
            btnGroup.appendChild(divDropdown);
            divDropdown.appendChild(itemDetail);
            divDropdown.appendChild(div);
            divDropdown.appendChild(itemDel);

            //NEU**********************

            button.setAttribute('type', 'button');
            button.setAttribute('id', btnId)
            button.setAttribute('data-toggle', 'dropdown'); //Neu
            //# button.setAttribute('onclick', 'showMenueDetail(this)');

            button.setAttribute('value', JSON.stringify(menuesMonth[i]))
            button.classList = 'btn btn-block btn-sm btn-secondary dropdown-toggle';
            //button.classList = 'btn btn-primary mt-2 mx-auto btn-sm dropdown-toggle';
            //button.innerHTML = 'Menü: '+menuesMonth[i].menuenumber;
            button.innerHTML = 'Menü: ' + count;
            switch (menuesMonth[i].type) {
                case 3:
                    button.style.backgroundColor = 'red';
                    break;
                case 4:
                    button.style.backgroundColor = 'green';
                    break;
                case 5:
                    button.style.backgroundColor = 'khaki';
                    break;
                default:
                // code block
            }
            //# row.appendChild(button);
            if (body.innerHTML == 'Kein Menü angelegt') body.innerHTML = '';
            //# body.appendChild(row);
            if (count == 1) {
                let cardFooter = document.createElement('div');
                cardFooter.appendChild(btnDelAll);
                cardFooter.classList = 'card-footer';
                cardFooter.setAttribute('style', 'padding: 0.25rem');
                document.getElementById(id.replace('cardBodyId_', 'cardId_')).appendChild(cardFooter);

            }
            body.appendChild(btnGroup);
        }
    }
    btnDelAll.setAttribute('data-menuedel', JSON.stringify(menueArray));

}

function addClickEventToDelButtons() {
    let items = document.querySelectorAll('#btnDropdownDelSingleMenue');
    let buttonDelAll = document.querySelectorAll('#btnDelAllMenues');
    //let itemdel;
    //console.log(body);
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener('click', deleteMenueDetail);

    }
    for (let x = 0; x < buttonDelAll.length; x++) {
        buttonDelAll[x].addEventListener('click', deleteMenuesDay);

    }

}
function deleteMenuesDay(sender) {

    let menues = [];
    for (const iterator of JSON.parse(sender.toElement.dataset.menuedel)) {
        let a = iterator;
        console.log(a);
        menues.push(a);
    }
    deleteMenueDetail(this, menues);
}

function deleteMenueDetail(sender, menues) {
    let selMenueDel = [];

    let delmenueId = [];
    if (sender.id == 'btnDelAllMenues') delmenueId = menues
    else {
        selMenueDel.push(JSON.parse(sender.toElement.dataset.menuedel));
        for (let i = 0; i < selMenueDel.length; i++) {
            delmenueId.push({
                menuedetailid: null,
                menueid: parseInt(selMenueDel[i].menueid),
                productid: null
            })
        }
    }

    request.execute
        ({
            method: 'DELETE',
            url: '/menueDetail',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(delmenueId),
            successCallback: function (response) {

                console.log(response);

                if (response) {
                   // alert("MenüDetail löschen erfolgreich");


                }
                else alert('Fehler beim löschen');
                deleteMenue(delmenueId);
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

}

function deleteMenue(selMenueDel) {
    let delMenue = [];
    console.log(delMenue);

    for (let i = 0; i < selMenueDel.length; i++) {
        delMenue.push({
            menueid: selMenueDel[i].menueid,
            servedate: null,
            type: null

        })
    }

    request.execute
        ({
            method: 'DELETE',
            url: '/menue',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(delMenue),
            successCallback: function (response) {

                console.log(response);

                if (response) {
                    //alert("Menü löschen erfolgreich");


                }
                else alert('Fehler beim löschen');
                createCalendarCards(currentMonth, currentYear); //aktualisere Ansicht
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

}


