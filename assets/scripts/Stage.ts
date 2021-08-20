
import { _decorator, Component, Node, Button, Prefab, instantiate, NodePool, tween, Vec3, UIOpacity, Tween, TweenSystem, assert, game, view, ResolutionPolicy, RenderTexture, UITransform, Camera, director, Director, gfx, renderer, Vec2, Rect, Color } from 'cc';
import { Alert, IAlertParam } from './components/Alert';
import { Toast } from './components/Toast';


const { ccclass, property ,type} = _decorator;

declare global{
    var stage:Stage;
}

@ccclass('Stage')
export class Stage extends Component {
    @type(Prefab)
    alert_prefab:Node = null;

    @type(Prefab)
    toast_prefab:Node = null;

    @type(Prefab)
    busy_prefab:Node = null;


    @type(Node)
    game_layer:Node = null;

    @type(Node)
    ui_layer:Node = null;

    @type(Node)
    notice_layer:Node = null;

    constructor(name){
        super(name);
    }

    onLoad(){
        game.addPersistRootNode(this.node);
        // view.setDesignResolutionSize(640, 1136, ResolutionPolicy.FIXED_HEIGHT);
        // let size = view.getVisibleSize();
        // if(size.width < 640){
        //     view.setDesignResolutionSize(640, 1136, ResolutionPolicy.FIXED_WIDTH);
        //     console.log("width less than 640, ResolutionPolicy has been changed to fixed width automaticly");
        // }
        // size = view.getVisibleSize();
        // console.log("getVisibleSize:",size.width,size.height,view.getDevicePixelRatio());
    }

    start () {
        assert(!globalThis.stage, "duplication The");
        globalThis.stage = this;
    }

    private toastPool = new NodePool(Toast)
    toast(content:string,duration = 0.3){
        let instance = this.toastPool.get() || instantiate(this.toast_prefab) as Node;
        instance.parent = this.notice_layer;
        let com = instance.getComponent(Toast);
        com.setData(content);

        // instance.getComponent(UIOpacity).opacity = 0
        tween(instance.getComponent(UIOpacity)).set({opacity:0}).to(0.6,{opacity:255}).delay(duration).to(0.5,{opacity:0}).start();
        tween(instance).set({position:new Vec3(0,-150)}).to(0.6,{position:new Vec3()},{easing:"quadOut"}).delay(duration).to(0.5,{position:new Vec3(0,100,0)},{easing:"quadIn"}).call(()=>{
            this.toastPool.put(instance);
        }).start();
    }


    private _alertArr = [];
    private _alert:Alert = null;
    private _isAlertShowing = false;
    alert(param:IAlertParam,onClose?:(v)=>void){
        if(!this._alert){
            this._alert = (instantiate(this.alert_prefab) as Node).getComponent(Alert);
        }
        if(!this._isAlertShowing){
            this._isAlertShowing = true;

            if(!this._alert.node.activeInHierarchy){
                this._alert.node.parent = this.notice_layer;
            }
            this._alert.setData(param,v=>{
                this._isAlertShowing = false;
                onClose && onClose(v);
                if(this._alertArr.length > 0){
                    let item = this._alertArr.shift();
                    this.alert(item.param,item.onClose);
                }else{
                    this._alert.node.removeFromParent();
                }
            });
        }else{
            this._alertArr.push({param,onClose});
        }
    }

    private _busyCount = 0;
    private _busyInst:Node ;
    private _busy_timer = 0;
    private _busy_time_out = 0;
    busy(timeOut = 100000) {
        this._busy_time_out = Math.max(timeOut,this._busy_time_out);
        clearTimeout(this._busy_timer);
        this._busy_timer = window.setTimeout(()=>this.unbusy(true),this._busy_time_out);
        this._busyCount++;

        if(!this._busyInst){
            this._busyInst = instantiate(this.busy_prefab) as Node;
        }
        this._busyInst.parent = this.notice_layer;
    }
    
    unbusy(force=false) {
        if(force || --this._busyCount <= 0){
            this._busyInst && this._busyInst.removeFromParent();
            this._busyCount = 0;
            this._busy_time_out = 0;
            clearTimeout(this._busy_timer);
        }
    }

    private setLayerRecursively (node:Node,layer:number){
        let arr = [node];
        for(let i = 0; i < arr.length;i++){
            let child = arr[i]
            child["__bk_layer"] = child.layer;
            child.layer = layer;
            child.children.forEach(v=>arr.push(v));
        }
    }

    private restoreLayerRecursively(node:Node){
        let arr = [node];
        for(let i = 0; i <arr.length;i++){
            let child = arr[i]
            let layer = child["__bk_layer"] ?? child.layer;
            delete child["__bk_layer"];
            child.layer = layer;
            child.children.forEach(v=>arr.push(v));
        }
    }

    capture(targetNode: Node,rect?:Rect) {
        return new Promise<string>(resolve=>{
            const rt = new RenderTexture();
            const trans = targetNode.getComponent(UITransform);
            const width = trans.width;
            const height = trans.height;
    
            rt.reset({width, height});

            let needRemove = false;
            if(!targetNode.parent){
                targetNode.parent = this.node;
                needRemove = true;
            }
            
            var node = new Node();
            node.parent = targetNode;
            const camera = node.addComponent(Camera);
            camera.projection = Camera.ProjectionType.ORTHO;
            node.setPosition(new Vec3(0,0,camera.far/2));
            camera.orthoHeight = height/ 2;
            camera.clearDepth =  Camera.ClearFlag.DEPTH_ONLY;
            camera.clearColor = new Color(0,0,0,0);

            camera.visibility = 1024;
            camera.targetTexture = rt;
            this.setLayerRecursively(targetNode,1024);

            director.once(Director.EVENT_AFTER_DRAW, () => {
                let arrayBuffer = new ArrayBuffer(rt.width * rt.height * 4);
                let region = new gfx.BufferTextureCopy();
                region.texOffset.x = 0;
                region.texOffset.y = 0;
                region.texExtent.width = rt.width;
                region.texExtent.height = rt.height;
                director.root.device.copyFramebufferToBuffer(rt.window.framebuffer, arrayBuffer, [region]);
                rt.destroy();
                this.restoreLayerRecursively(targetNode)
                node.destroy();
                if(needRemove){
                    targetNode.removeFromParent();
                }
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                // ctx.putImageData(new ImageData(new Uint8ClampedArray(arrayBuffer), width, height), 0, 0)
                
                let data = new Uint8ClampedArray(arrayBuffer);
                let rowBytes = width * 4; 
                for (let row = 0; row < height; row++) {
                    let srow = height - 1 - row;
                    let imageData = ctx.createImageData(width, 1);
                    let start = srow * width * 4;
                    for (let i = 0; i < rowBytes; i++) {
                        imageData.data[i] = data[start + i];
                    }
                    
                    ctx.putImageData(imageData, 0, row);
                }

                const dataURL = canvas.toDataURL('image/png');
                
                // var href = dataURL.replace(/^data:image[^;]*/, "data:image/octet-stream");
                // document.location.href = href;
                resolve(dataURL);
            });
        })
	}

    vibrate(duration:number = 50){
        let keys = ['vibrate', 'webkitVibrate', 'mozVibrate', 'msVibrate'];
        // let b = navigator.vibrate || navigator["webkitVibrate"] || navigator["mozVibrate"] || navigator["msVibrate"];
        let s:string;
        for (s of keys){
            if (navigator[s]) break;
        }
        navigator[s] && navigator[s](duration);
    }
}
 