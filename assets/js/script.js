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

    event = "";

    display() {
        let tblock, hour, desc, save_button;

        // Declare the timeblock element
        tblock = $('<div></div>').addClass('time-block row');

        // Declare hour element to display its time
        hour = $('<div></div>').addClass('hour');
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

        // Set the data attribute for this elements time
        desc.attr('data-hour', this.hour);

        // Generate the save button element
        save_button = $('<button></button>').addClass('saveBtn');
        save_button.attr('onclick', 'saveTBtoLocal()');
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
        let desc_el = $('<textarea></textarea>').addClass(`description ${tblock_type}`);
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
    timeblocks[i].display();
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

    // Set the day of the week
    if (ordinal === 1) {
        // This day is the ()st of the month
        day += 'st';
    }
    else if (ordinal === 2) {
        // This day is the ()nd of the month
        day += 'nd';
    }
    else if (ordinal === 3) {
        // This day is the ()rd of the month
        day += 'rd';
    }
    else {
        // This day is the ()th of the month
        day += 'th';
    }

    return `${weekday}, ${month} ${day}`;
}