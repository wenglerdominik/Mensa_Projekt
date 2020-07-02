import WifiRequest from './wifiRequest.js';

let request = new WifiRequest();


//#region CONST
const orderMenue = JSON.parse(sessionStorage.getItem('orderMenue'));
console.log(orderMenue);
let pageCount = 0;
let menueprice = 0;
let menuecalories = 0;


const containerMenue = document.querySelector('#containerMenue');
const rowcontainerMenue = document.querySelector('#colcontainerMenue')
const containerLocation = document.querySelector('#containerLocation');
const containerAdditional = document.querySelector('#containerAdditional');
const containerAddProducts = document.querySelector('#contProducts');
const containerSummaryTop = document.querySelector('#containerSummaryTop');
const containerSummaryContent = document.querySelector('#containerSummaryContent');
const rowcontainerSummaryContent = document.querySelector('#rowcontainerSummaryContent');

const status = document.querySelector('#statusBar');
const btnPrev = document.querySelector('#btnPrev');
const btnNext = document.querySelector('#btnNext');
//#endregion


LoadLocation();
let productsOfMenue = [];
function createMenueCards(menue, target) {
    productsOfMenue.length = 0;
    let card = document.createElement('div');
    card.classList = 'card mb-2';
    let cardHeader = document.createElement('div');
    cardHeader.classList = 'card-header';
    let row = document.createElement('div');
    row.classList = 'row';
    let col10 = document.createElement('div');
    col10.classList = 'col-12';
    col10.style.paddingLeft = '5px';
    let span = document.createElement('span');
    span.style.float = 'right';


    let button = document.createElement('button');
    button.classList = 'mdi mdi-menu';
    button.setAttribute('data-toggle', 'collapse');
    button.setAttribute('data-target', '#collapse');
    button.style.display = 'contents';
    button.innerText = menue.titel;

    button.appendChild(span);
    col10.append(button);
    row.appendChild(col10);
    cardHeader.appendChild(row);
    menuecalories = 0;
    menueprice = 0;
    let collapse = document.createElement('div');
    collapse.classList = 'collapse';
    collapse.id = 'collapse';
    let cardBody = document.createElement('div');
    cardBody.classList = 'card-body';
    //cardHeader.innerText = `Menü ${menue.menuetypename}`;
    for (let product of menue.detaillist) {
        let hr = document.createElement('hr');
        let title = document.createElement('span');
        let content = document.createElement('p');
        title.innerText = product.name;
        content.innerText = product.description;
        //cardBody.append(title, content, hr);

        //cardBody.append(title, content);
        cardBody.append(content);
        menueprice += product.price;
        menuecalories += product.calorie;

        //Speicher Produkte in Array zum senden
        let productObject = {
            orderdetailid: null,
            orderid: null,
            name: product.name,
            description: product.description,
            calorie: product.calorie,
            image: null,
            price: product.price,
            menueid: orderMenue[0].menueid,

        };

        productsOfMenue.push(productObject);
    }
    span.innerText = `€ ${menueprice.toFixed(2)}`
    collapse.appendChild(cardBody);
    card.append(cardHeader, collapse);
    target.appendChild(card);
}

createMenueCards(orderMenue[0], rowcontainerMenue);

document.querySelector('#btnNext').addEventListener('click', () => {
    pageCount += 1;
    showContainers(pageCount);
});
function showContainers(pageCount) {
    if (pageCount === 0) {
        containerMenue.style.display = 'block';
        containerLocation.style.display = 'none';
        containerAdditional.style.display = 'none';
        containerSummaryTop.style.display = 'none';
        containerSummaryContent.style.display = 'none';
        status.style.width = '33%';
        btnPrev.style.display = 'none'
        btnNext.style.display = 'block';
    }
    else if (pageCount === 1) {
        containerMenue.style.display = 'none';
        containerLocation.style.display = 'block';
        containerAdditional.style.display = 'block';
        containerSummaryTop.style.display = 'none';
        containerSummaryContent.style.display = 'none';
        status.style.width = '60%';
        btnPrev.style.display = 'block'
        btnNext.style.display = 'block';
    }
    else if (pageCount === 2) {
        containerMenue.style.display = 'none';
        containerLocation.style.display = 'none';
        containerAdditional.style.display = 'none';
        containerSummaryTop.style.display = 'block';
        containerSummaryContent.style.display = 'block';
        status.style.width = '100%';
        btnPrev.style.display = 'block';
        btnNext.style.display = 'none';
        createSummaryContent();
    }
}
document.querySelector('#btnPrev').addEventListener('click', () => {
    pageCount = (pageCount === 0) ? 0 : pageCount - 1;
    showContainers(pageCount);
});


