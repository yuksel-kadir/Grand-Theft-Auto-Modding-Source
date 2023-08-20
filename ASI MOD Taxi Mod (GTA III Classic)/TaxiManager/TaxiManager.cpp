#include "plugin.h"
#include "CTimer.h"
#include "CVehicle.h"
#include "cDMAudio.h"
#include "CPlayerPed.h"
#include "CMenuManager.h"
#include "TaxiUtils.h"
#include "TextUtils.h"
#include "InputUtils.h"
#include "Destinations.h"
#include <extensions/scripting/ScriptCommandNames.h>
#include "extensions/ScriptCommands.h"

using namespace plugin;

class TaxiManager {
public:
    //KEY CODES
    static const int8_t NUM_1 = 0x31;
    static const int8_t NUM_2 = 0x32;
    static const int8_t A_KEY = 0x41;
    static const int8_t C_KEY = 0x43;
    static const int8_t D_KEY = 0x44;
    static const int8_t E_KEY = 0x45;
    static const int8_t G_KEY = 0x47;
    static const int8_t S_KEY = 0x53;
    static const int8_t T_KEY = 0x54;
    static const int8_t W_KEY = 0x57;
    static const int DESTINATION_TEXT_DURATION = 10000;
    static const int CONFIRMED_DESTINATION_TEXT_DURATION = 5000;
public:
    static void CompleteTravel(CPlayerPed* playerped, CVehicle* pTaxi) {
        int cost = TaxiUtils::CalculateTheCost(TaxiUtils::taxiStatus.startPosition, pTaxi->GetPosition());
        int total = TaxiUtils::taxiStatus.currentTotalCost + cost;

        if(total > 0) {
            std::string cabFareText = TextUtils::CABFARE_MSG + std::to_string(total);
            TextUtils::SetText(TextUtils::cabFareTextInfo, cabFareText);
            TextUtils::SetTextDisplayStartTime(TextUtils::cabFareTextInfo, CTimer::m_snTimeInMilliseconds);
            TextUtils::SetTextDisplayTime(TextUtils::cabFareTextInfo, CONFIRMED_DESTINATION_TEXT_DURATION);
            TextUtils::ShowText(TextUtils::cabFareTextInfo);

            TaxiUtils::PayTheCost(total, playerped);
        }

        TaxiUtils::taxiStatus.currentTotalCost = 0;
        TaxiUtils::taxiStatus.goingToDestination = false;
    }

    static void ResetSettings(CPlayerPed* playerped, CVehicle* pTaxi) {
        TextUtils::HideText(TextUtils::destinationTextInfo);
        if (TaxiUtils::taxiStatus.goingToDestination) {
            TaxiManager::CompleteTravel(playerped, pTaxi);
        }
        TaxiUtils::ResetTaxiSettings(pTaxi);
        TaxiUtils::StopTheTaxi(pTaxi);
        TaxiUtils::MakeTaxiWanderRandomly(pTaxi);
    }

    static void ResetPlayerWantedSettings(CPlayerPed* playerped) {
        playerped->m_pWanted->SetMaximumWantedLevel(6);
    }

    static void MakePlayerIgnoredByCops(CPlayerPed* playerped) {
        playerped->m_pWanted->SetMaximumWantedLevel(0);
    }

