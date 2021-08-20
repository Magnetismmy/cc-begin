
import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property ,type} = _decorator;

@ccclass('ResultView')
export class ResultView extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @type(Button)
    btn_home:Button = null;

    @type(Button)
    btn_play:Button = null;

    start () {
        // [3]
        // this.btn_home.node.on(Button.EventType.CLICK, ()=>{
        //     controller.setState(GameStateEnum.home);
        // }, this);

        // this.btn_play.node.on(Button.EventType.CLICK, ()=>{
        //     controller.setState(GameStateEnum.play);
        // }, this);
    }

    clickHome(){
        coreEvent.emit('home');
    }

    clickPlay(){
        coreEvent.emit('play');
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
