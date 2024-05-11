import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
  standalone: true,
})
export class TitleComponent implements OnInit {
  @Input() title!: string;
  constructor(private titleService: Title) {}
  ngOnInit() {

  }
  ngDoCheck() {
    this.titleService.setTitle('Moni! - ' +this.title);
  }
}
