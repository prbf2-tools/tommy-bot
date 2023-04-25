export interface GameMode {
    name: string,
    color: string,
    short: string,
    tagPriv: string,
}

export interface Layer {
    name: string,
    short: string,
    tagPriv: string,
}

export interface MapName {
    name: string,
    imageUrl: string,
    galleryUrl: string,
}

export interface PRJSON {
    StartTime: number,
    EndTime: number,

    MapName: string,
    MapMode: string,
    MapLayer: string,

    Team1Name: string,
    Team2Name: string,
}

export interface PRJSONExt extends PRJSON {
    demoFile: string,
    ggwinner?: string,
    truet1t?: string,
    truet2t?: string,
}
