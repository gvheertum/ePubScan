import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ModalMessage, } from './modal.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private subject = new Subject<ModalMessage>();
    
    onChange(): Observable<ModalMessage> {
        return this.subject.asObservable().pipe();
    }
    
    confirm(message: string, actionConfirmed: Function, actionNotConfirmed: Function) {
        
        var msgModel : ModalMessage = {
            message: message,
            buttons: [ { text: "No", action: actionNotConfirmed }, { text: "Yes", action: actionConfirmed } ]
        };
        this.showModal(msgModel);
    }

    showModal(modalModel: ModalMessage) {
        this.subject.next(modalModel);
    }
}