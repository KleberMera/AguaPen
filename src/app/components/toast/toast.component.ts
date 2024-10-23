import { Component } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgxSonnerToaster],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

}
