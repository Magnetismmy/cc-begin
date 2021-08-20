
import { _decorator, Component, Node, Button, Label, Sprite, UITransform, Layout } from 'cc';
const { ccclass, property ,type} = _decorator;


export interface IAlertParam{
    content:string,
    title?:string,
    withCancel?:boolean,
    withClose?:boolean,
    okLabel?:string,
    cancelLabel?:string
}

@ccclass('Alert')
export class Alert extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @type(Sprite)
    modal:Sprite = null;

    @property
    btn_colse:Button = null;
    @type(Label)
    txt_title:Label = null;

    @property
    txt_content:Label = null;

    @property
    btn_ok:Button = null;
    @property
    btn_no:Button = null;


    private _isStarted = false;
    start () {
        this._isStarted = true;

        this.btn_ok.node.on(Button.EventType.CLICK, ()=>{
            this._onClose(1);
        }, this);

        this.btn_colse.node.on(Button.EventType.CLICK, ()=>{
            this._onClose(0);
        }, this);

        this.btn_no.node.on(Button.EventType.CLICK, ()=>{
            this._onClose(0);
        }, this);

        this.modal.node.on(Button.EventType.CLICK, ()=>{
            this._onClose(0);
        }, this);


        this.updateDisplay();
    }

    private _dataDirty = false;
    private _onClose:(v)=>void = null;
    private _param:IAlertParam = null;
    setData(param:IAlertParam,onClose?:(v)=>void){
        this._param = param;
        this._onClose = onClose;
        
        this._dataDirty = true;
        // this.scheduleOnce(()=>{
            this.updateDisplay();
        // })
    }

    private updateDisplay(){
        if(!this._isStarted) return;

        if(!this._dataDirty) return;
        this._dataDirty = false;

        let param = this._param;
        this.txt_title.string  = param.title ||"";
        // console.log("before:",this.txt_content.getComponent(UITransform).height);
        this.txt_content.string = param.content || "";
        this.txt_content.updateRenderData(true);
        // console.log("after:",this.txt_content.getComponent(UITransform).height);
        this.btn_ok.getComponentInChildren(Label).string = param.okLabel || "OK";
        this.btn_no.getComponentInChildren(Label).string = param.cancelLabel || "Cancel";

        this.btn_no.node.active = param.withCancel;
        this.btn_colse.node.active = param.withClose;

        this.getComponentsInChildren(Layout).forEach(v=>v.updateLayout(true))
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
