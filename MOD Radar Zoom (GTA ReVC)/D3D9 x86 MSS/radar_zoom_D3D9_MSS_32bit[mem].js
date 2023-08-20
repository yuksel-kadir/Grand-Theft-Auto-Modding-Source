/// <reference path=".config/vc.d.ts" />
/**
 *  AUTHOR: WastedHymn
 *  DATE: 19.02.2023
 *  WARNING: This script only works with GTA ReVC D3D9 MSS 32 Bit build.
 *           You can find more information about ReVC and different builds here: https://steamcommunity.com/sharedfiles/filedetails/?id=2655588823
 *  Radar.cpp -> https://github.com/WastedHymn/Grand-Theft-Auto-Modding-Source/blob/d56a5a48dd201d267ec369df311959a66a3a6f09/re3-miami%20(2ea365e5da8c0d1919374fdfd2a02932c2a308c8)/src/core/Radar.cpp
 */

const T_KEY = 84;
const MINUS_KEY = 189;
const NUMPAD_MINUS_KEY = 109;
const NUMPAD_PLUS_KEY = 107;
const NUMPAD_MULTIPLY_KEY = 106;
const MAX_RADAR_RANGE = 350;
const MIN_RADAR_RANGE_OFFSET = 1833092;
//const MAX_RADAR_RANGE_OFFSET = 1826280;
const MAP_ZOOM_DELTA = 5;

let minRadarRange = 120;
let canZoomIn = false;
let drawMapAddress = Memory.Translate("CRadar::DrawMap");
let currentZoom = minRadarRange;

function loadDefaultValues() {
  minRadarRange = 120;
  currentZoom = 120;
}

while (true) {
  //ZOOM IN
  if (Pad.IsKeyPressed(T_KEY)) {
    if (currentZoom + MAP_ZOOM_DELTA <= MAX_RADAR_RANGE) {
      currentZoom += MAP_ZOOM_DELTA;
    } else {
      TIMERA = 0;
      canZoomIn = true;
    }
  } else if (TIMERA > 1000 && canZoomIn) {
    // ZOOM OUT
    if (currentZoom - MAP_ZOOM_DELTA >= minRadarRange) {
      currentZoom -= MAP_ZOOM_DELTA;
    } else {
      canZoomIn = false;
    }
  } else if (Pad.IsKeyUp(T_KEY)) canZoomIn = true;

  //CHANGE ZOOM VALUES
  if (
    Pad.IsKeyPressed(NUMPAD_MINUS_KEY) &&
    minRadarRange - MAP_ZOOM_DELTA >= 20
  ) {
    minRadarRange -= MAP_ZOOM_DELTA;
    currentZoom -= MAP_ZOOM_DELTA;
  }

  if (
    Pad.IsKeyPressed(NUMPAD_PLUS_KEY) &&
    minRadarRange + MAP_ZOOM_DELTA <= MAX_RADAR_RANGE
  ) {
    currentZoom += MAP_ZOOM_DELTA;
    minRadarRange += MAP_ZOOM_DELTA;
  }

  if (Pad.IsKeyDown(NUMPAD_MULTIPLY_KEY)) loadDefaultValues();

  //APPLY CURRENT ZOOM
  Memory.WriteFloat(
    drawMapAddress + MIN_RADAR_RANGE_OFFSET,
    currentZoom,
    true,
    false
  );

  wait(0);
}
