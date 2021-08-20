import { Component, Label ,SystemEventType,_decorator} from "cc";
const { ccclass, property, requireComponent} = _decorator;

@ccclass('ItemRenderer')
export class ItemRenderer extends Component {
    onLoad(){
        
    }

    itemIndex:number;
    data:any;
    dataChanged(){
        let arr = this.node.getComponentsInChildren(Label);
        if(arr.length > 0){
            arr[0].string = this.data+"";
        }
        console.log(this.data);
    }
}
