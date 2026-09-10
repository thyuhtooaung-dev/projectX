import type { Routes } from '@angular/router';
import { ChatComponent } from '@/features/chat/chat.component';

export const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: 'c/:id', component: ChatComponent },
  { path: '**', redirectTo: '' },
];
