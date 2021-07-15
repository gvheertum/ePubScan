export class Toast {
    id?: string;
    type?: ToastType;
    message?: string;
    
    constructor(init?:Partial<Toast>) {
        Object.assign(this, init);
    }
}

export enum ToastType {
    Unknown,
    Success,
    Error,
    Info,
    Warning
}