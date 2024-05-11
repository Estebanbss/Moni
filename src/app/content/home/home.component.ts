
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, DoCheck, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { Wallet } from '../../models/wallet';
import { AppComponent } from '../../app.component';
import { FormsModule } from '@angular/forms';
import { DateService } from '../../services/date.service';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { DateTime,Duration } from 'luxon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck,AfterViewChecked {
  cruds = inject(CrudService);
  main = inject(AppComponent);
  date = inject(DateService);
  cdr = inject(ChangeDetectorRef);
  @Input() user = signal(new Wallet())
  @Input() key = signal('')
  toSubstract = signal('');
  toAdding = signal('');
  daysPassed = signal(this.date.today.getDate());
  daysInMonth = signal(this.date.getLastDayOfTheMonth().getDate());
  weeksInMonth = signal(this.daysInMonth() / 7);
  hourWage = signal(0);
  todayWage = signal(0);
  today = signal(this.date.today.toDateString());
  lastDay = signal(this.date.getLastDayOfTheMonth().toDateString());
  constructor() {

   }
  ngOnInit() {

  }

  ngDoCheck() {
    if(this.user().user !== undefined){
      this.calculate();

    }
  }
  ngAfterViewInit(): void {


  }

  ngAfterViewChecked(){

  }

  ngOnDestroy() {

  }

  substract() {
    if (this.toSubstract() === '' || this.toSubstract() === null || this.toSubstract() === undefined) {
      this.main.emptyModal();
    } else {

      const toSubstractValue = parseFloat(this.toSubstract()); // Convert the input to a number
      if (!isNaN(toSubstractValue)) { // Ensure the conversion is successful
        this.user().amount = parseFloat(((this.user().amount || 0) - (toSubstractValue * this.hourWage())).toFixed(2)); // Subtract the value from amount
        this.changing();
      } else {
        this.main.emptyModal(); // Show an error if conversion fails
      }
    }
  }


  adding() {
    if (this.toAdding() === '' || this.toAdding() === null || this.toAdding() === undefined) {
      this.main.emptyModal();
    } else {
      const amountToAdd = parseFloat(this.toAdding()); // Convert the input to a number
      if (!isNaN(amountToAdd)) { // Ensure the conversion is successful
        this.user().amount = (this.user().amount || 0) + amountToAdd; // Add the value to amount
        this.changing();
      } else {
        this.main.emptyModal(); // Show an error if conversion fails
      }
    }
  }


  changing(){
  this.main.saveWallet(this.user(), this.key());
  }

  calculate(){
    this.hourWage.set(this.user().minimumWage! / (this.user().daysPerWeek! * this.user().hoursPerDay! * this.weeksInMonth()));
    this.todayWage.set(Number((this.daysPassed() * this.hourWage()).toFixed(2)));
  }

  saveSettings(){
    if(this.user().daysPerWeek === undefined || this.user().daysPerWeek === null || this.user().daysPerWeek === 0){
      this.main.emptyModal();
      return
      }
    if(isNaN(this.user().daysPerWeek!)){
      this.main.itsNotANumberModal();
      return
    }
    if(this.user().hoursPerDay === undefined || this.user().hoursPerDay === null || this.user().hoursPerDay === 0){
      this.main.emptyModal();
      return
    }
    if(isNaN(this.user().hoursPerDay!)){
      this.main.itsNotANumberModal();
      return
    }
    if(this.user().minimumWage === undefined || this.user().minimumWage === null || this.user().minimumWage === 0){
      this.main.emptyModal();
      return
    }
    if(isNaN(this.user().minimumWage!)){
      this.main.itsNotANumberModal();
      return
    }
    this.main.saveWallet(this.user(), this.key());
  }


  formatterMoney(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }



}
