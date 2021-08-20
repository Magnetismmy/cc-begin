import {instantiate, Node, Prefab, resources} from 'cc';
import { ShareChallengeResultUI } from "./ShareChallengeResultUI";
import { ShareChallengeUI } from "./ShareChallengeUI";
import { ShareChampionUI } from "./ShareChampionUI";
import { ShareGameUI } from "./ShareGameUI";
import { ShareRankUI } from "./ShareRankUI";

declare global{
    interface IOpponent{
        head:string,
        playerId:string,
        score:number,
        name:string,
        skin:number,
    }
}

export namespace ShareHelper{
    export function setup(){
        ig.ShareBridge.setup({
            onBusy: () => stage.busy(),
            onUnbusy: () => stage.unbusy(),
            onToast: (msg: string) => stage.toast(msg),
            onCreateNormalImg:async (info: IOpponent, template?: string): Promise<string>=>{
                if(template && template.indexOf("rank_share_")==0){
                    let prefabe = await new Promise(r=>resources.load("share/ShareRankUI",Prefab,(err,data)=>r(data)));
                    let inst =  (instantiate(prefabe) as Node).getComponent(ShareRankUI);
                    inst.setData(info);
                    let image = await generateImage(inst.node);
                    return image;
                }
                let imgs = [
                    "share/share_game.png",
                    // "share/share_game_1.png",
                    // "share/share_game_2.png",
                ];
                let imageIndex = Math.floor(Math.random()*imgs.length);
                let prefabe = await new Promise(r=>resources.load("share/ShareGameUI",Prefab,(err,data)=>r(data)));
                let inst =  (instantiate(prefabe) as Node).getComponent(ShareGameUI);
                inst.setData(info,imgs[imageIndex]);
                let image = await generateImage(inst.node);
                return image;
            },
            onCreateChallengeImg:async(info: IOpponent, template?: string): Promise<string>=>{
                let prefabe = await new Promise(r=>resources.load("share/ShareChallengeUI",Prefab,(err,data)=>r(data)));
                let inst =  (instantiate(prefabe) as Node).getComponent(ShareChallengeUI);
                inst.setData(info);
                let image = await generateImage(inst.node);
                return image;
            },
            onCreateChallengeResultImg:async(self: IOpponent, info: IOpponent, template?: string): Promise<string>=>{
           
                let prefabe = await new Promise(r=>resources.load("share/ShareChallengeResultUI",Prefab,(err,data)=>r(data)));
                let inst =  (instantiate(prefabe) as Node).getComponent(ShareChallengeResultUI);
                inst.setData(info);
                let image = await generateImage(inst.node);
                return image;
            },
            onCreateChampionImg:async (info: IOpponent, template?: string): Promise<string>=>{
                let prefabe = await new Promise(r=>resources.load("share/ShareChampionUI",Prefab,(err,data)=>r(data)));
                let inst =  (instantiate(prefabe) as Node).getComponent(ShareChampionUI);
                inst.setData(info);
                let image = await generateImage(inst.node);
                return image;
            },
        })
    }
    export function generateImage(spr:Node){
        return stage.capture(spr);
    }

    export async function championShare(template:string,useUpdate = true,option:{strategy?:string,text?:string} = {}){
        await ig.ShareBridge.championShare(template,useUpdate,option);
    }

    export async function normalShare(template:string,useUpdate = true,option:{strategy?:string,text?:string} = {}){
        await ig.ShareBridge.normalShare(template,useUpdate,option);
    }

    export async function challengeShare(score:number,useUpdate:boolean = true,source="normal"){
        await ig.ShareBridge.challengeShare(score,useUpdate,source);
    }

    export async function rankShare(template:string,useUpdate = true,option:{strategy?:string,text?:string} = {}){
        await ig.ShareBridge.normalShare("rank_share_"+template,useUpdate,option);
    }

    export async function sendScore(score:number){
		await ig.ShareBridge.sendScore(score,true);
    }
}