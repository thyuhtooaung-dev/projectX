import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  host: {
    class: 'block h-screen w-screen overflow-hidden',
  },
})
export class AppComponent {}
