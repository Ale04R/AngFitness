import { Component, Input, OnInit } from '@angular/core';
import { CorsiPrenotati } from '../prenotazioni.modal';
import { PrenotazioniService } from '../prenotazioni.service';

@Component({
  selector: 'app-prenotazione',
  standalone: true,
  imports: [],
  templateUrl: './prenotazione.component.html',
  styleUrl: './prenotazione.component.css'
})
export class PrenotazioneComponent implements OnInit {
  @Input() corsoPrenotato!: CorsiPrenotati;

  corsiPrenotati: CorsiPrenotati[] = [];
  constructor(private prenotazioniService: PrenotazioniService) {}

  ngOnInit() {
    // Carica tutti i corsi prenotati
    this.prenotazioniService.loadCorsiPrenotati().subscribe((data) => {
      this.corsiPrenotati = data;
    });

    // carica i corsi
    this.prenotazioniService.loadCorsiPrenotati().subscribe();
  }

  getCorsoNome(idCorso: string): string {
    const corso = this.prenotazioniService.getCorsoById(idCorso);
    return corso ? corso.nome : 'Corso non trovato';
  }

  getCorsoCapMax(idCorso: string, nPrenotazioni: number): string {
    const capMax = this.prenotazioniService.getCorsoById(idCorso);
    // console.log(capMax);
    return capMax.capacitaMassima - nPrenotazioni + ' posti disponibili';
  }
}
