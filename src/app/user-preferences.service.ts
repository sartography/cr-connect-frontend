import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Preferences} from './preferences.model';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  /*
  User preferences can be stored here, and they will persist between sessions.
  Any component can change these values, and all other subscribers will be notified
  of the modification.  If you have additional settings you wan to keep track of,
  just update the Preferences model.
   */

  private localKey = 'connect_user_pref_settings';
  private readonly _prefs = new BehaviorSubject<Preferences>(Preferences.default());
  readonly preferences$ = this._prefs.asObservable();

  constructor() {
    // Load any existing prefs from local stroage when loaded.
    const jsonPrefs = localStorage.getItem(this.localKey);
    if(jsonPrefs) {
      this._prefs.next(JSON.parse(jsonPrefs))
    } else {
      this.savePreferences()
    }
  }

  updatePreferences(prefs: Preferences) {
    this._prefs.next(prefs);
    this.savePreferences()
  }

  private savePreferences() {
    localStorage.setItem(this.localKey, JSON.stringify(this._prefs.value))
  }

}
