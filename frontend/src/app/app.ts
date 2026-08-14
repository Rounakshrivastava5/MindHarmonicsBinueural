import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GlobalAudioPlayerComponent } from './components/global-audio-player/global-audio-player.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, GlobalAudioPlayerComponent, AuthModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'MindHarmonics';
}
