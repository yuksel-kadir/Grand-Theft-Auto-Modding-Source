#include "Destinations.h"

DestinationInformation Destinations::destinationInformationList[26] = {
	//VICE CITY BEACH
	DestinationInformation("Ken Rosenburg's Office", CVector(108.80f, -813.16f, 11.04f), 2.55f, -1),
	DestinationInformation("Rafael's", CVector(105.17f, -1117.22f, 11.07f), 4.69f, -1),
	DestinationInformation("Ocean Bay Marina", CVector(-166.64f, -1443.76f, 11.56f), 3.5f, -1),
	DestinationInformation("The Pole Position Club", CVector(110.47f, -1493.32f, 9.91f), 6.09f, -1),
	DestinationInformation("Ammu-Nation Ocean Beach", CVector(-53.93f, -1481.91f, 11.24f), 3.0f, -1),
	DestinationInformation("Pay 'n' Spray Ocean Beach", CVector(-18.68f, -1262.94f, 11.27f), 0.0f, -1),
	DestinationInformation("Ocean View Hotel", CVector(240.62f, -1285.84f, 11.73f), 2.89f, -1),
	DestinationInformation("Malibu Club", CVector(493.96f, -97.75f, 11.13f), 1.56f, -1),
	DestinationInformation("Avery Construction Site", CVector(243.74f, -229.29f, 11.89f), 2.6f, -1),
	DestinationInformation("Diaz's Mansion", CVector(-281.09f, -469.86f, 11.95), 1.6f, 903),
	DestinationInformation("North Point Mall", CVector(488.52f, 1122.98f, 17.23f), 3.03f, -1),
	DestinationInformation("InterGlobal Studios", CVector(19.76f, 972.32f, 11.55f), 3.0f, -1),
	//VICE CITY MAIN LAND
	DestinationInformation("Ammu-Nation Downtown", CVector(-659.21f, 1194.73f, 11.78f), 1.5f, 847),
	DestinationInformation("V-Rock Recording Studio", CVector(-863.79f, 1151.79f, 11.98f), 3.0f, 847),
	DestinationInformation("Hyman Condo", CVector(-862.46f, 1291.98f, 12.35f), 0.0f, 847),
	DestinationInformation("The Greasy Chopper Bar", CVector(-610.77f, 654.57f, 12.17f), 4.79f, 847),
	DestinationInformation("El Banco Corrupto Grande", CVector(-869.55f, -341.29, 11.84f), 3.10f, 847),
	DestinationInformation("Print Works", CVector(-1042.33f, -272.42f, 12.11f), 4.69f, 847),
	DestinationInformation("Cherry Popper Ice Cream Factory", CVector(-848.42f, -565.43f, 11.93f), 3.25f, 847),
	DestinationInformation("Kaufman Cabs", CVector(-1014.52f, 210.39f, 12.02f), 6.1f, 847),
	DestinationInformation("Auntie Poulet's House", CVector(-942.82f, 123.29f, 10.16f), 3.06f, 847),
	DestinationInformation("Phil's Place", CVector(-998.42f, 307.88f, 12.14f), 5.8f, 847),
	DestinationInformation("Sunshine Autos", CVector(-1026.67f, -904.00f, 14.86f), 7.0f, 847),
	DestinationInformation("Cafe Robina", CVector(-1165.60f, -590.14f, 11.47f), 1.7f, 847),
	DestinationInformation("Escobar International Airport", CVector(-1457.76f, -827.05f, 15.70f), 3.94f, 847),
	DestinationInformation("Viceport Boatyard", CVector(-697.59f, -1485.25f, 11.88f), 5.78f, 847),
};

const int Destinations::destinationArraySize = sizeof(Destinations::destinationInformationList) / sizeof(DestinationInformation);