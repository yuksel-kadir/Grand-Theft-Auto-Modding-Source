/// <reference path=".config/vc.d.ts" />
/**
 *  AUTHOR: WastedHymn
 *  DATE: 15.02.2023
 *  INFO: This script is based on ThirteenAG's script. You can find the source code -> https://github.com/ThirteenAG/III.VC.SA.CLEOScripts/blob/master/gtavc/VC.VCSRadioFont.txt
 *        ThirteenAG Github Profile -> https://github.com/ThirteenAG/III.VC.SA.CLEOScripts/blob/master/gtavc/VC.VCSRadioFont.txt
 */
const PAGEDOWN = 34;
const PAGEUP = 33;
let fontIndex = 0;
let canRun = true;

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

if(Game.GetVersion() != 0){
    log("Radio Station Font Changer ERROR: Your game version is not supported!");
    canRun = false;
}

while(canRun){
    if(Pad.IsKeyDown(PAGEDOWN)){
        cyclePrevious();
        Memory.WriteU8(0x5FA178, fontIndex, 1);
    }
    if(Pad.IsKeyDown(PAGEUP)){
        cycleNext();
        Memory.WriteU8(0x5FA178, fontIndex, 1);
    }
    wait(10);
}

    