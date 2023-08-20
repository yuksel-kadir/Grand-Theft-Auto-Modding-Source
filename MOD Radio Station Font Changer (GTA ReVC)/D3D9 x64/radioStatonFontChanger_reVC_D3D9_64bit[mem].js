/// <reference path=".config/vc.d.ts" />
/**
 *  AUTHOR: WastedHymn
 *  DATE: 15.02.2023
 *  INFO: This script is based on ThirteenAG's script. You can find the source code -> https://github.com/ThirteenAG/III.VC.SA.CLEOScripts/blob/master/gtavc/VC.VCSRadioFont.txt
 *        ThirteenAG Github Profile -> https://github.com/ThirteenAG/III.VC.SA.CLEOScripts/blob/master/gtavc/VC.VCSRadioFont.txt
 *        More information about ReVC -> https://steamcommunity.com/sharedfiles/filedetails/?id=2655588823
 *                                    -> https://web.archive.org/web/20210906122256/https://github.com/GTAmodding/re3/tree/miami/
 *  WARNING: This script only works with GTA ReVC D3D9 x64 build.
 */
const PAGEDOWN = 34;
const PAGEUP = 33;
let fontAddress = Memory.Translate("cMusicManager::DisplayRadioStationName") +  749;
let fontIndex = 0;

function cyclePrevious(){
    fontIndex -= 1;
    if(fontIndex < 0)
        fontIndex = 2
}

function cycleNext(){
    fontIndex += 1;
    if(fontIndex >= 3)
        fontIndex = 0;
}


while(true){
    if(Pad.IsKeyDown(PAGEDOWN)){
        cyclePrevious();
        
        Memory.WriteU8(fontAddress, fontIndex, 1);
    }
    if(Pad.IsKeyDown(PAGEUP)){
        cycleNext();
        Memory.WriteU8(fontAddress, fontIndex, 1);
    }
    wait(10);
}

    
