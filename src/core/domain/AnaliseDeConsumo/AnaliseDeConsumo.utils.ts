
export function getWeeksInMonth(year : number, month: number) {
    let date = new Date(year, month - 1, 1);
    let weeks = [];
    let week = [];

    // Adjust the start date to the nearest Sunday before the 1st of the month
    while (date.getDay() !== 0) {
        date.setDate(date.getDate() - 1);
    }

    // Loop through the weeks
    while (true) {
        week = [];

        // Loop through the days of the week
        for (let i = 0; i < 7; i++) {
            week.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        weeks.push(week);

        // Break if the month has ended and the current date is after the last day of the month
        if (date.getMonth() !== month - 1 && date.getDay() === 0) {
            break;
        }
    }

    return weeks;
}

// Example usage
let year = 2024;
let month = 4; // June

let weeks = getWeeksInMonth(year, month);


export function getWeeksBetweenDates(startDate: Date, endDate: Date) {
    let date = new Date(startDate);
    let weeks = [];
    let week = [];

    // Adjust the start date to the nearest Sunday before the startDate
    while (date.getDay() !== 0) {
        date.setDate(date.getDate() - 1);
    }

    // Loop through the weeks until the end date is reached
    while (date <= endDate) {
        week = [];

        // Loop through the days of the week
        for (let i = 0; i < 7; i++) {
            week.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        weeks.push(week);
    }

    return weeks;
}


export function getDateFourWeeksAgo(): Date {
    let date = new Date();
    date.setDate(date.getDate() - 28); // 28 days ago
    return date;
}