const divLocation = document.querySelector('#location');
// for (let location of distance) {

//     let option = document.createElement('option');
//     option.value = location.id;
//     $(option).data('location', location);
//     option.innerText = location.name;
//     divLocation.appendChild(option);
// }

//console.log(locations);
$(divLocation).change();


let distance = [];
function LoadLocation() {

    request.execute({
        method: 'GET',
        url: '/location',
        datatype: 'json',

        successCallback: function (response) {
            //locations = response;

            for (let location of response) {
                let object = {
                    id: location.locationid,
                    longitude: location.longitude,
                    latitude: location.latitude,
                    name: location.name,
                    distance: 0
                }
                distance.push(object);
            }
            getLocation();

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);

        }

    })

}
let selectedLocation;
$(divLocation).on('change', () => {
    selectedLocation = $(divLocation).val();
    console.log(selectedLocation);
    loadAddProducts(selectedLocation);
})

function loadAddProducts(id) {
    request.execute({
        method: 'GET',
        url: '/additionalproduct/extended/' + id,
        datatype: 'json',
        successCallback: function (response) {
            console.log(response);
            containerAddProducts.innerHTML = '';
            createProductCard(response, containerAddProducts, true);

        },
        errorCallback: function (s, t) {
            console.log('fehler!!!');
            console.error(s + ': ' + t);
        }
    })
}

/**Erstellt die Zusatzproduktcard
    * 
    * @param {list} products 
    * @param {element} target 
    */
function createProductCard(products, target, checkbox) {

    let label = document.querySelector('#labelAddProduct')
    if (products.length === 0) {
        label.innerText = 'Keine Zusatzprodukte verfügbar';
    }
    else {
        label.innerText = 'Sie können Zusatzprodukte auswählen';
        for (let product of products) {

            let card = document.createElement('div');
            card.classList = 'card mb-2';
            let cardHeader = document.createElement('div');
            cardHeader.classList = 'card-header';
            let row = document.createElement('div');
            row.classList = 'row';
            let col10 = document.createElement('div');
            col10.classList = 'col-10';
            let col12 = document.createElement('div');
            col12.classList = 'col-12';
            col10.style.paddingLeft = '5px';
            col12.style.paddingLeft = '5px';

            let button = document.createElement('button');
            button.classList = 'mdi mdi-menu';
            button.setAttribute('data-toggle', 'collapse');
            button.setAttribute('data-target', '#collapse' + product.productid);
            button.style.display = 'contents';
            button.innerText = product.productname;

            let span = document.createElement('span');
            span.style.float = 'right';
            span.innerText = `€ ${product.productprice.toFixed(2)}`

            let col2 = document.createElement('div');
            col2.classList = 'col-2';


            let formCheck = document.createElement('div');
            formCheck.classList = 'form-check';
            let input = document.createElement('input');
            input.classList = 'form-check-input';
            input.type = 'checkbox';
            $(input).data('product', product);
            input.id = 'checkAddProduct';

            button.appendChild(span);
            col10.appendChild(button);
            formCheck.appendChild(input);
            col2.appendChild(formCheck);
            if (checkbox === true) {
                row.append(col10, col2);
            }
            else {
                col12.appendChild(button);
                row.appendChild(col12);
            }
            cardHeader.appendChild(row);

            let collapse = document.createElement('div');
            collapse.classList = 'collapse';
            collapse.id = 'collapse' + product.productid;

            let cardBody = document.createElement('div');
            cardBody.classList = 'card-body';
            let description = document.createElement('p');
            description.innerText = product.productdescription;
            let hr = document.createElement('hr');
            let calorie = document.createElement('span');
            calorie.innerText = `Kalorien: ${product.productcalorie} kCal`;

            //cardBody.append(description, hr, calorie);
            cardBody.append(description, calorie);
            collapse.appendChild(cardBody);

            card.append(cardHeader, collapse);
            target.appendChild(card);

        }
    }

}

