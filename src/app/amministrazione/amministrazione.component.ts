import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorsiPrenotati } from './prenotazioni.modal';
import { PrenotazioniService } from './prenotazioni.service';
import { CorsiService } from '../corsi/corsi.service';
import { Corsi } from '../corsi/corsi.modal';
import { IstruttoriService } from '../chisiamo/istruttore.service';
import { Istruttori } from '../chisiamo/istruttori.modal';

@Component({
  selector: 'app-amministrazione',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './amministrazione.component.html',
  styleUrls: ['./amministrazione.component.css']
})
export class AmministrazioneComponent {
  corsiPrenotati = signal<CorsiPrenotati[]>([]);
  corsi = signal<Corsi[]>([]);
  istruttori = signal<Istruttori[]>([]);
  inCaricamento = signal(false);
  filtro = signal<string>('');

  private destroyRef = inject(DestroyRef);
  private prenotazioniService = inject(PrenotazioniService);
  private corsiService = inject(CorsiService);
  private istruttoriService = inject(IstruttoriService);

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

    this.corsiService.loadCorsi().subscribe((data) => {
      this.corsi.set(data);
    });

    this.istruttoriService.loadIstruttori().subscribe((data) => {
      this.istruttori.set(data);
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  filtraPrenotazioni() {
    const filtroValue = this.filtro().toLowerCase();
    if (filtroValue && this.corsiPrenotati().length > 0) {
      this.corsiPrenotati.set(this.corsiPrenotati().filter(corso => {
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
      const offset = -80;
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

  deleteCorso(corsoId: string) {
    this.corsiService.deleteCorso(corsoId).subscribe(() => {
      this.corsi.update(corsi => corsi.filter(corso => corso.id !== corsoId));
      this.prenotazioniService.deletePrenotazioniByCorsoId(corsoId).subscribe(() => {
        this.corsiPrenotati.update(prenotazioni => prenotazioni.filter(prenotazione => prenotazione.idCorso !== corsoId));
      });
      this.prenotazioniService.deletePreferitiByCorsoId(corsoId).subscribe();
    });
  }
}
