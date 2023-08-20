#pragma once
#include "PluginBase.h"
#include "CRGBA.h"
#include "TextInformation.h"
#include <game_III/eLevelName.h>

class TextUtils {
public:
	//COLORS
	static const CRGBA COLOR_ORANGE;
	static const CRGBA COLOR_DARK_ORANGE;

	//MESSAGES
	static const std::string STAUNTON_MSG;
	static const std::string SHORESIDE_MSG;
	static const std::string DISTANCE_MSG;
	static const std::string NOT_ENOUGH_MONEY_MSG;
	static const std::string CABFARE_MSG;

	static TextInformation destinationTextInfo;
	static TextInformation cabFareTextInfo;

	static void PrintQuickHelpMessage(std::string messageText);
	static void SetTextInfo(TextInformation& textInfo, std::string& text, CRGBA& color, int textStartTime, int textDisplayTime, eTextPosition textPosition);
	static void PreviousDestination(int8_t& destinationIndex);
	static void NextDestination(int8_t& destinationIndex);
	static void SetFont(int8_t& fontIndex);
	static void SetText(TextInformation& textInfo, std::string& text);
	static void SetTextColor(const CRGBA color);
	static void SetTextPosition(eTextPosition& textPos);
	static void SetTextDisplayTime(TextInformation& textInfo, int displayTimeInMs);
	static void SetTextDisplayStartTime(TextInformation& textInfo, int startTimeInMs);
	static void SwitchTextPosition();
	static void ChangeFont();
	static void ShowText(TextInformation& textInfo);
	static void HideText(TextInformation& textInfo);
	static void ResetTextSettings(TextInformation& textInfo);
	static void PrintBridgeHelpMessage(eLevelName levelName);
	static void PrintText(std::string text, CRGBA textColor, eTextPosition textPosition);
	static void DisplayDebugText(std::string msg, float positionY);
};
