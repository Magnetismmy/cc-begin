import {Event} from 'cc';

export class CCCEvent extends Event{
    public data:any;
    constructor(name: string, bubbles?: boolean, ...data: any) {
        super(name, bubbles);
        this.data = data;
    }
}