import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { Istruttori } from "./istruttori.modal";

@Injectable({
    providedIn: "root"
})
export class IstruttoriService {
    private httpClient = inject(HttpClient);

    private fetchIstruttori(url: string, errorMessage: string){
        return this.httpClient.get<Istruttori[]>(url)
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

    loadIstruttori(){
        return this.fetchIstruttori('http://localhost:3000/istruttori', "Qualcosa è andato storto")
    }
}