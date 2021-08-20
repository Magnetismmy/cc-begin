
import { Label, log, Overflow, UITransform } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property ,integer,requireComponent,executeInEditMode,playOnFocus} = _decorator;


@ccclass('MaxWidthLabel')
@executeInEditMode(true)
@playOnFocus(true)
@requireComponent(Label)
export class MaxWidthLabel extends Component {
    @integer
    maxWidth = 300

    private label:Label = null;
    private _text = null;
    start () {
       
    }

    update (deltaTime: number) {
        if(!this.label){
            this.label = this.getComponent(Label);
        }
        if(!this.label) return;

        let str = this.label.string;
        if(this._text == str) return;
        
        this._text = str;
        this.label.overflow = Overflow.NONE;
        let tranform = this.label.node.getComponent(UITransform);
        let w = tranform.width;
        if(w >= this.maxWidth){
            this.label.overflow = Overflow.RESIZE_HEIGHT;
            tranform.width = this.maxWidth;
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
