import { Injectable } from '@angular/core';
import { Location } from '../types/location.interface';

const PERIODS = {
  morning: {
    first: 6,
    last: 12,
  },
  afternoon: {
    first: 12,
    last: 18,
  },
  night: {
    first: 18,
    last: 23,
  },
};

type PeriodsOptions = keyof typeof PERIODS;

@Injectable({
  providedIn: 'root',
})
export class FilterUnitsService {
  constructor() {}

  transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.';
      case 6:
        return 'Sáb.';
      default:
        return 'Seg. à Sex.';
    }
  }

  filterUnits(unit: Location, openHourFilter: number, closeHourFilter: number) {
    if (!unit.schedules) return true;

    let todayWeekday = this.transformWeekday(new Date().getDay());

    for (let i = 0; i < unit.schedules.length; i++) {
      let scheduleHour = unit.schedules[i].hour;
      let scheduleWeekday = unit.schedules[i].weekdays;
      if (todayWeekday === scheduleWeekday) {
        if (scheduleHour !== 'Fechada') {
          let [unitOpenHour, unitCloseHour] = scheduleHour
            .split(' às ')
            .map((value) => parseInt(value));

          if (
            unitOpenHour <= openHourFilter &&
            unitCloseHour >= closeHourFilter
          )
            return true;

          return false;
        }
      }
    }

    return false;
  }

  filter(results: Location[], showClosed: boolean, period: string) {
    let filteredResults = results;
    console.log(results);
    if (!showClosed) {
      filteredResults = filteredResults.filter((location) => location.opened);
    }

    if (period) {
      const { first: openHourFilter, last: closeHourFilter } =
        PERIODS[period as PeriodsOptions];

      filteredResults = filteredResults.filter((location) =>
        this.filterUnits(location, openHourFilter, closeHourFilter)
      );
    }

    console.log(filteredResults === results);
    return filteredResults;
  }
}
