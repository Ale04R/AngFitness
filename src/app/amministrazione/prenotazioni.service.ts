import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { signal } from '@angular/core';
import { CorsiPrenotati } from './prenotazioni.modal';

@Injectable({
    providedIn: 'root'
})
  
export class PrenotazioniService {
  private httpClient = inject(HttpClient);
  private corsiPrenotati = signal<any[]>([]);

  getCorsoById(idCorso: string) {
    if (this.corsiPrenotati().length === 0) {
      this.loadCorsiPrenotati().subscribe();
    }
    return this.corsiPrenotati().find(corsiPrenotati => corsiPrenotati.id === idCorso);
  }

  loadCorsiPrenotati() {
    return this.httpClient.get<CorsiPrenotati[]>('http://localhost:3000/corsiPrenotati')
      .pipe(
        tap({
          next: (data) => {
            this.corsiPrenotati.set(data);
          }
        }),
        catchError((error) => {
          console.log(error);
          return throwError(
            () => new Error("Qualcosa è andato storto con il caricamento dei corsi prenotati")
          );
        })
      );
  }

  onPrenotato(corso: CorsiPrenotati) {
    const isPrenotato = this.corsiPrenotati().some((c) => c.idCorso === corso.idCorso && c.email === corso.email);

    if (isPrenotato) {
      return this.deletePrenotato(corso);
    } else {
      return this.addCorsoPrenotato(corso);
    }
  }

  addCorsoPrenotato(corso: CorsiPrenotati) {
    this.corsiPrenotati.update(prevCorso => [...prevCorso, corso]);
    return this.httpClient.post('http://localhost:3000/corsiPrenotati', corso);
  }

  deletePrenotato(corso: CorsiPrenotati) {
    this.corsiPrenotati.update(
      corsi => corsi.filter(c => c.idCorso !== corso.idCorso || c.email !== corso.email)
    );
    return this.httpClient.delete('http://localhost:3000/corsiPrenotati/' + corso.id);
  }
}