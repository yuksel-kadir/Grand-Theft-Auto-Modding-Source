#include "PluginBase.h"
#include "plugin.h"
#include "CTimer.h"
#include "InputUtils.h"

bool InputUtils::IsTimeElapsed(int& time, int delay) {
    if (CTimer::m_snTimeInMilliseconds - time > delay)
       return true;
    return false;
}

void InputUtils::RefreshKeyPressTime(int& keyPressTime) {
    keyPressTime = CTimer::m_snTimeInMilliseconds;
}