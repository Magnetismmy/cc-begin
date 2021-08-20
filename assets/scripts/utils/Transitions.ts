import { Component, Node, UIOpacity} from 'cc';

export namespace Transitions{
    var fadeFrequency = 30;

    export function fadeIn(exec:Component, target:Node|null, time:number, from = 0, f=fadeFrequency){
        if (!target) return;
        target.active = true;
        var o = target.getComponent(UIOpacity);
        if (o == null){
            o = target.addComponent(UIOpacity);
        }
        o.opacity = from;
        let t = Math.ceil(time*f);
        let d = Math.ceil(255 / t);
        exec.schedule(()=>{
            if(o){
                o.opacity += d;
                if (o.opacity > 255) o.opacity = 255;
            }
        }, 1/f, t);
    }

    export function fadeOut(exec:Component, target:Node|null, time:number, from = 255, f=fadeFrequency){
        if (!target) return;
        var o = target.getComponent(UIOpacity);
        if (o == null){
            o = target.addComponent(UIOpacity);
        }
        o.opacity = from;
        let t = Math.ceil(time*f);
        let d = Math.ceil(o.opacity / t);
        exec.schedule(()=>{
            if(o){
                o.opacity -= d;
                if (o.opacity < 0) o.opacity = 0;
            }
        }, 1/f, t);
        exec.scheduleOnce(()=>{
            if (target) target.active = false;
        }, time);
    }
}