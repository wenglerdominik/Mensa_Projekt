
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

let userid;

document.addEventListener('DOMContentLoaded', () => {
    userid = JSON.parse(sessionStorage.getItem('user')).userid;
    if (window.location.pathname.includes('message.html')) {
        getNewMessages(userid);
    }
});



function getNewMessages(userid) {
    console.log('getmessages');
    request.execute({
        method: 'GET',
        url: '/notification/' + userid,
        datatype: 'json',
        successCallback: function (response) {
            console.log(response);
            document.getElementById('notificationcount').innerText = response.length;
            if (response.length > 0 && window.location.pathname.includes('message.html')) {

                createMessage(response);
            }
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    });
}

export default getNewMessages;

let buttons;

let target = document.querySelector('#messageContainer');
function createMessage(messages) {
    console.log('loadmessage');
    target.innerHTML = '';
    for (let message of messages) {
        let row = document.createElement('div');
        row.classList = 'row message';
        row.id = message.notificationid;
        let div1 = document.createElement('div');
        div1.classList = 'col-4';
        let date = new Date(message.messagedate);
        div1.innerText = date.toLocaleDateString();
        let div2 = document.createElement('div');
        div2.classList = 'col-12';
        div2.innerText = message.text;
        let div3 = document.createElement('div');
        div3.classList = 'col-12 text-center';
        let button = document.createElement('button');
        button.classList = 'btn btn-outline-info';
        button.innerText = 'Als gelesen markieren';
        //button.id = message.notificationid;
        button.addEventListener('click', markRead);
        div3.appendChild(button);
        row.append(div1, div2, div3);
        target.appendChild(row);

    }
    buttons = document.getElementsByTagName('button');
    console.log(buttons);
}
function markRead(event) {
    let messageid = event.target.parentElement.parentElement.id;


    request.execute({
        method: 'POST',
        url: '/notification/' + messageid,
        contentHeader: 'application/json; charset=utf-8',
        successCallback: function (resp) {
            target.removeChild(document.getElementById(messageid));
            getNewMessages(userid);
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    });
}