import { instantiate, Prefab } from "cc";
import { GameController } from "../../GameController";
import { HomeView } from '../../views/HomeView'
import { AbstractState } from "../AbstractState";

export class StateHome extends AbstractState{
    private core:GameController;
    private view:HomeView|null = null;

    constructor(core:GameController){
        super();
        this.core = core;
    }

    enter(...args: any[]) {
        this.core.ui.clearView();
        if (!this.view){
            let inst = instantiate(this.core.ui.homeView);
            this.view = inst.getComponent(HomeView);
        }
        this.core.ui.addView(this.view.node);

        coreEvent.on('play', this.onPlay, this);
        coreEvent.on('test', this.onTest, this);
        coreEvent.on('sound', this.onSound, this);
    }

    exit() {
        coreEvent.off('play', this.onPlay, this);
        coreEvent.off('test', this.onTest, this);
        coreEvent.off('sound', this.onSound, this);
        // this.view.node.destroy(); 
    }

    update(dt: number) {
        
    }
    
    onTest(s:string){
        stage.toast(s);
    }

    onPlay(){
        this.core.setState(this.core.states.play);
    }

    onSound(){
        audioManager.play();
    }
}