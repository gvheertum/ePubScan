import { Injectable } from '@angular/core';
import { Secrets } from './secrets'; //The secrets.example can be used as reference to populate the secrets.ts file

@Injectable({ providedIn: 'root' })
export class Settings {
  public getApplicationTitle() : string { return 'BookCatalog'; }  
  public getSecrets() : Secrets { return new Secrets(); }
}
