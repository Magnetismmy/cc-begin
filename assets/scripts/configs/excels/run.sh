# set -e -u;
#  author: @terran

dir=$(cd `dirname $0`; pwd);
proj_dir=$(cd $dir/../ && pwd);

function deal_json(){
    local excelName=$(basename $1);
    local out_name=${excelName/.xlsx/.ts};
    local out_path=${proj_dir}/$out_name; #${proj_dir}/assets/scripts/skins/$out_name;
    
	npx shimo_json $1 --nameRow 0 --typeRow 1 --desRow 2 --dataRow 3 --cookie "$cookie" --formater "$dir/gen_ts.js.tmp" -o $out_path;
}

deal_json $dir/xlsx/DB_skins.xlsx;