    TaxiManager() {
        static CPlayerPed* playerped;

        static int n_keyPressTime = 0;
        static int n_fadeOutStartTime = 0;

        static int8_t n_destinationIndex = 0;

        static const float f_positionOffset = 7.0f;

        static CVehicle* pTaxi;

        static ePedState driverPedState = ePedState::PEDSTATE_NONE;

        static bool b_fadingOut = false;

        Events::initGameEvent += [] {
            playerped = FindPlayerPed();
        };

        Events::initScriptsEvent += [] {
            screen::SetBaseResolution(900.0f);
            pTaxi = NULL;
            n_keyPressTime = 0;
            n_fadeOutStartTime = 0;
            b_fadingOut = false;
            TextUtils::ResetTextSettings(TextUtils::destinationTextInfo);
            TextUtils::ResetTextSettings(TextUtils::cabFareTextInfo);
            TaxiUtils::ResetTaxiStatus();
        };

        Events::drawHudEvent += [] {
            /*
            std::string goingToDestMsg = "Going to Destination: " + std::to_string(TaxiUtils::taxiStatus.goingToDestination);
            TextUtils::DisplayDebugText(goingToDestMsg, 625);
            std::string cabFareMsg = "CabFare: " + std::to_string(TextUtils::cabFareTextInfo.showText);
            TextUtils::DisplayDebugText(cabFareMsg,  600);
            std::string playerMsg = "player state: " + std::to_string(playerped->m_ePedState);
            TextUtils::DisplayDebugText(playerMsg,  550);
            std::string currentTotalCostMsg = "Crnt Total Cost: " + std::to_string(TaxiUtils::taxiStatus.currentTotalCost);
            TextUtils::DisplayDebugText(currentTotalCostMsg, 525);
            if (pTaxi != NULL) {
                std::string taxiMission = "Taxi Mission: " + std::to_string(pTaxi->m_autoPilot.m_nCarMission);
                TextUtils::DisplayDebugText(taxiMission, 500);
                if (pTaxi->m_pDriver != NULL) {
                    std::string driverMsg = "driver state: " + std::to_string(pTaxi->m_pDriver->m_ePedState);
                    TextUtils::DisplayDebugText(driverMsg, 575);
                    std::string driverCheckMsg = "Driver Check: " + std::to_string(TaxiUtils::CheckDriverModel(pTaxi->m_pDriver));
                    TextUtils::DisplayDebugText(driverCheckMsg, 650);
                }
            }
            std::string wantedMultiplierMsg = "Wanted Multiplier: " + std::to_string(playerped->m_pWanted->m_fMultiplier);
            TextUtils::DisplayDebugText(wantedMultiplierMsg, 475);
            std::string maxWantedLevelMsg = "Max Wanted Level: " + std::to_string(playerped->m_pWanted->MaximumWantedLevel);
            TextUtils::DisplayDebugText(maxWantedLevelMsg, 450);
            std::string everSelectedDestMsg = "Ever Selected Dest: " + std::to_string(TaxiUtils::taxiStatus.everSelectedDestination);
            TextUtils::DisplayDebugText(everSelectedDestMsg, 425);
            std::string fontIndexMsg = "Font Index: " + std::to_string(TextUtils::destinationTextInfo.fontIndex);
            TextUtils::DisplayDebugText(fontIndexMsg, 400);
            */
            if (TextUtils::destinationTextInfo.showText)
                TextUtils::PrintText(TextUtils::destinationTextInfo.text, TextUtils::destinationTextInfo.textColor, TextUtils::destinationTextInfo.textPosition);
            if (TextUtils::cabFareTextInfo.showText)
                TextUtils::PrintText(TextUtils::cabFareTextInfo.text, TextUtils::COLOR_ORANGE, eTextPosition::BOTTOM_CENTER);
        };

        Events::gameProcessEvent += [] {
            if (!FrontEndMenuManager.m_bMenuActive) {
                if (playerped->m_ePedState == ePedState::PEDSTATE_IDLE) {
                    if (TaxiUtils::taxiStatus.goingToDestination) {
                        TaxiManager::ResetPlayerWantedSettings(playerped);
                        TaxiManager::ResetSettings(playerped, pTaxi);
                        pTaxi = NULL;
                    }
                    // CHECK IF THE TAXI HAS WAITED 8 SECONDS FOR THE PLAYER TO GET IN
                    if (pTaxi != NULL && InputUtils::IsTimeElapsed(TaxiUtils::taxiStatus.passengerWaitStartTime, 8000) && !TaxiUtils::taxiStatus.goingToDestination) {
                        TaxiManager::ResetSettings(playerped, pTaxi);
                        pTaxi = NULL;
                    }
                    if (KeyPressed(E_KEY) && InputUtils::IsTimeElapsed(n_keyPressTime, 250) && playerped->m_pWanted->m_nWantedLevel == 0) {
                        InputUtils::RefreshKeyPressTime(n_keyPressTime);
                        pTaxi = TaxiUtils::FindTaxi(playerped->GetPosition(), f_positionOffset);
                        if (pTaxi != NULL) {
                            TaxiUtils::StopTheTaxi(pTaxi);
                            TaxiUtils::ForcePassengersToLeave(pTaxi);
                            TaxiUtils::EnterTheTaxi(playerped, pTaxi);
                        }
                    }
                }
                else if (playerped->m_ePedState == ePedState::PEDSTATE_DRIVING) {// CHECK IF THE PLAYER IS PASSENGER IN THE TAXI
                    if (pTaxi != NULL) {
                        if (pTaxi->m_pDriver != NULL) {// CHECK IF THE DRIVER EXIST
                            if (pTaxi->m_pDriver->m_ePedState == ePedState::PEDSTATE_DRIVING && TaxiUtils::CheckDriverModel(pTaxi->m_pDriver)) {// CHECK IF THE DRIVER IS DRIVING
                                if (!TaxiUtils::taxiStatus.skippingTravel) {
                                    // SHOW/HIDE DESTINATION TEXT || (CPad::GetPad(0)->NewState.LeftStickY <= -127)
                                    if ((KeyPressed(VK_UP) || KeyPressed(W_KEY)) && InputUtils::IsTimeElapsed(n_keyPressTime, 350)) {
                                        InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                        if (!TextUtils::destinationTextInfo.showText) {
                                            int selectedDestIndex = TaxiUtils::taxiStatus.selectedDestinationIndex;
                                            TextUtils::SetText(TextUtils::destinationTextInfo, Destinations::destinationInformationList[selectedDestIndex].destinationName);
                                            TextUtils::SetTextDisplayStartTime(TextUtils::destinationTextInfo, CTimer::m_snTimeInMilliseconds);
                                            TextUtils::SetTextDisplayTime(TextUtils::destinationTextInfo, DESTINATION_TEXT_DURATION);
                                            TextUtils::SetTextColor(TextUtils::COLOR_ORANGE);
                                        }
                                        TextUtils::destinationTextInfo.showText = !TextUtils::destinationTextInfo.showText;
                                        DMAudio.PlayFrontEndSound(TaxiUtils::HELP_MESSAGE_SOUND, 0);
                                    }
                                    if (TextUtils::destinationTextInfo.showText) {
                                        // SHOW PREVIOUS DESTINATION TEXT || (CPad::GetPad(0)->NewState.LeftStickX <= -127)
                                        if ((KeyPressed(VK_LEFT) || KeyPressed(A_KEY)) && InputUtils::IsTimeElapsed(n_keyPressTime, 250)) {
                                            InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                            TextUtils::PreviousDestination(n_destinationIndex);
                                            TextUtils::SetText(TextUtils::destinationTextInfo, Destinations::destinationInformationList[n_destinationIndex].destinationName);
                                            TextUtils::SetTextDisplayStartTime(TextUtils::destinationTextInfo, CTimer::m_snTimeInMilliseconds);
                                            TextUtils::SetTextDisplayTime(TextUtils::destinationTextInfo, DESTINATION_TEXT_DURATION);
                                            TextUtils::SetTextColor(TextUtils::COLOR_ORANGE);
                                            DMAudio.PlayFrontEndSound(TaxiUtils::HELP_MESSAGE_SOUND, 0);
                                        }
                                        // SHOW PREVIOUS NEXT TEXT || (CPad::GetPad(0)->NewState.LeftStickX >= 127)
                                        if ((KeyPressed(VK_RIGHT) || KeyPressed(D_KEY)) && InputUtils::IsTimeElapsed(n_keyPressTime, 250)) {
                                            InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                            TextUtils::NextDestination(n_destinationIndex);
                                            TextUtils::SetText(TextUtils::destinationTextInfo, Destinations::destinationInformationList[n_destinationIndex].destinationName);
                                            TextUtils::SetTextDisplayStartTime(TextUtils::destinationTextInfo, CTimer::m_snTimeInMilliseconds);
                                            TextUtils::SetTextDisplayTime(TextUtils::destinationTextInfo, DESTINATION_TEXT_DURATION);
                                            TextUtils::SetTextColor(TextUtils::COLOR_ORANGE);
                                            DMAudio.PlayFrontEndSound(TaxiUtils::HELP_MESSAGE_SOUND, 0);
                                        }
                                        // CONFIRM DESTINATION   || (CPad::GetPad(0)->NewState.ButtonCross == 255)
                                        if ((KeyPressed(VK_DOWN) || KeyPressed(S_KEY)) && InputUtils::IsTimeElapsed(n_keyPressTime, 250)) {
                                            InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                            bool canTaxiGoToDestination = TaxiUtils::CheckBridgeStatus(Destinations::destinationInformationList[n_destinationIndex].levelName);
                                            if (canTaxiGoToDestination) {//TaxiUtils::taxiStatus.destinationPosition
                                                CVector taxiDestinationPosition = Destinations::destinationInformationList[n_destinationIndex].destinationLocation;
                                                float distanceToDestinationFromCurrentPosition = DistanceBetweenPoints(pTaxi->GetPosition(), taxiDestinationPosition);
                                                if (distanceToDestinationFromCurrentPosition > 20) {
                                                    int costFromCurrentToDestination = TaxiUtils::CalculateTheCost(pTaxi->GetPosition(), taxiDestinationPosition);
                                                    bool hasEnoughMoney = false;
                                                    //If taxi is not going anywhere change the start position to the taxi's current position.
                                                    if (!TaxiUtils::taxiStatus.goingToDestination) {
                                                        hasEnoughMoney = TaxiUtils::DoesPlayerHaveEnoughMoney(costFromCurrentToDestination, playerped);
                                                    }
                                                    else {//If the taxi is going to a destination, calculate the cost and add that to the current taxi cost.
                                                        int costFromStartToCurrent = TaxiUtils::CalculateTheCost(TaxiUtils::taxiStatus.startPosition, pTaxi->GetPosition());
                                                        int tempcost = TaxiUtils::taxiStatus.currentTotalCost + costFromStartToCurrent + costFromCurrentToDestination;
                                                        hasEnoughMoney = TaxiUtils::DoesPlayerHaveEnoughMoney(tempcost, playerped);
                                                        if (hasEnoughMoney) {
                                                            TaxiUtils::taxiStatus.currentTotalCost += costFromStartToCurrent;
                                                        }
                                                    }
                                                    if (hasEnoughMoney) {
                                                        TaxiUtils::taxiStatus.startPosition = pTaxi->GetPosition();
                                                        TaxiUtils::taxiStatus.goingToDestination = true;
                                                        TaxiUtils::taxiStatus.selectedDestinationIndex = n_destinationIndex;
                                                        TaxiUtils::taxiStatus.destinationPosition = Destinations::destinationInformationList[n_destinationIndex].destinationLocation;

                                                        TextUtils::SetText(TextUtils::destinationTextInfo, Destinations::destinationInformationList[n_destinationIndex].destinationName);
                                                        TextUtils::SetTextDisplayStartTime(TextUtils::destinationTextInfo, CTimer::m_snTimeInMilliseconds);
                                                        TextUtils::SetTextDisplayTime(TextUtils::destinationTextInfo, CONFIRMED_DESTINATION_TEXT_DURATION);
                                                        TextUtils::SetTextColor(TextUtils::COLOR_DARK_ORANGE);

                                                        DMAudio.PlayFrontEndSound(TaxiUtils::HELP_MESSAGE_SOUND, 0);

                                                        TaxiUtils::GoToDestination(pTaxi, taxiDestinationPosition);
                                                        TaxiUtils::taxiStatus.everSelectedDestination = true;
                                                    }
                                                    else {
                                                        TextUtils::PrintQuickHelpMessage(TextUtils::NOT_ENOUGH_MONEY_MSG + Destinations::destinationInformationList[n_destinationIndex].destinationName);
                                                    }
                                                }
                                                else {
                                                    TextUtils::PrintQuickHelpMessage(TextUtils::DISTANCE_MSG);
                                                }
                                            }
                                            else {
                                                TextUtils::PrintBridgeHelpMessage(Destinations::destinationInformationList[n_destinationIndex].levelName);
                                            }
                                        }
                                        // CHANGE TEXT FONT || CPad::GetPad(0)->NewState.ShockButtonL == 255
                                        /*
                                        if ((KeyPressed(VK_NEXT)) && InputUtils::IsTimeElapsed(n_keyPressTime, 250)) {
                                            InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                            TextUtils::ChangeFont();
                                        }
                                        */
                                    }
                                    // SKIP TRAVEL
                                    if (KeyPressed(G_KEY)
                                        && InputUtils::IsTimeElapsed(n_keyPressTime, 500)
                                        && !TaxiUtils::taxiStatus.skippingTravel
                                        && (DistanceBetweenPoints(pTaxi->GetPosition(), TaxiUtils::taxiStatus.destinationPosition) > 20)
                                        )
                                    {
                                        InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                        Command<plugin::Commands::SET_PLAYER_CONTROL>(0, false);
                                        TaxiUtils::StartFadeOut();
                                        n_fadeOutStartTime = CTimer::m_snTimeInMilliseconds;
                                        b_fadingOut = true;
                                        TaxiUtils::taxiStatus.skippingTravel = true;
                                    }
                                    // STOP THE TAXI
                                    if (KeyPressed(VK_SPACE) && InputUtils::IsTimeElapsed(n_keyPressTime, 250)) {
                                        InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                        if (pTaxi != NULL) {
                                            TaxiUtils::StopTheTaxi(pTaxi);
                                        }
                                    }
                                    //LOCK THE DOOR  || CPad::GetPad(0)->NewState.DPadDown == 255
                                    if ((KeyPressed(NUM_1) || KeyPressed(VK_NUMPAD1)) && (CTimer::m_snTimeInMilliseconds - n_keyPressTime > 500)) {
                                        TaxiUtils::LockTheDoor(pTaxi);
                                    }
                                    //UNLOCK THE DOOR || CPad::GetPad(0)->NewState.DPadUp == 255
                                    if ((KeyPressed(NUM_2) || KeyPressed(VK_NUMPAD2)) && (CTimer::m_snTimeInMilliseconds - n_keyPressTime > 500)) {
                                        TaxiUtils::UnlockTheDoor(pTaxi);
                                    }
                                }
                                if (TaxiUtils::taxiStatus.skippingTravel && InputUtils::IsTimeElapsed(n_fadeOutStartTime, 1500)) {
                                    TaxiUtils::StopTheTaxi(pTaxi);
                                    TaxiUtils::TaxiTeleport(
                                        pTaxi,
                                        Destinations::destinationInformationList[TaxiUtils::taxiStatus.selectedDestinationIndex].destinationLocation,
                                        Destinations::destinationInformationList[TaxiUtils::taxiStatus.selectedDestinationIndex].vehicleRotation,
                                        Destinations::destinationInformationList[TaxiUtils::taxiStatus.selectedDestinationIndex].levelName
                                    );
                                    TaxiUtils::taxiStatus.skippingTravel = false;
                                }
                                if (b_fadingOut && InputUtils::IsTimeElapsed(n_fadeOutStartTime, 2500)) {
                                    TaxiUtils::StartFadeIn();
                                    b_fadingOut = false;
                                    pTaxi->m_autoPilot.m_nCarMission = eCarMission::MISSION_NONE;
                                    pTaxi->m_autoPilot.m_nTimeToStartMission = CTimer::m_snTimeInMilliseconds;
                                    Command<plugin::Commands::SET_PLAYER_CONTROL>(0, true);
                                }
                                if (pTaxi->m_autoPilot.m_nCarMission == eCarMission::MISSION_NONE && TaxiUtils::taxiStatus.goingToDestination) {
                                    TaxiManager::CompleteTravel(playerped, pTaxi);
                                }
                            }
                        }
                    }
                }
                else if (playerped->m_ePedState == ePedState::PEDSTATE_DRAG_FROM_CAR || playerped->m_ePedState == ePedState::PEDSTATE_EXIT_CAR) {
                    if (pTaxi != NULL) {
                        TaxiManager::ResetPlayerWantedSettings(playerped);
                        TaxiManager::ResetSettings(playerped, pTaxi);
                        pTaxi = NULL;
                    }
                }
                else if (playerped->m_ePedState == ePedState::PEDSTATE_ENTER_CAR) {
                    if (pTaxi != NULL && playerped->m_pVehicle != NULL) {
                        if (TaxiUtils::CheckVehicleAndDriverModel(playerped->m_pVehicle) && TaxiUtils::CheckVehicleAndDriverModel(pTaxi)) {
                            TaxiManager::MakePlayerIgnoredByCops(playerped);
                        }
                    }
                }
                //CLEAR TEXT
                if (TextUtils::destinationTextInfo.showText
                    && InputUtils::IsTimeElapsed(TextUtils::destinationTextInfo.textDisplayStartTimeInMs, TextUtils::destinationTextInfo.textDisplayTimeInMs)) {
                    TextUtils::HideText(TextUtils::destinationTextInfo);
                }
                if (TextUtils::cabFareTextInfo.showText
                    && InputUtils::IsTimeElapsed(TextUtils::cabFareTextInfo.textDisplayStartTimeInMs, TextUtils::cabFareTextInfo.textDisplayTimeInMs)) {
                    TextUtils::HideText(TextUtils::cabFareTextInfo);
                }
            }
        };
    }
} taxiManager;

