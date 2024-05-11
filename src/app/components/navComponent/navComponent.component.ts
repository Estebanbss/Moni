import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-navComponent',
  templateUrl: './navComponent.component.html',
  styleUrls: ['./navComponent.component.css'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponentComponent implements OnInit {
  @Output() pageToSend: EventEmitter<string> = new EventEmitter<string>();

  @Input() user!: any;
  page = 'Home';

  pages = [
    // { name: 'Settings', svg: '<svg xmlns="http://www.w3.org/2000/svg" width=30px  viewBox="0 0 24 24"><path  d="m12 1l9.5 5.5v11L12 23l-9.5-5.5v-11zm0 14a3 3 0 1 0 0-6a3 3 0 0 0 0 6" /></svg>'},
    { name: 'Home', svg: '<svg xmlns="http://www.w3.org/2000/svg"  width=30px viewBox="0 0 24 24"><path  fill-rule="evenodd" d="M2.52 7.823C2 8.77 2 9.915 2 12.203v1.522c0 3.9 0 5.851 1.172 7.063C4.343 22 6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.212C22 19.576 22 17.626 22 13.725v-1.521c0-2.289 0-3.433-.52-4.381c-.518-.949-1.467-1.537-3.364-2.715l-2-1.241C14.111 2.622 13.108 2 12 2c-1.108 0-2.11.622-4.116 1.867l-2 1.241C3.987 6.286 3.038 6.874 2.519 7.823m6.927 7.575a.75.75 0 1 0-.894 1.204A5.766 5.766 0 0 0 12 17.75a5.766 5.766 0 0 0 3.447-1.148a.75.75 0 1 0-.894-1.204A4.267 4.267 0 0 1 12 16.25a4.267 4.267 0 0 1-2.553-.852" clip-rule="evenodd"/></svg>'},
    { name: 'Stats', svg: '<svg xmlns="http://www.w3.org/2000/svg" width=30px viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.6 2.25A1.35 1.35 0 0 0 2.25 3.6v16.8c0 .746.604 1.35 1.35 1.35h16.8a1.35 1.35 0 0 0 1.35-1.35V3.6a1.35 1.35 0 0 0-1.35-1.35zM8.75 8a.75.75 0 0 0-1.5 0v8a.75.75 0 0 0 1.5 0zM12 10.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75M16.75 13a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0z" clip-rule="evenodd" /></svg>'},
  ];
  constructor(private sanitizer: DomSanitizer) {}


  ngOnInit() {
    this.pageToSend.emit(this.page);
  }

  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  change(page: string) {
    this.page = page;
    this.pageToSend.emit(page);
  }


}
