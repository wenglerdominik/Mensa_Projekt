import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

let roles = ['Kunde', 'Lieferant', 'Ausgabestelle', 'Systemadmin', 'Ausgabestelle Admin']
const p1 = document.querySelector('#password1');
const p2 = document.querySelector('#password2');

document.addEventListener('DOMContentLoaded', () => {
    loadUser();

})


function loadUser() {

    //let table = document.getElementById('tbody');

    // table.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/user',
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);
            initTableUser(response);
            //#region  old Table
            // for (let user of response) {

            //     let tr = document.createElement('tr');
            //     let tdUserNumber = document.createElement('td');
            //     let tdLastName = document.createElement('td');
            //     let tdFirstName = document.createElement('td');
            //     let tdUserName = document.createElement('td');
            //     let tdRole = document.createElement('td');
            //     let tdDelete = document.createElement('td');
            //     tr.appendChild(tdUserNumber);
            //     tr.appendChild(tdLastName);
            //     tdLastName.innerHTML = name;
            //     tr.appendChild(tdFirstName);
            //     tr.appendChild(tdUserName);
            //     tr.appendChild(tdRole);
            //     tr.appendChild(tdDelete);

            //     tdUserNumber.innerHTML = user.usernumber;
            //     tdLastName.innerHTML = user.lastname;
            //     tdFirstName.innerHTML = user.firstname;
            //     tdUserName.innerHTML = user.nickname;
            //     tdRole.innerHTML = roles[user.role];

            //     tr.setAttribute('data-user', JSON.stringify(user));
            //     tr.setAttribute('data-toggle', 'modal');
            //     tr.setAttribute('data-target', '#modalEditUser');
            //     tr.setAttribute('style', 'cursor: pointer')
            //     table.appendChild(tr);
            //     $('#btnCancel').click();

            // }
            //#endregion
            //addClickEventRow();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
}
function initTableUser(users) {
    $('#tableUser').bootstrapTable('destroy').bootstrapTable({
        locale: 'de-DE',
        clickToSelect: true,
        classes: 'table table-striped',
        height: 850,
        pageList: [10, 25, 50, 100, 'all'],
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
                field: 'nickname',
                title: 'Benutzername',
                sortable: true,

            },
            {
                field: 'role',
                title: 'Berechtigung',
                sortable: true,
                formatter: roleFormatter,

            },
        ],
        data: users,
    })
}
function roleFormatter(value, row, index) {
    return roles[row.role];
}
$('#tableUser').on('click-cell.bs.table', function (e, column, arg2, object, sender, arg5) {
    $('#modalEditUser').data('user', object)
    $('#modalEditUser').modal('show');
    console.log(e, column, arg2, object, sender, arg5);
});


