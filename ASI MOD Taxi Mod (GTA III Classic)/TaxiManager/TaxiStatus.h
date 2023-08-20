#pragma once

#include "plugin.h"
#include "CVector.h"

/// <summary>
/// Taxi status struct
/// </summary>
/// <param name="goingToDestination: ">Is taxi going to a destination?</param>
/// <param name="currentTotalCost: ">Current total cost.</param>
/// <param name="passengerWaitStartTime: ">When the taxi started to waiting?</param>
/// <param name="selectedDestinationIndex: ">Selected destination index.</param>
///
/// <returns></returns>
struct TaxiStatus {
	bool goingToDestination;
	bool skippingTravel;
	bool everSelectedDestination;
	int currentTotalCost;
	int passengerWaitStartTime;
	int8_t selectedDestinationIndex;
	CVector startPosition;
	CVector destinationPosition;
};