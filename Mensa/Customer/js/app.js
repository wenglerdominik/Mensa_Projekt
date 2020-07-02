if (!sessionStorage.getItem('user')) window.open('../customer/index.html', '_self');
document.addEventListener('DOMContentLoaded', () => {
    let roles = ['Kunde', 'Lieferant', 'Ausgabestelle', 'Systemadmin', 'Ausgabestelle Admin']


    // $(function () {
    //     let role = JSON.parse(sessionStorage.getItem('user')).role;
    //     console.log(role);
    //     if (role === 1) { //Lieferant
    //         sideBar.innerHTML = navKitchen + navProducts;
    //     }
    //     else if (role === 2) { //Ausgabestelle
    //         sideBar.innerHTML = navOutputNormal;
    //     }
    //     else if (role === 3) { //Systemadmin
    //         sideBar.innerHTML = navKitchen + navOutputAdmin + navProductsAll + navSettings;

    //     }
    //     else if (role === 4) { //Ausgabestelle Admin
    //         sideBar.innerHTML = navOutputAdmin + navProductsAdditional;

    //     }
    //     headerRoleText.innerText = roles[role];

    // })


    //Sidebar, andere Menüs collapsen wenn eins geöffnet wird
    // let myGroup = $('#sidebarItemList');
    // myGroup.on('show.bs.collapse', '.collapse', function () {
    //     myGroup.find('.collapse.show').collapse('hide');

    // });

    // $("#menu-toggle").click(function (e) {
    //     e.preventDefault();
    //     $("#wrapper").toggleClass("toggled");
    // });


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












