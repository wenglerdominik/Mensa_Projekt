import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
document.addEventListener('DOMContentLoaded', () => {

})

const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const lblState = document.getElementById('lblState');
console.log(today);
let lastMonth;
let lastYear;
if (sessionStorage.getItem('lastmonth')) currentMonth = parseInt(sessionStorage.getItem('lastmonth'));
if (sessionStorage.getItem('lastyear')) currentYear = parseInt(sessionStorage.getItem('lastyear'));


//#region Erzeuge Kalender
createTable(currentYear, currentMonth);

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
    lastMonth = currentMonth;
    lastYear = currentYear;
    sessionStorage.setItem('lastmonth', lastMonth);
    sessionStorage.setItem('lastyear', lastYear);
    createTable(currentYear, currentMonth);
})
document.getElementById('prevMonth').addEventListener('click', () => {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    lastMonth = currentMonth;
    lastYear = currentYear;
    sessionStorage.setItem('lastmonth', lastMonth);
    sessionStorage.setItem('lastyear', lastYear);
    createTable(currentYear, currentMonth);
})

//#region Lade Alle Menüs vom aktuellen Monat
function loadMenuesForMonth(currentYear, currentMonth) {
    request.execute({
        method: 'GET',
        url: '/menue/monthList/' + currentYear + "/" + (currentMonth + 1) + "/" + 0,
        datatype: 'json',
        successCallback: function (response) {
            //menuesMonth = response;

            //sessionStorage.setItem('menuesMonth', JSON.stringify(menuesMonth));
            createMenuesForDay(response);
            //console.log(response);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}
//#endregion



//#region zeige Menüs in den Kalendertagen an
function createMenuesForDay(menueList) {
    const calendarBody = document.getElementById('calendar-body');
    const tdDay = calendarBody.querySelectorAll('td');

    for (let i = 0; i < tdDay.length; i++) {
        let set = true;
        if (tdDay[i].id) {
            const menueListDay = [];
            for (let x = 0; x < menueList.length; x++) {
                const menue = menueList[x];
                const menueDate = new Date(menue.servedate).toDateString();
                const actDay = new Date(tdDay[i].id).toDateString();
                if (menueDate === actDay) {
                    menueListDay.push(menue);

                    const ul = tdDay[i].querySelector('ul');
                    const li = document.createElement('li');
                    const count = ul.childElementCount + 1;
                    li.classList = "menu-icon-td"
                    // li.innerText = 'Menü: ' + count;
                    li.innerText = menue.titel;
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
                        tdDay[i].classList.add('small');
                        set = false;
                    }
                    ul.appendChild(li);

                    $(tdDay[i]).data('menue', menueListDay);
                    //console.log(tdDay[i], menueListDay);
                }

            }

        }

    }
}
//#endregion 


//#region get clicked Element in Calendar
//if element is li => open Menuedetail, if Element is td open Modal Menue
$("#Calendar").on("click", 'td', function (event) {
    const sender = $(event.target);
    const element = sender[0];
    let date;

    if (element.className === 'days inactive') return;
    else if (element.tagName === 'TD') {
        // const date = new Date(element.id);
        date = new Date(element.id);
        if (date <= today) {
            //return;
            $('#modalError').modal();
        }
        else {
            $('#modalMenue').data('sender', element);
            $('#modalMenue').modal();
        }

    }
    else if (element.tagName === 'LI') {

        //const date = new Date(element.offsetParent.id);
        date = new Date(element.offsetParent.id);
        if (date <= today) {
            const menue = $(element).data('menue');
            sessionStorage.setItem('menueDate', date);
            sessionStorage.setItem('menueId', menue.menueid);
            sessionStorage.setItem('menueName', element.innerText);

            window.open('menueDetail.html', '_self');
        }
        else {
            date = element.offsetParent.id;
            //const id = JSON.stringify(menue.menueid);
            sessionStorage.setItem('menueDate', date);
            let menues = $(element.offsetParent).data('menue');
            let selMenue = $(element).data('menue');
            showMenueDetails(menues, selMenue);
        }

    }

});
//#endregion
let menues;
$('#modalMenue').on("click", 'td', (event) => {
    if (event.target.className !== 'menu-icon-modal') return;
    let sender = $(event.delegateTarget).data('sender');
    let menues = $(sender).data('menue');
    let selMenue = $(event.target).data('menue');
    showMenueDetails(menues, selMenue);
});   //Klick Event Modal auf Menüitem

function showMenueDetails(menues, selMenue) {
    const sender = $(event.target);
    const element = sender[0];
    //
    // if (element.tagName === 'LI') {
    //     const menue = $(element).data('menue');
    //     sessionStorage.setItem('menueId', menue.menueid);
    //     sessionStorage.setItem('menueName', element.innerText);

    //     window.open('menueDetail.html', '_self');

    // }

    //let x = sender[0].offsetParent;
    // let selMenue = $(sender[0]).data('menue');
    //menues = $(x).data('menue');
    sessionStorage.setItem('menuesEdit', JSON.stringify(menues));
    sessionStorage.setItem('selMenue', JSON.stringify(selMenue));
    //window.open('newMenue2.html', '_self')
    window.open('editMenues.html', '_self')
}

//#region Open Modal

$('#modalMenue').on('show.bs.modal', (event) => {
    lblState.innerText = '';
    const btnNewMenue = document.querySelector('#btnNewMenue');
    const btnEditMenue = document.querySelector('#btnEditMenue');

    const sender = $('#modalMenue').data('sender');
    const date = new Date(sender.id);
    const day = date.getDay();
    menues = $(sender).data('menue');
    const target = document.querySelector('#tableBodyModal');
    sessionStorage.setItem('menueDate', date);
    let lock = false;
    if (date <= today) lock = true;
    if (lock) {
        btnEditMenue.style.display = 'none';
        btnNewMenue.style.display = 'none';
    }
    else if (menues) {
        btnEditMenue.style.display = 'inline';
        btnNewMenue.style.display = 'none';
    }
    else {
        btnEditMenue.style.display = 'none';
        btnNewMenue.style.display = 'inline';
    }
    target.innerHTML = ''
    document.querySelector('#modalHeader').innerText = `${days[day]},  ${date.toLocaleDateString()}`;
    document.querySelector('#checkBoxAll').checked = false;
    if (!menues) {
        document.querySelector('#tableHeadModal').style.visibility = 'hidden';
        document.querySelector('#btnDelete').style.visibility = 'hidden';
    }
    else {
        if (!lock) document.querySelector('#btnDelete').style.visibility = 'visible';
        document.querySelector('#tableHeadModal').style.visibility = 'visible';
        for (let i = 0; i < menues.length; i++) {
            const tr = document.createElement('tr');
            const tdLi = document.createElement('td');
            tdLi.classList = 'modal-li';
            const tdCheck = document.createElement('td');
            tdCheck.classList = 'modal-check'
            const li = document.createElement('li');
            const div = document.createElement('div');
            const check = document.createElement('input');

            //set attributes
            li.classList = "menu-icon-modal"
            div.classList = 'form-check';
            check.classList = 'form-check-input';
            //$(check).data('menueid', menues[i].menueid);
            $(check).data('menue', menues[i]);
            check.type = 'checkbox';
            check.id = 'delMenue'
            check.addEventListener('change', statusCheckBox);
            //li.innerText = `Menü ${i + 1}`;
            li.innerText = menues[i].titel;

            $(li).data('menue', menues[i]);
            $(li).data('menueNo', i + 1);
            switch (menues[i].type) {
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
            //append Elements
            tdLi.appendChild(li);
            tdCheck.appendChild(check);
            tr.append(tdLi, tdCheck);
            target.appendChild(tr);
        }
    }

})
//#endregion

document.querySelector('#btnDelete').addEventListener('click', () => {
    const inputElements = document.querySelectorAll('#delMenue');
    let menueToDelete = [];
    for (let checkbox of inputElements) {
        if (checkbox.checked) {
            //menueToDelete.push($(checkbox).data('menueid'));
            menueToDelete.push($(checkbox).data('menue'));
        }

    }
    deleteMenueDetails(menueToDelete);
})
function statusCheckBox() {
    const inputElements = document.querySelectorAll('.form-check-input');
    let status;
    const btn = document.querySelector('#btnDelete')

    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].checked) {
            status = false;
            break;
        }
        else status = true;
    }
    btn.disabled = status;
}

$('#checkBoxAll').on('click', () => {
    const inputElements = document.querySelectorAll('#delMenue');
    const status = document.querySelector('#checkBoxAll').checked;
    for (let element of inputElements) {
        element.checked = (status) ? true : false;
    }
    statusCheckBox();
})


function deleteMenueDetails(menues) {
    let menuesToDelete = [];

    for (let i = 0; i < menues.length; i++) {
        menuesToDelete.push({
            menuedetailid: null,
            menueid: parseInt(menues[i].menueid),
            productid: null
        })
    }


    request.execute
        ({
            method: 'DELETE',
            url: '/menueDetail',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(menuesToDelete),
            successCallback: function (response) {

                console.log(response);

                if (response) {
                    // alert("MenüDetail löschen erfolgreich");


                }
                else if (response.status == 304) deleteMenue(menuesToDelete);
                else alert('Fehler beim löschen');
                deleteMenue(menues);
            },
            errorCallback: function (s, t) {
                lblState.innerText = 'Fehler beim Löschen. Versuchen Sie es erneut';
                lblState.style.color = 'red';
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

}

function deleteMenue(menues) {
    let menuesToDelete = [];

    for (let i = 0; i < menues.length; i++) {
        menuesToDelete.push({
            menueid: menues[i].menueid,
            servedate: menues[i].servedate,
            type: null,
            titel: menues[i].titel,
        })
    }

    request.execute
        ({
            method: 'DELETE',
            url: '/menue',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(menuesToDelete),
            successCallback: function (response) {

                console.log(response);

                if (response) {
                    // alert("Menü löschen erfolgreich");
                    $('#btnCancel').click();

                }
                else alert('Fehler beim löschen');
                createTable(currentYear, currentMonth); //aktualisere Ansicht
            },
            errorCallback: function (s, t) {
                lblState.innerText = 'Fehler beim Löschen. Versuchen Sie es erneut';
                lblState.style.color = 'red';
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

}

document.getElementById('btnNewMenue').addEventListener('click', function () {
    let count = document.querySelector('#tableBodyModal').childElementCount
    sessionStorage.setItem('menueNo', count + 1);
    sessionStorage.setItem('menuesEdit', '');
    sessionStorage.setItem('selMenue', '');
    //window.open('newMenue2.html', '_self')
    window.open('editMenues.html', '_self')

})
document.getElementById('btnEditMenue').addEventListener('click', function () {
    sessionStorage.setItem('menuesEdit', JSON.stringify(menues));
    //window.open('newMenue2.html', '_self')
    window.open('editMenues.html', '_self')

})


