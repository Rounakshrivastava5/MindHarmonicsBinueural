import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GlobalAudioPlayerComponent } from './components/global-audio-player/global-audio-player.component';
import { AmbientBackgroundComponent } from './components/ambient-background/ambient-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, GlobalAudioPlayerComponent, AmbientBackgroundComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'MindHarmonics';
}
