import { Component } from '@angular/core';

@Component({
  selector: 'app-updated',
  standalone: true,
  imports: [],
  templateUrl: './updated.component.html',
  styleUrl: './updated.component.scss'
})
export class UpdatedComponent  {

  ngOnInit(): void {
    console.log('updated works!');
    
    
  }

}
