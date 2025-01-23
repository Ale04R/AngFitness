import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorsiPrenotati } from './prenotazioni.modal';
import { PrenotazioniService } from './prenotazioni.service';

@Component({
  selector: 'app-amministrazione',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    const filtroValue = this.filtro().toLowerCase();
    if (filtroValue && this.corsiPrenotati()) {
      this.corsiPrenotati.set(this.corsiPrenotati()!.filter(corso => {
        const corsoNome = this.getCorsoNome(corso.idCorso).toLowerCase();
        return corsoNome.includes(filtroValue);
      }));
    } else {
      this.prenotazioniService.loadCorsiPrenotati().subscribe((data) => {
        this.corsiPrenotati.set(data);
      });
    }
  }

  getCorsoNome(idCorso: string): string {
    const corso = this.prenotazioniService.getCorsoById(idCorso);
    return corso ? corso.nome : 'Corso non trovato';
  }

  getCorsoCapMax(idCorso: string, nPrenotazioni: number): string {
    const capMax = this.prenotazioniService.getCorsoById(idCorso);
    return capMax ? capMax.capacitaMassima - nPrenotazioni + ' posti disponibili' : 'Capacità non trovata';
  }

  scrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = -80; // Altezza dello spazio aggiunto
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
