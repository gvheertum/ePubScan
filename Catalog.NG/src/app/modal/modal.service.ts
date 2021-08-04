import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ModalMessage, } from './modal.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private subject = new Subject<ModalMessage>();
    private defaultId = 'default-modal';

    confirm(message: string, actionConfirmed?: Function, actionNotConfirmed?: Function) {
        console.debug("Asking confirmation for: ", message);
        if(window.confirm(message))
        {
            console.debug("Confirmed!");
            if(actionConfirmed) { actionConfirmed(); }
        }
        else
        {
            console.debug("NOT Confirmed!");
            if(actionNotConfirmed) { actionNotConfirmed(); }
        }
    }
}