import { _decorator, Component, Enum, CCInteger, instantiate, isValid, ScrollView, Vec2, Node, UITransform } from "cc";
import { ItemRenderer } from "./ItemRenderer";


/**列表排列方式 */
export enum ListType {
    /**水平排列 */
    Horizontal = 1,
    /**垂直排列 */
    Vertical = 2,
    /**网格排列 */
    Grid = 3
}

/**网格布局中的方向 */
export enum StartAxisType {
    /**水平排列 */
    Horizontal = 1,
    /**垂直排列 */
    Vertical = 2,
}

const { ccclass, property, requireComponent} = _decorator;

@ccclass('List')
@requireComponent(ScrollView)
export default class List extends Component {

    //==================== 属性面板 =========================
    /**列表选项 */
    @property({ type: Node, tooltip: "列表项" })
    public itemRender: Node = null;

    /**排列方式 */
    @property({ type: Enum(ListType), tooltip: "排列方式" })
    public type: ListType = ListType.Vertical;

    /**网格布局中的方向 */
    @property({ type: Enum(StartAxisType), tooltip: "网格布局中的方向", visible() { return this.type == ListType.Grid } })
    public startAxis: StartAxisType = StartAxisType.Horizontal;

    /**列表项之间X间隔 */
    @property({ type: CCInteger, tooltip: "列表项X间隔", visible() { return (this.type == ListType.Horizontal || this.type == ListType.Grid) } })
    public spaceX: number = 0;

    /**列表项之间Y间隔 */
    @property({ type: CCInteger, tooltip: "列表项Y间隔", visible() { return this.type == ListType.Vertical || this.type == ListType.Grid } })
    public spaceY: number = 0;

    /**上间距 */
    @property({ type: CCInteger, tooltip: "上间距", visible() { return (this.type == ListType.Vertical || this.type == ListType.Grid) } })
    public padding_top: number = 0;

    /**下间距 */
    @property({ type: CCInteger, tooltip: "下间距", visible() { return (this.type == ListType.Vertical || this.type == ListType.Grid) } })
    public padding_buttom: number = 0;

    /**左间距 */
    @property({ type: CCInteger, tooltip: "左间距", visible() { return (this.type == ListType.Horizontal || this.type == ListType.Grid) } })
    public padding_left: number = 0;



    @property(CCInteger)
    public _padding: number = 0;

    /**右间距 */
    @property({ type: CCInteger, tooltip: "右间距", visible() { return (this.type == ListType.Horizontal || this.type == ListType.Grid) } })
    public padding_right: number = 0;

    //====================== 滚动容器 ===============================
    /**列表滚动容器 */
    public scrollView: ScrollView = null;
    /**scrollView的内容容器 */
    private content: Node = null;

    //======================== 列表项 ===========================
    /**列表项数据 */
    private itemDataList: Array<any> = [];
    /**应创建的实例数量 */
    private spawnCount: number = 0;
    /**存放列表项实例的数组 */
    private itemList: Array<Node> = [];
    /**item的高度 */
    private itemHeight: number = 0;
    /**item的宽度 */
    private itemWidth: number = 0;
    /**存放不再使用中的列表项 */
    private itemPool: Array<Node> = [];

    //======================= 计算参数 ==========================
    /**距离scrollView中心点的距离，超过这个距离的item会被重置，一般设置为 scrollVIew.height/2 + item.heigt/2 + space，因为这个距离item正好超出scrollView显示范围 */
    private halfScrollView: number = 0;
    /**上一次content的X值，用于和现在content的X值比较，得出是向左还是向右滚动 */
    private lastContentPosX: number = 0;
    /**上一次content的Y值，用于和现在content的Y值比较，得出是向上还是向下滚动 */
    private lastContentPosY: number = 0;
    /**网格行数 */
    private gridRow: number = 0;
    /**网格列数 */
    private gridCol: number = 0;
    /**刷新时间，单位s */
    private updateTimer: number = 0;
    /**刷新间隔，单位s */
    private updateInterval: number = 0.1;
    /**是否滚动容器 */
    private bScrolling: boolean = false;
    /**刷新的函数 */
    private updateFun: Function = function () { };

    onLoad() {
        let trans = this.itemRender.getComponent(UITransform);
        this.itemWidth = trans.width;
        this.itemHeight = trans.height;
        this.scrollView = this.node.getComponent(ScrollView);

        this.content = this.scrollView.content;
        this.content.getComponent(UITransform).anchorX = 0;
        this.content.getComponent(UITransform).anchorY = 1;
        this.content.removeAllChildren();
        this.scrollView.node.on(ScrollView.EventType.SCROLLING, this.onScrolling, this);
    }

