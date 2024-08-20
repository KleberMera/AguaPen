import { Component, inject, Input } from '@angular/core';
import { LayoutService } from '../../services/gen/layout.service';

import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MenuService } from '../../services/gen/menu.service';
@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [MessagesModule],
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.scss',
  providers: [MessageService],
})
export class ThemesComponent {
  @Input() minimal: boolean = false;
  isDarkTheme: boolean = false;

  public layoutService = inject(LayoutService);
  public menuService = inject(MenuService);
  private srvMessage = inject(MessageService);
  set theme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      theme: val,
    }));
  }

  get theme(): string {
    return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      colorScheme: val,
    }));
  }

  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }

  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;
  }

  toggleTheme() {
    if (this.isDarkTheme) {
      this.changeTheme('lara-light-blue', 'light');
    } else {
      this.changeTheme('mdc-dark-indigo', 'dark');
    }
    this.isDarkTheme = !this.isDarkTheme;
  }
}
