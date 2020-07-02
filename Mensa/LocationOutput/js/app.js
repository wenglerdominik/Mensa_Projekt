document.addEventListener('DOMContentLoaded', () => {
    let roles = ['Kunde', 'Lieferant', 'Ausgabestelle', 'Systemadmin', 'Ausgabestelle Admin']

    const sideBar = document.querySelector('#sidebarItemList')
    const headerRoleText = document.querySelector('#sidebarHeaderRole');
    const MenuOutput = ` <li class="nav-Item"><a class="mdi mdi-silverware-fork-knife mr-2" href="orderView.html"><span class="nav-ItemText">Menü
        Ausgabe</span></a></li>`



    const subProduktAddition = `<li class="nav-Item">
                                    <a href="manAdditionalProduct.html"><span class="mdi mdi-silverware-fork-knife mr-2"></span>Zusatzprodukte</a>
                                </li>`
    const ReportDay = `<li class="nav-Item">
                         <a href="reportOrders.html"><span class="mdi mdi-silverware-fork-knife mr-2"></span>Tagesreport</a>
                    </li>`;
    const ReportMonth = `<li class="nav-Item">
                         <a href="reportCost.html"><span class="mdi mdi-silverware-fork-knife mr-2"></span>Monatsreport</a>
                     </li>`;


    $(function () {
        let role = JSON.parse(sessionStorage.getItem('user')).role;
        console.log(role);

        if (role === 2) { //Ausgabestelle
            sideBar.innerHTML = MenuOutput;
            //document.querySelector('#navMainMenue').innerHTML += subMenuOutput;
        }
        else if (role === 4) { //Ausgabestelle Admin
            sideBar.innerHTML = MenuOutput + subProduktAddition + ReportDay + ReportMonth;//+ navSettings;

            //document.querySelector('#navMainMenue').innerHTML += subMenuOutput;

        }
        headerRoleText.innerText = roles[role];

    })


    //Sidebar, andere Menüs collapsen wenn eins geöffnet wird
    // let myGroup = $('#sidebarItemList');
    // myGroup.on('show.bs.collapse', '.collapse', function () {
    //     myGroup.find('.collapse.show').collapse('hide');

    // });

    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });


    //#region User --> eingeloggter User speichern, beim Ausloggen SessionStorage clearen

    let user = JSON.parse(sessionStorage.getItem('user'));
    document.getElementById('username').innerHTML = 'Hallo ' + user.nickname;

    document.querySelector('#btnLogout').addEventListener('click', () => {
        sessionStorage.clear();
        window.open('../../wifi.mensa/index.html', '_self');
    })



    //Notwendig??
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











