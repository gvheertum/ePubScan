import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Toast, ToastType } from './toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private subject = new Subject<Toast>();
    private defaultId = 'default-toast';

    // enable subscribing to alerts observable
    onToast(id = this.defaultId): Observable<Toast> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // convenience methods
    success(message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Success, message }));
    }

    error(message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Error, message }));
    }

    info(message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Info, message }));
    }

    warn(message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Warning, message }));
    }

    // main alert method    
    toast(toast: Toast) {
        console.debug("Logging stuff to toast: ", toast);
        window.alert(toast.message);
        toast.id = toast.id || this.defaultId;
        this.subject.next(toast);
    }

    // clear alerts
    clear(id = this.defaultId) {
        this.subject.next(new Toast({ id }));
    }
}