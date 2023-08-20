#pragma once

#include "plugin.h"
#include "CVector.h"
#include <game_III/eLevelName.h>

struct DestinationInformation {
	std::string destinationName;
	CVector destinationLocation;
	float vehicleRotation;
	eLevelName levelName;
};
