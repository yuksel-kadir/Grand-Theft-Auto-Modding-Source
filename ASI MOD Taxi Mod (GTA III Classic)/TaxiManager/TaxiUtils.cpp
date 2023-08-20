#include "PluginBase.h"
#include "plugin.h"
#include "CHud.h"
#include "CCam.h"
#include "CGame.h"
#include "CFont.h"
#include "CTimer.h"
#include "CPools.h"
#include "CStats.h"
#include "CCamera.h"
#include "cDMAudio.h"
#include "CCarCtrl.h"
#include "CPathFind.h"
#include "CTheZones.h"
#include "CStreaming.h"
#include "CAutoPilot.h"
#include "CModelInfo.h"
#include "CTheScripts.h"
#include "TaxiUtils.h"
#include "../extensions/ScriptCommands.h"
#include "TextInformation.h"
#define _USE_MATH_DEFINES
#include <math.h>

TaxiStatus TaxiUtils::taxiStatus = TaxiStatus(false, false, false, 0, 0, 0, CVector(0,0,0), CVector(0, 0, 0));

//Convert degree to radian.
float TaxiUtils::DegreeToRadian(float degree) {
    return (float)((degree * M_PI) / 180.0f);
}
//Set key press time to current time in milliseconds.
void TaxiUtils::SetKeyPressTimeToCurrentTime(int& keyPressTime) {
    keyPressTime = CTimer::m_snTimeInMilliseconds;
}
//Start Fade Out
void TaxiUtils::StartFadeOut() {
    TheCamera.SetFadeColour(0, 0, 0);
    TheCamera.Fade(0.5f, 0);
    //TheCamera.ProcessFade();
}
//Start Fade In
void TaxiUtils::StartFadeIn() {
    TheCamera.SetFadeColour(0, 0, 0);
    TheCamera.Fade(2.0f, 1);
    //TheCamera.ProcessFade();
}
//Confirm the destination
void TaxiUtils::ConfirmDestination(bool& isGoingToDestination, int& destinationConfirmStartTime, int& selectedDestinationIndex, int& destinationIndex) {
    isGoingToDestination = true;
    destinationConfirmStartTime = CTimer::m_snTimeInMilliseconds;
    selectedDestinationIndex = destinationIndex;
    DMAudio.PlayFrontEndSound(HELP_MESSAGE_SOUND, 100);
}
//Go to the selected destination.
void TaxiUtils::GoToDestination(CVehicle* veh, CVector destination) {
    veh->m_autoPilot.m_vecDestinationCoors.x = destination.x;
    veh->m_autoPilot.m_vecDestinationCoors.y = destination.y;
    veh->m_autoPilot.m_vecDestinationCoors.z = destination.z;
    plugin::Command<eScriptCommands::COMMAND_SET_CAR_CHANGE_LANE>(veh, true);
    plugin::Command<eScriptCommands::COMMAND_CAR_GOTO_COORDINATES_ACCURATE>(veh, destination.x, destination.y, destination.z);
    veh->m_autoPilot.m_nCruiseSpeed = 25;
    veh->m_autoPilot.m_nDrivingStyle = eCarDrivingStyle::DRIVINGSTYLE_AVOID_CARS;
    //veh->m_autoPilot.m_nCarMission = eCarMission::MISSION_GOTOCOORDS_ACCURATE;
    //veh->m_autoPilot.m_nTimeToStartMission = CTimer::m_snTimeInMilliseconds;
    veh->m_nVehicleFlags.bCanBeDamaged = false;
    CAutomobile* taxiAutomobile = reinterpret_cast<CAutomobile*>(veh);
    taxiAutomobile->SetTaxiLight(true);
}
//Check if the vehicle model is a taxi.
bool TaxiUtils::CheckVehicleModel(CVehicle* veh) {
    short vehicleModelID = veh->m_nModelIndex;
    if (vehicleModelID == TaxiUtils::TAXI_MODEL_1 || vehicleModelID == TaxiUtils::TAXI_MODEL_2)
        return true;
    return false;
}
//Check if the driver is a taxi driver.
bool TaxiUtils::CheckDriverModel(CPed* driver) {
    if (driver != NULL) {
        short driverModelID = driver->m_nModelIndex;
        if (driverModelID == TaxiUtils::TAXI_DRIVER_MODEL_1 || driverModelID == TaxiUtils::TAXI_DRIVER_MODEL_2)
            return true;
    }
    return false;
}
//Check if the vehicle model is a taxi and the driver is a taxi driver.
bool TaxiUtils::CheckVehicleAndDriverModel(CVehicle* veh) {
    if (veh->m_pDriver != NULL) {
        bool isVehicleTaxi = CheckVehicleModel(veh);
        bool isPedTaxiDriver = CheckDriverModel(veh->m_pDriver);
        if (isVehicleTaxi && isPedTaxiDriver)
            return true;
    }
    return false;
}
//Check bridge status for Starfish Island and the other bridges.
bool TaxiUtils::CheckBridgeStatus(eLevelName levelName) {
    bool bridgeStatus = false;
    switch (levelName) {
    case eLevelName::PORTLAND:
        bridgeStatus = true;//CStats::IndustrialPassed;
        break;
    case eLevelName::STAUNTON_ISLAND:
        bridgeStatus = CStats::IndustrialPassed;
        break;
    case eLevelName::SHORESIDE_VALE:
        bridgeStatus = CStats::CommercialPassed;
        //bridgeStatus = CStats::SuburbanPassed;
        break;
    default:
        bridgeStatus = false;
        break;
    }
    return bridgeStatus;
}
//Enter the taxi.
void TaxiUtils::EnterTheTaxi(CPlayerPed* playerped, CVehicle* taxi) {
    playerped->ClearObjective();
    playerped->SetObjective(eObjective::OBJECTIVE_ENTER_CAR_AS_PASSENGER, taxi);
}
//Get out of the taxi.
void TaxiUtils::ResetTaxiSettings(CVehicle* taxi) {
    if (taxi != NULL) {
        taxi->m_nVehicleFlags.bCanBeDamaged = true;
        TaxiUtils::UnlockTheDoor(taxi);
        reinterpret_cast<CAutomobile*>(taxi)->SetTaxiLight(false);
    }
}
//Stop the taxi.
void TaxiUtils::StopTheTaxi(CVehicle* taxi) {
    taxi->m_autoPilot.m_nAnimationId = eCarTempAction::TEMPACT_HANDBRAKESTRAIGHT;
    taxi->m_autoPilot.m_nAnimationTime = CTimer::m_snTimeInMilliseconds + 2500;
    taxi->m_autoPilot.m_nCarMission = eCarMission::MISSION_STOP_FOREVER;
    taxi->m_autoPilot.m_nTimeToStartMission = CTimer::m_snTimeInMilliseconds;
    taxi->m_autoPilot.m_nCruiseSpeed = 0;
}
//Make the taxi wander randomly.
void TaxiUtils::MakeTaxiWanderRandomly(CVehicle* taxi) {
    if (taxi != NULL) {
        taxi->m_autoPilot.m_nDrivingStyle = eCarDrivingStyle::DRIVINGSTYLE_STOP_FOR_CARS;
        taxi->m_autoPilot.m_nCarMission = eCarMission::MISSION_CRUISE;
        taxi->m_autoPilot.m_nTimeToStartMission = CTimer::m_snTimeInMilliseconds + 5000;
        taxi->m_autoPilot.m_nCruiseSpeed = 10;
        if(TaxiUtils::taxiStatus.everSelectedDestination)
            CCarCtrl::JoinCarWithRoadSystem(taxi);
        TaxiUtils::taxiStatus.everSelectedDestination = false;
    }
}
//Find the nearest taxi and check the drivers model and health
CVehicle* TaxiUtils::FindTaxi(CVector playerPos, float positionOffset) {
    float leftBottomX = playerPos.x - positionOffset;
    float leftBottomY = playerPos.y - positionOffset;
    float rightTopX = playerPos.x + positionOffset;
    float rightTopY = playerPos.y + positionOffset;
    float maxDistanceBetweenPlayerAndTaxi = 10;
    CVehicle* tempVehicle = NULL;
    float minDistance = 100.0f;
    for (auto veh : CPools::ms_pVehiclePool)
    {
        if (veh != NULL) {
            //Check if the vehicle is a taxi.
            bool isVehicleTaxi = CheckVehicleModel(veh);
            if (isVehicleTaxi) {
                CVector vehiclePos = veh->GetPosition();
                float distance = DistanceBetweenPoints(playerPos, vehiclePos);
                //Check if the taxi is near the player.
                if (distance < maxDistanceBetweenPlayerAndTaxi && distance < minDistance) {
                    //Check if the taxi has a driver.
                    if (veh->m_pDriver != NULL) {
                        bool isPedTaxiDriver = CheckDriverModel(veh->m_pDriver);
                        //Check if the driver is a taxi driver.
                        if (isPedTaxiDriver) {
                            CPed* driver = veh->m_pDriver;
                            if (driver->m_fHealth > 1
                                && driver->m_ePedState == ePedState::PEDSTATE_DRIVING
                                ) {
                                minDistance = distance;
                                tempVehicle = veh;
                            }
                        }
                    }
                }
            }
        }
    }
    if (tempVehicle != NULL) {
        return tempVehicle;
    }
    return NULL;
}
//Teleport the taxi to the destination.
void TaxiUtils::TaxiTeleport(CVehicle* taxi, CVector& destination, float heading, eLevelName levelName) {
    CTimer::Suspend();
    //plugin::Command<plugin::Commands::REQUEST_COLLISION>(destination.x, destination.y);
    //Request and load collisions and scene.
     plugin::Command<plugin::Commands::LOAD_COLLISION>(levelName);
    //CColStore::RequestCollision(ShortCutDestination);
    //CStreaming::LoadSceneCollision(pos);
     CStreaming::LoadScene(destination);
     CTheScripts::ClearSpaceForMissionEntity(destination, taxi);
     taxi->Teleport(destination);
     taxi->SetHeading(heading);
    //ShortCutTimer = CTimer::GetTimeInMilliseconds() + 1500;
    CTimer::Resume();
}

