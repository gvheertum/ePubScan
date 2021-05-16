import { Injectable } from '@angular/core';
import { Secrets } from './secrets'; //The secrets.example can be used as reference to populate the secrets.ts file

@Injectable({ providedIn: 'root' })
export class Settings {
  public getApplicationTitle() : string { return 'Book Catalog'; }  
  public getNewBookOffset() : number { return 3000; } //Books that are considered new if the status is not set
  public getSecrets() : Secrets { return new Secrets(); } //Reference to the secrets file
}
