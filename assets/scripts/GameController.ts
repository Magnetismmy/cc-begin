import { Component, director, game, Prefab, _decorator, EventTarget, log,  Director, Canvas, Camera } from "cc";
import { StateMachine } from "./state/StateMachine";
import { UIManager } from "./UIManager";
import { GameData } from "./configs/GameData";
import { GameStateEnum } from "./state/states/GameStateEnum";
const { ccclass, property,type } = _decorator;

import { StateHome } from "./state/states/StateHome";
import { StateLoading } from "./state/states/StateLoading";
import { StatePlay } from "./state/states/StatePlay";
import { StateResult } from "./state/states/StateResult";
import { StateFail } from "./state/states/StateFail";

// import * as HL from "howler";


declare global{
    // var controller:GameController;
    var coreEvent:EventTarget;
}

var coreEventT = new EventTarget;

@ccclass("GameController")
export class GameController extends Component{
    @property(UIManager)
    ui:UIManager;

    public states = GameStateEnum;

    stateMachine:StateMachine;
    
    readonly data:GameData;

    constructor(){
        super();
        globalThis.coreEvent = coreEventT;

        this.stateMachine = new StateMachine('core');
        this.data = new GameData;
    }

    onLoad(){  
        game.addPersistRootNode(this.node);

        this.stateMachine.registerState(GameStateEnum.loading, new StateLoading());
        this.stateMachine.registerState(GameStateEnum.home, new StateHome(this));
        this.stateMachine.registerState(GameStateEnum.play, new StatePlay(this));
        this.stateMachine.registerState(GameStateEnum.fail, new StateFail(this));
        this.stateMachine.registerState(GameStateEnum.result, new StateResult(this));


        this.stateMachine.setState(GameStateEnum.loading);

        coreEvent.on('start', this.onStart, this);
    }

    setState(s:GameStateEnum, ...args:any){
        log('[Core] Set Game State', s);
        this.stateMachine.setState(s, ...args);
    }

    start(){
        
    }

    update(dt){
        this.stateMachine.update(dt);
        //Do not add update logic here!!!
    }


    onStart(){
        this.ui = director.getScene().getComponentInChildren(UIManager);
        audioManager.init();
        // let c = this.ui.getComponent(Canvas);
        // c.cameraComponent = stage.getComponentInChildren(Camera);
        this.setState(GameStateEnum.home);
    }
 
}