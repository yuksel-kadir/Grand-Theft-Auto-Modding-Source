#pragma once

#include "PluginBase.h"

class InputUtils {
public:
	static bool IsTimeElapsed(int& time, int delay);
	static void RefreshKeyPressTime(int& keyPressTime);
};