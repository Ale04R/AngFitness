
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CorsiService } from './corsi.service';
import { Corsi } from './corsi.modal';
import { CorsoComponent } from './corso/corso.component';


@Component({
  selector: 'app-corsi',
  standalone: true,
  imports: [CorsoComponent],
  templateUrl: './corsi.component.html',
  styleUrl: './corsi.component.css'
})

export class CorsiComponent implements OnInit {
  
    corsi = signal<Corsi[] | undefined>(undefined);
    inCaricamento = signal(false);

    private destroyRef = inject(DestroyRef);
    private corsiService = inject(CorsiService);

    ngOnInit(): void {
        
        const subscription = this.corsiService.loadCorsi()
            .subscribe({
              next: (resData) => {
                this.corsi.set(resData);
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