    /**
     * 列表数据 (列表数据复制使用，如果列表数据改变，则需要重新设置一遍数据)
     * @param itemDataList item数据列表
     */
    public setData(itemDataList: Array<any>) {
        this.itemDataList = itemDataList.slice();
        this.updateContent();
    }

    /**计算列表的各项参数 */
    private countListParam() {
        let dataLen = this.itemDataList.length;
        if (this.type == ListType.Vertical) {
            this.scrollView.horizontal = false;
            this.scrollView.vertical = true;
            this.content.getComponent(UITransform).width = this.content.parent.getComponent(UITransform).width;
            this.content.getComponent(UITransform).height = dataLen * this.itemHeight + (dataLen - 1) * this.spaceY + this.padding_top + this.padding_buttom;
            this.spawnCount = Math.round(this.scrollView.node.getComponent(UITransform).height / (this.itemHeight + this.spaceY)) + 2; //计算创建的item实例数量，比当前scrollView容器能放下的item数量再加上2个
            this.halfScrollView = this.scrollView.node.getComponent(UITransform).height / 2 + this.itemHeight / 2 + this.spaceY; //计算bufferZone，item的显示范围
            this.updateFun = this.updateV;
        } else if (this.type == ListType.Horizontal) {
            this.scrollView.horizontal = true;
            this.scrollView.vertical = false;
            this.content.getComponent(UITransform).width = dataLen * this.itemWidth + (dataLen - 1) * this.spaceX + this.padding_left + this.padding_right;
            this.content.getComponent(UITransform).height = this.content.parent.getComponent(UITransform).height;
            this.spawnCount = Math.round(this.scrollView.node.getComponent(UITransform).width / (this.itemWidth + this.spaceX)) + 2;
            this.halfScrollView = this.scrollView.node.getComponent(UITransform).width / 2 + this.itemWidth / 2 + this.spaceX;
            this.updateFun = this.udpateH;
        } else if (this.type == ListType.Grid) {
            if (this.startAxis == StartAxisType.Vertical) {
                this.scrollView.horizontal = false;
                this.scrollView.vertical = true;
                this.content.getComponent(UITransform).width = this.content.parent.getComponent(UITransform).width;
                //如果left和right间隔过大，导致放不下一个item，则left和right都设置为0，相当于不生效
                if (this.padding_left + this.padding_right + this.itemWidth + this.spaceX > this.content.getComponent(UITransform).width) {
                    this.padding_left = 0;
                    this.padding_right = 0;
                    console.error("padding_left或padding_right过大");
                }

                this.gridCol = Math.floor((this.content.getComponent(UITransform).width - this.padding_left - this.padding_right) / (this.itemWidth + this.spaceX));
                this.gridRow = Math.ceil(dataLen / this.gridCol);
                this.content.getComponent(UITransform).height = this.gridRow * this.itemHeight + (this.gridRow - 1) * this.spaceY + this.padding_top + this.padding_buttom;
                this.spawnCount = Math.round(this.scrollView.node.getComponent(UITransform).height / (this.itemHeight + this.spaceY)) * this.gridCol + this.gridCol * 2;
                this.halfScrollView = this.scrollView.node.getComponent(UITransform).height / 2 + this.itemHeight / 2 + this.spaceY;
                this.updateFun = this.updateGrid_V;
            } else if (this.startAxis == StartAxisType.Horizontal) {
                this.scrollView.horizontal = true;
                this.scrollView.vertical = false;
                //计算高间隔
                this.content.getComponent(UITransform).height = this.content.parent.getComponent(UITransform).height;
                //如果left和right间隔过大，导致放不下一个item，则left和right都设置为0，相当于不生效
                if (this.padding_top + this.padding_buttom + this.itemHeight + this.spaceY > this.content.getComponent(UITransform).height) {
                    this.padding_top = 0;
                    this.padding_buttom = 0;
                    console.error("padding_top或padding_buttom过大");
                }

                this.gridRow = Math.floor((this.content.getComponent(UITransform).height - this.padding_top - this.padding_buttom) / (this.itemHeight + this.spaceY));
                this.gridCol = Math.ceil(dataLen / this.gridRow);
                this.content.getComponent(UITransform).width = this.gridCol * this.itemWidth + (this.gridCol - 1) * this.spaceX + this.padding_left + this.padding_right;
                this.spawnCount = Math.round(this.scrollView.node.getComponent(UITransform).width / (this.itemWidth + this.spaceX)) * this.gridRow + this.gridRow * 2;
                this.halfScrollView = this.scrollView.node.getComponent(UITransform).width / 2 + this.itemWidth / 2 + this.spaceX;
                this.updateFun = this.updateGrid_H;
            }
        }
    }

