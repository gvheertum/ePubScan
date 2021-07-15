export class Toast {
    id?: string;
    type?: ToastType;
    message?: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
    fade?: boolean;

    constructor(init?:Partial<Toast>) {
        Object.assign(this, init);
    }
}

export enum ToastType {
    Success,
    Error,
    Info,
    Warning
}