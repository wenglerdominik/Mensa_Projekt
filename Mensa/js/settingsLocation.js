import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();


document.addEventListener('DOMContentLoaded', () => {
    LoadLocation();
})


function LoadLocation() {

    let table = document.getElementById('tbody');
    table.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/location',
        datatype: 'json',

        successCallback: function (response) {
            console.log(response);

            for (let location of response) {

                let tr = document.createElement('tr');
                let tdLocationName = document.createElement('td');
                let tdLocationStreet = document.createElement('td');
                let tdLocationPostCode = document.createElement('td');
                let tdLocationDeleted = document.createElement('td');
                tr.appendChild(tdLocationName);
                tr.appendChild(tdLocationStreet);
                tr.appendChild(tdLocationPostCode);
                //tr.appendChild(tdLocationDeleted);

                tdLocationName.innerText = location.name;
                tdLocationStreet.innerText = location.street;
                tdLocationPostCode.innerText = location.postcode;
                tdLocationDeleted.innerText = location.deleted;

                tr.setAttribute('data-location', JSON.stringify(location));
                tr.setAttribute('data-toggle', 'modal');
                tr.setAttribute('data-target', '#modalLocation');
                tr.setAttribute('style', 'cursor: pointer')
                table.appendChild(tr);
                $('#btnCancel').click();

            }

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}


document.getElementById('btnSave').addEventListener('click', () => {

    const location = { locationid: null, name: null, street: null, postcode: null, deleted: null, longitude: null, latitude: null }
    const name = $('#locationName').val();
    const street = $('#locationStreet').val();
    const postcode = $('#locationPostcode').val();
    const longitude = parseFloat($('#longitude').val());
    const latitude = parseFloat($('#latitude').val());

    if ($('#modalLocation').data('location') === '') {
        location.locationid = null;

    }
    else {
        location.locationid = $('#modalLocation').data('location').locationid;
    }
    location.name = name;
    location.street = street;
    location.postcode = parseInt(postcode);
    location.deleted = false;
    location.longitude = longitude;
    location.latitude = latitude;

    request.execute({
        method: 'POST',
        url: '/location',
        contentHeader: 'application/json; charset=utf-8',
        data: JSON.stringify(location),
        datatype: 'json',

        successCallback: function (response) {
            //alert('Ausgabestelle erfolgreich geändert')
            LoadLocation();

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


//#region //check if no field is empty
const modal = document.getElementById('modalLocation');
const inputs = modal.querySelectorAll('input');
const label = document.getElementById('lblState');
const emptyInput = [];
const btnSave = document.querySelector('#btnSave');
$(inputs).on('input', () => {

    checkEmptyField();

})
function checkEmptyField() {
    emptyInput.length = 0;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            emptyInput.push(i);
        }
    }
    console.log(emptyInput.length);
    if (emptyInput.length === 0) {
        btnSave.disabled = false;
        label.innerText = 'Ausgabestelle kann gespeichert werden';
        label.style.color = 'green'
    }
    else if (emptyInput.length > 0) {
        btnSave.disabled = true;
        label.innerText = 'Zum Speichern müssen alle Felder ausgefüllt sein';
        label.style.color = 'black'

    }
}

//#endregion


//#region Open Modal
$('#modalLocation').on('show.bs.modal', (sender) => {

    if (sender.relatedTarget.id === "btnNewLocation") {
        label.innerText = 'Zum Speichern müssen alle Felder ausgefüllt sein'
        label.style.color = 'black';
        btnSave.disabled = true;
        document.querySelector('#modalHeader').innerText = 'Neue Ausgabestelle anlegen'
        $('#locationName').val('');
        $('#locationStreet').val('');
        $('#locationPostcode').val('');
        $('#longitude').val('');
        $('#latitude').val('');

        $('#modalLocation').data('location', '')

    }
    else if (sender.relatedTarget.nodeName === 'TR') {
        document.querySelector('#modalHeader').innerText = 'Ausgabestelle ändern'
        btnSave.disabled = false;
        label.innerText = 'Ausgabestelle kann gespeichert werden';
        label.style.color = 'green'
        let row = $(sender.relatedTarget);
        let location = row.data('location');

        $('#locationName').val(location.name);
        $('#locationStreet').val(location.street);
        $('#locationPostcode').val(location.postcode);
        $('#longitude').val(location.longitude);
        $('#latitude').val(location.latitude);

        $('#modalLocation').data('location', location)

        console.log($('#modalLocation').data('location'))
    }

})
//#endregion