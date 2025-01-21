import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Corso } from "../corsi/corso.modal";

@Injectable({ providedIn: 'root' })
export class CorsiService {
  private httpClient = inject(HttpClient);

  private fetchCorsi(url: string, errorMessage: string) {
    return this.httpClient.get<Corso[]>(url).pipe(
      catchError((error) => {
        console.error('Errore:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  loadCorsi() {
    return this.fetchCorsi('http://localhost:3000/corsi', 'Errore nel caricamento dei corsi');
  }
}
