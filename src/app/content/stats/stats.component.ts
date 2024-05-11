import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { Wallet } from '../../models/wallet';
import { CrudService } from '../../services/crud.service';
import { AppComponent } from '../../app.component';
import { DateService } from '../../services/date.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {

  constructor() { }
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
  today = signal(this.date.today.toDateString());
  inputMonthAmount = signal('');
  monthChoose = signal('');
  lastDay = signal(this.date.getLastDayOfTheMonth().toDateString());
  previousMonths = signal(this.date.getPreviousMonthsInThisYear());
  overAll = signal(0);

  ngOnInit() {
  this.verifyPreviousMonths();
  this.overAllAmount();
  }
  verifyPreviousMonths() {
    this.cruds.verifyMonths(this.key(), this.previousMonths()).then((months) => {
      this.previousMonths.set(months!);
      this.cdr.detectChanges();
    } );
  }

  addMonth(){
    if(this.monthChoose() === '' || this.inputMonthAmount() === null || this.inputMonthAmount() ===  undefined){
      this.main.emptyModal()
      return
    }
    if(this.inputMonthAmount() === '' || isNaN(parseFloat(this.inputMonthAmount())) || this.inputMonthAmount === null || this.inputMonthAmount === undefined ){
      this.main.emptyModal()
    }
    if(isNaN(parseFloat(this.inputMonthAmount()))){
      this.main.itsNotANumberModal()
      this.inputMonthAmount.set('')
      return
    }
    if (!this.user().lastmonts) {
      this.user().lastmonts = [];
    }

    this.user().lastmonts!.push({date: this.monthChoose(), amount: parseFloat(this.inputMonthAmount())})
    this.main.saveWallet(this.user(),this.key());
    this.verifyPreviousMonths();
    this.inputMonthAmount.set('');
    this.monthChoose.set('');
  }

  changingInput(){
    this.main.saveWallet(this.user(),this.key());
    this.overAllAmount();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  overAllAmount(){

    let sumaMontos = 0;
    const lastMonths = this.user()?.lastmonts;

    if (lastMonths) {
        for (let i = 0; i < lastMonths.length; i++) {
            let numba = parseFloat(lastMonths[i].amount as unknown as string);
            sumaMontos += numba;
        }
    }
    this.overAll.set(sumaMontos);
  }
  formatterMoney(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }


}
