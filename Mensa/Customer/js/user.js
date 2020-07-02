
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

//Register new User
// if (window.location.pathname === "/wifi.mensa/customer/index.html") {
//     document.getElementById('buttonRegister').addEventListener('click', () => {
//         window.open('register.html', '_self');
//     })
// }
document.getElementById('buttonRegister').addEventListener('click', () => {
    window.open('register.html', '_self');
})

////////////////////
//0...Kunde
//1...Lieferant
//2...Ausgabe normal
//3...Admin
//4...Ausgabe Admin

//User Login
// document.getElementById('buttonLoginClick').addEventListener('click', () => {
//     let nickname = document.getElementById('textNickname').value;
//     let password = document.getElementById('textPassword').value;

//     request.execute({
//         method: 'GET',
//         url: '/user/login/' + nickname + '?password=' + password,
//         datatype: 'json',
//         successCallback: function (response) {
//             if (response) {
//                 sessionStorage.setItem('user', JSON.stringify(response));
//                 if (response.role === 0) {
//                     if (window.location.pathname === '/wifi.mensa/index.html') {
//                         alert('Keine Berechtigung für Kunden! \nSie werden zur Kundenapp weitergeleitet');
//                         window.open('./Customer/index.html', '_self')
//                         console.log(window.location.pathname);
//                     }
//                     else window.open('./month.html', '_self');

//                 }
//                 else if (response.role === 1) window.open('calendar.html', '_self');
//                 else if (response.role === 2) window.open('orderView.html', '_self');
//                 else if (response.role === 3) window.open('settingsUser.html', '_self');
//                 else if (response.role === 4) window.open('orderView.html', '_self');
//             }
//             else alert('Benutzername/Passwort nicht gefunden');
//         },
//         errorCallback: function (s, t) {
//             console.log('fehler');
//             console.error(s + ': ' + t);
//         }

//     })

// });



document.getElementById('buttonLoginClick').addEventListener('click', () => {
    let nickname = document.getElementById('textNickname').value;
    let password = document.getElementById('textPassword').value;
    let loginObject = {
        nickname: nickname,
        password: password
    }
    let json = JSON.stringify(loginObject);
    //if Browser is offline
    if (!navigator.onLine) {
        let p = document.getElementById('pLoginFailed');
        p.innerText = 'Sie sind offline !';
    }
    request.execute({
        method: 'POST',
        url: '/user/login',
        contentHeader: 'application/json; charset=utf-8',
        data: JSON.stringify(loginObject),
        successCallback: function (resp) {
            if (resp) {
                let response = JSON.parse(resp);
                sessionStorage.setItem('user', JSON.stringify(response));
                if (response.role === 0) {
                    // if (window.location.pathname === '/wifi.mensa/index.html') {
                    //     //alert('Keine Berechtigung für Kunden! \nSie werden zur Kundenapp weitergeleitet');
                    //     window.open('./Customer/index.html', '_self')
                    //     console.log(window.location.pathname);
                    // }
                    window.open('./month.html', '_self');

                }
                else {

                    alert('Sie sind kein Kunde! \nSie werden zum Verwaltungssystem weitergeleitet');
                    window.open('../../wifi.mensa/index.html', '_self')
                    console.log(window.location.pathname);

                }
                // else if (response.role === 1) window.open('calendar.html', '_self');
                // else if (response.role === 2) window.open('orderView.html', '_self');
                // else if (response.role === 3) window.open('settingsUser.html', '_self');
                // else if (response.role === 4) window.open('orderView.html', '_self');
            }
            else document.getElementById('pLoginFailed').innerText = 'Benutzername oder Passwort falsch!';
        },
        errorCallback: function (s, t) {
            console.log('fehler');
            console.error(s + ': ' + t);
        }

    })

});
const inputs = document.querySelectorAll('input');
const emptyInput = [];
$(inputs).on('input', () => {

    checkEmptyField();

})
function checkEmptyField() {
    let buttonLogin = document.getElementById('buttonLoginClick')
    emptyInput.length = 0;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            if (inputs[i].id !== 'upload') emptyInput.push(i);
        }
    }
    console.log(emptyInput.length);
    if (emptyInput.length === 0) {
        buttonLogin.disabled = false;
        //label.innerHTML = 'Bereit zum Registrieren' + iconOK;;
        // label.style.color = 'green'
    }
    else if (emptyInput.length > 0) {
        buttonLogin.disabled = true;
        //label.innerText = 'Füllen Sie alle Felder aus';
        // label.style.color = 'black'

    }
}

