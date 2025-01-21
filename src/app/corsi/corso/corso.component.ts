import { Component, input } from '@angular/core';
import { Corsi } from '../corsi.modal';

@Component({
  selector: 'app-corso',
  standalone: true,
  imports: [ ],
  templateUrl: './corso.component.html',
  styleUrl: './corso.component.css'
})
export class CorsoComponent {
  corso = input.required<Corsi>();  
}
