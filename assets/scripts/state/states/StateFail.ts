import { instantiate } from "cc";
import { GameController } from "../../GameController";
import { FailView } from "../../views/FailView";
import { AbstractState } from "../AbstractState";


export class StateFail extends AbstractState{
    private view:FailView;
    private core:GameController;

    constructor(core:GameController){
        super();
        this.core = core;
    }

    enter(...args: any[]) {
        this.core.ui.clearView();
        if (!this.view){
            let inst = instantiate(this.core.ui.failView);
            this.view = inst.getComponent(FailView);
        }
        this.core.ui.addView(this.view.node);

        coreEvent.on('revive', this.onRevive, this);
        coreEvent.on('skip', this.onSkip, this);
    }

    exit() {
        // this.view.node.destroy(); 
        coreEvent.off('revive', this.onRevive, this);
        coreEvent.off('skip', this.onSkip, this);
    }

    update(dt: number) {
        
    }

    onRevive(){
        this.core.setState(this.core.states.play);
    }

    onSkip(){
        this.core.setState(this.core.states.result);
    }
}