import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { Corsi } from "./corsi.modal";

@Injectable({
    providedIn: "root"
})
export class CorsiService {
    private httpClient = inject(HttpClient);
    private corsiPreferiti = signal<Corsi[]>([]);
    private istruttori = signal<any[]>([]);

    private fetchCorsi(url: string, errorMessage: string){
        return this.httpClient.get<Corsi[]>(url)
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

    loadCorsi(){
        return this.fetchCorsi('http://localhost:3000/corsi', "Qualcosa è andato storto")
    }

    loadedCorsiPreferiti = this.corsiPreferiti.asReadonly();

    loadCorsiPreferiti(){
        return this.fetchCorsi('http://localhost:3000/corsiPreferiti', "Qualcosa è andato storto con i preferiti")
        .pipe(
          tap({
            next: (corsiPref) => {
              return this.corsiPreferiti.set(corsiPref);
            }
          })
        )
    }

    onPreferito(corso: Corsi){
        const isPreferito = this.corsiPreferiti().some((c) => c.id === corso.id);

        if(isPreferito){
            return this.deletePreferito(corso);
        } else {
          return this.addCorsoPreferito(corso);
        }
    }

    addCorsoPreferito(corso: Corsi){
        this.corsiPreferiti.update( prevCorso => [...prevCorso, corso]);
        return this.httpClient.post('http://localhost:3000/corsiPreferiti', corso)
    }

    deletePreferito(corso: Corsi){
        this.corsiPreferiti.update(
          corsi => corsi.filter(c => c.id !== corso.id)
        )
        return this.httpClient.delete('http://localhost:3000/corsiPreferiti/' + corso.id);
    }

    getIstruttoreById(istruttoreId: string) {
        if (this.istruttori().length === 0) {
            this.loadIstruttori().subscribe();
        }
        
        console.log(this.istruttori().find(istruttore => istruttore.id === istruttoreId));
        return this.istruttori().find(istruttore => istruttore.id === istruttoreId);
    }

    loadIstruttori() {
        return this.httpClient.get<any[]>('http://localhost:3000/istruttori')
            .pipe(
                tap({
                    next: (data) => {
                        this.istruttori.set(data);
                    }
                }),
                catchError((error) => {
                    console.log(error);
                    return throwError(
                        () => {
                            new Error("Qualcosa è andato storto con il caricamento degli istruttori");
                        }
                    )
                })
            );
    }
}