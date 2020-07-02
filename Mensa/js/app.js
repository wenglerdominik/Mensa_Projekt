if (!sessionStorage.getItem('user')) window.open('../wifi.mensa/index.html', '_self');

document.addEventListener('DOMContentLoaded', () => {
    let roles = ['Kunde', 'Lieferant', 'Ausgabestelle', 'Systemadmin', 'Ausgabestelle Admin']

    const sideBar = document.querySelector('#sidebarItemList')
    const headerRoleText = document.querySelector('#sidebarHeaderRole');
    const navKitchen = ` <li class="nav-Item " data-toggle="collapse" href="#collapseMenue" aria-expanded="false"
aria-controls="collapse"><a class="mdi mdi-speedometer"><span class="nav-ItemText">Küche</span></a>
<div class="collapse" id="collapseMenue">
    <ul class="nav-sub-item" id="navMainMenue">
        <li>
            <a id="linkKitchenCalendar" class="sideBarLink" href="calendar.html"><span class="mdi mdi-calendar-month mr-2"></span>Menü Kalender </a>
        </li>
        <li>
            <a id="linkKitchenOrders" class="sideBarLink" href="menueOrders.html"><span
                    class="mdi mdi-clipboard-list-outline mr-2"></span>Bestellungen </a>
        </li>
        <li>
            <a id="linkKitchenBilling" class="sideBarLink" href="billing.html"> <span class="mdi mdi-cash-register mr-2"></span>Abrechnung</a>
        </li>
    </ul>
</div>
</li>`;
    const navOutputAdmin = ` <li class="nav-Item " data-toggle="collapse" href="#collapseOutput" aria-expanded="false"
aria-controls="collapse"><a class="mdi mdi-silverware-fork-knife"><span class="nav-ItemText">Ausgabestelle</span></a>
<div class="collapse " id="collapseOutput">
    <ul class="nav-sub-item" id="navMainOutput">
        <li>
            <a id="linkOutputOrder" class="sideBarLink" href="orderview.html"><span class="mdi mdi-calendar-month mr-2"></span>Menü Ausgabe </a>
        </li>
        <li>
            <a id="linkOutputReportDay" class="sideBarLink" href="reportOrders.html"><span
                    class="mdi mdi-clipboard-list-outline mr-2"></span>Tagesreport </a>
        </li>
        <li>
            <a id="linkOutputReportCost" class="sideBarLink" href="reportCost.html"> <span class="mdi mdi-cash-register mr-2"></span>Monatsabrechnung</a>
        </li>
    </ul>
</div>
</li>`;
    const navOutputNormal = ` <li class="nav-Item " data-toggle="collapse" href="#collapseOutput" aria-expanded="false"
aria-controls="collapse"><a class="mdi mdi-silverware-fork-knife"><span class="nav-ItemText">Ausgabestelle</span></a>
<div class="collapse" id="collapseOutput">
    <ul class="nav-sub-item" id="navMainOutput">
        <li>
            <a id="linkOutputOrder" class="sideBarLink" href="orderview.html"><span class="mdi mdi-calendar-month mr-2"></span>Menü Ausgabe </a>
        </li>
    </ul>
</div>
</li>`;
    //#region  old navSetting
    //     const navSettings = ` <li class="nav-Item " data-toggle="collapse" href="#collapseSettings" aria-expanded="false"
    // aria-controls="collapse"><a class="mdi mdi-cogs"><span class="nav-ItemText">Stammdaten</span></a>
    // <div class="collapse" id="collapseSettings">
    //     <ul class="nav-sub-item">
    //         <li>
    //             <a id="linkSettingType" class="sideBarLink" href="manProductType_new.html"><span class="mdi mdi-food mr-2"></span>Produkt Arten</a>
    //         </li>
    //         <li>
    //             <a id="linkSettingUser" class="sideBarLink" href="settingsUser.html"><span class="mdi mdi-account-details mr-2"></span>Benutzerverwaltung</a>
    //         </li>
    //         <li>
    //             <a id="linkSettingLocation" class="sideBarLink" href="settingsLocation.html"><span class="mdi mdi-home mr-2"></span>Ausgabestellen</a>
    //         </li>
    //     </ul>
    // </div>
    // </li>`
    //#endregion
    const navSettings = ` <li class="nav-Item " data-toggle="collapse" href="#collapseSettings" aria-expanded="false"
aria-controls="collapse"><a class="mdi mdi-cogs"><span class="nav-ItemText">Stammdaten</span></a>
<div class="collapse" id="collapseSettings">
    <ul class="nav-sub-item">
        <li>
            <a id="linkSettingUser" class="sideBarLink" href="settingsUser.html"><span class="mdi mdi-account-details mr-2"></span>Benutzerverwaltung</a>
        </li>
        <li>
            <a id="linkSettingLocation" class="sideBarLink" href="settingsLocation.html"><span class="mdi mdi-home mr-2"></span>Ausgabestellen</a>
        </li>
    </ul>
</div>
</li>`
    const navProducts = `<li class="nav-Item " data-toggle="collapse" href="#collapseProducts" aria-expanded="false"
    aria-controls="collapse"><a class="mdi mdi-food mr-2"><span class="nav-ItemText">Produkt
            Verwaltung</span></a>
    <div class="collapse" id="collapseProducts">
        <ul class="nav-sub-item" id="navMainProduct">
            <li>
                <a id="linkProduct" class="sideBarLink" href="manProduct_new.html"><span class="mdi mdi-silverware-fork-knife mr-2"></span>Produkte</a>
            </li>
           
        </ul>
    </div>
</li>`
    const navProductsAdditional = `<li class="nav-Item " data-toggle="collapse" href="#collapseProducts" aria-expanded="false"
aria-controls="collapse"><a class="mdi mdi-food mr-2"><span class="nav-ItemText">Produkt
        Verwaltung</span></a>
<div class="collapse" id="collapseProducts">
    <ul class="nav-sub-item" id="navMainProduct">
        <li>
        <a id="linkAddProduct" class="sideBarLink" href="manAdditionalProduct.html"><span class="mdi mdi-food mr-2"></span>Zusatzprodukte</a>

        </li>
       
    </ul>
</div>
</li>`
    const navProductsAll = `<li class="nav-Item " data-toggle="collapse" href="#collapseProducts" aria-expanded="false"
aria-controls="collapse"><a class="mdi mdi-food mr-2"><span class="nav-ItemText">Produkt
        Verwaltung</span></a>
<div class="collapse" id="collapseProducts">
    <ul class="nav-sub-item" id="navMainProduct">
    <li>
    <a id="linkProduct" class="sideBarLink" href="manProduct_new.html"><span class="mdi mdi-food mr-2"></span>Produkte</a>
</li>
<li>
<a id="linkAddProduct" class="sideBarLink" href="manAdditionalProduct.html"><span class="mdi mdi-food mr-2"></span>Zusatzprodukte</a>

</li>
       
    </ul>
</div>
</li>`
    const navBarTop = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
    <button class="btn bg-nav" id="menu-toggle"><span class="navbar-toggler-icon"></span></button>

    <button type="button" id="dropdownMenu1" data-toggle="dropdown"
        class="btn btn-secondary dropdown-toggle ml-auto" style="color: whitesmoke;"><span
            id="username">Name</span></button>
    <ul class="dropdown-menu dropdown-menu-right mt-2">
        <li class="px-3 py-2">
            <form class="needs-validation" novalidate>

                <div class="form-group">
                    <button type="button" class="btn btn-primary btn-block" id="btnLogout">Abmelden</button>
                </div>
            </form>
        </li>
    </ul>
</nav>`


    $(function () {
        let role = JSON.parse(sessionStorage.getItem('user')).role;
        console.log(role);
        if (role === 1) { //Lieferant
            sideBar.innerHTML = navKitchen + navProducts;
            document.getElementById('linkKitchenCalendar').addEventListener('click', () => {
                sessionStorage.setItem('lastmonth', '');
                sessionStorage.setItem('lastyear', '');
            })
        }
        else if (role === 2) { //Ausgabestelle
            sideBar.innerHTML = navOutputNormal;
        }
        else if (role === 3) { //Systemadmin
            sideBar.innerHTML = navKitchen + navOutputAdmin + navProductsAll + navSettings;
            document.getElementById('linkKitchenCalendar').addEventListener('click', () => {
                sessionStorage.setItem('lastmonth', '');
                sessionStorage.setItem('lastyear', '');
            })
        }
        else if (role === 4) { //Ausgabestelle Admin
            sideBar.innerHTML = navOutputAdmin + navProductsAdditional;

        }
        headerRoleText.innerText = roles[role];
        if (sessionStorage.getItem('collapsedItems')) {
            let collapsed = JSON.parse(sessionStorage.getItem('collapsedItems'));
            for (let item of collapsed) {
                console.log(item.id)
                let x = document.getElementById(item.id);
                $(x).collapse('toggle');
            }
        }

        let siteLinks = document.getElementById('sidebarItemList').getElementsByClassName('sideBarLink');
        console.log(siteLinks);
        for (let link of siteLinks) {
            link.addEventListener('click', (event) => {
                event.target.classList.add('active');
                sessionStorage.setItem('activeLink', event.target.id);
            })
        }
        if (window.location.pathname === '/wifi.mensa/startpage.html') sessionStorage.setItem('activeLink', '');
        if (sessionStorage.getItem('activeLink')) {
            document.getElementById(sessionStorage.getItem('activeLink')).classList.add('active');
        }

    })

    //Sidebar, andere Menüs collapsen wenn eins geöffnet wird
    // let myGroup = $('#sidebarItemList');
    // myGroup.on('show.bs.collapse', '.collapse', function () {
    //     myGroup.find('.collapse.show').collapse('hide');

    // });
    let myGroup = $('#sidebarItemList');


    myGroup.on('shown.bs.collapse', '.collapse', function () {
        let side = document.getElementById('sidebarItemList');
        let x = side.getElementsByClassName('collapse show');

        let array = [];
        for (let object of x) {
            array.push({ id: object.id });
        }
        console.log(array);
        sessionStorage.setItem('collapsedItems', JSON.stringify(array));
    });
    myGroup.on('hidden.bs.collapse', '.collapse', function () {
        let side = document.getElementById('sidebarItemList');
        let x = side.getElementsByClassName('collapse show');

        let array = [];
        for (let object of x) {
            array.push({ id: object.id });
        }
        sessionStorage.setItem('collapsedItems', JSON.stringify(array));
        console.log(array);
    });


    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });


    //#region User --> eingeloggter User speichern, beim Ausloggen SessionStorage clearen

    let user = JSON.parse(sessionStorage.getItem('user'));
    document.getElementById('username').innerText = 'Hallo ' + user.nickname;
    if (JSON.parse(sessionStorage.getItem('user')).role === 0) document.getElementById('usernumber').innerText = 'Kundennr.: ' + user.usernumber;
    document.querySelector('#btnLogout').addEventListener('click', () => {
        sessionStorage.clear();
        window.open('index.html', '_self');
    })


    // function myFunction(x) {
    //     if (x.matches) { // If media query matches
    //         let y = document.querySelectorAll('.menu-icon');
    //         console.log(y);
    //     } else {

    //     }
    // }

    // var x = window.matchMedia("(max-width: 700px)")
    // myFunction(x) // Call listener function at run time
    // x.addListener(myFunction) // Attach listener function on state changes
})


//Merke CollapseState of Sidebar
// function check(event) {
//     let collapseKitchen = document.getElementById('collapseMenue');
//     let collapseSetting = document.getElementById('collapseSettings');
//     let collapseOutput = document.getElementById('collapseOutput');
//     let collapseProduct = document.getElementById('collapseProducts');
// }








