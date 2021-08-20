!function(){
    function loadLib(src, callback) {
        var s = document.createElement('script');
        s.async = false;
        s.src = src;
        s.addEventListener('load', function () {
            s.parentNode.removeChild(s);
            s.removeEventListener('load', arguments.callee, false);
            callback && callback();
        }, false);
        document.head.appendChild(s);
    };
    var origin_log = console.log;
    var vconsole = null;
    function onDevModeChanged(bo){
        if(bo){
            console.log = origin_log;
            if(!vconsole){
                if(1){//navigator.userAgent.indexOf("Mobile")>-1){
                    loadLib("vconsole.min.js",function(){
                        try{
                            console.log = origin_log;
                            vconsole = new window["VConsole"]();
                            vconsole.showSwitch();
                        }catch(e){console.log(e)}
                    })
                }
            }else{
                console.log = origin_log;
                vconsole.showSwitch()
            }
        }else{
            vconsole && vconsole.hideSwitch();
            // console.log = function(){};
        }
    }

    var tp_dev_key="gusssad";
    var dev_mode = null;
    Object.defineProperty(window, "$tp_dev_mode", {
        get: function () {
            if(dev_mode == null){
                dev_mode = localStorage.getItem(tp_dev_key) == "true";
            }
			return dev_mode;
		},
		set: function (bo) {
            if(bo){
                localStorage.setItem(tp_dev_key,"true");
            }else{
                localStorage.removeItem(tp_dev_key)
            }
            dev_mode = bo;
            onDevModeChanged(bo); 
            window.dispatchEvent(new Event("dev_mode_changed"));
		},
		configurable: true
    })
    onDevModeChanged($tp_dev_mode);
    
    var canvas = document.getElementById("GameCanvas");
    if(canvas){
        var click_count = 0;
		var timer = 0;
        var eventName = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
        canvas.addEventListener(eventName, function (event) {
            var w = event.target.offsetWidth;
            var h = event.target.offsetHeight;
            var s = event.target.width/event.target.offsetWidth;
            var mouseX = (event.offsetX === undefined) ? (event.clientX-event.target.offsetX) : event.offsetX;
            var mouseY = (event.offsetY === undefined) ? (event.clientY-event.target.offsetY) : event.offsetY;
            if(event.targetTouches){
                var canvasCss = event.target.getBoundingClientRect();
                mouseX = event.targetTouches[0].clientX - canvasCss.left;
                mouseY = event.targetTouches[0].clientY - canvasCss.top;
            }
            if(Math.abs(mouseX - w/2)>50*s || mouseY>50*s) return;
            
			click_count++;
			clearTimeout(timer);
			timer = setTimeout(()=>{
				if(click_count>=5){
					$tp_dev_mode = !$tp_dev_mode;
                    origin_log("dev:",$tp_dev_mode);
				}
				click_count=0
			},200)
        }, true);
    }
}();