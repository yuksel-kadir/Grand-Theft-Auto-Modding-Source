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

class SaveAnywhere
{
public:
    SaveAnywhere()
    {
        // Variable for when the last time key has been pressed.
        static int keyPressTime = 0;
        // F5 Keycode -> 0x74
        static int F5_KEY = 0x74;
        // Initialise your plugin here
        Events::processScriptsEvent += []
        {
            // Check if the player pressed F5 and 500ms has passed since the player pressed F5.
            if (KeyPressed(F5_KEY) && CTimer::m_snTimeInMilliseconds - keyPressTime > 500)
            {
                keyPressTime = CTimer::m_snTimeInMilliseconds;
                // Find player ped pointer.
                CPlayerPed *player = FindPlayerPed();
                if (player != nullptr)
                {
                    // Get some player info to check before calling "ACTIVATE_SAVE_MENU" command.                                        
                    bool isInAir = player->m_nPedFlags.bIsInTheAir;
                    bool isPlayerOnAMission = CTheScripts::IsPlayerOnAMission();                    
                    auto playerState = player->m_ePedState;
                    int wantedLevel = player->m_pWanted->m_nWantedLevel;
                    int interiorId = injector::ReadMemory<int>(0x978810, false); //Read interior value from "0x978810". More info -> https://gtamods.com/wiki/Memory_Addresses_(VC)#CGame
                    /*
                     * Check these player states:
                     * Is idle  
                     * Not on a mission
                     * Wamted level is lower than 1
                     * Is not in interior (id of the outside is 0.)
                     * Player States and Flags Information = https://github.com/DK22Pac/plugin-sdk/blob/master/plugin_vc/game_vc/CPed.h
                     */
                    if (!isPlayerOnAMission && wantedLevel < 1 && playerState == ePedState::PEDSTATE_IDLE && !isInAir && interiorId == 0)
                    {                        
                                    //FrontEndMenuManager.m_bSaveMenuActive = true;
                                    Command<Commands::ACTIVATE_SAVE_MENU>();
                                    CHud::SetHelpMessage("Quick Save", true, false);                                    
                    }                   
                }
            }
        };
    }
} saveAnywhere;
