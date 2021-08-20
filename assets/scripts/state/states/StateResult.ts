import { Game, instantiate } from "cc";
import { GameController } from "../../GameController";
import { ResultView } from "../../views/ResultView";
import { AbstractState } from "../AbstractState";

export class StateResult extends AbstractState{
    private core:GameController;
    private view:ResultView|null = null;

    constructor(core:GameController){
        super();
        this.core = core;
    }
    
    enter(...args: any[]) {
        this.core.ui.clearView();
        if (!this.view){
            let inst = instantiate(this.core.ui.resultView);
            this.view = inst.getComponent(ResultView);
        }
        this.core.ui.addView(this.view.node);

        coreEvent.on('home', this.onHome, this);
        coreEvent.on('play', this.onStart, this);
    }

    exit() {
        // this.view.node.destroy(); 
        coreEvent.off('home', this.onHome, this);
        coreEvent.off('play', this.onStart, this);
    }

    update(dt: number) {
        
    }

    onHome(){
        this.core.setState(this.core.states.home);
    }

    onStart(){
        this.core.setState(this.core.states.play);
    }
}