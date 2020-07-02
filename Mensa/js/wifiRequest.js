

export default class WifiRequest {

  constructor() {
    this._baseUrl = 'http://10.211.55.3/wifi.database.mensa/api/v1';
    //this._baseUrl = 'http://10.0.0.58/wifi.database.mensa/api/v1';
    //this._baseUrl = 'http://localhost/wifi.database.mensa/api/v1';
  }

  execute(options) {

    let xhr = new XMLHttpRequest();
    if (options.datatype) xhr.responseType = options.datatype;
    xhr.onload = function (e) {
      if (this.status >= 200 && this.status < 300 && options.successCallback) options.successCallback(this.response);
      else {
        if (options.errorCallback) options.errorCallback(this.status, this.statusText);
      }
    }
    xhr.open(options.method, this._baseUrl + options.url);
    if (options.contentHeader) xhr.setRequestHeader('content-type', options.contentHeader);
    if (options.data && (options.method == 'POST' || options.method == 'PUT' || options.method == 'DELETE')) xhr.send(options.data);
    else xhr.send();

  }


}
