import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

import { CommonModule } from '@angular/common';
import { SplitterModule } from 'primeng/splitter';
import { MenuComponent } from '../../components/menu/menu.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

const PRIMEMG_MODULES = [SplitterModule];
const COMPONENTS = [ToolbarComponent, MenuComponent, SidebarComponent];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PRIMEMG_MODULES, COMPONENTS, RouterOutlet, CommonModule],
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
