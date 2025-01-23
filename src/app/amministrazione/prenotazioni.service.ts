import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { CorsiPrenotati } from './prenotazioni.modal';

@Injectable({
    providedIn: 'root'
})
  
export class PrenotazioniService {
  private httpClient = inject(HttpClient);
  private prenotazioni = signal<CorsiPrenotati[]>([]);
  private corso = signal<any[]>([]);

  private fetchCorsi(url: string, errorMessage: string){
    return this.httpClient.get<CorsiPrenotati[]>(url)
        .pipe(
            catchError((error) => {
                console.log(error);
                return throwError(
                    () => {
                        new Error(errorMessage);
                    }
                )
            })
        )
      }

  loadCorsiPrenotati() {
    return this.fetchCorsi('http://localhost:3000/corsiPrenotati', "Qualcosa è andato storto")
  }

  getCorsoById(idCorso: string) {
    if (this.corso().length === 0) {
      this.loadCorsi().subscribe((data) => {
        this.corso.set(data);
      });
    }
    console.log(this.corso().find(corso => corso.id === idCorso));
    return this.corso().find(corso => corso.id === idCorso);
  }

  loadCorsi() {
    return this.httpClient.get<any[]>('http://localhost:3000/corsi')
      .pipe(
        tap({
          next: (data) => {
            this.corso.set(data);
          }
        }),
        catchError((error) => {
          console.log(error);
          return throwError(
            () => {
              new Error("Qualcosa è andato storto con i corsi");
            }
          )
        })
      );
  }

  prenotazione(prenotazione: CorsiPrenotati) {
    this.prenotazioni.update(prevCorso => [...prevCorso, prenotazione]);
    return this.httpClient.post('http://localhost:3000/corsiPrenotati', prenotazione);
  } 
}