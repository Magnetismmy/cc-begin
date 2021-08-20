
import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property ,type} = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @type(Prefab)
    homeView:Prefab;
    @type(Prefab)
    playView:Prefab;
    @type(Prefab)
    failView:Prefab;
    @type(Prefab)
    resultView:Prefab;

    @type(Node)
    viewContainer:Node;

    start () {
        // [3]
    }

    private _curView:Node[] = [];
    addView(view:Node, pos = new Vec3){
        view.active = true;
        if (this.viewContainer){
            this.viewContainer.addChild(view);
        }else{
            this.node.addChild(view);
        }
        view.setPosition(pos);
        this._curView.push(view);
    }

    clearView(s?:string|RegExp){
        if (typeof s == 'string'){
            let t = this.viewContainer ?? this.node;
            t.children.find(v=>v.name == s)?.removeFromParent();
        }else if (s instanceof RegExp){
            let t = this.viewContainer ?? this.node;
            for (let v of t.children){
                if (s.test(v.name)) v.removeFromParent();
            }
        }else{
            this._curView.forEach(v=>{v.active = false;v.removeFromParent()});
            this._curView = [];
            if (this.viewContainer){
                this.viewContainer.removeAllChildren();
            }
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
