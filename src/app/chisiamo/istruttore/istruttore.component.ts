import { Component, Input } from '@angular/core';
import { Istruttori } from '../istruttori.modal';

@Component({
  selector: 'app-istruttore',
  standalone: true,
  imports: [ ],
  templateUrl: './istruttore.component.html',
  styleUrl: './istruttore.component.css'
})
export class IstruttoreComponent {
  @Input() istruttore!: Istruttori;
}
