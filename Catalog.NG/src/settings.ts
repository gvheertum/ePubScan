import { Injectable } from '@angular/core';
import { environment } from './environments/environment';

@Injectable({ providedIn: 'root' })
export class Settings {
  public getApplicationTitle() : string { return 'Book Catalog'; }  
  public getNewBookOffset() : number { return 3000; } //Books that are considered new if the status is not set
  public getApiUrl() : string { return environment.apiUrl; } //Reference to the secrets file
}

