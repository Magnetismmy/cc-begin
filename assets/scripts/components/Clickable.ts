
import { _decorator, Component, Node, SystemEventType, EventTouch, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Clickable')
export class Clickable extends Component {
    private _pressed: boolean;
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]

    }

    onEnable(){
        this._registerNodeEvent()
    }

    onDisable(){
        this._unregisterNodeEvent();
    }

    protected _registerNodeEvent () {
        this.node.on(SystemEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(SystemEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    protected _unregisterNodeEvent () {
        this.node.targetOff(this);
        // this.node.off(SystemEventType.TOUCH_START, this._onTouchBegan, this);
        // this.node.off(SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
        // this.node.off(SystemEventType.TOUCH_END, this._onTouchEnded, this);
        // this.node.off(SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

     // touch event handler
     protected _onTouchBegan (event?: EventTouch) {
        this._pressed = true;
        // if (event) {
        //     event.propagationStopped = true;
        // }
    }

    protected _onTouchMove (event?: EventTouch) {
        if (!this._pressed) { return; }
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        if (!event) {
            return;
        }

        // const touch = (event).touch;
        // if (!touch) {
        //     return;
        // }
        // const hit = this.node._uiProps.uiTransformComp!.isHit(touch.getUILocation());
        // if (event) {
        //     event.propagationStopped = true;
        // }
    }

    protected _onTouchEnded (event?: EventTouch) {
       
        if (this._pressed) {
            this.node.emit(Button.EventType.CLICK, this);
        }
        this._pressed = false;

        // if (event) {
        //     event.propagationStopped = true;
        // }
    }

    protected _onTouchCancel (event?: EventTouch) {
        this._pressed = false;
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
