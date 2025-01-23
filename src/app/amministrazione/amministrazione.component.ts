import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrenotazioneComponent } from "./prenotazione/prenotazione.component";
import { CorsiPrenotati } from './prenotazioni.modal';
import { PrenotazioniService } from './prenotazioni.service';

@Component({
  selector: 'app-amministrazione',
  standalone: true,
  imports: [CommonModule, FormsModule, PrenotazioneComponent],
  templateUrl: './amministrazione.component.html',
  styleUrls: ['./amministrazione.component.css']
})
export class AmministrazioneComponent {
  corsiPrenotati = signal<CorsiPrenotati[] | undefined>(undefined);
  inCaricamento = signal(false);
  filtro = signal<string>('');

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
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  filtraPrenotazioni() {
    const filtroValue = this.filtro();
    if (filtroValue && this.corsiPrenotati()) {
      this.corsiPrenotati.set(this.corsiPrenotati()!.filter(corso => corso.idCorso.includes(filtroValue)));
    } else {
      this.prenotazioniService.loadCorsiPrenotati().subscribe((data) => {
        this.corsiPrenotati.set(data);
      });
    }
  }
}
