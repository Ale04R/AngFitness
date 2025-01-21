import { Component, Input } from '@angular/core';
import { Corsi } from '../corsi.modal';
import { CorsiService } from '../corsi.service';

@Component({
  selector: 'app-corso',
  standalone: true,
  imports: [ ],
  templateUrl: './corso.component.html',
  styleUrl: './corso.component.css'
})
export class CorsoComponent {
  @Input() corso!: Corsi;
  
  corsi: Corsi[] = [];
  corsiPreferiti: Corsi[] = [];
  constructor(private corsiService: CorsiService) {}

  ngOnInit() {
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
}