    /**
     * 创建列表
     * @param startIndex 起始显示的数据索引 0表示第一项
     * @param offset     scrollView偏移量
     */
    private createList(startIndex: number, offset: Vec2) {
        //当需要显示的数据长度 > 虚拟列表长度， 删除最末尾几个数据时，列表需要重置位置到scrollView最底端
        if (this.itemDataList.length > this.spawnCount && (startIndex + this.spawnCount - 1) >= this.itemDataList.length) {
            startIndex = this.itemDataList.length - this.spawnCount;
            offset = this.scrollView.getMaxScrollOffset();

            //当需要显示的数据长度 <= 虚拟列表长度， 隐藏多余的虚拟列表项
        } else if (this.itemDataList.length <= this.spawnCount) {
            startIndex = 0;
        }

        for (let i = 0; i < this.spawnCount; i++) {
            let item: Node;
            //需要显示的数据索引在数据范围内，则item实例显示出来
            if (i + startIndex < this.itemDataList.length) {
                if (this.itemList[i] == null) {
                    item = this.getItem();
                    this.itemList.push(item);
                    item.parent = this.content;
                } else {
                    item = this.itemList[i];
                }
                //需要显示的数据索引超过了数据范围，则item实例隐藏起来
            } else {
                //item实例数量 > 需要显示的数据量
                if (this.itemList.length > (this.itemDataList.length - startIndex)) {
                    item = this.itemList.pop();
                    item.removeFromParent();
                    this.itemPool.push(item);
                }
                continue;
            }

            let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
            itemRender.itemIndex = i + startIndex;
            itemRender.data = this.itemDataList[i + startIndex];
            itemRender.dataChanged();

            if (this.type == ListType.Vertical) {
                //因为content的锚点X是0，所以item的x值是content.with/2表示居中，锚点Y是1，所以item的y值从content顶部向下是0到负无穷。所以item.y= -item.height/2时，是在content的顶部。
                item.setPosition(this.content.getComponent(UITransform).width / 2, -item.getComponent(UITransform).height * (0.5 + i + startIndex) - this.spaceY * (i + startIndex) - this.padding_top);
            } else if (this.type == ListType.Horizontal) {
                item.setPosition(item.getComponent(UITransform).width * (0.5 + i + startIndex) + this.spaceX * (i + startIndex) + this.padding_left, -this.content.getComponent(UITransform).height / 2);
            } else if (this.type == ListType.Grid) {
                if (this.startAxis == StartAxisType.Vertical) {
                    var row = Math.floor((i + startIndex) / this.gridCol);
                    var col = (i + startIndex) % this.gridCol;
                    item.setPosition(item.getComponent(UITransform).width * (0.5 + col) + this.spaceX * col + this.padding_left, -item.getComponent(UITransform).height * (0.5 + row) - this.spaceY * row - this.padding_top);
                    item.active = true;
                } else if (this.startAxis == StartAxisType.Horizontal) {
                    var row = (i + startIndex) % this.gridRow;
                    var col = Math.floor((i + startIndex) / this.gridRow);
                    item.setPosition(item.getComponent(UITransform).width * (0.5 + col) + this.spaceX * col + this.padding_left, -item.getComponent(UITransform).height * (0.5 + row) - this.spaceY * row - this.padding_top);
                    item.active = true;
                }
            }
        }

        this.scrollView.scrollToOffset(offset);
    }

    /**获取一个列表项 */
    private getItem() {
        if (this.itemPool.length == 0) {
            return instantiate(this.itemRender);
        } else {
            return this.itemPool.pop();
        }
    }