void TaxiUtils::ForcePassengersToLeave(CVehicle* taxi) {
    for (auto passenger : taxi->m_apPassengers) {
        if (passenger != NULL) {
            passenger->SetObjective(eObjective::OBJECTIVE_LEAVE_CAR, taxi);
        }
    }
}

void TaxiUtils::ResetTaxiStatus() {
    TaxiUtils::taxiStatus.currentTotalCost = 0;
    TaxiUtils::taxiStatus.selectedDestinationIndex = 0;
    TaxiUtils::taxiStatus.passengerWaitStartTime = 0;
    TaxiUtils::taxiStatus.destinationPosition = CVector(0, 0, 0);
    TaxiUtils::taxiStatus.startPosition = CVector(0, 0, 0);
    TaxiUtils::taxiStatus.goingToDestination = false;
    TaxiUtils::taxiStatus.everSelectedDestination = false;
    TaxiUtils::taxiStatus.skippingTravel = false;
}

//Get money from player.
void TaxiUtils::PayTheCost(int& cost, CPlayerPed* playerped) {
    playerped->GetPlayerInfoForThisPlayerPed()->m_nMoney -= cost;
}
//Calculate the taxi cost.
int TaxiUtils::CalculateTheCost(CVector& startPoint, CVector& destinationPoint) {
    int distance = (int)DistanceBetweenPoints(startPoint, destinationPoint);
    int cost = (int)(distance * TaxiUtils::COST_MULTIPLIER);
    return cost;
}
//Check if the player has enough money for the destination.
bool TaxiUtils::DoesPlayerHaveEnoughMoney(int& cost, CPlayerPed* playerped) {
    int playerMoney = playerped->GetPlayerInfoForThisPlayerPed()->m_nMoney;
    if (cost > playerMoney)
        return false;
    return true;
}

void TaxiUtils::LockTheDoor(CVehicle* pTaxi) {
    pTaxi->m_eDoorLock = eDoorLock::DOORLOCK_LOCKED;
}

void TaxiUtils::UnlockTheDoor(CVehicle* pTaxi) {
    pTaxi->m_eDoorLock = eDoorLock::DOORLOCK_UNLOCKED;
}