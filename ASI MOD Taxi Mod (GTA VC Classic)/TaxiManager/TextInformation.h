#pragma once
#include "plugin.h"
#include "CRGBA.h"

enum eTextPosition : unsigned char
{
	BOTTOM_CENTER,
	ON_RADAR
};
/// <summary>
/// Text Information struct
/// </summary>
/// <param name="text: ">The text going to be displayed.</param>
/// <param name="textColor: ">Color of the text.</param>
/// <param name="textDisplayTimeInMs: ">How many milliseconds the text is going to be displayed?</param>
/// <param name="textDisplayStartTimeInMs: ">When the text is started to be displayed?</param>
/// <param name="fontIndex: ">The font index of the text?</param>
/// <param name="textPosition: ">The position of the text. ON_RADAR or BOTTOM_CENTER</param>
/// <param name="showText: ">Hide or display the text.</param>
/// <returns></returns>
struct TextInformation {
	std::string text;
	CRGBA textColor;
	int textDisplayTimeInMs;
	int textDisplayStartTimeInMs;
	int8_t fontIndex;
	eTextPosition textPosition;
	bool showText;
};
