import { Routes } from '@angular/router';
import { GenreGridComponent } from './components/genre-grid/genre-grid.component';
import { TrackGeneratorComponent } from './components/track-generator/track-generator.component';
import { TrackLibraryComponent } from './components/track-library/track-library.component';
import { DeveloperSuggestionsComponent } from './components/developer-suggestions/developer-suggestions.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: GenreGridComponent },
  { path: 'generator', component: TrackGeneratorComponent, canActivate: [authGuard] },
  { path: 'library', component: TrackLibraryComponent, canActivate: [authGuard] },
  { path: 'suggestions', component: DeveloperSuggestionsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
