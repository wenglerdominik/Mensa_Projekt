const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

import WifiRequest from './wifiRequest.js';
import CalenderComponent from './calendar.js';

let request = new WifiRequest();
//let calendarComponent = new CalenderComponent(document.querySelector('#containerCalendar'));

calendarComponent.createCalender(currentYear, currentMonth);