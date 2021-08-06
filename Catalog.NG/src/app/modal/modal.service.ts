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
            title: "Please confirm",
            buttons: [ { text: "No", action: actionNotConfirmed, buttonType: "danger" }, { text: "Yes", action: actionConfirmed, buttonType: "success" } ]
        };
        this.showModal(msgModel);
    }

    showModal(modalModel: ModalMessage) {
        this.subject.next(modalModel);
    }
}