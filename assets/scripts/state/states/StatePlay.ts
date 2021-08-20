import { instantiate, view } from "cc";
import { GameController } from "../../GameController";
import { PlayView } from "../../views/PlayView";
import { AbstractState } from "../AbstractState";

export class StatePlay extends AbstractState{
    private view:PlayView|null = null;
    private core:GameController;

    constructor(core:GameController){
        super();
        this.core = core;
    }

    enter(...args: any[]) {
        this.core.ui.clearView();
        if (!this.view){
            let inst = instantiate(this.core.ui.playView);
            this.view = inst.getComponent(PlayView);
        }
        this.core.ui.addView(this.view.node);

        coreEvent.on('fail', this.onFail, this);
    }

    exit() {
        coreEvent.off('fail', this.onFail, this);
        // this.view.node.destroy(); 
    }


    onFail(){
        this.core.setState(this.core.states.fail);
    }

    update(dt: number) {
        
    }
}