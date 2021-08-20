
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property, float } = _decorator;

@ccclass('BreathEffect')
export class BreathEffect extends Component {
    // [1]
    // dummy = '';

    // [2]
    @float
    cycle = 2;

    @float
    transformRate = 0.1;

    private _counter = this.cycle/2;

    private _scale: null | Vec3 = null;


    onEnable () {
        // [3]
        this._scale = this.node.getScale();
    }

    onDisable(){
        if (this._scale){
            this.node.setScale(this._scale);
            this._scale = null;
        }
    }

    update (deltaTime: number) {
        this._counter += deltaTime;
        if (this._counter >= this.cycle/2){
            this._counter -= this.cycle;
        }
        if (this._scale){
            let v = new Vec3().add(this._scale);
            let f = (this._counter>0?-1:1) * 4/this.cycle*this._counter + 1;
            this.node.setScale(v.multiplyScalar(1+f*this.transformRate));
        }
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
