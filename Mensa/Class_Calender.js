let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
export { currentYear, currentMonth };
export default class Calender {
    constructor() {
        this._calenderHead = `<div class="month">
        <ul>
            <li class="prev" id="prevMonth">&#10094;</li>
            <li class="next" id="nextMonth">&#10095;</li>
            <li id="calendar-head">asf<br>
                <span style="font-size:18px">2017</span>
            </li>
        </ul>
    </div>`;
        this._calenderBody = `	<table class="table table-bordered" id="Calendar">
        <thead class="thead-dark" id="calendar-tHead">
            <tr>
                <th class="th-calendar" data-day="1">Mo</th>
                <th class="th-calendar" data-day="2">Di</th>
                <th class="th-calendar" data-day="3">Mi</th>
                <th class="th-calendar" data-day="4">Do</th>
                <th class="th-calendar" data-day="5">Fr</th>

            </tr>
        </thead>
        <tbody id="calendar-body">
            <tr>

            </tr>
        </tbody>
        <tfoot>
            <!-- <tr>
                <th></th>
            </tr> -->
        </tfoot>
    </table>`;


    }

    createCalender(targetElement) {
        const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember']

        targetElement.innerHTML = this._calenderHead + this._calenderBody;

        let calendarBody = document.querySelector('#calendar-body');
        let head = document.querySelector('#calendar-head');
        let br = document.createElement('br');
        head.innerHTML = months[currentMonth];
        head.append(br, currentYear)
        const getdDaysInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let firstday = new Date(currentYear, currentMonth).getDay();
        const daysInMonth = getdDaysInMonth(new Date(currentYear, currentMonth));
        calendarBody.innerHTML = ''
        let dayCounter = 1;
        let rowMax = 5;
        for (let row = 0; row < rowMax; row++) {
            const tr = document.createElement('tr');
            tr.classList = 'tr-calendar'
            for (let tdCount = 0; tdCount < 5; tdCount++) {
                let dayOfWeek = new Date(currentYear, currentMonth, dayCounter).getDay();
                let date = new Date(currentYear, currentMonth, dayCounter).toString();
                const td = document.createElement('td');

                td.classList = 'days active'
                if ((firstday === 0 || firstday === 6) && row === 0) {
                    dayCounter++;
                    rowMax = 6;
                    break;
                }
                if (tdCount + 1 < firstday && row === 0) {
                    td.innerText = ''
                    td.classList = 'days inactive'
                    tr.appendChild(td);
                }
                else if (dayOfWeek === 0 || dayOfWeek === 6) {
                    dayCounter++;
                    tdCount--;
                }
                else if (dayCounter > daysInMonth) {
                    row = 6;
                    break;
                }
                else {
                    const ul = document.createElement('ul');
                    td.innerText = dayCounter;
                    td.setAttribute('id', date);
                    $(td).data('date', date);
                    dayCounter++;
                    td.appendChild(ul);
                    tr.appendChild(td);
                }
                if (dayCounter < daysInMonth) {
                    calendarBody.appendChild(tr);
                }

            }

        }
        document.getElementById('nextMonth').addEventListener('click', () => {

            currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
            currentMonth = (currentMonth + 1) % 12;

            this.createCalender(targetElement);
        })
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
            currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;

            this.createCalender(targetElement);
        })

    }

}

