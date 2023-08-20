/**
 *  AUTHOR: WastedHymn
 *  DATE: 09.03.2023
 *  INFO: This code is based on spaceeinstein's "Vice City Radar Zoom" script.
          You can find the source code -> http://spaceeinstein.altervista.org/mods.php#mod_14608
          spaceeinstein's website -> http://spaceeinstein.altervista.org
 *  INFO_2: This code can also work with GTA Re LCS Beta 6.0.
 */
#include "plugin.h"
#include "CTimer.h"
#include "injector.hpp"
#include "CHud.h"
#include "CPlayerPed.h"
#include "CTheScripts.h"
#include "extensions/ScriptCommands.h"

using namespace plugin;

class RadarZoom {
public:
    RadarZoom() {
        // Variables for when the last time key has been pressed.
        static int keyPressTime = 0;
        /*
        * T key keycode -> 0x54
        * - key keycode -> 0x6D
        * + key keycode -> 0x6B
        * * key keycode -> 0x6A
        * More information about keycodes -> https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
        */
        static const int T_KEY = 0x54;
        static const int NUMPAD_MINUS_KEY = 0x6D;
        static const int NUMPAD_PLUS_KEY = 0x6B;
        static const int NUMPAD_MULTIPLY_KEY = 0x6A;
        static int zoomDelta = 5;
        static int minZoom = 120;
        static const int MAX_ZOOM = 350;
        static const int MIN_ZOOM = 10;
        static const int DEFAULT_MIN_ZOOM = 120;
        static float currentZoom = minZoom;
        static int canZoomInTime = 0;
        static bool canZoomIn = false;
        
        //Reset some values
        Events::initScriptsEvent += [] {
            keyPressTime = 0;
            minZoom = DEFAULT_MIN_ZOOM;
            currentZoom = minZoom;
            canZoomInTime = 0;
            canZoomIn = false;
        };

        Events::gameProcessEvent += [] {
            //Zoom Out when T key is pressed
            if (KeyPressed(T_KEY) && CTimer::m_snTimeInMilliseconds - keyPressTime > 10) {
                if (canZoomIn)
                    canZoomIn = !canZoomIn;
                minZoom = DEFAULT_MIN_ZOOM;
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                if (currentZoom + zoomDelta <= MAX_ZOOM) {
                    currentZoom += zoomDelta;
                }
                else {
                    canZoomIn = true;
                    canZoomInTime = CTimer::m_snTimeInMilliseconds;
                }
                CPlayerPed* playerped = FindPlayerPed();
                if (playerped != NULL) {
                    //Display zone name and vehicle name
                    if (playerped->m_bInVehicle)
                        CHud::m_VehicleState = 1;
                    CHud::m_ZoneState = 1;
                }
            }
            else if (!canZoomIn) { //Zoom In if the current zoom hasn't reached the maximum zoom value.
                if (currentZoom - zoomDelta >= minZoom) {
                    currentZoom -= zoomDelta;
                }
            }
            //Lower the min zoom value by zoom delta.
            if (KeyPressed(NUMPAD_MINUS_KEY) && CTimer::m_snTimeInMilliseconds - keyPressTime > 10) {
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                if (minZoom - zoomDelta >= MIN_ZOOM) {
                    minZoom -= zoomDelta;
                }
            }
            //Increase the min zoom value by zoom delta.
            if (KeyPressed(NUMPAD_PLUS_KEY) && CTimer::m_snTimeInMilliseconds - keyPressTime > 10) {
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                if (minZoom + zoomDelta <= MAX_ZOOM) {
                    minZoom += zoomDelta;
                    currentZoom += zoomDelta;
                }
            }
            //Change the min zoom value to the default min zoom value;
            if (KeyPressed(NUMPAD_MULTIPLY_KEY) && CTimer::m_snTimeInMilliseconds - keyPressTime > 10) {
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                minZoom = DEFAULT_MIN_ZOOM;
                currentZoom = minZoom;
            }
            //Zoom In when the current zoom value has reached the max zoom value and 1000ms has passed since the current zoom has reached the max zoom value.
            if (canZoomIn && (CTimer::m_snTimeInMilliseconds - canZoomInTime > 1000)) {
                if (currentZoom - zoomDelta >= minZoom) {
                    currentZoom -= zoomDelta;
                }
                else {
                    canZoomIn = false;
                }
            }

            //on foot min zoom
            injector::WriteMemory<float>(0x4C5D26, currentZoom, true);
            //minimum fast car dynamic zoom
            injector::WriteMemory<float>(0x4C5CD5, currentZoom, true);
            //fast car dynamic zoom
            injector::WriteMemory<float>(0x68FF04, currentZoom, true);
            //minimum fast car dynamic zoom
            injector::WriteMemory<float>(0x68FF0C, currentZoom, true);
        };
    }
} radarZoom;
