import { assetManager, director, JsonAsset, sys, TextAsset, _decorator } from 'cc';
const { ccclass, property } = _decorator;

export class HotUpdate {
    private compareVersion(versionA: string, versionB: string) {
        console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    };

    private _storagePath = '';
    private _am: jsb.AssetsManager = null!;
    async startUpdate(remoteVersion: string, options?: {
        onProgess?: (v: number, t: number) => void,
        onFinish?: (bo: boolean) => void,
        onBeforeRestart?: () => void
    }) {
        if (!window.jsb){
            options?.onFinish && options.onFinish(true);
            return;
        };

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('project.manifest', this._storagePath, this.compareVersion);

        let localManifest = this._am.getLocalManifest();
        let localVersion = localManifest.getVersion();

        if (this.compareVersion(localVersion, remoteVersion) >= 0) {
            options?.onFinish && options.onFinish(true);
            return;
        }

        let url = `https://fay-res.oss-cn-beijing.aliyuncs.com/gameking/coin/ios/hot_res/${remoteVersion}/project.manifest`;
        let customManifestString = await new Promise<string>(resolve => assetManager.loadRemote(url, (e, v: TextAsset) => resolve(v?.text)));
        const manifest = new jsb.Manifest(customManifestString, this._storagePath);

        let hasNewVersion = new Promise(resolve => {
            this._am.setEventCallback((event: jsb.EventAssetsManager) => {
                if (event.getEventCode() === jsb.EventAssetsManager.ALREADY_UP_TO_DATE) {
                    //enter game
                    resolve(false)
                } else if (event.getEventCode() === jsb.EventAssetsManager.NEW_VERSION_FOUND) {
                    resolve(true)
                } else {
                    console.log("on loadRemoteManifest error:", event.getEventCode())
                }
                this._am.setEventCallback(null);
            });
            this._am.loadRemoteManifest(manifest);
        })

        let falied_count = 0;
        if (hasNewVersion) {
            this._am.setEventCallback((event: jsb.EventAssetsManager) => {
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        options?.onFinish && options.onFinish(true);

                        var searchPaths = jsb.fileUtils.getSearchPaths();
                        var newPaths = this._am.getLocalManifest().getSearchPaths();
                        searchPaths.unshift(...newPaths);
                        localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        options?.onProgess && options.onProgess(event.getDownloadedFiles(), event.getTotalFiles());
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        if (++falied_count == 3) {
                            options?.onFinish && options.onFinish(false);
                        } else {
                            this._am.downloadFailedAssets();
                        }
                        break;
                    default:
                        console.log("on update error:", event.getEventCode())
                        break
                }
            });
            this._am.update();
        } else {
            options?.onFinish && options.onFinish(true);
        }
    }
}


//     updateCallback(event: jsb.EventAssetsManager) {
//         console.log('Code: ' + event.getEventCode());
//         var needRestart = false;
//         var failed = false;
//         switch (event.getEventCode()) {
//             case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
//                 console.log('No local manifest file found, hot update skipped.');
//                 // this.panel.info.string = 'No local manifest file found, hot update skipped.';
//                 failed = true;
//                 break;
//             case jsb.EventAssetsManager.UPDATE_PROGRESSION:
//                 // this.panel.byteProgress.progress = event.getPercent();
//                 // this.panel.fileProgress.progress = event.getPercentByFile();

//                 this.onUpdateProgress && this.onUpdateProgress(event.getDownloadedFiles(), event.getTotalFiles());
//                 // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
//                 // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
//                 // console.log(this.panel.fileLabel.string, this.panel.byteLabel.string);
//                 var msg = event.getMessage();
//                 if (msg) {
//                     console.log('Updated file: ' + msg);
//                     // this.panel.info.string = 'Updated file: ' + msg;
//                     // cc.log(event.getPercent()/100 + '% : ' + msg);
//                 }
//                 break;
//             case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
//             case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
//                 console.log('Fail to download manifest file, hot update skipped.');
//                 // this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
//                 failed = true;
//                 break;
//             case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
//                 console.log('Already up to date with the latest remote version.');
//                 // this.panel.info.string = 'Already up to date with the latest remote version.';
//                 failed = true;
//                 break;
//             case jsb.EventAssetsManager.UPDATE_FINISHED:
//                 console.log('Update finished. ' + event.getMessage());
//                 // this.panel.info.string = 'Update finished. ' + event.getMessage();
//                 this.onUpdateFinish && this.onUpdateFinish();
//                 needRestart = true;
//                 break;
//             case jsb.EventAssetsManager.UPDATE_FAILED:
//                 console.log('Update failed. ' + event.getMessage());
//                 // this.panel.info.string = 'Update failed. ' + event.getMessage();
//                 // this.panel.retryBtn.active = true;
//                 this._updating = false;
//                 this._canRetry = true;
//                 break;
//             case jsb.EventAssetsManager.ERROR_UPDATING:
//                 console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
//                 // this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
//                 break;
//             case jsb.EventAssetsManager.ERROR_DECOMPRESS:
//                 console.log(event.getMessage());
//                 // this.panel.info.string = event.getMessage();
//                 break;
//             default:
//                 break;
//         }

//         if (failed) {
//             this._am.setEventCallback(null!);
//             this._updating = false;
//         }

//         if (needRestart) {
//             this._am.setEventCallback(null!);
//             // Prepend the manifest's search path
//             var searchPaths = jsb.fileUtils.getSearchPaths();
//             var newPaths = this._am.getLocalManifest().getSearchPaths();
//             console.log(JSON.stringify(newPaths));
//             Array.prototype.unshift.apply(searchPaths, newPaths);
//             // This value will be retrieved and appended to the default search path during game startup,
//             // please refer to samples/js-tests/main.js for detailed usage.
//             // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
//             localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
//             jsb.fileUtils.setSearchPaths(searchPaths);

//             // restart game.
//             setTimeout(() => {
//                 // AppMain.RestartApp();
//             }, 1000)
//         }
//     }
// }
