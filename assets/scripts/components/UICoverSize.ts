
import { _decorator, Component, Node, SystemEventType, view, UITransformComponent, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UICoverSize')
export class UICoverSize extends Component {
    @property
    widthFirst:boolean = false;

    @property({type:Node})
    target:Node|null = null;
    
    private _target:Node|null = null;

    onLoad(){
        
    }

    register(){
        if(this.target){
            this._target = this.target;
        }else{
            this._target = this.node.parent;
        }
        this._target?.on(SystemEventType.TRANSFORM_CHANGED, this.resize, this);
        this._target?.on(SystemEventType.SIZE_CHANGED, this.resize, this);
    }

    unregister(){
        this._target?.off(SystemEventType.TRANSFORM_CHANGED, this.resize, this);
        this._target?.off(SystemEventType.SIZE_CHANGED, this.resize, this);
    }

    start () {
    }

    onEnable(){
        this.register();
    }

    onDisable(){
        this.unregister();
    }

    resize(){
        let tc = this._target?.getComponent(UITransform);
        let c = this.node.getComponent(UITransform);
        let ts = this._target.scale;
        let s = this.node.scale;
        if (!c || !tc) return;
        if (this.widthFirst){
            let tw = tc.width*ts.x;
            let w = c.width*s.x;
            c.width = tw/s.x;
            c.height *= tw/w;
        }else{
            let th = tc.height*ts.y;
            let h = c.height*s.y;
            c.height = th/s.y;
            c.width *= th/h;
        }
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
