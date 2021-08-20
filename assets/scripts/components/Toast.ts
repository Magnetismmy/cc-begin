
import { _decorator, Component, Node, Label, IPoolHandlerComponent } from 'cc';
const { ccclass, property,type } = _decorator;

@ccclass('Toast')
export class Toast extends Component implements IPoolHandlerComponent {
    
    unuse(): void {
        // throw new Error('Method not implemented.');
    }
    reuse(args: any): void {
        // throw new Error('Method not implemented.');
    }
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @type(Label)
    txt_content:Label = null;
    
    private _isStarted: boolean = false;
    start () {
        // [3]
        this._isStarted = true;
        this.updateDisplay()
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    private _dataDirty: boolean = false;
    private _content:string = ""
    setData(content:string){
        this._content = content;
        
        this._dataDirty = true;
        this.scheduleOnce(()=>{
            this.updateDisplay();
        })
    }

    private updateDisplay(){
        if(!this._isStarted) return;

        if(!this._dataDirty) return;
        this._dataDirty = false;

        this.txt_content.string = this._content;
    }

    // private static _toastCout = 0;
    // private static _toastPool = [];
    // static toast(content: string, icon?: string,immediate = true){
    //     let t = this._toastPool.length>0?this._toastPool.pop():new Toast();
    //     this.layerNotice.addChild(t);
    //     t.setData(content, icon);
        
    //     t.alpha = 0;
    //     t.x = Laya.stage.width * .5
    //     t.y = Laya.stage.height * .5 + 100;
    //     let tl = new Laya.TimeLine();
    //     tl.addLabel("1", 0).to(t, { y: t.y - 150, alpha: 1 }, 600, Laya.Ease.quadOut,immediate?0:this._toastCout*500)
    //     .addLabel("2", 700).to(t, { alpha: 0 }, 600, Laya.Ease.quadIn)
    //     tl.on(Laya.Event.COMPLETE, this, ()=>{
    //         this._toastCout--;
    //         t.removeSelf();
    //         this._toastPool.push(t);
    //     });
    //     tl.play();
    //     this._toastCout++;
    // }

}