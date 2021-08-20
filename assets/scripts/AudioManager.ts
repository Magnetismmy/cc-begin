import { AudioClip, resources } from 'cc';
import * as HOWL from 'howler';

const {Howl, Howler} = (HOWL as any).default as typeof HOWL;

declare global{
    var audioManager:typeof AudioManager;
}


export namespace AudioManager{
    let howl:HOWL.Howl|undefined;
    export async function init(){
        let a = await new Promise<AudioClip>((resolve,reject)=>{
            resources.load('sounds/test', AudioClip, (e,r)=>{
                if (e){
                    reject(e);
                    return;
                }
                resolve(r);
            })
        });

        await new Promise<void>((resolve,reject)=>{
            howl = new Howl({
                src: a.nativeUrl,
                autoplay:true,
                onload: function(){resolve()},
            });
        })

        coreEvent.emit('test', '!!!');
    }

    export function play(){
        howl && howl.play();
    }
}

globalThis.audioManager = AudioManager;