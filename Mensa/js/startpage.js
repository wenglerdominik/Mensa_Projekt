
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

let locations = [];
let selectedLocation;
let role = JSON.parse(sessionStorage.getItem('user')).role;
if (role !== 1) {
    if (role === 3) {
        LoadLocation();
    }

    else if (!sessionStorage.getItem('shown-modal')) {
        LoadLocation();
    }
    else {
        selectedLocation = parseInt(sessionStorage.getItem('selectedLocation'));
        //document.querySelector('#headerLocationName').innerText = sessionStorage.getItem('selectedLocationName');
        // loadOrders(selectedLocation);
    }
}

// document.querySelector('#headerDate').innerText = 'Datum: ' + today.toLocaleDateString();


const modalBody = document.querySelector('#modalSetLocationBody');
const modal = document.querySelector('#modalSetLocation');
const buttonSetLocation = document.querySelector('#btnSetLocation');
function LoadLocation() {

    request.execute({
        method: 'GET',
        url: '/location',
        datatype: 'json',

        successCallback: function (response) {
            locations = response;
            for (let i = 0; i < locations.length; i++) {
                let formCheck = document.createElement('div');
                formCheck.classList = 'form-check';
                let input = document.createElement('input');
                input.classList = 'form-check-input';
                input.type = 'radio';
                let label = document.createElement('label');
                label.classList = 'form-check-label';
                if (i === 0) input.checked = true;
                input.id = locations[i].locationid;
                input.name = 'Locations';
                label.htmlFor = locations[i].locationid;
                input.setAttribute('data-name', locations[i].name);
                label.innerText = locations[i].name;
                input.value = locations[i].locationid;
                formCheck.append(input, label);
                modalBody.appendChild(formCheck);
                $(modal).modal();
            }
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

////////////////////
//0...Kunde
//1...Lieferant
//2...Ausgabe normal
//3...Admin
//4...Ausgabe Admin

buttonSetLocation.addEventListener('click', (event) => {


    let radios = modalBody.getElementsByTagName('input');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedLocation = radios[i].id;
            sessionStorage.setItem('selectedLocation', radios[i].id);
            sessionStorage.setItem('selectedLocationName', radios[i].getAttribute('data-name'));
            // document.querySelector('#headerLocationName').innerText = radios[i].getAttribute('data-name');
        }
    }

    $(modal).modal('hide');
    sessionStorage.setItem('shown-modal', 'true');
    if (role === 2 || role === 4) {
        let item = [{ "id": "collapseOutput" }];
        let link = document.getElementById('linkOutputOrder');
        sessionStorage.setItem('collapsedItems', JSON.stringify(item));
        link.click();
    }
    //loadOrders(selectedLocation);

})

