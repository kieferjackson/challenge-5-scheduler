// Select Time Block Container and current day element
const timeblock_c = $('#time_blocks_display');
const current_day_el = $('#currentDay');

// Gets the current time in Military Time
const current_hour = new Date().getHours();
const current_day = determineDate();

// Set the current day element to current date in format (e.g. Thursday, July 21st)
current_day_el.text(current_day);

// The range of times for timeblocks in Military Time
const start_of_day = 9;
const end_of_day = 17;

class TimeBlock {
    constructor(hour) {
        this.hour = hour;
    }

    display(index_of_timeblock) {
        let tblock, hour, desc, save_button;

        // Declare the timeblock element
        tblock = $('<div></div>').addClass('time-block row');

        // Declare hour element to display its time
        hour = $('<div></div>').addClass('hour col-1');
        hour.text(this.#standard_time());

        // Check and set the description depending on if this time block is in the past, present, or future
        if (this.hour < current_hour) {
            // This time block occurred in the past
            desc = this.#g_desc('past');
        } 
        else if (this.hour === current_hour) {
            // This time block is in the present
            desc = this.#g_desc('present');
        }
        else if (this.hour > current_hour) {
            // This time block is in the future
            desc = this.#g_desc('future');
        }

        desc.attr("id", `tb${index_of_timeblock}`);

        // Generate the save button element and sets the index for its timeblock
        save_button = $('<button></button>').addClass('saveBtn');
        save_button.attr('data-tb_index', index_of_timeblock);
        save_button.text("Save");

        // Append all hour, description, and save button to timeblock element
        tblock.append(hour);
        tblock.append(desc);
        tblock.append(save_button);

        // Append the time block to the page
        timeblock_c.append(tblock);
    }

    // Generates the .description based on the current time and timeblock type
    #g_desc(tblock_type) {
        let desc_el = $('<textarea></textarea>').addClass(`description ${tblock_type} col-10`);
        return desc_el;
    }

    #standard_time() {
        const noon = 12;
        
        // The current time of this timeblock is before noon
        if (this.hour < noon) {
            return `${this.hour} am`;
        } 
        // The current time is noon
        else if (this.hour === noon) {
            return `${this.hour} pm`
        }
        // The current time of this timeblock is after noon
        else {
            return `${this.hour - noon} pm`
        }
    }
}

let timeblocks = [];

// Generate Time Blocks depending on the number of hours between start and end of day
for (var i = 0 ; i <= (end_of_day - start_of_day) ; i++) {
    timeblocks[i] = new TimeBlock(start_of_day + i);
    timeblocks[i].display(i);

    // Get the value for this timeblock saved locally, this value is null if no event is saved
    let local_tb = localStorage.getItem(`#tb${i}`);

    // Check if there is an event saved already for this timeblock, and display if so
    if (local_tb != null) {
        // Select the timeblock's event textarea element
        let tb_textarea = document.querySelector(`#tb${i}`);

        // Update the textarea with the locally saved timeblock event
        tb_textarea.value = local_tb;
    }
}

// Select all save buttons in the document
let save_buttons = $('.saveBtn');

// A save button has been clicked for an element, so save the contents of the text area to local storage
save_buttons.on('click', saveTBtoLocal);

function saveTBtoLocal(event) {
    event.preventDefault();

    // Get the index for the timeblock from the button's data attribute
    let tb_id = event.target.dataset.tb_index;

    // Select the timeblock's text area based on its unique id
    const tb_textarea = document.querySelector(`#tb${tb_id}`);
    
    // Check that there is a value entered, and save it locally if so
    if (tb_textarea.value != "") {
        // Input exists for this textarea, save to local storage
        localStorage.setItem(`#tb${tb_id}`, tb_textarea.value);
    } 
    else {
        // No input exists for this textarea, delete the previously saved item if it exists
        if (localStorage.getItem(`#tb${tb_id}`) != null) {
            localStorage.removeItem(`#tb${tb_id}`);
        }
    }
}

function determineDate() {
    const date = new Date();

    const SUNDAY    = 0;
    const MONDAY    = 1;
    const TUESDAY   = 2;
    const WEDNESDAY = 3;
    const THURSDAY  = 4;
    const FRIDAY    = 5;
    const SATURDAY  = 6;

    let weekday = date.getDay();
    switch(weekday) {
        case SUNDAY:    weekday = "Sunday";     break; 
        case MONDAY:    weekday = "Monday";     break; 
        case TUESDAY:   weekday = "Tuesday";    break; 
        case WEDNESDAY: weekday = "Wednesday";  break; 
        case THURSDAY:  weekday = "Thursday";   break; 
        case FRIDAY:    weekday = "Friday";     break; 
        case SATURDAY:  weekday = "Saturday";   break; 
    }

    const JANUARY   = 0;
    const FEBRUARY  = 1;
    const MARCH     = 2;
    const APRIL     = 3;
    const MAY       = 4;
    const JUNE      = 5;
    const JULY      = 6;
    const AUGUST    = 7;
    const SEPTEMBER = 8;
    const OCTOBER   = 9;
    const NOVEMBER  = 10;
    const DECEMBER  = 11;

    let month = date.getMonth();
    switch(month) {
        case JANUARY:   month = "January";      break; 
        case FEBRUARY:  month = "Feburary";     break; 
        case MARCH:     month = "March";        break; 
        case APRIL:     month = "April";        break; 
        case MAY:       month = "May";          break; 
        case JUNE:      month = "June";         break; 
        case JULY:      month = "July";         break; 
        case AUGUST:    month = "August";       break; 
        case SEPTEMBER: month = "September";    break; 
        case OCTOBER:   month = "October";      break; 
        case NOVEMBER:  month = "November";     break; 
        case DECEMBER:  month = "December";     break; 
    }

    let day = date.getDate();
    // ordinals are numbers with additional letters (i.e. 'st, 'nd', 'rd', or 'th') depending on the number
    let ordinal = day % 10;

    // There is an exception for ordinal numbers between 10 and 20 which 'is_special_ordinal' accounts for
    // 11, 12, and 13 end with 'th' instead of 'st', 'nd', and 'rd' respectively
    let is_special_ordinal = day < 10 || day > 20;

    // Set the day of the week
    if (ordinal === 1 && is_special_ordinal) {
        // This day is the ()st of the month
        day += 'st';
    }
    else if (ordinal === 2 && is_special_ordinal) {
        // This day is the ()nd of the month
        day += 'nd';
    }
    else if (ordinal === 3 && is_special_ordinal) {
        // This day is the ()rd of the month
        day += 'rd';
    }
    else {
        // This day is the ()th of the month
        day += 'th';
    }

    return `${weekday}, ${month} ${day}`;
}