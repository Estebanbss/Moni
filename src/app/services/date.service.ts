import { inject, Injectable } from '@angular/core';
import { get } from 'http';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  today = new Date();
  cruds = inject(CrudService);
  lastDayOfTheMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  constructor() { }

  getToday(){
    return this.today;
  }

  getLastDayOfTheMonth(){
    return this.lastDayOfTheMonth;
  }

  getHour(){
    const hour = this.today.getHours();
    const minutes = this.today.getMinutes();
    const seconds = this.today.getSeconds();
    return `${hour}:${minutes}:${seconds}`;
  }

  getPreviousMonthsInThisYear(): string[] {
    const today = new Date(); // Obtener la fecha actual
    const currentMonth = today.getMonth();
    const year = today.getFullYear();

    const previousMonths: string[] = [];
    for (let i = 1; i <= currentMonth; i++) {
      const monthString = new Date(today.getFullYear(), currentMonth - i, 1).toLocaleDateString(undefined, { month: 'long' });
      previousMonths.push(`${monthString}, ${year}`);
    }

    // Ordenar el array en orden cronológico inverso (desde el más antiguo hasta el más reciente)
    previousMonths.sort((a, b) => {
      const [monthA, yearA] = a.split(', ');
      const [monthB, yearB] = b.split(', ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    return previousMonths;
  }





}
