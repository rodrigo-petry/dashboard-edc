import { WeekDates } from "@core/domain/Dashboards/Dashboards.types";

export function getWeekNumber(startDate : any, currentDate: any) {
    // Calculate the time difference in milliseconds
    const timeDiff = currentDate - startDate;
    
    // Convert milliseconds to weeks (1 week = 7 * 24 * 60 * 60 * 1000 milliseconds)
    const weeks = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
    
    return weeks;
  }

  export function getStartAndEndDateOfWeek(weekNumber:any, startMonth:any,startYear:any) : WeekDates {
    const startDate = new Date(startYear, startMonth, 1); // Set the starting date of the year
    const endDate = new Date(startYear, startMonth, 1); // Set the ending date of the year
    
    startDate.setDate(startDate.getDate() + (7 * (weekNumber - 1) - startDate.getDay()));
    endDate.setDate(endDate.getDate() + (7 * weekNumber - endDate.getDay()));
    
    // Adjust the ending date if it goes beyond the year boundary
    if (endDate.getFullYear() > startYear) {
      endDate.setFullYear(startYear);
      endDate.setMonth(11);
      endDate.setDate(31);
    }
    
    return { start: startDate, end: endDate };
  }
  