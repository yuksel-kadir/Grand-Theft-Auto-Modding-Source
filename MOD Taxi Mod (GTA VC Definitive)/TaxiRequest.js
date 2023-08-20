/// <reference path=".config/vc.d.ts" />

var player = new Player(0);

var requestedTaxi = undefined;
var requestedTaxiDriver = undefined;
var taxiBlip = undefined;

var isTaxiRequested = false;
var isGameIsSupported = false;
var taxiModelIds;

const altKey = 18;
const upKey = 38;
const tKey = 84;

var taxiModelId = -1;
var taxiDriverModelID;

var closestCarNodeToPlayerLocation = {
  nodeX: 0.0,
  nodeY: 0.0,
  nodeZ: 0.0,
};

switch (HOST) {
  case "vc_unreal":
    taxiModelIds = [150, 168, 216];
    taxiDriverModelID = 74;
    isGameIsSupported = true;
    log("THE GAME IS: " + HOST);
    break;
  case "sa_unreal":
    log("GTA SA IS NOT SUPPORTED BY THIS SCRIPT.");
    break;
  case "gta3_unreal":
    log("GTA 3 NOT SUPPORTED BY THIS SCRIPT.");
    break;
  default:
    log("THIS GAME IS NOT SUPPORTED BY THIS SCRIPT.");
    break;
}

/**
 * Loads taxi model.
 */
function loadTaxiModel() {
  let randomTaxiModelIdIndex = Math.RandomIntInRange(0, taxiModelIds.length);
  taxiModelId = taxiModelIds[randomTaxiModelIdIndex];
  Streaming.RequestModel(taxiModelId);

  while (!Streaming.HasModelLoaded(taxiModelId)) {
    wait(250);
  }
}

/**
 * Loads taxi driver model.
 */
function loadTaxiDriverModel() {
  Streaming.RequestModel(taxiDriverModelID); //74

  while (!Streaming.HasModelLoaded(taxiDriverModelID)) {
    wait(100);
  }
}

/**
     * Check drivers model id and health.
     * @param {Char} driverHandler Char handler of the taxi driver.
     
*/
function CheckDriverModelAndHealth(driverHandler) {
  let isTaxiDriver = driverHandler.isModel(74);
  let isDriverAlive = driverHandler.isHealthGreater(1);
  if (isTaxiDriver && isDriverAlive) return true;
  return false;
}

/**
 * Mark taxi as normal car. Turn off taxi lights. Wander randomly. Remove blip. Mark as no longer needed.
 * @param {Car} taxihandler Car handler for the taxi
 */
function markTaxiAsNormalCar(taxihandler) {
  makeTaxiStrongOrNormal(taxihandler, true, false);

  taxihandler.setDrivingStyle(0);
  taxihandler.setChangeLane(false);
  taxihandler.setMission(1);
  taxihandler.markAsNoLongerNeeded();
  let driver = taxihandler.getDriver();
  if (driver != -1) {
    let driverCheck = CheckDriverModelAndHealth(driver);
    if (driverCheck) {
      taxihandler.setTaxiLights(false);
      taxihandler.setCruiseSpeed(15);
      makeTaxiWanderRandomly(taxihandler);
    }
  }
  //taxihandler.wanderRandomly();
  taxiBlip.remove();
  log("[REQUEST_TAXI] TAXI WANDERING");
}

