import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PrenotazioneComponent } from "./prenotazione/prenotazione.component";
import { CorsiPrenotati } from './prenotazioni.modal';
import { PrenotazioniService } from './prenotazioni.service';

@Component({
  selector: 'app-amministrazione',
  standalone: true,
  imports: [PrenotazioneComponent],
  templateUrl: './amministrazione.component.html',
  styleUrl: './amministrazione.component.css'
})
export class AmministrazioneComponent {
  corsiPrenotati = signal<CorsiPrenotati[] | undefined>(undefined);
  inCaricamento = signal(false);

  private destroyRef = inject(DestroyRef);
  private prenotazioniService = inject(PrenotazioniService);

  ngOnInit(): void {
      
      const subscription = this.prenotazioniService.loadCorsiPrenotati()
          .subscribe({
            next: (resData) => {
              this.corsiPrenotati.set(resData);
              this.inCaricamento.set(true);
            },
            complete: () => {
              this.inCaricamento.set(false);
            }
          })
      
      this.destroyRef.onDestroy(()=>{
            subscription.unsubscribe();
          }
          )
  }
}
