
﻿import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Toast, ToastType } from './toast.model';
import { ToastService } from './toast.service';

@Component({ selector: 'toast', styleUrls: ['toast.component.less'] , templateUrl: 'toast.component.html' })
export class ToastComponent implements OnInit, OnDestroy {
    @Input() id = 'default-toast';
    @Input() fade = true;

    toasts: Toast[] = [];
    toastSubscription?: Subscription;
    routeSubscription?: Subscription;

    constructor(private router: Router, private toastService: ToastService) { }

    ngOnInit() {
        // subscribe to new alert notifications
        this.toastSubscription = this.toastService.onToast(this.id)
            .subscribe(toast => {

                // If an empty item is pushed we need to purge the list
                if(!toast || !toast.message) {
                    this.toasts = []; //TODO: Why is this implemented this way?
                    return;
                }

                this.toasts.push(toast);
                setTimeout(() => this.removeToast(toast), 10000);
           });

        // On change of route purge all toasts
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.toastService.clear(this.id);
            }
        });

        console.debug("Toasts:", this.toasts.length, this.toasts);
    }

    ngOnDestroy() {
        this.toastSubscription!.unsubscribe();
        this.routeSubscription!.unsubscribe();
    }

    removeToast(toast: Toast) {
        if (!this.toasts.includes(toast)) return;
        this.toasts = this.toasts.filter(x => x !== toast);
    }

    messageType(toast: Toast) {
        if(!toast || !toast.type) { return null; }
        switch(toast.type)
        {
            case ToastType.Success: return "✔ Success";
            case ToastType.Error: return "❌ Success";
            case ToastType.Info: return "ℹ️ Information";
            case ToastType.Warning: return "⚠️ Warning";
            default: return "Unknown Message Type";
        }
    }
}