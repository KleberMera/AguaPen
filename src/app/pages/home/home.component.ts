import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { CommonModule } from '@angular/common';
import { SplitterModule } from 'primeng/splitter';
import { MenuComponent } from '../../components/menu/menu.component';

const PRIMEMG_MODULES = [SplitterModule];
const Componentes = [
  ToolbarComponent,
  SidebarComponent,
  MenuComponent

]

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PRIMEMG_MODULES, Componentes, RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent implements OnInit {
  menuVisible: boolean = true;

  constructor() {}

  ngOnInit() {}

  onMenuVisibilityChange(visible: boolean) {
    this.menuVisible = visible;
  }
}
