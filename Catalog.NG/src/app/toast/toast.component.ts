
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
                // clear alerts when an empty alert is received
                if (!toast.message) {
                    // filter out alerts without 'keepAfterRouteChange' flag
                    this.toasts = this.toasts.filter(x => x.keepAfterRouteChange);

                    // remove 'keepAfterRouteChange' flag on the rest
                    this.toasts.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }

                // add alert to array
                this.toasts.push(toast);

                // auto close alert if required
                if (toast.autoClose) {
                    setTimeout(() => this.removeToast(toast), 3000);
                }
           });

        // clear alerts on location change
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.toastService.clear(this.id);
            }
        });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.toastSubscription!.unsubscribe();
        this.routeSubscription!.unsubscribe();
    }

    removeToast(toast: Toast) {
        console.debug("Toast be gone!");

        // check if already removed to prevent error on auto close
        if (!this.toasts.includes(toast)) return;

        console.debug("It was found!");
        if (this.fade) {
            // fade out alert
            this.toasts!.find(x => x === toast)!.fade = true;

            // remove alert after faded out
            setTimeout(() => {
                this.toasts = this.toasts.filter(x => x !== toast);
            }, 250);
        } else {
            // remove alert
            this.toasts = this.toasts.filter(x => x !== toast);
        }
    }

    cssClass(toast: Toast) {
        if (!toast) return;

        const classes = ['alert', 'alert-dismissable'];
                
        const toastTypeClass = {
            [ToastType.Success]: 'alert alert-success',
            [ToastType.Error]: 'alert alert-danger',
            [ToastType.Info]: 'alert alert-info',
            [ToastType.Warning]: 'alert alert-warning'
        }

        classes.push(toastTypeClass[toast.type!]);

        if (toast.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}