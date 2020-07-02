
class MenueApiService{
    constructor() {
        this._listUrl = 'http://localhost/wifi.database.mensa/api/v1/menue';
        this._listMonth ='http://localhost/wifi.database.mensa/api/v1/menue/monthList/';
        this._listDay ='http://localhost/wifi.database.mensa/api/v1/menue/dayList/';
        this._detailUrl ='';
    }

    _makeRequest(url, successCallback, errorCallback) {
        let httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function (event) {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    let response = JSON.parse(httpRequest.responseText);

                        successCallback(response);
                  
                }
                else {
                    errorCallback();
                }
            }
        };

        httpRequest.open('GET', url);
        httpRequest.send();
    }

       /**
     * Returns a list of Menues 
     * 
     * @param {function} successCallback 
     * @param {function} errorCallback 
     */
    getList1(successCallback, errorCallback) {
        this._makeRequest(this._listUrl, successCallback, errorCallback);
    }

    getListMonth(year, month, successCallback, errorCallback){
        let url = this._listMonth + year + '?month=' + month;
        this._makeRequest(url, successCallback, errorCallback);
    }

    getListDay(date, successCallback, errorCallback){
        let url = this_listDay + date;
        this._makeRequest(url, successCallback, errorCallback)
    }
}


class MenueListComponent{
    constructor(targetElement, apiService){
        this._targetElement = targetElement;
        this._apiService = apiService;
        this._apiService.getListMonth('2020','01', menuelist => this.my(menuelist), ()=>console.log('error'))
    }

    my(menuelist){
        for(let menue of menuelist)
        createMenueDayForCard();
    }
    

}

let list = document.querySelector('#calender-menues');
let apiService = new MenueApiService();
let menueListComponent = new MenueListComponent(list,apiService)
menueListComponent.getListMonth();
//menueListComponent.getListAll();

console.log(menueListComponent.getListAll());