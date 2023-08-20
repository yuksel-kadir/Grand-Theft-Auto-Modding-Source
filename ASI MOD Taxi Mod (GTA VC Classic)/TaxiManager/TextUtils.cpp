#include "PluginBase.h"
#include "plugin.h"
#include "CHud.h"
#include "CFont.h"
#include "TextUtils.h"
#include "Destinations.h"

//COLORS
const CRGBA TextUtils::COLOR_ORANGE = CRGBA(232, 156, 38, 255);
const CRGBA TextUtils::COLOR_DARK_ORANGE = CRGBA(187, 100, 52, 255);
const CRGBA TextUtils::COLOR_PINK = CRGBA(241, 149, 172, 255);

//MESSAGES
const std::string TextUtils::BRIDGE_MSG = "Storm warning: All bridges to the mainland are closed.";
const std::string TextUtils::DISTANCE_MSG = "You are too close to the destination.";
const std::string TextUtils::NOT_ENOUGH_MONEY_MSG = "You don't have enough money for: ";
const std::string TextUtils::CABFARE_MSG = "Cab fare $";

TextInformation TextUtils::destinationTextInfo = TextInformation("", TextUtils::COLOR_ORANGE, 0, 0, 1, eTextPosition::ON_RADAR, false);
TextInformation TextUtils::cabFareTextInfo = TextInformation("", TextUtils::COLOR_ORANGE, 0, 0, 0, eTextPosition::BOTTOM_CENTER, false);

//Display quick help message.
void TextUtils::PrintQuickHelpMessage(std::string messageText) {
    CHud::SetHelpMessage(messageText.data(), true, false);
}
//Set text information values.
void TextUtils::SetTextInfo(TextInformation& textInfo, std::string& text, CRGBA& color, int textStartTime, int textDisplayTime, eTextPosition textPosition) {
    textInfo.text = text;
    textInfo.textColor = color;
    textInfo.textDisplayStartTimeInMs = textStartTime;
    textInfo.textDisplayTimeInMs = textDisplayTime;
    textInfo.textPosition = textPosition;
}
//Cycle previous destination.
void TextUtils::PreviousDestination(int8_t& destinationIndex) {
    destinationIndex -= 1;
    if (destinationIndex < 0)
        destinationIndex = Destinations::destinationArraySize - 1;
}
//Cycle next destination.
void TextUtils::NextDestination(int8_t& destinationIndex) {
    destinationIndex += 1;
    if (destinationIndex >= Destinations::destinationArraySize)
        destinationIndex = 0;
}
//Change the font of the destination text.
void TextUtils::SetFont(int8_t& fontIndex) {
    TextUtils::destinationTextInfo.fontIndex = fontIndex;
}
void TextUtils::SetText(TextInformation& textInfo, std::string& text) {
    textInfo.text = text;
}
void TextUtils::SetTextColor(const CRGBA color) {
    TextUtils::destinationTextInfo.textColor = color;
}
void TextUtils::SetTextPosition(eTextPosition& textpos) {
    TextUtils::destinationTextInfo.textPosition = textpos;
}
void TextUtils::SetTextDisplayTime(TextInformation& textInfo, int displayTimeInMs) {
    textInfo.textDisplayTimeInMs = displayTimeInMs;
}
void TextUtils::SetTextDisplayStartTime(TextInformation& textInfo, int startTimeInMs) {
    textInfo.textDisplayStartTimeInMs = startTimeInMs;
}
void TextUtils::SwitchTextPosition() {
    switch (TextUtils::destinationTextInfo.textPosition)
    {
    case eTextPosition::BOTTOM_CENTER:
        TextUtils::destinationTextInfo.textPosition = eTextPosition::ON_RADAR;
        break;
    case eTextPosition::ON_RADAR:
        TextUtils::destinationTextInfo.textPosition = eTextPosition::BOTTOM_CENTER;
        break;
    default:
        break;
    }
}
//Change the font of the destination text.
void TextUtils::ChangeFont() {
    int fontIndex = TextUtils::destinationTextInfo.fontIndex + 1;
    if (fontIndex > 2)
        fontIndex = 0;
    TextUtils::destinationTextInfo.fontIndex = fontIndex;
}
void TextUtils::ShowText(TextInformation& textInfo) {
    textInfo.showText = true;
}
void TextUtils::HideText(TextInformation& textInfo) {
    textInfo.showText = false;
}
void TextUtils::ResetTextSettings(TextInformation& textInfo) {
    textInfo.showText = false;
    textInfo.textColor = TextUtils::COLOR_ORANGE;
}

void TextUtils::PrintText(std::string text, CRGBA textColor, eTextPosition textPosition) {
    float width = 0;
    float height = 0;
    float fontScaleX = 1;
    float fontScaleY = 1;
    switch (textPosition) {
    case BOTTOM_CENTER:
        width = (float)(SCREEN_WIDTH / 2.0f);
        height = (float)(SCREEN_HEIGHT * 0.8f);
        fontScaleX = 0.8f * (SCREEN_WIDTH / 1920.0f) * 1.5f;
        fontScaleY = (SCREEN_HEIGHT / 1080.0f) * 1.35f * 1.5f;
        CFont::SetJustifyOff();
        CFont::SetCentreOn();
        CFont::SetCentreSize(SCREEN_WIDTH);
        break;
    case ON_RADAR:
        width = SCREEN_COORD_LEFT(25);
        height = SCREEN_COORD_BOTTOM(265);
        fontScaleX = SCREEN_MULTIPLIER(.75f);
        fontScaleY = SCREEN_MULTIPLIER(1.25f);
        CFont::SetCentreOff();
        CFont::SetRightJustifyOff();
        CFont::SetJustifyOn();
        break;
    default:
        break;
    }    

    CFont::SetBackgroundOff();
    CFont::SetScale(fontScaleX, fontScaleY);
    CFont::SetPropOn();
    CFont::SetDropShadowPosition(1);
    CFont::SetDropColor(CRGBA(0, 0, 0, 255));
    CFont::SetFontStyle(TextUtils::destinationTextInfo.fontIndex);

    //MAIN TEXT
    CFont::SetColor(textColor);
    CFont::PrintString(
        width,
        height,
        text.data()
    );
}
void TextUtils::DisplayDebugText(std::string msg, float positionY) {
    float width = SCREEN_COORD_LEFT(25);
    float height = SCREEN_COORD_BOTTOM(265);
    float fontScaleX = SCREEN_MULTIPLIER(.75f);
    float fontScaleY = SCREEN_MULTIPLIER(1.25f);
    CFont::SetCentreOff();
    CFont::SetRightJustifyOff();
    CFont::SetJustifyOn();
    CFont::SetBackgroundOff();
    CFont::SetScale(fontScaleX, fontScaleY);
    CFont::SetPropOn();
    CFont::SetFontStyle(TextUtils::destinationTextInfo.fontIndex);
    CFont::PrintString(
        SCREEN_COORD_LEFT(width),
        SCREEN_COORD_BOTTOM(positionY),
        msg.data()
    );
}