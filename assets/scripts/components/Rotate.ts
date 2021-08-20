
import { _decorator, Component, Node, utils, math } from 'cc';
const { ccclass, property ,integer,executeInEditMode,playOnFocus} = _decorator;

@ccclass('Rotate')
@executeInEditMode(false)
@playOnFocus(true)
export class Rotate extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @integer
    speed = -360

    start () {
        // [3]
    }

    update (deltaTime: number) {
        this.node.angle = math.repeat(this.node.angle + this.speed * deltaTime,360);
    }
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
