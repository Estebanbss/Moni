import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponentComponent } from './components/navComponent/navComponent.component';
import { TitleComponent } from './components/title/title.component';
import { HomeComponent } from './content/home/home.component';
import { SettingsComponent } from './content/settings/settings.component';
import { StatsComponent } from './content/stats/stats.component';
import { CrudService } from './services/crud.service';
import { CookieService } from 'ngx-cookie-service';
import { Wallet } from './models/wallet';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponentComponent, TitleComponent, HomeComponent, SettingsComponent, StatsComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  pageToReceive: string = 'Home';
  user = signal(new Wallet())
  first = signal(true)
  showDialog = signal(false)
  key = signal('')
  changeAccountInput = signal('')
  alert = signal('')
  isFirstLoad = true
  private cruds = inject(CrudService);
  private cookies = inject(CookieService);
  constructor() {
    effect(() => {
      if (typeof window !== 'undefined' && this.user().user !== '' && this.user().user !== undefined && this.isFirstLoad === false) {
          console.log(`effect in: ${this.user().user}`);
       }else{
          this.isFirstLoad = true;
       }
    });
   }
  ngOnInit(): void {

  }

  updating(){
    if(this.user().user !== '' && this.user().user !== null && this.user().user !== undefined){
      this.saveWallet(this.user(), this.key());
    }else{
      document.execCommand('undo');
    }
  }


  ngAfterViewInit(): void {
    this.checkUser();

  }

  receivePage(page: string) {
    this.pageToReceive = page;
  }

  async checkUser() {
    if (typeof window !== 'undefined') {
      const key = this.cookies.get('user');
      if (key) {
        const wallet = await this.cruds.getSingle(key)
        if (wallet) {
          this.user.set(wallet);
          this.key.set(key);
        }

      } else {
        this.cruds.firstUser().then(async (wallet) => {
          let newWallet = new Wallet();
          newWallet = wallet!;
          this.user.set(newWallet);
          const key = await this.cruds.gettingKeybyUser(newWallet.user!);
          if(key){
           this.key.set(key);
           this.cookies.set('user', key)
          }
        })
      }
    }
  }

  async saveWallet(wallet: Wallet, key: string) {
    this.cruds.update(key, wallet);
  }

  async newAccount(){
    this.cookies.delete('user');
    window.location.reload();
  }

  async changeAccount(){
      if(this.changeAccountInput() !== '' && this.changeAccountInput() !== null && this.changeAccountInput() !== undefined){
        const response = await this.cruds.gettingUserbyUser(this.changeAccountInput());
        if(response !== null && response !== undefined ){
        const key = await this.cruds.gettingKeybyUser(this.changeAccountInput());
        this.cookies.delete('user');
        if(key){
          this.cookies.set('user', key);
          window.location.reload();
        }
        }else{
          this.accountNotFoundModal();
        }

      }else{
        this.emptyModal();
      }
  }

  emptyModal(){
    document.execCommand('undo');
    this.alert.set('It cant be empty')
    setTimeout(() =>{
      this.alert.set('')
    }, 3000);
  }

  itsNotANumberModal(){
    this.alert.set('It must be a number')
    setTimeout(() =>{
      this.alert.set('')
    }, 3000);
  }

  accountNotFoundModal(){
    this.alert.set('Account not found')
    setTimeout(() =>{
      this.alert.set('')
    }, 3000);
  }
}
