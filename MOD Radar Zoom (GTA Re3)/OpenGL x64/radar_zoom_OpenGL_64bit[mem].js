/// <reference path=".config/gta3.d.ts" />
/**
 *  AUTHOR: WastedHymn
 *  DATE: 06.03.2023
 *  WARNING: This script only works with GTA Re3 OpenGL 64 Bit build.
 *           You can find more information about ReVC and different builds here: https://steamcommunity.com/sharedfiles/filedetails/?id=2623495528
 *  Radar.cpp -> https://github.com/WastedHymn/Grand-Theft-Auto-Modding-Source/blob/master/re3-master%20(ac339f47242ab84689938512947cc259f3e6ae13)/src/core/Radar.cpp
 */

const BASE_ADDRESS = Memory.GetImageBase();
const T_KEY = 84;
const MINUS_KEY = 189;
const NUMPAD_MINUS_KEY = 109;
const NUMPAD_PLUS_KEY = 107;
const NUMPAD_MULTIPLY_KEY = 106;
const MAX_RADAR_RANGE = 350;
const MIN_RADAR_RANGE_OFFSET = 2415384; 
//const MAX_RADAR_RANGE_OFFSET = 1826280;
const MAP_ZOOM_DELTA = 5;

let minRadarRange = 120; 
let canZoomIn = false;

let player = new Player(0);
let currentZoom = minRadarRange;
//log("CRadar::DrawMap: " + Memory.Translate("CRadar::DrawMap"));
//log("base address: " + BASE_ADDRESS);
//log("base address + offset: " + (BASE_ADDRESS + MIN_RADAR_RANGE_OFFSET));

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
    BASE_ADDRESS + MIN_RADAR_RANGE_OFFSET,
    currentZoom,
    true,
    false
  );

  wait(0);
}
