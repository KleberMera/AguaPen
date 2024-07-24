import { Component, inject } from '@angular/core';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export default class AreasComponent {
  listAreas: any[] = [];

  private SrvList = inject(ListService);

  ngOnInit(): void {
    this.getListAreas();
  }

  getListAreas() {
    this.SrvList.getviewAreas().subscribe((res) => {
      this.listAreas = res.data;
      console.log(this.listAreas);
    });
  }
}