document.getElementById('btnSaveUser').addEventListener('click', () => {
    const user = { userid: null, usernumber: null, lastname: null, firstname: null, nickname: null, password: null, passwordclear: null, role: null, deleted: null }
    const lastname = $('#lastName').val();
    const firstname = $('#firstName').val();
    const nickname = $('#nickName').val();
    const password1 = p1.value;
    const password2 = p2.value;

    if ($('#modalEditUser').data('user') === '') {
        user.userid = null;
        user.usernumber = null;
        user.lastname = lastname
        user.firstname = firstname
        user.nickname = nickname
        user.password = null;
        user.passwordclear = p1.value;
        user.role = document.getElementById('userRole').selectedIndex;
        user.deleted = false
    }
    else {
        if (p1.value && p2.value) {
            user.passwordclear = p1.value;
            user.password = null;
        }
        else {
            user.passwordclear = null;
            user.password = $('#modalEditUser').data('user').password;
        }
        user.userid = $('#modalEditUser').data('user').userid;
        user.usernumber = parseInt($('#customerNumber').val());
        user.lastname = lastname
        user.firstname = firstname
        user.nickname = nickname
        user.role = document.getElementById('userRole').selectedIndex;
        user.deleted = false;
    }

    request.execute({
        method: 'POST',
        url: '/user',
        contentHeader: 'application/json; charset=utf-8',
        data: JSON.stringify(user),
        datatype: 'json',

        successCallback: function (response) {
            //alert('Benutzerdaten erfolgreich gespeichert')
            loadUser();
            $('#modalEditUser').modal('hide');

        },
        errorCallback: function (s, t) {
            let lblState = document.getElementById('lblState');
            lblState.innerText = 'Fehler beim Speichern. Versuchen Sie es erneut';
            lblState.style.color = 'red';
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })
})
const btn = document.querySelector('#btnSaveUser');
//#region Open Modal
$('#modalEditUser').on('show.bs.modal', (sender) => {

    $('#password1').val('');
    $('#password2').val('');
    const lblPasswordOK = document.querySelector('#lblPasswordOK');
    lblPasswordOK.innerHTML = '';
    const btnPassword = document.querySelector('#btnPassword');
    btnPassword.disabled = false;
    let userRole = document.getElementById('userRole');
    userRole.innerHTML = '';

    if ($('#modalEditUser').data('user')) {
        btn.disabled = false;
        btnPassword.style.display = 'block';
        $('#password').collapse('hide');
        document.querySelector('#modalHeader').innerText = 'Benutzerdaten ändern'

        // let row = $(sender.relatedTarget);
        let userData = $('#modalEditUser').data('user');

        for (let i = 0; i < roles.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = roles[i];
            userRole.appendChild(option);
        }
        $('#customerNumber').val(userData.usernumber);
        $('#lastName').val(userData.lastname);
        $('#firstName').val(userData.firstname);
        $('#nickName').val(userData.nickname);
        $('#userRole').val(roles[userData.role]);
        //$('#modalEditUser').data('user', userData)

        console.log($('#modalEditUser').data('user'))
    }

    else if (sender.relatedTarget.id === "btnNewUser") {

        $('#customerNumber').val('Wird vom System vergeben');
        lbl.innerHTML = 'Bitte Kennwort vergeben'
        lbl.style.fontSize = '1rem';
        lbl.style.color = 'black';
        document.querySelector('#modalHeader').innerText = 'Neuen Benutzer anlegen'
        btnPassword.style.display = 'none';
        $('#password').collapse('show');
        $('#customerNumber').val('Wird vom System vergeben');
        $('#lastName').val('');
        $('#firstName').val('');
        $('#nickName').val('');
        for (let i = 0; i < roles.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = roles[i];
            userRole.appendChild(option);
        }
        $('#modalEditUser').data('user', '')

    }

})

$('#modalEditUser').on('hidden.bs.modal', function (e) {
    $('#modalEditUser').data('user', '');
    btn.disabled = true;
    //loadUser();
})

//#region  old Modal
// $('#modalEditUser').on('show.bs.modal', (sender) => {
//     $('#password1').val('');
//     $('#password2').val('');
//     btn.disabled = true;
//     const lblPasswordOK = document.querySelector('#lblPasswordOK');
//     lblPasswordOK.innerHTML = '';
//     const btnPassword = document.querySelector('#btnPassword');
//     let userRole = document.getElementById('userRole');
//     userRole.innerHTML = '';
//     if (sender.relatedTarget.id === "btnNewUser") {
//         lbl.innerHTML = 'Bitte Kennwort vergeben'
//         lbl.style.fontSize = '1rem';
//         lbl.style.color = 'black';
//         document.querySelector('#modalHeader').innerText = 'Neuen Benutzer anlegen'
//         btnPassword.style.display = 'none';
//         $('#password').collapse('show');
//         $('#customerNumber').text('Wird vom System vergeben');
//         $('#lastName').val('');
//         $('#firstName').val('');
//         $('#nickName').val('');
//         for (let i = 0; i < roles.length; i++) {
//             let option = document.createElement('option');
//             option.innerHTML = roles[i];
//             userRole.appendChild(option);
//         }
//         $('#modalEditUser').data('user', '')

//     }
//     else if (sender.relatedTarget.nodeName === 'TR') {
//         btnPassword.style.display = 'block';
//         $('#password').collapse('hide');
//         document.querySelector('#modalHeader').innerText = 'Benutzerdaten ändern'

//         let row = $(sender.relatedTarget);
//         let userData = row.data('user');

//         for (let i = 0; i < roles.length; i++) {
//             let option = document.createElement('option');
//             option.innerHTML = roles[i];
//             userRole.appendChild(option);
//         }
//         $('#customerNumber').text(userData.usernumber);
//         $('#lastName').val(userData.lastname);
//         $('#firstName').val(userData.firstname);
//         $('#nickName').val(userData.nickname);
//         $('#userRole').val(roles[userData.role]);
//         $('#modalEditUser').data('user', userData)

//         console.log($('#modalEditUser').data('user'))
//     }



// })
//#endregion
//#endregion


//Modal Passwort Check

const lbl = document.querySelector('#lblPasswordOK')
const iconOK = `<span class="mdi mdi-check-circle-outline"></span>`
const iconNOK = `<span class="mdi mdi-alert-circle-outline"></span>`
const inputs = document.querySelectorAll('input');

let length = 0;
const emptyInput = [];
//Check if all Inputs are filled
$('#password').on('shown.bs.collapse', () => {
    checkEmptyField();
    lbl.innerHTML = 'Bitte Kennwort vergeben'
    lbl.style.fontSize = '1rem';
    lbl.style.color = 'black';
})
$('#password').on('hidden.bs.collapse', () => {
    checkEmptyField();
    lbl.innerHTML = 'Bitte Kennwort vergeben'
    lbl.style.fontSize = '1rem';
    lbl.style.color = 'black';
})
$(inputs).on('input', () => {

    checkEmptyField();

})
function checkEmptyField() {
    emptyInput.length = 0;
    if ($('#password').hasClass('show')) length = inputs.length;
    else length = inputs.length - 2;
    for (let i = 0; i < length; i++) {
        if (inputs[i].value === '') emptyInput.push(i);
    }
    console.log(emptyInput.length);
    // if ($('#password').hasClass('show')) checkPassword(p1,p2)
    if (emptyInput.length === 0) btn.disabled = false;
    else if (emptyInput.length > 0) btn.disabled = true;
}



$(p2).on('input', function () {
    checkPassword(p1, p2)
})
$(p1).on('input', function () {
    checkPassword(p1, p2)
})
function checkPassword(p1, p2) {
    //Collapse deaktiveren wenn PW eingegeben
    if (p1.value || p2.value) document.querySelector('#btnPassword').disabled = true
    else document.querySelector('#btnPassword').disabled = false
    //Check if PW ok, dann freigabe Speichern
    if (p1.value === '' && p2.value === '') {
        lbl.innerHTML = 'Bitte Kennwort vergeben'
        lbl.style.color = 'black';
        lbl.style.fontSize = '1rem';
        btn.disabled = true
    }
    else if (p1.value === p2.value) {
        lbl.innerHTML = 'Passwörter stimmen überein' + iconOK;
        lbl.style.color = 'green';
        lbl.style.fontSize = '1.2rem';
        if (emptyInput === 0) btn.disabled = false;

    }
    else {
        lbl.innerHTML = 'Passwörter stimmen nicht überein ' + iconNOK;
        lbl.style.color = 'red';
        lbl.style.fontSize = '1rem';
        btn.disabled = true;
    }


}