// CHANGE DESTINATION TEXT POSITION
                                        /*
                                        if ((KeyPressed(VK_SHIFT)) && InputUtils::IsTimeElapsed(n_keyPressTime, 250)) {
                                            InputUtils::RefreshKeyPressTime(n_keyPressTime);
                                            TextUtils::SwitchTextPosition();
                                        }
                                        */

/*
                        TextUtils::HideText(TextUtils::destinationTextInfo);
                        if (TaxiUtils::taxiStatus.goingToDestination) {
                            TaxiManager::CompleteTravel(playerped, pTaxi);
                        }
                        TaxiUtils::ResetTaxiSettings(pTaxi);
                        TaxiUtils::MakeTaxiWanderRandomly(pTaxi);
                        pTaxi = NULL;
*/

//TaxiUtils::taxiStatus.currentTotalCost + cost;
        /*
        if (pTaxi->m_autoPilot.m_nCarMission == eCarMission::MISSION_NONE) {
            int cost = TaxiUtils::CalculateTheCost(TaxiUtils::taxiStatus.startPosition, TaxiUtils::taxiStatus.destinationPosition);
            total = TaxiUtils::taxiStatus.currentTotalCost + cost;
        }
        else {
            total = TaxiUtils::taxiStatus.currentTotalCost + TaxiUtils::CalculateTheCost(TaxiUtils::taxiStatus.startPosition, pTaxi->GetPosition());
        }
        */