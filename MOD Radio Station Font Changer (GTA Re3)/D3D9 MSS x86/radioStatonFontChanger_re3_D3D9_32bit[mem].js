/// <reference path=".config/gta3.d.ts" />
/**
 *  AUTHOR: WastedHymn
 *  DATE: 06.03.2023
 *  INFO: This script is based on ThirteenAG's script. You can find the source code -> https://github.com/ThirteenAG/III.VC.SA.CLEOScripts/blob/master/gtavc/VC.VCSRadioFont.txt
 *        ThirteenAG Github Profile -> https://github.com/ThirteenAG/III.VC.SA.CLEOScripts/blob/master/gtavc/VC.VCSRadioFont.txt
 *        More information about Re3 -> https://steamcommunity.com/sharedfiles/filedetails/?id=2623495528
 *                                   -> https://web.archive.org/web/20210906122256/https://github.com/GTAmodding/re3/
 *  WARNING: This script only works with GTA Re3 D3D9 MSS x86 build.
 */
const PAGEDOWN = 34;
const PAGEUP = 33;
const OFFSET = 0x2B7;
const FUNCTIONADDRESS = Memory.Translate(
  "cMusicManager::DisplayRadioStationName"
);
log("cMusicManager::DisplayRadioStationName: " + FUNCTIONADDRESS);
let fontAddress = FUNCTIONADDRESS + OFFSET;
let fontIndex = 0;

function cyclePrevious() {
  fontIndex -= 1;
  if (fontIndex < 0) fontIndex = 2;
}

function cycleNext() {
  fontIndex += 1;
  if (fontIndex >= 3) fontIndex = 0;
}

while (true) {
  if (Pad.IsKeyDown(PAGEDOWN)) {
    cyclePrevious();
    Memory.WriteU8(fontAddress, fontIndex, 1);
  }
  if (Pad.IsKeyDown(PAGEUP)) {
    cycleNext();
    Memory.WriteU8(fontAddress, fontIndex, 1);
  }
  wait(10);
}
