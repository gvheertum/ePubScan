export class ModalMessage {
    id?: string;
    
    message?: string;
    
    constructor(init?:Partial<ModalMessage>) {
        Object.assign(this, init);
    }
}