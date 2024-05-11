import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { Wallet } from '../../models/wallet';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  constructor() { }
  cruds = inject(CrudService);
  @Input() user = signal(new Wallet())
  @Input() key = signal('')
  ngOnInit() {
  }

}
