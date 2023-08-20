/// <reference path=".config/vc.d.ts" />
/**
 * AUTHOR: WastedHymn
 * DATE: 03.08.2022
 */


import locations from "./locations.json";

class Coordinates {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

var player = new Player(0);
var currentTaxi = -1;
var destinationBlip = undefined;

var taxiSpeed = 10;

var reachbool = false;
var boolswitch = false;
var canClear = false;
var canSkipTravel = false;
var isDestinationMenuActive = false;
var isAutoPilotOn = false;

var destinationCoordinate = new Coordinates(106.64, -813.53, 10.04);

var index = 0;
var destinationIndex = 0;

const taxiModelIds = [150, 168, 216];
//KEY CODES
const enterKey = 13;
const upKey = 38;
const downKey = 40;
const leftKey = 37;
const rightKey = 39;
const bKey = 66;
const eKey = 69;
const fKey = 70;
const mKey = 77;
const nKey = 78;
const yKey = 89;
const tKey = 84;
const threeKey = 51;
const twoKey = 50;
const oneKey = 49;
const ctrlKey = 17;
const altKey = 18;
const spaceKey = 32;
/**
 * Make taxi stop.
 * @param {Car} taxihandler Car handler for the taxi
 */
function stopTaxi(taxihandler) {
  taxihandler.setCruiseSpeed(0);
  taxihandler.setTempAction(5, 5000);
  log("[GET_TAXI] TAXI STOPPED");
}

/**
 * Get in the taxi.
 * @param {Car} taxihandler Car handler for the taxi
 */
function enterTaxi(taxihandler) {
  stopTaxi(taxihandler);
  taxihandler.setTaxiLights(true);
  log("[GET_TAXI] TAXIHANDLER:" + taxihandler);
  log("[GET_TAXI] TAXI STOPPED.");
  taxihandler.lockDoors(1);
  player.getChar().setObjEnterCarAsPassenger(taxihandler);

  //letTaxiWander(currentTaxi);
  TIMERB = 0;
  boolswitch = false;
  log("[GET_TAXI] ENTERING TAXI.");
}

/**
 * Find a taxi near the player's location.
 * @param {Car} taxihandler Car handler for the taxi
 */
function findTaxi() {
  let playerCoordinate = player.getCoordinates();
  let randomTaxi = undefined;

  //SEARCH FOR IF THERE IS TAXI NEARBY
  for (var i = 0; i < taxiModelIds.length; i++) {
    randomTaxi = World.GetRandomCarOfTypeInAreaNoSave(
      playerCoordinate.x - 5,
      playerCoordinate.y - 5,
      playerCoordinate.x + 5,
      playerCoordinate.y + 5,
      taxiModelIds[i]
    );
    log("[GET_TAXI] RANDOM TAXI: " + randomTaxi);
    if (randomTaxi != -1) {
      break;
    }
  }

  if (randomTaxi != -1) {
    log("[GET_TAXI] DRIVER: " + randomTaxi.getDriver());
    if (randomTaxi.getDriver() != -1) {
      currentTaxi = randomTaxi;
    }
  } else {
    log("[GET_TAXI] COULDN'T FIND TAXI: " + randomTaxi);
  }
}

/**
 * Make the taxi wander randomly (if the player is not in the taxi).
 * @param {Car} taxihandler Car handler for the taxi
 * @param {int} actionTimeMS Duration of the temp action.
 * @param {int} cruiseSpeed Cruise speed of the taxi.
 * @param {int} drivingStyle Driving style of the taxi.
 * @param {boolean} taxiLight Is the taxi light on?
 * @param {boolean} doorLock Door lock status of the taxi.
 * @param {boolean} isStrong Is the taxi stronger than normal?
 * @param {boolean} canBeDamaged Can the taxi be damaged?
 * @param {boolean} canChangeLane Can the taxi change lane?
 */
function makeTaxiWanderRandomly(
  taxihandler,
  actionTimeMS,
  cruiseSpeed,
  drivingStyle,
  taxiLight,
  doorLock,
  isStrong,
  canBeDamaged,
  canChangeLane
) {
  changeTaxiSettings(
    taxihandler,
    taxiLight,
    drivingStyle,
    cruiseSpeed,
    doorLock
  );
  makeTaxiStrongOrNormal(taxihandler, canBeDamaged, isStrong);
  taxihandler.setChangeLane(canChangeLane);
  taxihandler.setTempAction(8, actionTimeMS);
  taxihandler.setMission(1);
  let taxicoordinate = taxihandler.getCoordinates();
  let node = Path.GetNthClosestCarNode(
    taxicoordinate.x,
    taxicoordinate.y,
    taxicoordinate.z,
    30
  );
  taxihandler.gotoCoordinatesAccurate(node.x, node.y, node.z);
  let randomNumber = Math.RandomIntInRange(0, 10);
  let car = taxihandler.setRandomRouteSeed(randomNumber);
  car.wanderRandomly();
}

/**
 * Removes destination blip from radar.
 */
function removeBlip() {
  if (destinationBlip != undefined) {
    //log("BLIP:" + currentBlip);
    destinationBlip.remove();
  }
}

/**
 * Changes destination icon on the radar.
 */
function changeBlip(location) {
  removeBlip();
  log("[GET_TAXI] LOCATION: " + location.locationName);
  log("[GET_TAXI] BLIP REMOVED");
  let x = location.locationCoordinates.x;
  let y = location.locationCoordinates.y;
  let z = location.locationCoordinates.z;
  let iconNumber = location.locationIconNumber;
  log(x + " " +
    y + " " +
    z + " " +
    iconNumber)
  destinationBlip = Blip.AddShortRangeSpriteForContactPoint(
    x,
    y,
    z,
    iconNumber
  );
  log("[GET_TAXI] destinationBlip:" + destinationBlip);
  destinationBlip.changeDisplay(2);
  //destinationBlip.changeScale(2);

  
  log("[GET_TAXI] BLIP:" + locations[index].locationName);
}

/**
 * Displays destination text according to index value.
 */
function displayDestinationText() {
  TIMERA = 0;
  
  //Text.UseCommands(false);
  wait(100);
  //Text.SetCenter(true);
  //Text.SetBackground(true);
  //Text.SetColor(247, 145, 221, 255);
  Text.ClearPrints();
  Text.ClearHelp();
  //log("DISPLAY SIZE: " + ImGui.GetWindowSize().height + " " + ImGui.GetDisplaySize().width);
  //Text.SetJustify(true);
  //Text.SetScale(0.75, 2.5);  
  //Text.Display(0, 420, locations[index].locationName);
  let name = locations[index].locationName;
  //Text.Print(name, 1000, 1);
  Text.PrintHelp(name);
  log("[GET_TAXI] DISPLAYING TEXT:" + locations[index].locationName);
  
}

/**
 * Changes destination text by changing index value.
 * @param {int} forwardOrBackward Scroll direction. 1 -> Right, -1 -> Left
 */
function changeDestinationText(forwardOrBackward) {
  Text.ClearPrints();
  Text.ClearHelp();
  //Text.LoadMissionText("TAXI1");
  isDestinationMenuActive = true;
  if (forwardOrBackward == 1) {
    if (index + 1 == locations.length) {
      index = 0;
    } else {
      index += 1;
    }
  } else {
    if (index - 1 < 0) {
      index = locations.length - 1;
    } else {
      index -= 1;
    }
  }

  displayDestinationText();
  //wait(1000);
  //Text.Print(locations[index].locationName, 5000, 0);
  if (locations[index].locationInfo != "") {
    //Text.ClearHelp();
    //Text.PrintHelpForever(locations[index].locationInfo);
  }
 // changeBlip(locations[index]);
  //log("INDEX: "+ index);
  canClear = true;
  wait(150);
}

/**
 * Prints specified text.
 * @param {string} text  Specified text variable.
 */
function printText(text) {
  Text.Print(text, 2000, true);
  TIMERA = 0;
  canClear = true;
}

/**
     * Change taxi settings.
     * @param {Car} taxihandler Car handler for the taxi
     * @param {Boolean} isTaxiLightsOn Is taxi lights on?
     * @param {int} drivingStyle AI's driving style
     * @param {int} cruiseSpeed AI's cruise speed
     * @param {int} doorLockStatus Taxi's door lock status
     
*/
function changeTaxiSettings(
  taxihandler,
  isTaxiLightsOn,
  drivingStyle,
  cruiseSpeed,
  doorLockStatus
) {
  taxihandler.setTaxiLights(isTaxiLightsOn);
  taxihandler.setDrivingStyle(drivingStyle);
  taxihandler.setCruiseSpeed(cruiseSpeed);
  taxihandler.lockDoors(doorLockStatus);
}

/**
     * Make taxi stronger than normal or make normal
     * @param {Car} taxihandler Car handler for the taxi
     * @param {Boolean} canBeDamaged Can taxi be damaged
     * @param {Boolean} isStrong Can taxi be stronger than normal
     
  */
function makeTaxiStrongOrNormal(taxihandler, canBeDamaged, isStrong) {
  taxihandler.setCanBeDamaged(canBeDamaged);
  taxihandler.setStrong(isStrong);
}

/**
     * Go to specified destination.
     * @param {Car} taxihandler Car handler for the taxi
     
  */
function startAutoPilot(taxihandler) {
  destinationCoordinate = new Coordinates(
    locations[index].locationCoordinates.x,
    locations[index].locationCoordinates.y,
    locations[index].locationCoordinates.z
  );
  destinationIndex = index;
  changeTaxiSettings(taxihandler, true, 2, 20, 2);
  makeTaxiStrongOrNormal(taxihandler, false, true);
  taxihandler.setAvoidLevelTransitions(true);
  taxihandler.gotoCoordinates(
    destinationCoordinate.x,
    destinationCoordinate.y,
    destinationCoordinate.z
  );
  canSkipTravel = true;
  isAutoPilotOn = true;
  reachbool = false;
  removeBlip();
}

/**
 * Teleports the player to the destination.
 */
function skipTravelling() {
  Camera.DoFade(500, 0);
  TIMERB = 0;

  while (TIMERB < 1000) {
    wait(0);
  }
  player.setCoordinates(
    destinationCoordinate.x,
    destinationCoordinate.y,
    destinationCoordinate.z
  );
  currentTaxi.setHeading(locations[index].rotation);
  TIMERB = 0;

  while (TIMERB < 1000) {
    wait(0);
  }

  Camera.DoFade(500, 1);
  isAutoPilotOn = false;
}

function clearBlipAndTexts() {
  Text.ClearPrints();
  Text.ClearHelp();
  canClear = false;
  Text.UseCommands(false);
  isDestinationMenuActive = false;
  index = destinationIndex;
  removeBlip();
}

/**
     * Make the taxi obey the traffic rules.
     * @param {Car} taxihandler Car handler for the taxi
     
*/
function taxiObeyTheTrafficRules(taxihandler) {
  taxihandler.setCruiseSpeed(15);
  taxihandler.setDrivingStyle(0);
  taxihandler.setChangeLane(false);
  //printText("LANCE_1");
}

/**
     * Make taxi hurry up.
     * @param {Car} taxihandler Car handler for the taxi
     
*/
function taxiHurryUp(taxihandler) {
  taxihandler.setCruiseSpeed(35);
  taxihandler.setDrivingStyle(2);
  taxihandler.setChangeLane(true);
  //printText("MERC_26");
}

/**
     * Make taxi drive normal.
     * @param {Car} taxihandler Car handler for the taxi
     
*/
function taxiNormalDrive(taxihandler) {
  taxihandler.setCruiseSpeed(25);
  taxihandler.setDrivingStyle(1);
  taxihandler.setChangeLane(true);
  //Text.LoadMissionText("CARBUY");
  //printText("CAR1_8");
}

/**
     * Change the taxi driver's behaviour to normal.
     * @param {Car} taxihandler Car handler for the taxi
     
*/
function DriveNormal(taxihandler) {
  taxihandler.setDrivingStyle(0);
}

/**
     * Change the taxi driver's behaviour to aggressive.
     * @param {Car} taxihandler Car handler for the taxi
     
*/
function DriveAggressive(taxihandler) {
  taxihandler.setDrivingStyle(2);
}

/**
     * Change the taxi driver's behaviour to more aggressive.
     * @param {Car} taxihandler Car handler for the taxi
     
*/
function DriveMoreAggressive(taxihandler) {
  taxihandler.setDrivingStyle(3);
}

while (true) {
  if (player.isPlaying()) {
    if (player.isOnFoot()) {
      if (Pad.IsKeyPressed(eKey)) {
        findTaxi();
        if (currentTaxi != -1) {
          enterTaxi(currentTaxi);
        }
      }
      if (canClear) {
        clearBlipAndTexts();
      }
      isAutoPilotOn = false;
      canSkipTravel = false;
    }

    //IF PLAYER IS NOT IN THE TAXI LET TAXI WANDER RANDOMLY
    if (TIMERB >= 2500 && currentTaxi != -1 && player.isOnFoot()) {
      makeTaxiWanderRandomly(
        currentTaxi,
        1,
        15,
        0,
        false,
        1,
        false,
        true,
        false
      );
      currentTaxi = -1;
    }

    //CLEAR  DESTINATION TEXT AND BLIP AFTER 3 SECONDS
    if (TIMERA >= 3000 && canClear) {
      clearBlipAndTexts();
    }

    if (currentTaxi != -1) {
      let taxiCoordination = currentTaxi.getCoordinates();
      let distanceToDestination = Math.GetDistanceBetweenCoords3D(
        taxiCoordination.x,
        taxiCoordination.y,
        taxiCoordination.z,
        destinationCoordinate.x,
        destinationCoordinate.y,
        destinationCoordinate.z
      );

      

      if (distanceToDestination <= 20) {
        canSkipTravel = false;
      }

      if (distanceToDestination <= 5 && !reachbool) {
        Text.PrintHelp("REACH");
        reachbool = true;
      }      

      if (player.isInTaxi()) {
        player.alterWantedLevel(0);
        let temptaxi = player.storeCarIsInNoSave();
        if (temptaxi != -1) {
          let temptaxicoor = temptaxi.getCoordinates();
          let temptaxicoor2 = currentTaxi.getCoordinates();
          //CHECK IF THE PLAYER IS IN THE CURRENT TAXI
          if (
            temptaxicoor.x == temptaxicoor2.x &&
            temptaxicoor.y == temptaxicoor2.y &&
            temptaxicoor.z == temptaxicoor2.z
          ) {
            //HURRY UP
            if (Pad.IsKeyPressed(mKey)) {
              taxiHurryUp(currentTaxi);
              Text.PrintHelp("FAST");
            }

            //NORMAL DRIVING BEHAVIOUR
            if (Pad.IsKeyPressed(nKey)) {
              taxiNormalDrive(currentTaxi);
              Text.PrintHelp("NORM");
            }

            //OBBEY THE RULES
            if (Pad.IsKeyPressed(bKey)) {
              taxiObeyTheTrafficRules(currentTaxi);
              Text.PrintHelp("SLOW");
            }

            if(Pad.IsKeyPressed(threeKey)){
              DriveMoreAggressive(currentTaxi);
              Text.PrintHelp("DRIVER3");
            }
            
            if(Pad.IsKeyPressed(twoKey)){
              DriveAggressive(currentTaxi);
              Text.PrintHelp("DRIVER2");
            } 

            if(Pad.IsKeyPressed(oneKey)){
              DriveNormal(currentTaxi);
              Text.PrintHelp("DRIVER1");
            }

            if(Pad.IsKeyPressed(ctrlKey)){
              taxiSpeed -= 5;
              if(taxiSpeed < 0){
                taxiSpeed = 0;
              }
              currentTaxi.setCruiseSpeed(taxiSpeed);
              wait(100);
            }

            
            if(Pad.IsKeyPressed(altKey)){
              taxiSpeed += 5;
              if(taxiSpeed > 50){
                taxiSpeed = 50;
              }
              currentTaxi.setCruiseSpeed(taxiSpeed);
              wait(100);
            }

            //STOP TAXI
            if (Pad.IsKeyPressed(spaceKey) && player.isInTaxi()) {
              stopTaxi(currentTaxi);
              isAutoPilotOn = false;
              canSkipTravel = false;
              reachbool = false;
              if (!player.isInTaxi()) {
                log("exiting from taxi");
                currentTaxi = -1;
              }
            }

            //PRINT CURRENT DESTINATION
            if (Pad.IsKeyPressed(upKey)) {
              index = destinationIndex;
              displayDestinationText();
              canClear = true;
            }

            //CHANGE DESTINATION OPTION
            if (Pad.IsKeyPressed(rightKey)) {
              changeDestinationText(1);
            }

            //CHANGE DESTINATION OPTION
            if (Pad.IsKeyPressed(leftKey)) {
              changeDestinationText(-1);
            }

            //CONFIRM DESTINATION OPTION OR GO TO THE LAST VISITED DESTINATION
            if (Pad.IsKeyPressed(downKey)) {
              startAutoPilot(currentTaxi);
              Text.UseCommands(false);
              Text.PrintHelp("SELDST");
              
            }

            //SKIP
            if (Pad.IsKeyPressed(tKey)) {
              if (canSkipTravel && isAutoPilotOn) {
                skipTravelling();
              }
            }

            //MAKE TAXI WANDER
            if (Pad.IsKeyPressed(yKey) && player.isInTaxi()) {
              makeTaxiWanderRandomly(
                currentTaxi,
                500,
                20,
                1,
                true,
                2,
                true,
                false,
                true
              );
              boolswitch = true;
              reachbool = false;
              log("[GET_TAXI]TAXI WANDERING");
            }
            //MAKE TAXI WANDER AUTOMATICALLY
            if (!boolswitch) {
              makeTaxiWanderRandomly(
                currentTaxi,
                500,
                20,
                0,
                true,
                2,
                true,
                false,
                true
              );
              boolswitch = true;
              log("[GET_TAXI]TAXI WANDERING (1)");
            }
          }
        }
      }
    }
  }

  wait(100);
}


