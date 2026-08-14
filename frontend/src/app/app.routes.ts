import { Routes } from '@angular/router';
import { GenreGridComponent } from './components/genre-grid/genre-grid.component';
import { TrackGeneratorComponent } from './components/track-generator/track-generator.component';
import { TrackLibraryComponent } from './components/track-library/track-library.component';
import { DeveloperSuggestionsComponent } from './components/developer-suggestions/developer-suggestions.component';

export const routes: Routes = [
  { path: '', component: GenreGridComponent },
  { path: 'generator', component: TrackGeneratorComponent },
  { path: 'library', component: TrackLibraryComponent },
  { path: 'suggestions', component: DeveloperSuggestionsComponent },
  { path: '**', redirectTo: '' }
];