    update(dt) {
        if (this.bScrolling == false) {
            return;
        }
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return;
        }
        this.updateTimer = 0;
        this.bScrolling = false;
        this.updateFun();
    }

    onScrolling() {
        this.bScrolling = true;
    }

    /**垂直排列 */
    private updateV() {
        let items = this.itemList;
        let bufferZone = this.halfScrollView;
        let isUp = this.scrollView.content.position.y > this.lastContentPosY;
        let offset = (this.itemHeight + this.spaceY) * items.length;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isUp) {
                //item上滑时，超出了scrollView上边界，将item移动到下方复用，item移动到下方的位置必须不超过content的下边界
                if (viewPos.y > bufferZone && item.position.y - offset - this.padding_buttom > -this.content.getComponent(UITransform).height) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex + items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.setPosition(item.position.x,item.position.y - offset);
                }
            } else {
                //item下滑时，超出了scrollView下边界，将item移动到上方复用，item移动到上方的位置必须不超过content的上边界
                if (viewPos.y < -bufferZone && item.position.y + offset + this.padding_top < 0) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex - items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.setPosition(item.position.x,item.position.y + offset);
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.position.y;
    }

    /**水平排列 */
    private udpateH() {
        let items = this.itemList;
        let bufferZone = this.halfScrollView;
        let isRight = this.scrollView.content.position.x > this.lastContentPosX;
        let offset = (this.itemWidth + this.spaceX) * items.length;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isRight) {
                //item右滑时，超出了scrollView右边界，将item移动到左方复用，item移动到左方的位置必须不超过content的左边界
                if (viewPos.x > bufferZone && item.position.x - offset - this.padding_left > 0) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex - items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.setPosition(item.position.x - offset,0);
                }
            } else {
                //item左滑时，超出了scrollView左边界，将item移动到右方复用，item移动到右方的位置必须不超过content的右边界
                if (viewPos.x < -bufferZone && item.position.x + offset + this.padding_right < this.content.getComponent(UITransform).width) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex + items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.setPosition(item.position.x + offset,0);
                }
            }
        }
        this.lastContentPosX = this.scrollView.content.position.x;
    }

    /**网格垂直排列 */
    private updateGrid_V() {
        let items = this.itemList;
        let item: Node;
        let bufferZone = this.halfScrollView;
        let isUp = this.scrollView.content.position.y > this.lastContentPosY;
        let offset = (this.itemHeight + this.spaceY) * (this.spawnCount / this.gridCol);
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isUp) {
                //item上滑时，超出了scrollView上边界，将item移动到下方复用，item移动到下方的位置必须不超过content的下边界
                if (viewPos.y > bufferZone && item.position.y - offset - this.padding_buttom > -this.content.getComponent(UITransform).height) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex + (this.spawnCount / this.gridCol) * this.gridCol;
                    if (this.itemDataList[itemIndex] != null) {
                        item.setPosition(item.position.x, item.position.y - offset);
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        // item.opacity = 255;
                        item.active = true;
                    } else {
                        item.setPosition(item.position.x, item.position.y - offset);
                        itemRender.itemIndex = itemIndex;
                        // item.opacity = 0;
                        item.active = false;

                    }
                }
            } else {//item下滑时，超出了scrollView下边界，将item移动到上方复用，item移动到上方的位置必须不超过content的上边界
                if (viewPos.y < -bufferZone && item.position.y + offset + this.padding_top < 0) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex - (this.spawnCount / this.gridCol) * this.gridCol;
                    if (this.itemDataList[itemIndex] != null) {
                        item.setPosition(item.position.x, item.position.y + offset);
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.active = true;
                    } else {
                        item.setPosition(item.position.x, item.position.y + offset);
                        itemRender.itemIndex = itemIndex;
                        item.active = false;
                    }
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.position.y;
    }

    /**网格水平排列 */
    private updateGrid_H() {
        let items = this.itemList;
        let item;
        let bufferZone = this.halfScrollView;
        let isRight = this.scrollView.content.position.x > this.lastContentPosX;
        let offset = (this.itemWidth + this.spaceX) * (this.spawnCount / this.gridRow);
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isRight) {
                //item右滑时，超出了scrollView右边界，将item移动到左方复用，item移动到左方的位置必须不超过content的左边界
                if (viewPos.x > bufferZone && item.x - offset - this.padding_left > 0) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex - (this.spawnCount / this.gridRow) * this.gridRow;
                    if (this.itemDataList[itemIndex] != null) {
                        item.x = item.x - offset;
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.opacity = 255;
                    } else {
                        item.x = item.x - offset;
                        itemRender.itemIndex = itemIndex;
                        item.opacity = 0;
                    }
                }
            } else {
                //item左滑时，超出了scrollView左边界，将item移动到右方复用，item移动到右方的位置必须不超过content的右边界
                if (viewPos.x < -bufferZone && item.x + offset + this.padding_right < this.content.getComponent(UITransform).width) {
                    let itemRender: ItemRenderer = item.getComponent(ItemRenderer);
                    let itemIndex = itemRender.itemIndex + (this.spawnCount / this.gridRow) * this.gridRow;
                    if (this.itemDataList[itemIndex] != null) {
                        item.x = item.x + offset;
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.opacity = 255;
                    } else {
                        item.x = item.x + offset;
                        itemRender.itemIndex = itemIndex;
                        item.opacity = 0;
                    }
                }
            }
        }
        this.lastContentPosX = this.scrollView.content.position.x;
    }

    /**获取item在scrollView的局部坐标 */
    private getPositionInView(item: Node) {
        let worldPos = item.parent.getComponent(UITransform).convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    /**获取列表数据 */
    public getListData() {
        return this.itemDataList;
    }

    /**
     * 增加一项数据到列表的末尾
     * @param data 数据
     */
    public addItem(data: any) {
        this.itemDataList.push(data);
        this.updateContent();
    }

    /**
     * 增加一项数据到列表指定位置
     * @param index   位置，0表示第1项
     * @param data  数据
     */
    public addItemAt(index: number, data: any) {
        if (this.itemDataList[index] != null || this.itemDataList.length == index) {
            this.itemDataList.splice(index, 1, data);
            this.updateContent();
        }
    }

    /**
     * 删除一项数据
     * @param index 删除项的位置 ,0表示第1项
     */
    public deleteItem(index: number) {
        if (this.itemDataList[index] != null) {
            this.itemDataList.splice(index, 1);
            this.updateContent();
        }
    }

    /**
     * 改变一项数据
     * @param index   位置,0表示第1项
     * @param data  替换的数据
     */
    public changeItem(index: number, data: any) {
        if (this.itemDataList[index] != null) {
            this.itemDataList[index] = data;
            this.updateContent();
        }
    }

    /**获取第一个Item的位置 */
    private updateContent() {
        //显示列表实例为0个
        if (this.itemList.length == 0) {
            this.countListParam();
            this.createList(0, new Vec2(0, 0));
            //显示列表的实例不为0个，则需要重新排列item实例数组
        } else {
            if (this.type == ListType.Vertical) {
                this.itemList.sort((a: any, b: any) => {
                    return b.y - a.y;
                });
            } else if (this.type == ListType.Horizontal) {
                this.itemList.sort((a: any, b: any) => {
                    return a.x - b.x;
                });
            } else if (this.type == ListType.Grid) {
                if (this.startAxis == StartAxisType.Vertical) {
                    this.itemList.sort((a: any, b: any) => {
                        return a.x - b.x;
                    });
                    this.itemList.sort((a: any, b: any) => {
                        return b.y - a.y;
                    });
                } else if (this.startAxis == StartAxisType.Horizontal) {
                    this.itemList.sort((a: any, b: any) => {
                        return b.y - a.y;
                    });
                    this.itemList.sort((a: any, b: any) => {
                        return a.x - b.x;
                    });
                }
            }

            this.countListParam();

            //获取第一个item实例需要显示的数据索引
            var startIndex = this.itemList[0].getComponent(ItemRenderer).itemIndex;

            if (this.type == ListType.Grid && this.startAxis == StartAxisType.Vertical) {
                startIndex += (startIndex + this.spawnCount) % this.gridCol;
            } else if (this.type == ListType.Grid && this.startAxis == StartAxisType.Horizontal) {
                startIndex += (startIndex + this.spawnCount) % this.gridRow;
            }

            //getScrollOffset()和scrollToOffset()的x值是相反的
            var offset: Vec2 = this.scrollView.getScrollOffset();
            offset.x = - offset.x;

            this.createList(startIndex, offset);
        }
    }

    /**销毁 */
    public onDestroy() {
        //清理列表项
        let len = this.itemList.length;
        for (let i = 0; i < len; i++) {
            if (isValid(this.itemList[i], true)) {
                this.itemList[i].destroy();
            }
        }
        this.itemList.length = 0;
        //清理对象池
        len = this.itemPool.length;
        for (let i = 0; i < len; i++) {
            if (isValid(this.itemPool[i], true)) {
                this.itemPool[i].destroy();
            }
        }
        this.itemPool.length = 0;
        //清理列表数据
        this.itemDataList.length = 0;
    }
}