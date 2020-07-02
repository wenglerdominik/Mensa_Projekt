
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();
let additionalOptions = ['Keine', 'Ist Menütyp', 'Ist Zusatzprodukt'];

document.addEventListener('DOMContentLoaded', () => {
    loadProductTypes();
})

function loadProductTypes() {

    let table = document.getElementById('tbody');
    table.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/producttype',
        datatype: 'json',

        successCallback: function (response) {

            for (let producttype of response) {

                let tr = document.createElement('tr');
                let tdName = document.createElement('td');
                let tdOptions = document.createElement('td');

                tr.appendChild(tdName);
                tr.appendChild(tdOptions);

                tdName.innerText = producttype.name;

                if (producttype.ismenuetype === false && producttype.isadditional === false) tdOptions.innerText = additionalOptions[0];
                else if (producttype.ismenuetype === true && producttype.isadditional === false) tdOptions.innerText = additionalOptions[1];
                else if (producttype.ismenuetype === false && producttype.isadditional === true) tdOptions.innerText = additionalOptions[2];

                tr.setAttribute('data-producttype', JSON.stringify(producttype));
                tr.setAttribute('data-toggle', 'modal');
                tr.setAttribute('data-target', '#modalProductType');
                tr.setAttribute('style', 'cursor: pointer')
                table.appendChild(tr);
                $('#btnCancel').click();

            }

            //addClickEventRow();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}

document.getElementById('btnSave').addEventListener('click', () => {
    const producttype = { producttypeid: null, name: null, ismenuetype: null, isadditional: null }
    const name = $('#productTypeName').val();
    const option = $('#productTypeOption').val();
    let ismenu;
    let isadditional;
    if (option === additionalOptions[0]) {
        ismenu = false;
        isadditional = false;
    }
    else if (option === additionalOptions[1]) {
        ismenu = true;
        isadditional = false;
    }
    else if (option === additionalOptions[2]) {
        ismenu = false;
        isadditional = true;
    }
    producttype.name = name;
    producttype.ismenuetype = ismenu;
    producttype.isadditional = isadditional
    if ($('#modalProductType').data('producttype') === '') {
        producttype.producttypeid = null;
        
    }
    else{
        producttype.producttypeid = $('#modalProductType').data('producttype').producttypeid;
    }

    request.execute
        ({
            method: 'POST',
            url: '/producttype',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(producttype),

            successCallback: function (response) {
                //alert('Produktart erfolgreich gespeichert')
                loadProductTypes();
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);

            }

        })
})

//#region //check if no field is empty
const modal = document.getElementById('modalProductType');
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
        label.innerText = 'Produktart kann gespeichert werden';
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
$('#modalProductType').on('show.bs.modal', (sender) => {

    let typeOptions = document.getElementById('productTypeOption');
    productTypeOption.innerHTML = '';
    if (sender.relatedTarget.id === "btnNewProductType") {
        label.innerText = 'Zum Speichern müssen alle Felder ausgefüllt sein'
        label.style.color = 'black';
        btnSave.disabled = true;
        document.querySelector('#modalHeader').innerText = 'Neue Produktart anlegen'
        $('#productTypeName').val('');

        for (let i = 0; i < additionalOptions.length; i++) {
            let divOption = document.createElement('option');
            divOption.innerHTML = additionalOptions[i];
            typeOptions.appendChild(divOption);
        }
        $('#modalProductType').data('producttype', '')

    }
    else if (sender.relatedTarget.nodeName === 'TR') {
        document.querySelector('#modalHeader').innerText = 'Produktart ändern'
        btnSave.disabled = false;
        label.innerText = 'Produktart kann gespeichert werden';
        label.style.color = 'green'
        let row = $(sender.relatedTarget);
        let productTypeData = row.data('producttype');

        for (let i = 0; i < additionalOptions.length; i++) {
            let divOption = document.createElement('option');
            divOption.innerHTML = additionalOptions[i];
            divOption.value = additionalOptions[i];
            typeOptions.appendChild(divOption);
        }
        $('#productTypeName').val(productTypeData.name);

        if (productTypeData.ismenuetype === false && productTypeData.isadditional === false) $('#productTypeOption').val(additionalOptions[0]);
        else if (productTypeData.ismenuetype === true && productTypeData.isadditional === false) $('#productTypeOption').val(additionalOptions[1]);
        else if (productTypeData.ismenuetype === false && productTypeData.isadditional === true) $('#productTypeOption').val(additionalOptions[2]);


        $('#modalProductType').data('producttype', productTypeData)

        console.log($('#modalProductType').data('producttype'))
    }

})
//#endregion