let orderprice;
function createSummaryContent() {
    rowcontainerSummaryContent.innerHTML = '';
    createMenueCards(orderMenue[0], rowcontainerSummaryContent);
    createProductCard(getSelectedAddProduct(), rowcontainerSummaryContent, false);
    const totalCost = document.querySelector('#totalCost');
    const totalCal = document.querySelector('#totalCal');
    const location = document.querySelector('#viewLocation');
    location.innerText = divLocation.options[divLocation.selectedIndex].text;
    orderprice = 0;
    let ordercal = 0;
    for (let product of getSelectedAddProduct()) {
        orderprice += product.productprice;
        ordercal += product.productcalorie;
    }
    orderprice += menueprice;
    ordercal += menuecalories;
    totalCost.innerText = '€ ' + orderprice.toFixed(2);
    totalCal.innerText = ordercal;
}


function getSelectedAddProduct() {
    let selAddProducts = [];
    const inputElements = document.querySelectorAll('#checkAddProduct');
    for (let checkbox of inputElements) {
        if (checkbox.checked) {
            selAddProducts.push($(checkbox).data('product'));

        }

    }
    return selAddProducts;
}

document.querySelector('#btnSendOrder').addEventListener('click', () => {
    let ProductsForRequest = [];
    let orderContainer = {
        order: null,
        detaillist: null,
    }
    let orderObj = {
        orderid: null,
        userid: JSON.parse(sessionStorage.getItem('user')).userid,
        locationid: selectedLocation,
        orderdate: new Date(),
        consumed: false,
        totalcost: menueprice,
        barcode: null,
        canceled: false,
        servedate: orderMenue[0].servedate,
        menueid: orderMenue[0].menueid,
    }

    let orderPriceAdditional = 0;
    for (let product of getSelectedAddProduct()) {

        let productObject = {
            orderdetailid: null,
            orderid: null,
            name: product.productname,
            description: product.productdescription,
            calorie: product.productcalorie,
            price: product.productprice,
            menueid: null,

        };
        orderPriceAdditional += product.productprice;
        ProductsForRequest.push(productObject);

    }
    for (let product of productsOfMenue) {
        ProductsForRequest.push(product);
    }

    orderObj.totalcost += orderPriceAdditional;
    orderContainer = {
        order: orderObj,
        detaillist: ProductsForRequest,
    }

    requestOrder(orderContainer);
    console.log(productsOfMenue);
})

function requestOrder(orderContainer) {

    request.execute({
        method: 'POST',
        url: '/order',
        contentHeader: 'application/json; charset=utf-8',
        data: JSON.stringify(orderContainer),
        successCallback: function (resp) {
            let response = JSON.parse(resp);
            console.log(response);
            window.open('./month.html', '_self');

        },
        errorCallback: function (s, t) {
            console.log('error on ordersave')
        }
    })
}





