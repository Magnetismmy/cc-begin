
//【Notice】 auto generated。 @terran
declare global {
    interface IDB_skins {
		readonly id: number; //
		readonly type: number; //1:ad,2:coin
		readonly price: number; //
		readonly name: string; //
    }
}

export namespace DB_skins {
    export function getById(id: number): IDB_skins { return getDB().get(id); }
    export function getall(): IDB_skins[] { return getDB().getall(); }
    /*
    [
		[0,2,500,"Kabar_01"]
		[1,2,500,"Kabar_01_Color"]
		[2,2,500,"Kabar_02_Color"]
		[3,2,1000,"fixedblade_survival_knife_01"]
		[4,2,1000,"fixedblade_survival_knife_01_Color"]
		[5,2,1000,"forged_knife_01_Color"]
		[6,2,1000,"japan_knife_01"]
		[7,2,1500,"japan_sword_knife_01"]
		[8,2,1500,"kabar_03_Color"]
		[9,1,1,"karambit_01"]
		[10,1,1,"karambit_02"]
		[11,1,1,"karambit_03_Color"]
		[12,1,2,"knife_1"]
		[13,1,2,"kunai_01"]
		[14,1,2,"kunai_01_Color"]
		[15,1,2,"machete_01"]
		[16,1,2,"machete_01_Color"]
		[17,1,2,"machete_02"]
		[18,1,3,"machete_03"]
		[19,1,3,"military_knife_01"]
		[20,1,3,"military_knife_01_Color"]
		[21,1,3,"military_knife_02"]
		[22,1,4,"throwing_knife_01"]
		[23,1,4,"throwing_knife_02"]
		[24,1,4,"throwing_knife_02_Color"]
		[25,1,4,"ww1_knuckle_knife_01"]
		[26,1,4,"ww1_knuckle_knife_01_Color"]
    ]
    */
    let _db: ig.DB<IDB_skins>;
    function getDB(): ig.DB<IDB_skins> {
        if (!_db) {
            let _keys = 'NoIglgJiA0IC4E8AOBTGIkCcwGM2wDsBDAWzQF0g';
            let _datas = 'NrAMBoCZwVlCBEBpAhgIxQJwPqgIwIC64weUs84y6Wue2AwgPYA2TmRJ00ciqGOUJEat2nYAGZyeeIgBmASwAeAUwAmaFijUrsAZwCumAG4LjKFtgDWAOwVzd+cQBZpsqotUatO/UdPmlrb2jvTMbBzEwDBulAhy7ADm6tZ2DnQiEeIAbLGIAFYoAA4oNqkhdOIA7NK8VIUlZXoA7uxq5elOUQActXFWNIISmWJRAJzgZGQIA5goALZoCgAulVEyk5szWAtLq0LieFNbs7sruMPhoyR40GTQM2m6BOtS91RWBjYoCms3ru8Zl8fhkrpEbjFAfMUABjAAWKmWoUOuShsIRSNBonBpBqaPhiMckEOvTIUgQ0IJmNAEkOEzJVHmChYKywAE8OsiopAIAyKczWZgOcFOmFseJIMdyUyWct2ZzcMTuXdwK4EMs4ZgmM0FDZEgqulw3qqqBqtTq9QalVwASb1Zrtbr9SKiSMcZBIXbms16LYDDCrCxdC6/sBIKivT7Uv7A8GnlisoRCEA=';
            _db = new ig.DB(_keys, _datas, "id");
        }
        return _db;
    } 
}