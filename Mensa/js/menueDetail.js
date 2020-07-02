
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
let menueDetail = [];
let products = [];
let menueSelected = JSON.parse(sessionStorage.getItem('menueDetail'));
let menueid = sessionStorage.getItem('menueId');

document.getElementById('menueTitle').innerHTML = 'Menü ' + sessionStorage.getItem('menueName');
let datestring = sessionStorage.getItem('menueDate');
let date = new Date(datestring);
let day = date.getDay();
document.getElementById('date').innerHTML = days[day] + ', ' + date.toLocaleDateString();

loadProductsofMenue();

function loadProductsofMenue() {
    let tbody = document.getElementById('tableBody');
    let price = 0.00;
    let cal = 0;

    request.execute({
        method: 'GET',
        url: '/product/menueDetail/' + menueid,
        datatype: 'json',

        successCallback: function (response) {
            products = response;

            for (let product of response) {
                let tr = document.createElement('tr');
                let th = document.createElement('th');

                let tdName = document.createElement('td');
                let tdDesc = document.createElement('td');
                let tdCal = document.createElement('td');
                let tdPrice = document.createElement('td');
                tr.appendChild(th);
                tr.appendChild(tdName);
                tr.appendChild(tdDesc);
                tr.appendChild(tdCal);
                tr.appendChild(tdPrice);
                th.innerHTML = tbody.childElementCount + 1;
                tdName.innerHTML = product.name;
                tdDesc.innerHTML = product.description;
                tdCal.innerHTML = product.calorie;
                tdPrice.innerHTML = (product.price).toFixed(2);
                tbody.appendChild(tr);
                price += product.price;
                cal += product.calorie;
            }
            document.getElementById('totalCost').innerHTML = price.toFixed(2) + ' €';
            document.getElementById('totalCal').innerHTML = cal + ' kCal';

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })

}