function getLocation() {
    if (navigator.geolocation) {
        console.log('Browser unterstützt Geo');

        if (navigator.platform === 'iPhone' || 'iPad') {
            if (navigator.permissions) {
                navigator.permissions.query({ name: 'geolocation' })
                    .then((result) => {
                        if (result.state === 'granted') {
                            console.log('Geo zugestimmt');
                            console.log('lade Position');
                            showLoadingSpinner();
                            navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {
                                enableHighAccuracy: true, timeout: 5000,
                            });
                        }
                        else if (result.state === 'prompt') {
                            console.log('Geo bereits erteilt');
                            console.log('lade Position');
                            showLoadingSpinner();
                            navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {
                                enableHighAccuracy: true, timeout: 5000,
                            });
                        }
                        else if (result.state === 'denied') {
                            console.log('Geo abgelehnt');
                            for (let location of distance) {

                                let option = document.createElement('option');
                                option.value = location.id;
                                $(option).data('location', location);
                                option.innerText = location.name;
                                divLocation.appendChild(option);
                            }

                            //console.log(locations);
                            $(divLocation).change();
                            return;
                        }


                    });
                // console.log('lade Position');
                // showLoadingSpinner();
                // navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {
                //     enableHighAccuracy: true,
                // });
            }
            else {
                for (let location of distance) {

                    let option = document.createElement('option');
                    option.value = location.id;
                    $(option).data('location', location);
                    option.innerText = location.name;
                    divLocation.appendChild(option);
                }
                $(divLocation).change();
                return;
            }
        }

        else {
            navigator.permissions.query({ name: 'geolocation' })
                .then((result) => {
                    if (result.state === 'granted') {
                        console.log('Geo zugestimmt');
                        console.log('lade Position');
                        showLoadingSpinner();
                        navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {
                            enableHighAccuracy: true, timeout: 3000,
                        });
                    }
                    else if (result.state === 'prompt') {
                        console.log('Geo bereits erteilt');
                        console.log('lade Position');
                        showLoadingSpinner();
                        navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {
                            enableHighAccuracy: true, timeout: 3000,
                        });
                    }
                    else if (result.state === 'denied') {
                        console.log('Geo abgelehnt');
                        for (let location of distance) {

                            let option = document.createElement('option');
                            option.value = location.id;
                            $(option).data('location', location);
                            option.innerText = location.name;
                            divLocation.appendChild(option);
                        }

                        //console.log(locations);
                        $(divLocation).change();
                        return;
                    }


                });
        }
    }
    else {
        for (let location of distance) {

            let option = document.createElement('option');
            option.value = location.id;
            $(option).data('location', location);
            option.innerText = location.name;
            divLocation.appendChild(option);
        }

        //console.log(locations);
        $(divLocation).change();
    }
}
function onPositionSuccess(position) {
    console.log('Position ermittelt', position);
    removeLoadingSpinner();
    showPosition(position);


}

function onPositionError(positionError) {
    console.log(positionError);
    removeLoadingSpinner();
    for (let location of distance) {

        let option = document.createElement('option');
        option.value = location.id;
        $(option).data('location', location);
        option.innerText = location.name;
        divLocation.appendChild(option);
    }

    //console.log(locations);
    $(divLocation).change();
}

function showPosition(position) {

    for (let i = 0; i < distance.length; i++) {
        //distance[i].distance = calculateDistance(position.coords.latitude, position.coords.longitude, distance[i].latitude, distance[i].longitude);
        distance[i].distance = distanceBetween(position.coords.latitude, position.coords.longitude, distance[i].latitude, distance[i].longitude)
    }
    distance.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    console.log(distance);
    for (let location of distance) {

        let option = document.createElement('option');
        option.value = location.id;
        $(option).data('location', location);
        option.innerText = location.name;
        divLocation.appendChild(option);
    }

    //console.log(locations);
    $(divLocation).change();
}
// function calculateDistance(lat1, lon1, lat2, lon2) {
//     var R = 6371; // km
//     var dLat = (lat2 - lat1).toRad();
//     var dLon = (lon2 - lon1).toRad();
//     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     var d = R * c;
//     return d;
// }
// Number.prototype.toRad = function () {
//     return this * Math.PI / 180;
// }
function distanceBetween(lat1, lon1, lat2, lon2) {
    var rlat1 = Math.PI * lat1 / 180
    var rlat2 = Math.PI * lat2 / 180
    var rlon1 = Math.PI * lon1 / 180
    var rlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var rtheta = Math.PI * theta / 180
    var dist = Math.sin(rlat1) * Math.sin(rlat2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515

    dist = dist * 1.609344

    return dist
}

function showLoadingSpinner() {
    $('#modalLoading').modal({ backdrop: 'static', keyboard: false }, 'show');

}
function removeLoadingSpinner() {
    //setTimeout(function () { closeModal() }, 3000);
    $('#modalLoading').modal('hide');
}

document.querySelector('#btnQuitOrder').addEventListener('click', () => {
    window.history.back();
})