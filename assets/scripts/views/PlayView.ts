
import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property ,type} = _decorator;

@ccclass('PlayView')
export class PlayView extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @type(Button)
    btn_fail:Button = null;

    start () {
        // this.btn_fail.node.on(Button.EventType.CLICK, ()=>{
        //     controller.setState(GameStateEnum.revive);
        // }, this);
    }

    clickFail(){
        coreEvent.emit('fail');
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
