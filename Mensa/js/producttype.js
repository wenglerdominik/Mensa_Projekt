
import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();

document.getElementById('btnSaveProductType').addEventListener('click', () => {
    let selType =JSON.parse(document.getElementById('productTypeSel').value);
    let option = document.getElementById('editSelOptions').value;
    let name = document.getElementById('editProductTypeName').value;
    let add=false;
    let menue= false;
    if(option==0){
        menue=false;
        add = false;
    }
    else if(option==1){
        menue=true; 
        add=false;
    }
    else{
        menue=false;
        add = true;
    }

    let productType = {
        producttypeid : selType.producttypeid,
        name : name,
        ismenuetype: menue,
        isadditional: add
    }

    request.execute
        ({
            method: 'POST',
            url: '/producttype',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(productType),
            successCallback: function (resp) {
                let response = JSON.parse(resp);
                console.log(response);

                if (response) {
                   // alert("Speichern erfolgreich");
                    //sessionStorage.setItem('user', JSON.stringify(response));
                    //window.open('main.html', '_self');
                   

                }
                else alert('Fehler beim Speichern');
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

})

document.getElementById('btnSaveNewProductType').addEventListener('click', () => {
    let wert = document.getElementById('newProductTypeName').value
    let option = document.getElementById('newSelOptions').value;
    let add=false;
    let menue= false;
    if(option==0){
        menue=false;
        add = false;
    }
    else if(option==1){
        menue=true; 
        add=false;
    }
    else{
        menue=false;
        add = true;
    }


    let productType = {
        producttypeid : null,
        name : wert,
        ismenuetype: menue,
        isadditional: add
    }

    request.execute
        ({
            method: 'POST',
            url: '/producttype',
            contentHeader: 'application/json; charset=utf-8',
            data: JSON.stringify(productType),
            successCallback: function (resp) {
                let response = JSON.parse(resp);
                console.log(response);

                if (response) {
                    alert("Speichern erfolgreich");
                    //sessionStorage.setItem('user', JSON.stringify(response));
                    //window.open('main.html', '_self');
                   

                }
                else alert('Fehler beim Speichern');
            },
            errorCallback: function (s, t) {
                console.log('fehler!!!');
                console.error(s + ': ' + t);
            }
        });

})

function loadProductType(){
    let html = document.getElementById('productTypeSel');
    html.innerHTML = '';

    request.execute({
        method: 'GET',
        url: '/producttype',
        datatype: 'json',

        successCallback: function (response) {
           
            for (let type of response) {

                let htmlProductType = document.createElement('option');
                htmlProductType.setAttribute('value', JSON.stringify(type));

                htmlProductType.innerHTML = type.name;
                html.appendChild(htmlProductType);

            }
            $('#productTypeSel').change();
        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }
    })
   

}

$('#productTypeSel').change(function (){
    let name = document.getElementById('editProductTypeName');
    let sel = document.getElementById('productTypeSel');
    let selType = JSON.parse(sel.value);
    let option = document.getElementById('editSelOptions');
    name.value = selType.name;
    if(selType.ismenuetype == false && selType.isadditional == false) option.value=0
    else if(selType.ismenuetype == true && selType.isadditional == false) option.value=1
    else option.value = 2;

})


document.getElementById('btnEdit').addEventListener('click', () => {
    loadProductType();
    $('#ContNewProductType').collapse('hide');
    $('#ContEditProductType').collapse('show');
    $('#navSaveNewProductType').collapse('hide');
    $('#navSaveProductType').collapse('show');

    document.getElementById('btnEdit').setAttribute('class', 'btn btn-info');
    document.getElementById('btnNew').setAttribute('class', 'btn btn-outline-dark');

})
document.getElementById('btnNew').addEventListener('click', () => {
    $('#ContEditProductType').collapse('hide');
    $('#ContNewProductType').collapse('show');
    $('#navSaveProductType').collapse('hide');
  $('#navSaveNewProductType').collapse('show');

    document.getElementById('btnNew').setAttribute('class', 'btn btn-info');
    document.getElementById('btnEdit').setAttribute('class', 'btn btn-outline-dark');

   

})
