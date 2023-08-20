/**
 *  AUTHOR: WastedHymn
 *  DATE: 09.03.2023
 */
#include "plugin.h"
#include "CTimer.h"
#include "CHud.h"
#include "CPlayerPed.h"
#include "CTheScripts.h"
#include "extensions/ScriptCommands.h"

using namespace plugin;

class QuickSave {
    static void PrintQuickHelpMessage(std::string messageText) {
        //Converting char* to wchar_t* -> https://learn.microsoft.com/en-us/cpp/text/how-to-convert-between-various-string-types?view=msvc-170
        const char* orig = messageText.data();
        size_t newsize = strlen(orig) + 1;
        wchar_t* message = new wchar_t[newsize];
        // Convert char* string to a wchar_t* string.
        size_t convertedChars = 0;
        mbstowcs_s(&convertedChars, message, newsize, orig, _TRUNCATE);
        //wchar_t* message = "You can't save when you have a wanted level.";
        CHud::SetHelpMessage(message, true);
        delete[] message;
    }
public:
    QuickSave() {
        // Variable for when the last time key has been pressed.
        static int keyPressTime = 0;
        // F5 Keycode -> 0x74
        static int F5_KEY = 0x74;

        Events::initScriptsEvent += [] {
            keyPressTime = 0;
        };
        Events::processScriptsEvent += []
        {
            // Check if the player pressed F5 and 500ms has passed since the player pressed F5.
            if (KeyPressed(F5_KEY) && CTimer::m_snTimeInMilliseconds - keyPressTime > 500)
            {
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                // Find player ped pointer.
                CPlayerPed* player = FindPlayerPed();
                if (player != NULL)
                {
                    // Get some player info to check before calling "ACTIVATE_SAVE_MENU" command.
                    bool isInVehicle = player->m_bInVehicle;
                    bool isPlayerOnAMission = CTheScripts::IsPlayerOnAMission();
                    auto playerState = player->m_ePedState;
                    int wantedLevel = player->m_pWanted->m_nWantedLevel;
                    /*
                     * Player States and Flags Information = https://github.com/DK22Pac/plugin-sdk/blob/master/plugin_vc/game_vc/CPed.h
                     */
                    if (!isPlayerOnAMission)
                    {
                        if (!isInVehicle)
                        {
                            if (wantedLevel < 1)
                            {
                                if (player->m_eMoveState == eMoveState::PEDMOVE_STILL)
                                {
                                    PrintQuickHelpMessage("Quick Save");
                                    //We can also use front end manager to open the save menu.
                                    //FrontEndMenuManager.m_bSaveMenuActive = true;
                                    Command<Commands::ACTIVATE_SAVE_MENU>();
                                }
                            }
                            else
                            {
                                PrintQuickHelpMessage("You can't save when you have a wanted level.");
                            }
                        }
                        else
                        {
                            PrintQuickHelpMessage("You can't save when you are in a vehicle.");
                        }
                    }
                    else
                    {
                        PrintQuickHelpMessage("You can't save when you are on a mission.");
                    }
                }
            }
        };
    }
} quickSave;
