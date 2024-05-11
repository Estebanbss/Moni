
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Wallet } from '../models/wallet';
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private dbPath = '/wallet';

  walletRef: AngularFireList<Wallet>;
  constructor(private db: AngularFireDatabase,

  ) {
    this.walletRef = db.list(this.dbPath);
  }

  getSingle(key: string): Promise<Wallet | null> {
    return new Promise<Wallet | null>((resolve, reject) => {
      // Realizar la consulta a Firebase utilizando la clave
      const singleWalletRef = this.db.object<Wallet>(`${this.dbPath}/${key}`);
      singleWalletRef
        .valueChanges()
        .pipe(
          take(1) // Esto asegura que la suscripción se complete después de recibir el primer valor y luego se cancele automáticamente
        )
        .subscribe(
          (walletData: any) => {
            if (walletData) {
              resolve(walletData); // Si se encuentra el objeto Wallet, resolver con los datos
            } else {
              resolve(null); // Si no se encuentra ningún resultado, resolver con null
            }
          },
          (error) => {
            reject(error); // En caso de error, rechazar la promesa
          }
        );
    });
  }


  getAll(): AngularFireList<Wallet> {
    return this.walletRef;
  }

  create(wallet: Wallet): Promise<any> {
    return new Promise((resolve, reject) => {
      const newWalletRef = this.walletRef.push(wallet);
      newWalletRef.once('value').then((snapshot) => {
        const newWalletData = snapshot.val();
        resolve(newWalletData);
      }).catch((error) => {
        reject(error);
      });
    });
  }


  update(key: string, value: any): Promise<void> {
    return this.walletRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.walletRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.walletRef.remove();
  }

  gettingUserbyUser(user: string): Promise<Wallet | null> {
    return new Promise<Wallet | null>((resolve, reject) => {
      // Realizar la consulta a Firebase
      this.walletRef
        .query.orderByChild('user')
        .equalTo(user)
        .once('value')
        .then((snapshot) => {
          // Obtener el primer resultado (si existe)
          const userWallet = snapshot.val();
          if (userWallet) {
            // Obtener la clave del primer resultado
            const key = Object.keys(userWallet)[0];
            // Obtener los datos del primer resultado
            const walletData = userWallet[key];
            // Crear un objeto Wallet con los datos obtenidos
            const wallet: Wallet = {
              user: walletData.user,
              daysPerWeek: walletData.daysPerWeek,
              hoursPerDay: walletData.hoursPerDay,
              minimumWage: walletData.minimumWage,
              discountDays: walletData.discountDays,
              amount: walletData.amount
            };
            resolve(wallet);
          } else {
            // Si no se encuentra ningún resultado, resolver con null
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  gettingKeybyUser(user: string): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      this.walletRef
        .query.orderByChild('user')
        .equalTo(user)
        .once('value')
        .then((snapshot) => {
          const userWallet = snapshot.val();
          if (userWallet) {
            const key = Object.keys(userWallet)[0];
            resolve(key);
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

   firstUser(): Promise<void>{
    const random = ['1','2','3','4','5','6','7','8','9','0','a','e','i','o','u','#','_'];
    let newUser = 'newuser_'
        for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * random.length);
        newUser += random[randomIndex];
        }

     return this.create({
      user: newUser,
      daysPerWeek: 5,
      hoursPerDay: 8,
      minimumWage: 1100,
      discountDays: 0,
      amount: 0
       } );
     }

     verifyMonths(key: string, months: string[]): Promise<string[] | null> {
      return new Promise<string[] | null>((resolve, reject) => {
          const updatedMonths: string[] = [];

          // Obtener la referencia a la wallet
          const ref = this.db.object<any[]>(`${this.dbPath}/${key}`);

          ref.valueChanges().pipe(take(1)).subscribe((walletData: any) => {
              if (!walletData) {
                  resolve(null); // No hay datos para la clave dada
                  return;
              }

         // Obtener el arreglo de arreglos lastmonts de la walletData
         const lastmonts: any[] = walletData.lastmonts || [];

         // Verificar cada elemento del arreglo months
         for (const month of months) {
             // Verificar si el mes está presente en el arreglo lastmonts
             if (lastmonts.some(lastmont => lastmont.date === month)) {
                 // Si está presente, no se agrega al arreglo updatedMonths
                 continue;
             }
             // Si no está presente, se agrega al arreglo updatedMonths
             updatedMonths.push(month);
         }
              // Resuelve la promesa con la lista de meses actualizada
              resolve(updatedMonths);
          }, (error) => {
              reject(error); // Rechazar si hay un error al obtener los datos
          });
      });
  }




   }
