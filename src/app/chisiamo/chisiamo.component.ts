import { Component, inject, OnInit, signal } from '@angular/core';
import { IstruttoreComponent } from "./istruttore/istruttore.component";
import { Istruttori } from "./istruttori.modal";
import { IstruttoriService } from './istruttore.service';

@Component({
  selector: 'app-chisiamo',
  standalone: true,
  imports: [IstruttoreComponent],
  templateUrl: './chisiamo.component.html',
  styleUrl: './chisiamo.component.css'
})
export class ChisiamoComponent implements OnInit {
  istruttori = signal<Istruttori[] | undefined>(undefined);
  inCaricamento = signal(false);

  private istruttoriService = inject(IstruttoriService);

  ngOnInit(): void {
    const subscription = this.istruttoriService.loadIstruttori()
            .subscribe({
              next: (resData) => {
                this.istruttori.set(resData);
                this.inCaricamento.set(true);
              },
              complete: () => {
                this.inCaricamento.set(false);
              }
            })
  }
}
