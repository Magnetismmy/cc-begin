import { Constructor } from "cc";
import { AbstractState} from "./AbstractState";

interface StateInfo{
    name:string|number, 
    args:any[],
}

export class StateMachine{
    static machines:Array<StateMachine> = [];

    private stateMap:{[index:string]:AbstractState} = {};
    // private reverseMap:{[index:string]:number|string} = {};
    private _curState:StateInfo|null = null;
    private _nxtState:StateInfo|null = null;
    counter = 0;

    
    constructor(name:any){
        if (name){
            StateMachine.machines[name] = this;
        }else{
            StateMachine.machines.push(this);
        }
    }

    static get(n:any){
        return StateMachine.machines[n];
    }

    get currentState(){
        return this._curState?.name;
    }

    registerState(num:number, state:AbstractState){
        state.controller = this;
        this.stateMap[num] = state;
        // if (state.name)
        //     this.reverseMap[state.name] = num;
    }
    
    setState(name:string|number, ...args:any){
        if (this._nxtState || (this._curState && this._curState.name == name)) return false;
        this._nxtState = {name, args};
        return true;
    }

    update(dt:number){
        this.counter += dt;

        let s = this._curState && this.stateMap[this._curState.name];
        let ns = this._nxtState && this.stateMap[this._nxtState.name];
        if(ns){
            s?.exit();
            this._curState = this._nxtState;
            this._nxtState = null;
            this.counter = 0;

            s = ns;
            let t = this._curState.args;
            s?.enter(...t);
        }
        s?.update(dt, this.counter);
    }
}