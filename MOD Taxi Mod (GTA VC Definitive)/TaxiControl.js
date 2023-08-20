/// <reference path=".config/vc.d.ts" />
import locations from "./locations.json";
import TaxiManager from "./taxi_service_imports/taximanager";
import {
  CARDRIVINGSTYLE,
  CARLOCK,
  KEYCODES,
  TEMPACTION,
} from "./taxi_service_imports/taxienums";

class Coordinates {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

let player = new Player(0);
let taxiManager = new TaxiManager(-1);
let destinationBlip = undefined;

let boolswitch = false;
let canClear = false;
let canSkipTravel = false;
let isDestinationMenuActive = false;
let isAutoPilotOn = false;

let taxiSpeed = 10;

let destinationCoordinate = new Coordinates(106.64, -813.53, 10.04);

let index = 0;
let destinationIndex = 0;

const TAXI_MODEL_IDS = [150, 168, 216];

/**
 * Get in the taxi.
 */
function getInTheTaxi() {
  Game.SetWantedMultiplier(0);
  taxiManager.waitPlayerToEnter();
  let taxiHandler = taxiManager.getTaxiHandler();
  log("[GET_TAXI] TAXIHANDLER:" + taxiHandler);
  player.getChar().setObjEnterCarAsPassenger(taxiHandler);
  TIMERB = 0;
  boolswitch = false;
  log("[TAXI_CON] THE PLAYER GETS INTO THE TAXI.");
}

/**
 * Find a taxi near the player's location.
 */
function findTaxi() {
  let playerCoordinate = player.getCoordinates();
  let randomTaxi = -1;

  //SEARCH FOR IF THERE IS TAXI NEARBY
  for (var i = 0; i < TAXI_MODEL_IDS.length; i++) {
    randomTaxi = World.GetRandomCarOfTypeInAreaNoSave(
      playerCoordinate.x - 5,
      playerCoordinate.y - 5,
      playerCoordinate.x + 5,
      playerCoordinate.y + 5,
      TAXI_MODEL_IDS[i]
    );
    log("[TAXI_CON] RANDOM TAXI: " + randomTaxi);
    if (randomTaxi != -1) {
      break;
    }
  }

  if (randomTaxi != -1) {
    log("[TAXI_CON] DRIVER: " + randomTaxi.getDriver());
    return randomTaxi;
  } else {
    log("[TAXI_CON] COULDN'T FIND TAXI: " + randomTaxi);
    return -1;
  }
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
  //AddSpriteForContactPoint
  destinationBlip = Blip.AddSpriteForCoord(
    location.locationCoordinates.x,
    location.locationCoordinates.y,
    location.locationCoordinates.z,
    location.locationIconNumber
  );
  destinationBlip.changeDisplay(2);
  destinationBlip.changeScale(65535);

  log("[TAXI_CON] BLIP:" + destinationBlip);
  log("[TAXI_CON] BLIP:" + locations[index].locationName);
}

/**
 * Displays destination text according to index value.
 */
function displayDestinationText() {
  TIMERA = 0;
  Text.UseCommands(false);
  wait(100);
  Text.SetCenter(true);
  Text.SetBackground(true);
  Text.SetColor(247, 145, 221, 255);
  //Text.SetJustify(true);
  Text.SetScale(0.75, 2.5);
  Text.Display(320, 420, locations[index].locationName);
  log("[TAXI_CON] DISPLAYING TEXT:" + locations[index].locationName);
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
  changeBlip(locations[index]);
  //log("INDEX: "+ index);
  canClear = true;
  wait(150);
}

/**
     * Go to specified destination.
     * @param {Car} taxihandler Car handler for the taxi
     
  */
function startAutoPilot() {
  destinationCoordinate = new Coordinates(
    locations[index].locationCoordinates.x,
    locations[index].locationCoordinates.y,
    locations[index].locationCoordinates.z
  );
  destinationIndex = index;
  taxiManager.changeTaxiSettings(
    true,
    CARDRIVINGSTYLE.StopForCars,
    15,
    CARLOCK.Unlocked,
    true,
    false
  );
  taxiManager
    .getTaxiHandler()
    .gotoCoordinates(
      destinationCoordinate.x,
      destinationCoordinate.y,
      destinationCoordinate.z
    );
  canSkipTravel = true;
  isAutoPilotOn = true;
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
  taxiManager.setTaxiHeadding(locations[index].rotation); //currentTaxi.setHeading(locations[index].rotation);
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

function wanderRandomly() {
  taxiManager.changeTaxiSettings(
    true,
    CARDRIVINGSTYLE.SlowDownForCars,
    20,
    CARLOCK.Unlocked,
    true,
    false
  );
  taxiManager.canChangeLane(true);
  taxiManager.makeTaxiWonderRandomly();
}

while (true) {
  if (player.isPlaying()) {
    if (player.isOnFoot()) {
      if (Pad.IsKeyPressed(KEYCODES.E_KEY)) {
        let foundTaxi = findTaxi();
        log("found taxi: " + foundTaxi);
        if (foundTaxi != -1) {
          let driverCheck = taxiManager.CheckSpecificDriverModelAndHealth(
            foundTaxi.getDriver()
          );
          log("DRIVER CHECK: " + driverCheck);
          if (driverCheck) {
            taxiManager.setTaxiHandler(foundTaxi);
            getInTheTaxi();
          }
        }
      } 

      if (canClear) {
        clearBlipAndTexts();
      }
      isAutoPilotOn = false;
      canSkipTravel = false;
    }

    //IF THE PLAYER IS NOT IN THE TAXI LET THE TAXI WANDER RANDOMLY
    if (
      TIMERB >= 2500 &&
      taxiManager.getTaxiHandler() != -1 &&
      player.isOnFoot()
    ) {
      let driver = taxiManager.getTaxiHandler().getDriver();
      if (driver != -1) {
        taxiManager.loadDefaultTaxiSettings(true);
        taxiManager.makeTaxiWonderRandomly(1);
      } else {
        taxiManager.loadDefaultTaxiSettings(false);
      }
      taxiManager.setTaxiHandler(-1);
      Game.SetWantedMultiplier(1);
    }

    //CLEAR  DESTINATION TEXT AND BLIP AFTER 3 SECONDS
    if (TIMERA >= 3000 && canClear) {
      clearBlipAndTexts();
    }

    if (taxiManager.getTaxiHandler() != -1) {
      let currentTaxi = taxiManager.getTaxiHandler();
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

      if (player.isInTaxi()) {
        let temptaxi = player.storeCarIsInNoSave();
        let driver = temptaxi.getDriver();

        if (driver != -1) {
          //CHECK IF THE DRIVER IS A TAXI DRIVER AND ALIVE
          let driverCheck =
            taxiManager.CheckSpecificDriverModelAndHealth(driver); //CheckDriverModelAndHealth(driver);

          if (temptaxi != -1 && driverCheck) {
            let temptaxicoor = temptaxi.getCoordinates();
            let temptaxicoor2 = currentTaxi.getCoordinates();
            //CHECK IF THE PLAYER IS IN THE CURRENT TAXI
            if (
              temptaxicoor.x == temptaxicoor2.x &&
              temptaxicoor.y == temptaxicoor2.y &&
              temptaxicoor.z == temptaxicoor2.z
            ) {
              //HURRY UP
              if (Pad.IsKeyPressed(KEYCODES.M_KEY)) {
                taxiManager.taxiHurryUp(); //taxiHurryUp(currentTaxi);
              }

              //NORMAL DRIVING BEHAVIOUR
              if (Pad.IsKeyPressed(KEYCODES.N_KEY)) {
                taxiManager.taxiNormalDrive(); //taxiNormalDrive(currentTaxi);
              }

              //OBBEY THE RULES
              if (Pad.IsKeyPressed(KEYCODES.B_KEY)) {
                taxiManager.MakeDrivingStyleObbeyTheRules(); // taxiObeyTheTrafficRules(currentTaxi);
              }

              if (Pad.IsKeyPressed(KEYCODES.NUM_3_KEY)) {
                taxiManager.MakeDrivingStylePloughThrough(); //DriveMoreAggressive(currentTaxi);
              }

              if (Pad.IsKeyPressed(KEYCODES.NUM_2_KEY)) {
                taxiManager.MakeDrivingStyleAvoidCars(); //DriveAggressive(currentTaxi);
              }

              if (Pad.IsKeyPressed(KEYCODES.NUM_1_KEY)) {
                taxiManager.MakeDrivingStyleObbeyTheRules(); //DriveNormal(currentTaxi);
              }

              if (Pad.IsKeyPressed(KEYCODES.CTRL_KEY)) {
                taxiSpeed -= 5;
                if (taxiSpeed < 0) {
                  taxiSpeed = 0;
                }
                taxiManager.setTaxiCruiseSpeed(taxiSpeed); //currentTaxi.setCruiseSpeed(taxiSpeed);
                wait(100);
              }

              if (Pad.IsKeyPressed(KEYCODES.ALT_KEY)) {
                taxiSpeed += 5;
                if (taxiSpeed > 50) {
                  taxiSpeed = 50;
                }
                taxiManager.setTaxiCruiseSpeed(taxiSpeed); //currentTaxi.setCruiseSpeed(taxiSpeed);
                wait(100);
              }

              //STOP TAXI
              if (Pad.IsKeyPressed(KEYCODES.F_KEY) && player.isInTaxi()) {
                taxiManager.stopTaxi(); //stopTaxi(currentTaxi);
                isAutoPilotOn = false;
                canSkipTravel = false;
                if (!player.isInTaxi()) {
                  log("The player got out of the taxi.");
                  currentTaxi = -1;
                }
              }

              //PRINT CURRENT DESTINATION
              if (Pad.IsKeyPressed(KEYCODES.UP_KEY)) {
                index = destinationIndex;
                displayDestinationText();
                canClear = true;
              }

              //CHANGE DESTINATION OPTION
              if (Pad.IsKeyPressed(KEYCODES.RIGHT_KEY)) {
                changeDestinationText(1);
              }

              //CHANGE DESTINATION OPTION
              if (Pad.IsKeyPressed(KEYCODES.LEFT_KEY)) {
                changeDestinationText(-1);
              }

              //CONFIRM DESTINATION OPTION OR GO TO THE LAST VISITED DESTINATION
              if (Pad.IsKeyPressed(KEYCODES.DOWN_KEY)) {
                startAutoPilot(currentTaxi);
                Text.UseCommands(false);
              }

              //SKIP
              if (Pad.IsKeyPressed(KEYCODES.ENTER_KEY)) {
                if (canSkipTravel && isAutoPilotOn) {
                  skipTravelling();
                }
              }

              //MAKE TAXI WANDER (USE THIS IF THE PLAYER IN THE TAXI)
              if (Pad.IsKeyPressed(KEYCODES.Y_KEY) && player.isInTaxi()) {
                wanderRandomly();
                boolswitch = true;
              }
              //MAKE TAXI WANDER AUTOMATICALLY
              if (!boolswitch) {
                wanderRandomly();
                boolswitch = true;
              }
            }
          }
        }
      }
    }
  }

  wait(100);
}

/**
 * Prints specified text.
 * @param {string} text  Specified text variable.
 */
/*
function printText(text) {
  Text.Print(text, 2000, true);
  TIMERA = 0;
  canClear = true;
}
*/