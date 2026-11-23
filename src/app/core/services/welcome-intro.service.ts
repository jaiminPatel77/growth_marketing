import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WelcomeIntroService {
  /**
   * In-memory signal tracking if the welcome introduction has played
   * during this application runtime session.
   * Resets automatically on full page load or browser refresh (F5),
   * while remaining true during client-side Angular Router navigation.
   */
  private readonly _hasPlayed = signal<boolean>(false);
  readonly hasPlayed = this._hasPlayed.asReadonly();

  markPlayed(): void {
    this._hasPlayed.set(true);
  }

  reset(): void {
    this._hasPlayed.set(false);
  }
}

