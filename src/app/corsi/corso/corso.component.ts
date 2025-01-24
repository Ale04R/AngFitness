import { Component, Input } from '@angular/core';
import { Corsi } from '../corsi.modal';
import { CorsiService } from '../corsi.service';
import { CorsiPrenotati } from '../../amministrazione/prenotazioni.modal';
import { PrenotazioniService } from '../../amministrazione/prenotazioni.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-corso',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './corso.component.html',
  styleUrls: ['./corso.component.css']
})
export class CorsoComponent {
  @Input() corso!: Corsi;

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  corsi: Corsi[] = [];
  corsiPreferiti: Corsi[] = [];

  idAttuale: number = 1;

  constructor(private corsiService: CorsiService, private prenotazioniService: PrenotazioniService) {}

  ngOnInit() {
    const salvaId = localStorage.getItem('idAttuale');
    if (salvaId) {
      this.idAttuale = parseInt(salvaId, 10);
    }
    // Carica tutti i corsi
    this.corsiService.loadCorsi().subscribe((data) => {
      this.corsi = data;
    });

    // Carica i preferiti
    this.corsiService.loadCorsiPreferiti().subscribe(() => {
      this.corsiPreferiti = this.corsiService.loadedCorsiPreferiti();
    });

    // Carica gli istruttori
    this.corsiService.loadIstruttori().subscribe();
  }

  preferito(corso: Corsi) {
    this.corsiService.onPreferito(corso).subscribe(() => {
      // Aggiorna i corsi preferiti dopo l'operazione
      this.corsiPreferiti = this.corsiService.loadedCorsiPreferiti();
    });
  }

  isPreferito(corso: Corsi): boolean {
    return this.corsiPreferiti.some((c) => c.id === corso.id);
  }

  getIstruttoreNome(istruttoreId: string): string {
    const istruttore = this.corsiService.getIstruttoreById(istruttoreId);
    return istruttore ? istruttore.nome : 'Istruttore non trovato';
  }

  prenota() {
    if (this.form.valid) {
      const prenotazione: CorsiPrenotati = {
        id: this.idAttuale,
        userName: this.form.value.nome || '',
        email: this.form.value.email || '',
        idCorso: this.corso.id,
        nPrenotazioni: 1,
      };

      this.prenotazioniService.prenotazione(prenotazione)
        .subscribe(response => {
          console.log(response);
          this.idAttuale++;
          localStorage.setItem('idAttuale', this.idAttuale.toString());
          this.form.reset();
        });
    }
  }
}
