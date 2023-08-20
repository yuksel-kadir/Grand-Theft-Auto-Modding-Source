#include "Destinations.h"

DestinationInformation Destinations::destinationInformationList[24] = {
    //PORTLAND LOCATIONS
    DestinationInformation("Portland Safehouse (Portland)", CVector(840.85f, -298.32f, 4.62f), 0.01f, eLevelName::PORTLAND),
    DestinationInformation("Luigi's Strip Club 7 (Portland)", CVector(916.02f, -423.42f, 14.43f), 6.26f, eLevelName::PORTLAND),
    DestinationInformation("Ammu-Nation (Portland)", CVector(1061.00f, -398.75f, 15.43f), 6.27f, eLevelName::PORTLAND),
    DestinationInformation("Hepburn Heights (Portland)", CVector(916.75f, -220.75f, 5.42f), 6.27f, eLevelName::PORTLAND),
    DestinationInformation("Momma's Restaurante (Portland)", CVector(1201.57f, -315.63f, 25.43f), 0.00f, eLevelName::PORTLAND),
    DestinationInformation("Salvatore's Gentlemen's Club (Portland)", CVector(1360.56f, -297.43f, 50.5f), 3.11f, eLevelName::PORTLAND),
    DestinationInformation("Capital Autos (Portland)", CVector(1201.37f, -82.10f, 12.88f), 0.0f, eLevelName::PORTLAND),
    DestinationInformation("Sweeney General Hospital (Portland)", CVector(1131.44f, -596.82f, 15.38f), 0.0f, eLevelName::PORTLAND),
    DestinationInformation("Joey's Auto Painting (Portland)", CVector(1200.06f, -868.87f, 15.54f), 2.34f, eLevelName::PORTLAND),
    DestinationInformation("Portland Docks (Portland)", CVector(1348.96f, -809.79f, 14.54f), 3.11f, eLevelName::PORTLAND),
    //STAUNTON ISLAND LOCATIONS
    DestinationInformation("Rise FM Headquarters (Staunton Island)", CVector(199.93f, -476.29f, 26.5f), 5.79f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Panlantic Construction Site (Staunton Island)", CVector(456.71f, -364.64f, 21.75f), 0.0f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Staunton Island War Memorial (Staunton Island)", CVector(1.84f, -773.05f, 26.66f), 6.27f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Love Media Building (Staunton Island)", CVector(53.18f, -1536.72f, 26.74f), 3.15f, eLevelName::STAUNTON_ISLAND),//0.02f
    DestinationInformation("Kenji's Casino (Staunton Island)", CVector(391.17f, -1386.56f, 26.62f), 1.58f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Asuka Kasen's Condo (Staunton Island)", CVector(261.78f, -640.26f, 26.62f), 6.26f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Liberty Campus (Staunton Island)", CVector(116.93f, -278.82f, 16.9f), 6.26f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Ammu-Nation (Staunton Island)", CVector(346.9, -706.55f, 26.46f), 4.69f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Phil's Army Surplus (Staunton Island)", CVector(166.27f, 93.73f, 16.46f), 1.56f, eLevelName::STAUNTON_ISLAND),
    DestinationInformation("Carson General Hospital (Staunton Island)", CVector(205.41f, -51.41f, 20.71f), 1.56f, eLevelName::STAUNTON_ISLAND),
    //SHORESIDE VALE LOCATIONS
    DestinationInformation("Cartel Mansion (Shoreside Vale)", CVector(-362.31f, 237.64f, 60.05f), 1.53f, eLevelName::SHORESIDE_VALE),
    DestinationInformation("Pike Creek LCPD Compound (Shoreside Vale)", CVector(-1261.43f, -52.24f, 58.29f), 1.58f, eLevelName::SHORESIDE_VALE),
    DestinationInformation("Hope Medical College (Shoreside Vale)", CVector(-1274.26f, -62.58f, 58.27f), 4.67f, eLevelName::SHORESIDE_VALE),
    DestinationInformation("North West Towers (Shoreside Vale)", CVector(-642.86f, -52.53f, 19.31f), 1.57f, eLevelName::SHORESIDE_VALE),
};

const int Destinations::destinationArraySize = sizeof(Destinations::destinationInformationList) / sizeof(DestinationInformation);