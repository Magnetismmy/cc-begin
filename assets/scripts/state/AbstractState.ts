import { Component, log, warn } from "cc";
import { StateMachine } from "./StateMachine";

export abstract class AbstractState{
    protected _controller: StateMachine|null = null;
    private _once = true;
    protected name = 'State';

    set controller(o:StateMachine){
        this._controller = o;
    }

    protected log(...args:any){
        log(`[Game]${this.name}`, ...args);
    }

    abstract enter(...args:any[]):void;
    update(deltaTime:number, counter?:number){
        if (this._once){
            warn('Update() not implemented');
            this._once = false;
        }
    };
    abstract exit():void;
}