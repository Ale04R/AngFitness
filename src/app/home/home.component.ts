import { Component, inject, OnInit } from '@angular/core';
import { CorsiService } from '../corsi/corsi.service';
import { CorsoComponent } from '../corsi/corso/corso.component';
import { Corsi } from '../corsi/corsi.modal';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CorsoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  private corsiService = inject(CorsiService);

  corsi = this.corsiService.loadedCorsiPreferiti;

  ngOnInit(): void {
      this.corsiService.loadCorsiPreferiti()
        .subscribe({
            complete: () => {
              console.log("Caricamento completato")
            }
        })
  }

  removeCorso(corso: Corsi){
    this.corsiService.deletePreferito(corso).subscribe({
      next: (resData=>{
        console.log("Stai eliminando", resData);
      })
    })
  }
}
