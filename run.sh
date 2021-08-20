#!/usr/bin/env bash
# @terran
# set -e -u
# set -e
trap '{ echo "pressed Ctrl-C.  Time to quit." ; exit 1; }' INT
export PATH="/usr/local/bin:$PATH"

dir=$(cd `dirname $0`; pwd);
tmp=$dir/.tmp;mkdir -p $tmp;
function error_exit(){ echo "【ERROR】::${1:-"Unknown Error"}" 1>&2 && exit 1;}

function compressImages() {
	local cache=false
	local path
	while [ "$#" -gt 0 ]; do
		case "$1" in
		-c | --cache) cache=true ;;
		--cache=*) cache="${1#*=}" ;;
		*) path="$1" ;;
		esac
		shift
	done

	local cache_dir=$tmp/imageCache;
	mkdir -p $cache_dir;
	
	local OIFS="$IFS";IFS=$'\n'
	for file in $(find $path -name "*.png" -o -name "*.jpg"); do
		if $cache; then
			local fileMD5=$(md5 -q ${file})
			local cache_file=$cache_dir/$fileMD5
			if [[ -e $cache_file ]]; then
				cp -f $cache_file $file
				continue
			fi
		fi

		if [[ $file == *.png ]]; then #--quality 50-80
			local color=256
			if [[ $file == *level_bgs* ]]; then color=256; fi
			pngquant --ext ".png" --skip-if-larger --strip --force $color $file
			# pngquant --ext ".png" --skip-if-larger --strip --force --quality 65-80 $file
			# elif [[ $file == *.jpg ]]; then
			# 	jpegoptim -s -m60 -q $file
		fi

		if $cache; then cp -fv $file $cache_file; fi
	done
	IFS="$OIFS";
	echo "image compress finished!"
}

function compressMP3s() {
	local cache=false
	local path
	while [ "$#" -gt 0 ]; do
		case "$1" in
		-c | --cache) cache=true ;;
		--cache=*) cache="${1#*=}" ;;
		*) path="$1" ;;
		esac
		shift
	done

	local cache_dir=$tmp/mp3Cache;
	mkdir -p $cache_dir;
	local OIFS="$IFS";IFS=$'\n'
	for file in $(find $path -name "*.mp3"); do
		local fileMD5=$(md5 -q ${file})
		local cache_file=$cache_dir/$fileMD5
		if [[ -e $cache_file ]]; then
			cp -f $cache_file $file
		else
			lame --silent --abr 48 --resample 44.1 "${file}" $tmp/mp3 && mv $tmp/mp3 "${file}"
			if $cache; then cp -fv $file $cache_file; fi
		fi
	done
	IFS="$OIFS";
	echo "mp3 compress finished!"
}




fb_app_id=34216734145704101;
fb_app_secret="731e2e816903810f24e2aa118ee5d70f";
fb_app_name="test";
# fb_token="1019427915087457|5hMSz6ecbMXOsJq-k0al25aBzg"
fb_token="${fb_app_id}|${fb_app_secret}"
fb_iad="3421673414570410_3451001528304265";
fb_rad="3421673414570410_3451000488304369";
fb_leaderboard_world="world";
fb_leaderboard_context="context";

fb_game_id="42";
fb_comment="add switch in pass view";

function fbgame(){
    local upload=false;
	local debug=false;
	local target="IG";
	while [ "$#" -gt 0 ]; do
	case "$1" in
		-v|--version) version="$2";shift;;
		--version=*) version="${1#*=}";;
		-u|--upload) upload=true;;
		-d|--debug) debug=true;;
		-t|--target) target="$2";shift;;
	esac;shift
	done

    # local version_file=$tmp/version;
	# curl \
	# 	-H "Content-Type: application/json" \
	# 	-d "{\"app\":\"${fb_app_name}\",\"version\":\"${version}\"}" \
	# 	-o $version_file \
	# 	"https://us-central1-pack-server.cloudfunctions.net/get_version" || error_exit "get version failed" ;
	# version=`cat $version_file | json data.version`;
	# if [ -z ${version} ]; then cat $version_file;error_exit "need version";fi

	if [ -z ${version+x} ]; then 
		version=`request_version ${fb_app_name}`;
	fi
	echo "Version:$version";

	local CocosCreator=/Applications/CocosCreator/Creator/3.1.1/CocosCreator.app/Contents/MacOS/CocosCreator;
	$CocosCreator --project $dir --build "platform=web-mobile;debug=false;md5Cache=false;replaceSplashScreen=true;";

    local dist=$dir/build/web-mobile;
    if [ "$target" == "IG" ]; then
		perl -pi -e 's|<!--INSTANT_SDK-->|<script src="//connect.facebook.net/en_US/fbinstant.beta.js"></script>|g' $dist/index.html
	fi

    perl -pi -e "s|#platform#|${target}|g" $dist/config.js;
    perl -pi -e "s|#app_id#|${fb_app_id}|g" $dist/config.js
    perl -pi -e "s|#app_name#|${fb_app_name}|g" $dist/config.js
    perl -pi -e "s|#version#|${version}|g" $dist/config.js
    perl -pi -e "s|#game_id#|${fb_game_id}|g" $dist/config.js
    perl -pi -e "s|#iad#|${fb_iad}|g" $dist/config.js
    perl -pi -e "s|#rad#|${fb_rad}|g" $dist/config.js
    perl -pi -e "s|#leaderboard_world#|${fb_leaderboard_world}|g" $dist/config.js
    perl -pi -e "s|#leaderboard_context#|${fb_leaderboard_context}|g" $dist/config.js


    rm -rf $dir/game.zip;
	cp -v $dir/fbapp-config.json $dist;
	(cd $dist && zip -qr $dir/game.zip .)
}

function request_version(){
	local appName=$1;
	local key=${2:-`date +%s`};

	local version_file=$tmp/version;
	local remoteVersion="";
	curl \
	-o $version_file \
	"https://tcb-sever-1-1g2wu6md012f1d35-1303254815.ap-shanghai.app.tcloudbase.com/get_version?app=${appName}&key=$key" || error_exit "get version failed" ;
	remoteVersion=`cat $version_file | json version`;
	if [ -z ${remoteVersion} ]; then cat $version_file;error_exit "need version";fi
	echo $remoteVersion
}

function install_ig_core(){
	# rm -rf $tmp/ig_core && mkdir $tmp/ig_core;
	# local file_name="ig_core-2.0.111.tgz"
	# curl -o $tmp/ig_core/$file_name http://fay.capjoy.com/library_dist/$file_name
	# tar -xf $tmp/ig_core/$file_name -C $tmp/ig_core;
	# cp $tmp/ig_core/package/build/index.js $dir/build-templates/web-mobile/ig_core.js;
    # cp $tmp/ig_core/package/build/index.js $dir/preview-template/ig_core.js;
    
	# cp $tmp/ig_core/package/build/index.iife.d.ts $dir/libs/ig_core.d.ts;

    local version=2.0.111;
    npm i http://fay.capjoy.com/library_dist/ig_core-${version}.tgz;
    cp $dir/node_modules/ig_core/build/index.js $dir/build-templates/web-mobile/ig_core.js;
    cp $dir/node_modules/ig_core/build/index.js $dir/preview-template/ig_core.js
}

if test $# -lt 1; then error_exit "wrong arguments"; fi;
cmd=$1 && shift
echo $cmd $@
$cmd $@