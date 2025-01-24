import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CorsiPrenotati } from './prenotazioni.modal';
import { PrenotazioniService } from './prenotazioni.service';
import { CorsiService } from '../corsi/corsi.service';
import { Corsi } from '../corsi/corsi.modal';
import { IstruttoriService } from '../chisiamo/istruttore.service';
import { Istruttori } from '../chisiamo/istruttori.modal';

@Component({
  selector: 'app-amministrazione',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './amministrazione.component.html',
  styleUrls: ['./amministrazione.component.css']
})
export class AmministrazioneComponent {
  corsiPrenotati = signal<CorsiPrenotati[]>([]);
  corsi = signal<Corsi[]>([]);
  istruttori = signal<Istruttori[]>([]);
  inCaricamento = signal(false);
  filtro = new FormControl('');
  selectedCorsoId = signal<string | null>(null);

  private destroyRef = inject(DestroyRef);
  private prenotazioniService = inject(PrenotazioniService);
  private corsiService = inject(CorsiService);
  private istruttoriService = inject(IstruttoriService);

  form = new FormGroup({
    nome: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    descrizione: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    durata: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    capacita: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    istruttore: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
  })

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
    const filtroValue = this.filtro.value?.toLowerCase() || '';
    if (filtroValue) {
      this.prenotazioniService.loadCorsiPrenotati().subscribe((data) => {
        const filteredData = data.filter(corso => {
          const corsoNome = this.getCorsoNome(corso.idCorso).toLowerCase();
          return corsoNome.includes(filtroValue);
        });
        this.corsiPrenotati.set(filteredData);
      });
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

  aggiungiCorso() {
    if (this.form.valid) {
      const nuovoCorso: Corsi = {
        id: this.generateId(),
        nome: this.form.value.nome!,
        descrizione: this.form.value.descrizione!,
        durata: this.form.value.durata!,
        capacitaMassima: Number(this.form.value.capacita!),
        istruttoreId: this.form.value.istruttore!,
      };

      this.corsiService.addCorso(nuovoCorso).subscribe(response => {
        console.log(response);
        this.corsi.update(corsi => [...corsi, nuovoCorso]);
        this.form.reset();
        this.closeModal();
      });
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private closeModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.setAttribute('style', 'display: none');
      document.body.classList.remove('modal-open');
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }
  }

  openModal(corsoId: string) {
    this.selectedCorsoId.set(corsoId);
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.setAttribute('style', 'display: block');
      document.body.classList.add('modal-open');
      const modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(modalBackdrop);
    }
  }
}
