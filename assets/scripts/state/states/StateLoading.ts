import { assert, assetManager, director, error, game, log } from "cc";
import { ShareHelper } from "../../share/ShareHelper";
import { AbstractState } from "../AbstractState";
import { externals } from "../../../types/externals";

export class StateLoading extends AbstractState {


    async enter(...args: any[]) {
        stage.busy();
        externals.init();
        ig.PlatformFactory.create();

        let scenePrmise = new Promise<void>(resolve => {
            director.preloadScene("GameScene", (completedCount: number, totalCount: number, item: any) => {
                this.setTotal('scene', totalCount);
                this.addProgress(1);
            }, (e, sceneAssets) => {
                resolve()
            });
        });

        platform.initialize({
            app_id: $tp_app_id,
            app_name: $tp_app_name,
            leaderboard_world: $tp_leaderboard_world,
            leaderboard_context: $tp_leaderboard_context,
            game_id: $tp_game_id,
            host_api: "https://fb-api.capjoy.com",
            host_bot: "https://fb-bot.capjoy.com",
            host_friend: "https://fb-api-new.capjoy.com",
            host_tournament: "https://fb-api-new.capjoy.com",
            leaderboard_preload: true
        }).then(() => {
            let startPromise = platform.startGame({
                iad_ids: [$tp_iad],
                rad_ids: [$tp_rad],
                iad_interval_sec: 60,
                iad_delay_for_new: 30,
                iad_delay_for_old: 0,
                iad_delay_for_old_first_play_today: 0,
                // tournament_contextId:"3726579944079509"
            }).then(() => {
                this.log("Platform successfully start.");
            })

            return Promise.all([scenePrmise, startPromise])
        })
        .then(() => {
            return Promise.all([
                new Promise<void>(resolve => {
                    director.loadScene("GameScene", (e, scene) => {
                        console.log("enter to scene:", scene.name);
                        resolve();
                    })
                }),
                ig.CommonUSE.checkBotAndShortCut()
            ])
        }).then(() => {
            this.log('Setup IGCORE');
            ShareHelper.setup();
            ig.CommonUSE.reportFriends();
            // ig.CommonUSE.watchContext(() => controller.data.score, 12 * 1000);
            director.loadScene('GameScene', (e, sc)=>{
                if (e) error(e);
                coreEvent.emit('start');
            });
            stage.unbusy();
            
        })
        .catch(e => {
            error("Enter game failed:", e);
        })

        // console.log(DB_skins.getById(1).res);
    }

    private totalList:any = {};
    private total = 0;
    private count = 0;

    setTotal(name:string, n:number){
        let t = this.totalList[name];
        if (t){
            if (t!=n) this.total += n-t;
        }else{
            this.total += n;
        }
        this.totalList[name] = n;
    }

    addProgress(n:number){
        this.count += n;
        if (this.total >= 50) platform.setLoadingProgress(this.count * 100 / this.total);
        console.log(this.count+'/'+this.total);
    }


    update(dt: number) {

    }

    exit() {

    }

}