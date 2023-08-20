#pragma once
#include "PluginBase.h"
#include "CVehicle.h"
#include "CVector.h"
#include "CRGBA.h"
#include <game_III/eLevelName.h>
#include "TaxiStatus.h"
#include "TextInformation.h"


class TaxiUtils {
public:
	static TaxiStatus taxiStatus;
	//DRIVER MODEL IDS
	static const short TAXI_DRIVER_MODEL_1 = 7;
	static const short TAXI_DRIVER_MODEL_2 = 8;
	//TAXI MODEL IDS
	static const short TAXI_MODEL_1 = 110;
	static const short TAXI_MODEL_2 = 128;
	//Sound List -> https://gist.github.com/WastedHymn/ac8b59d17734138725b376a5e5d83c90
	static const unsigned short HELP_MESSAGE_SOUND = 160;
	//Multiplier
	static constexpr float COST_MULTIPLIER = 0.1f;
	//funcs
	static float DegreeToRadian(float degree);
	static void SetKeyPressTimeToCurrentTime(int& keyPressTime);
	static void StartFadeOut();
	static void StartFadeIn();
	static void ConfirmDestination(bool& isGoingToDestination, int& destinationConfirmStartTime, int& selectedDestinationIndex, int& destinationIndex);
	static void GoToDestination(CVehicle* veh, CVector destination);
	static bool CheckVehicleModel(CVehicle* veh);
	static bool CheckDriverModel(CPed* driver);
	static bool CheckVehicleAndDriverModel(CVehicle* veh);
	static bool CheckBridgeStatus(eLevelName levelName);
	static void EnterTheTaxi(CPlayerPed* playerped, CVehicle* taxi);
	static void ResetTaxiSettings(CVehicle* taxi);
	static void StopTheTaxi(CVehicle* taxi);
	static void MakeTaxiWanderRandomly(CVehicle* taxi);
	static CVehicle* FindTaxi(CVector playerPos, float positionOffset);
	static void TaxiTeleport(CVehicle* taxi, CVector& pos, float heading, eLevelName levelName);
	static void ForcePassengersToLeave(CVehicle* taxi);
	static void ResetTaxiStatus();
	static void PayTheCost(int& cost, CPlayerPed* playerped);
	static int CalculateTheCost(CVector& startPoint, CVector& destinationPoint);
	static bool DoesPlayerHaveEnoughMoney(int& cost, CPlayerPed* playerped);
	static void LockTheDoor(CVehicle* pTaxi);
	static void UnlockTheDoor(CVehicle* pTaxi);
};