/**
     * Change taxi settings.
     * @param {Car} taxihandler Car handler for the taxi
     * @param {Boolean} isTaxiLightsOn Is taxi lights on?
     * @param {int} drivingStyle AI's driving style
     * @param {int} cruiseSpeed AI's cruise speed
     
*/
function changeTaxiSettings(
  taxihandler,
  isTaxiLightsOn,
  drivingStyle,
  cruiseSpeed
) {
  taxihandler.setTaxiLights(isTaxiLightsOn);
  taxihandler.setDrivingStyle(drivingStyle);
  taxihandler.setCruiseSpeed(cruiseSpeed);
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
     * Forget the requested taxi.
     * @param {Car} taxihandler Car handler for the taxi
    
  */
function forgetRequestedTaxi() {
  markTaxiAsNormalCar(requestedTaxi);
  wait(250);
  requestedTaxi = undefined;
}

/**
     * Make taxi wander randomly.
     * @param {Car} taxihandler Car handler for the taxi
    
  */
function makeTaxiWanderRandomly(taxihandler) {
  let randomNumber = Math.RandomIntInRange(50, 70);
  let taxilocation = taxihandler.getCoordinates();
  let randomNode = Path.GetNthClosestCarNode(
    taxilocation.x,
    taxilocation.y,
    taxilocation.z,
    randomNumber
  );
  taxihandler.setDrivingStyle(0);
  taxihandler.gotoCoordinatesAccurate(randomNode.x, randomNode.y, randomNode.z);
}

/**
 * Request taxi to the player's location.
 */
function requestTaxi() {
  let nodecounter = 5;
  let playerCoordination = player.getCoordinates();

  //Find nth closest car node to player.
  let nthClosestNodeCoordination = Path.GetNthClosestCarNode(
    playerCoordination.x,
    playerCoordination.y,
    playerCoordination.z,
    nodecounter
  );

  //If there is a taxi on the way than make that taxi normal.
  if (requestedTaxi !== undefined) {
    markTaxiAsNormalCar(requestedTaxi);
  }

  //If the nth closest node is on the screen then find another node.
  while (
    Camera.IsPointOnScreen(
      nthClosestNodeCoordination.x,
      nthClosestNodeCoordination.y,
      nthClosestNodeCoordination.z,
      2
    )
  ) {
    nodecounter += 1;
    nthClosestNodeCoordination = Path.GetNthClosestCarNode(
      playerCoordination.x,
      playerCoordination.y,
      playerCoordination.z,
      nodecounter
    );
  }

  //Find closest node with heading angle to nth closest node.
  let tempNodeWithHeading = Path.GetClosestCarNodeWithHeading(
    nthClosestNodeCoordination.x,
    nthClosestNodeCoordination.y,
    nthClosestNodeCoordination.z
  );

  log("[REQUEST_TAXI] tempNodeWithHeading ANGLE: " + tempNodeWithHeading.angle);
  player
    .getChar()
    .turnToFaceCoord(
      tempNodeWithHeading.nodeX,
      tempNodeWithHeading.nodeY,
      tempNodeWithHeading.nodeZ
    );

  loadTaxiModel();
  loadTaxiDriverModel();
  log("[REQUEST_TAXI] TAXI AND TAXI DRIVER MODELS ARE LOADED.");

  //Create taxi with random model id.
  requestedTaxi = Car.Create(
    taxiModelId,
    nthClosestNodeCoordination.x,
    nthClosestNodeCoordination.y,
    nthClosestNodeCoordination.z
  );
  log("TAXI CREATED.");
  requestedTaxi.turnToFaceCoord(playerCoordination.x, playerCoordination.y);

  //Create taxi driver and put into the taxi
  requestedTaxiDriver = Char.CreateInsideCar(requestedTaxi, 4, 74);
  log("TAXI DRIVER CREATED.");
  requestedTaxiDriver.setHeedThreats(true);
  requestedTaxiDriver.setUsePednodeSeek(true);

  //Release models
  Streaming.MarkModelAsNoLongerNeeded(taxiModelId);
  Streaming.MarkModelAsNoLongerNeeded(74);

  log(
    "[REQUEST_TAXI] nth Closest Node Coordination: " +
      nthClosestNodeCoordination.x,
    +" " + nthClosestNodeCoordination.y + " " + nthClosestNodeCoordination.z
  );

  //Change taxi settings and make stronger
  makeTaxiStrongOrNormal(requestedTaxi, false, true);
  changeTaxiSettings(requestedTaxi, true, 2, 15);
  //Find closest car node to player.
  closestCarNodeToPlayerLocation = Path.GetClosestCarNode(
    playerCoordination.x,
    playerCoordination.y,
    playerCoordination.z
  );

  //Make the taxi go to the closest car node to the player.
  requestedTaxi.gotoCoordinatesAccurate(
    closestCarNodeToPlayerLocation.nodeX,
    closestCarNodeToPlayerLocation.nodeY,
    closestCarNodeToPlayerLocation.nodeZ
  );
  //isTaxiRequested = true;
  taxiBlip = Blip.AddForCar(requestedTaxi);
  taxiBlip.changeColor(1);
  TIMERA = 0;
  log("[REQUEST_TAXI] TAXI IS REQUESTED!");
}

function taxiService() {
  while (true) {
    wait(0);
    //CHECK IF THE PLAYER IS ON FOOT AND PRESSED ALT+UP KEYS
    if (
      Pad.IsKeyPressed(altKey) &&
      Pad.IsKeyPressed(tKey) &&
      player.isOnFoot()
    ) {
      requestTaxi();
      wait(1000);
    }

    if (TIMERA >= 20000 && requestedTaxi !== undefined && !player.isInTaxi()) {
      log(
        "[REQUEST_TAXI] 20 SECONDS PASSED SINCE THE TAXI IS REQUESTED. REQUEST CANCELED."
      );
      forgetRequestedTaxi();
    }

    //CHECK IF THE REQUESTED TAXI REACHED THE CLOSEST NODE OR PLAYER
    if (requestedTaxi !== undefined) {
      let playercoordinate = player.getCoordinates();
      let requestedTaxiCoordinate = requestedTaxi.getCoordinates();

      //GET DISTANCE BETWEEN THE REQUESTED TAXI AND THE CLOSEST CAR NODE
      let distance = Math.GetDistanceBetweenCoords3D(
        requestedTaxiCoordinate.x,
        requestedTaxiCoordinate.y,
        requestedTaxiCoordinate.z,
        closestCarNodeToPlayerLocation.nodeX,
        closestCarNodeToPlayerLocation.nodeY,
        closestCarNodeToPlayerLocation.nodeZ
      );

      let distance2 = Math.GetDistanceBetweenCoords3D(
        requestedTaxiCoordinate.x,
        requestedTaxiCoordinate.y,
        requestedTaxiCoordinate.z,
        playercoordinate.x,
        playercoordinate.y,
        playercoordinate.z
      );

      if (distance2 < 5) {
        taxiBlip.remove();
        requestedTaxi.setCruiseSpeed(0);
        requestedTaxi.markAsNoLongerNeeded();
        //log("[REQUEST_TAXI] TAXI HAS REACHED PLAYER'S LOCATION");
      } else if (distance < 30) {
        //log("[REQUEST_TAXI] REQUESTED TAXI IS GOING TO PLAYER'S LOCATION");
        requestedTaxi.gotoCoordinatesAccurate(
          playercoordinate.x,
          playercoordinate.y,
          playercoordinate.z
        );
      }

      //CHECK FOR IF THE PLAYER IS IN ANOTHER TAXI OR IN THE REQUESTED TAXI
      if (player.isInTaxi()) {
        let tempTaxi = player.storeCarIsInNoSave();
        if (tempTaxi != -1) {
          let temptaxicoor = tempTaxi.getCoordinates();
          let temptaxicoor2 = requestedTaxi.getCoordinates();
          if (
            temptaxicoor.x == temptaxicoor2.x &&
            temptaxicoor.y == temptaxicoor2.y &&
            temptaxicoor.z == temptaxicoor2.z
          ) {
            log(
              "[REQUEST_TAXI] tempTaxiDriver AND temprequestedTaxiDriver IS THE SAME DRIVER."
            );
            requestedTaxi = undefined;
            taxiBlip.remove();
          } else {
            forgetRequestedTaxi();
            log(
              "[REQUEST_TAXI] tempTaxiDriver AND temprequestedTaxiDriver IS NOT THE SAME DRIVER."
            );
          }
        } else {
          log("[REQUEST_TAXI] tempTaxi IS UNDEFINED.");
        }
      }
    }
  }
}

function startTaxiService() {
  if (isGameIsSupported) {
    wait(0);
    taxiService();
  } else {
    log("THIS GAME IS NOT SUPPORTED EXITING...");
    return;
  }
}

startTaxiService();
