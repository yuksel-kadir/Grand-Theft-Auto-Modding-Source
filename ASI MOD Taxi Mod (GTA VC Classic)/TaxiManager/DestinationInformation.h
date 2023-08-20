#pragma once

#include "plugin.h"
#include "CVector.h"

/// <summary>
/// Destination Information struct
/// </summary>
/// <param name="destinationName: ">Name of the destination.</param>
/// <param name="destinationLocation: ">Vector of the destination location.</param>
/// <param name="vehicleRotation: ">Rotation(radian) of the vehicle when placing the vehicle.</param>
/// <param name="globalVariableId: ">The variable id in the main.scm to check if the player unlocked relevant bridge.</param>
/// <returns></returns>
struct DestinationInformation {
	std::string destinationName;
	CVector destinationLocation;
	float vehicleRotation;
	int globalVariableId;
};
