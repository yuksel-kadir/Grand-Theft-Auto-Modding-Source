/**
 *  AUTHOR: WastedHymn
 *  DATE: 27.03.2023
 *  INFO: Find more information about radar zoom at -> (line 719) https://github.com/WastedHymn/reversed-gtas/blob/b37588c19326ded1d45cb81cdcde31ecbad00637/re3-master%20(ac339f47242ab84689938512947cc259f3e6ae13)/src/core/Radar.cpp
 */
#include "plugin.h"
#include "CTimer.h"
#include "injector.hpp"
#include "CHud.h"
#include "CPlayerPed.h"
#include "CTheScripts.h"
#include "extensions/ScriptCommands.h"

using namespace plugin;

class RadarMapZoom {
public:
    RadarMapZoom() {
        // Variables for when the last time the key has been pressed.
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
        static float minZoom = 120.0f;
        static const float MAX_ZOOM = 350.0f;
        static const float MIN_ZOOM = 10.0f;
        static const int DEFAULT_MIN_ZOOM = 120;
        static float currentZoom = minZoom;
        static int canZoomInTime = 0;
        static bool canZoomIn = false;

        Events::initScriptsEvent += [] {
            keyPressTime = 0;
            minZoom = DEFAULT_MIN_ZOOM;
            currentZoom = minZoom;
            canZoomInTime = 0;
            canZoomIn = false;
        };

        Events::gameProcessEvent += [] {
            //Zoom Out when T key is pressed
            if (KeyPressed(T_KEY) && (CTimer::m_snTimeInMilliseconds - keyPressTime > 10)) {
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                if (canZoomIn)
                    canZoomIn = false;
                minZoom = DEFAULT_MIN_ZOOM;
                if (currentZoom + zoomDelta <= MAX_ZOOM) {
                    currentZoom += zoomDelta;
                }
                else {
                    canZoomIn = true;
                    canZoomInTime = CTimer::m_snTimeInMilliseconds;
                }
                //zone state
                injector::WriteMemory<int>(0x8F29AC, 1, true);
                //vehicle state
                injector::WriteMemory<int>(0x940560, 1, true);
                /*
                CPlayerPed* playerped = FindPlayerPed();
                if (playerped != NULL) {
                    if (playerped->m_bInVehicle)
                        CHud::m_VehicleState = 1;
                    CHud::m_ZoneState = 1;
                }
                */
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
            injector::WriteMemory<float>(0x4A42BA, currentZoom, true);
            //minimum range in car
            injector::WriteMemory<float>(0x4A4270, currentZoom, true);
            //fast car min range dynamic zoom
            injector::WriteMemory<float>(0x5F7108, currentZoom, true);
            //minimum fast car dynamic zoom
            //injector::WriteMemory<float>(0x68FF0C, currentZoom, true);
        };

    }
} radarMapZoom;
