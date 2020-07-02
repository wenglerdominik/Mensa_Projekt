
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
const emptyInput = [];
const label = document.getElementById('lblState');
const inputs = document.querySelectorAll('input');
const buttonReg = document.querySelector('#buttonRegUserClick')
const lblState = document.getElementById('lblState');
document.getElementById('btnCancel').addEventListener('click', () => {
    window.open('index.html', '_self');
})


document.getElementById('buttonRegUserClick').addEventListener('click', () => {

    let saveOK = true;

    if (!document.getElementById('textPasswordReg').value) {
        saveOK = false;
    }
    if (document.getElementById('textPasswordReg').value != document.getElementById('textPasswordReg2').value) {
        saveOK = false;
    }

    if (saveOK) {

        let user = {
            userid: null,
            usernumber: null,
            lastname: document.getElementById('textLastName').value,
            firstname: document.getElementById('textFirstName').value,
            nickname: document.getElementById('textNicknameReg').value,
            passwordclear: document.getElementById('textPasswordReg').value,
            role: 0,
            deleted: false,
        }
        //if Browser is offline
        if (!navigator.onLine) {
            lblState.style.color = 'red';
            lblState.innerText = 'Sie sind offline !';
        }
        //check if username exists, if ok --> register, else show error

        request.execute({
            method: 'GET',
            url: '/user/' + user.nickname,
            datatype: 'json',

            successCallback: function (response) {
                console.log(response);
                if (!response) registerUser(user);
                else {
                    lblState.innerText = 'Benutzername bereits vergeben';
                    lblState.style.color = 'red';
                    document.getElementById('textNicknameReg').style.borderColor = 'red';
                }
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);

            }

        })
    }

});

function registerUser(user) {

    request.execute({
        method: 'POST',
        url: '/user',
        contentHeader: 'application/json; charset=utf-8',
        data: JSON.stringify(user),
        successCallback: function (resp) {
            let response = JSON.parse(resp);
            console.log(response);

            if (response) {
                //alert("Registrieren erfolgreich");
                sessionStorage.setItem('user', JSON.stringify(response.user));
                if (response.user.role === 0) window.open('../Customer/month.html', '_self');
            }
            // else alert('Fehler beim Speichern');
            else lblState.innerText = 'Fehler beim Registrieren. Versuchen Sie es erneut'
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    });
}



$(inputs).on('input', () => {

    checkEmptyField();

})
function checkEmptyField() {
    emptyInput.length = 0;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            if (inputs[i].id !== 'upload') emptyInput.push(i);
        }
    }
    console.log(emptyInput.length);
    if (emptyInput.length === 0) {
        buttonReg.disabled = false;
        //label.innerHTML = 'Bereit zum Registrieren' + iconOK;;
        // label.style.color = 'green'
    }
    else if (emptyInput.length > 0) {
        buttonReg.disabled = true;
        //label.innerText = 'Füllen Sie alle Felder aus';
        // label.style.color = 'black'

    }
}
const p1 = document.querySelector('#textPasswordReg');
const p2 = document.querySelector('#textPasswordReg2');
const iconOK = `<span class="mdi mdi-check-circle-outline"></span>`
const iconNOK = `<span class="mdi mdi-alert-circle-outline"></span>`
$(p2).on('input', function () {
    checkPassword(p1, p2)
})
$(p1).on('input', function () {
    checkPassword(p1, p2)
})
function checkPassword(p1, p2) {
    //Collapse deaktiveren wenn PW eingegeben
    const lbl = document.querySelector('#lblStatePW');

    //Check if PW ok, dann freigabe Speichern
    if (p1.value === '' && p2.value === '') {
        // lbl.innerHTML = 'Bitte Kennwort vergeben'
        lbl.style.color = 'black';
        lbl.style.fontSize = '1rem';
        buttonReg.disabled = true;
        p1.style.borderColor = 'none';
        p2.style.borderColor = 'none';
    }
    else if (p1.value === p2.value) {
        lbl.innerHTML = 'Passwörter stimmen überein' + iconOK;
        lbl.style.color = 'green';
        p1.style.borderColor = 'green';
        p2.style.borderColor = 'green';
        if (emptyInput === 0) buttonReg.disabled = false;

    }
    else {
        lbl.innerHTML = 'Passwörter stimmen nicht überein ' + iconNOK;
        lbl.style.color = 'red';
        buttonReg.disabled = true;
        p1.style.borderColor = 'red';
        p2.style.borderColor = 'red';
    }


}