export class ModalMessage {
    id?: string;
    title?: string;
    message?: string;
    
    buttons?: Array<ModalButton>;

    constructor(init?:Partial<ModalMessage>) {
        Object.assign(this, init);
    }
}

export class ModalButton {
    text: string = "";
    action?: Function;
    buttonType: string = "primary";

    constructor(init?:Partial<ModalMessage>) {
        Object.assign(this, init);
    }
}