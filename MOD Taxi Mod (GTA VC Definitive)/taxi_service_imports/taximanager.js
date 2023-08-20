/// <reference path="../.config/vc.d.ts" />
import { TEMPACTION, CARLOCK, CARMISSON, CARDRIVINGSTYLE } from "./taxienums";

const TAXI_DRIVER_MODEL_1 = 28; //HMOCA
const TAXI_DRIVER_MODEL_2 = 74; //WMOCA

export default class TaxiManager {
  /**
   * @param {Car} taxihandler Car handler for the taxi
   */
  constructor(taxihandler) {
    this.taxihandler = taxihandler;
  }

  /**
   * Change the taxi handler.
   * @param {Car} newTaxiHandler New car handler for the taxi.
   */
  setTaxiHandler(newTaxiHandler) {
    this.taxihandler = newTaxiHandler;
  }

  /**
   * Get the taxi handler.
   */
  getTaxiHandler() {
    return this.taxihandler;
  }
  /**
   * Change the taxi cruise speed.
   * @param {int} speed Cruise speed value.
   */
  setTaxiCruiseSpeed(speed) {
    this.taxihandler.setCruiseSpeed(speed);
  }

  /**
   * Change the rotation of the taxi.
   */
  setTaxiHeadding(rotation) {
    this.taxihandler.setHeading(rotation);
  }

  /**
   * Stop the taxi.
   * @param {Car} taxihandler Handler of the taxi.
   */
  stopTaxi() {
    this.taxihandler.setCruiseSpeed(0);
    this.taxihandler.setTempAction(TEMPACTION.HandbrakeStraight, 5000);
    log("[GET_TAXI] TAXI STOPPED");
  }

  /**
   * Stop the taxi.
   * @param {Boolean} taxiLight Taxi light status.
   */
  waitPlayerToEnter() {
    this.stopTaxi();
    this.taxihandler.setTaxiLights(true);
    this.taxihandler.lockDoors(CARLOCK.Unlocked);
  }

  /**
   * Make the taxi wander randomly (if the player is not in the taxi).
   * @param {int} actionTimeMS Duration of the temp action.
   */
  makeTaxiWonderRandomly(actionTimeMS) {
    this.taxihandler.setTempAction(CARMISSON.GotoCoords, 1);
    this.taxihandler.setMission(CARMISSON.Cruise);

    let taxicoordinate = this.taxihandler.getCoordinates();
    let node = Path.GetNthClosestCarNode(
      taxicoordinate.x,
      taxicoordinate.y,
      taxicoordinate.z,
      30
    );
    this.taxihandler.gotoCoordinatesAccurate(node.x, node.y, node.z);
    let randomNumber = Math.RandomIntInRange(0, 10);
    let taxi = this.taxihandler.setRandomRouteSeed(randomNumber);
    taxi.wanderRandomly();
    log("| Make Taxi Wonder Randomly | Taxi is wandering randomly.")
  }

  /**
   * Load default taxi settings. You this function if the player is not in the taxi.
   * @param -> Taxi light is off.
   * @param -> Driving style is stop for cars.
   * @param -> Cruise speed is 15.
   * @param -> Car doors unlocked.
   * @param -> Car is not heavy.
   * @param -> Car can be damaged.
   * @param -> Car can not change lane.
   * @param {Boolean} isDriverFound Is the driver found(Alive)? 
   */
  loadDefaultTaxiSettings(isDriverFound) {
    if (isDriverFound) {
      this.taxihandler.setTaxiLights(false);
      this.taxihandler.setCruiseSpeed(15);
    } else {
      this.taxihandler.setCruiseSpeed(0);
    }
    this.taxihandler.setDrivingStyle(CARDRIVINGSTYLE.StopForCars);
    this.taxihandler.lockDoors(CARLOCK.Unlocked);
    this.taxihandler.setHeavy(false);
    this.taxihandler.setCanBeDamaged(true);
    this.taxihandler.setChangeLane(false);
  }

  /**
     * Change taxi settings.
     * @param {Boolean} isTaxiLightsOn Is the taxi light on?
     * @param {CARDRIVINGSTYLE} drivingStyle AI's driving style
     * @param {int} cruiseSpeed AI's cruise speed
     * @param {CARLOCK} doorLockStatus Taxi's door lock status
     * @param {Boolean} isHeavy Is the taxi heavy?
     * @param {Boolean} canBeDamaged Can the taxi be damaged?
     
*/
  changeTaxiSettings(
    isTaxiLightsOn,
    drivingStyle,
    cruiseSpeed,
    doorLockStatus,
    isHeavy,
    canBeDamaged
  ) {
    this.taxihandler.setTaxiLights(isTaxiLightsOn);
    this.taxihandler.setDrivingStyle(drivingStyle);
    this.taxihandler.setCruiseSpeed(cruiseSpeed);
    this.taxihandler.lockDoors(doorLockStatus);
    this.taxihandler.setHeavy(isHeavy);
    this.taxihandler.setCanBeDamaged(canBeDamaged);
  }

  /**
   * Make the taxi obey the traffic rules.
   * Driving style -> Stop for cars.
   * Cruise speed -> 15
   * Can change lane = false
   */
  taxiObeyTheTrafficRules() {
    this.taxihandler.setCruiseSpeed(15);
    this.taxihandler.setDrivingStyle(CARDRIVINGSTYLE.StopForCars);
    taxihandler.setChangeLane(false);
  }

  /**
   * Make taxi hurry up.
   * Driving style -> Avoid cars.
   * Cruise speed -> 35
   * Can change lane = true
   */
  taxiHurryUp() {
    this.taxihandler.setCruiseSpeed(35);
    this.taxihandler.setDrivingStyle(CARDRIVINGSTYLE.AvoidCars);
    this.taxihandler.setChangeLane(true);
  }

  /**
   * Make taxi drive normal.
   * Driving style -> Slow down for cars.
   * Cruise speed -> 25
   * Can change lane = true
   */
  taxiNormalDrive() {
    this.taxihandler.setCruiseSpeed(25);
    this.taxihandler.setDrivingStyle(CARDRIVINGSTYLE.SlowDownForCars);
    this.taxihandler.setChangeLane(true);
  }

  /**
   * Change the taxi driver's driving style to "stop for cars".
   */
  MakeDrivingStyleObbeyTheRules() {
    this.taxihandler.setDrivingStyle(CARDRIVINGSTYLE.StopForCars);
  }

  /**
   * Change the taxi driver's driving style to "avoid cars".
   */
  MakeDrivingStyleAvoidCars() {
    this.taxihandler.setDrivingStyle(CARDRIVINGSTYLE.AvoidCars);
  }

  /**
   * Change the taxi driver's driving style to "plough through".
   */
  MakeDrivingStylePloughThrough() {
    taxihandler.setDrivingStyle(CARDRIVINGSTYLE.PloughThrough);
  }

  /**
   * Check driver's model id is the taxi driver model(74) and the health is greater than 1.
   */
  CheckDriverModelAndHealth() {
    let driverHandler = this.taxihandler.getDriver();
    if (driverHandler != -1) {
      let isTaxiDriver = driverHandler.isModel(74);
      let isDriverAlive = driverHandler.isHealthGreater(1);
      if (isTaxiDriver && isDriverAlive) return true;
      return false;
    }
    return false;
  }

  /**
   * Check specific driver's model id is the taxi driver model(74) and the health is greater than 1.
   * @param {Char} randomTaxiDriverHandler driver handler
   */
  CheckSpecificDriverModelAndHealth(randomTaxiDriverHandler) {
    //log("| Check Specific Driver Model And Health |  Random Taxi Driver Handler -> " + randomTaxiDriverHandler);
    if (randomTaxiDriverHandler != -1) {
      let isTaxiDriver = randomTaxiDriverHandler.isModel(TAXI_DRIVER_MODEL_1);
      let isTaxiDriver_2 = randomTaxiDriverHandler.isModel(TAXI_DRIVER_MODEL_2);
      //log("| Check Specific Driver Model And Health |  Is Taxi Driver Model 74 -> " + isTaxiDriver);
      let isDriverAlive = randomTaxiDriverHandler.isHealthGreater(1);
      //let driver_health = randomTaxiDriverHandler.getHealth();
      //log("| Check Specific Driver Model And Health |  Taxi Driver's Health -> " + driver_health);
      if ((isTaxiDriver || isTaxiDriver_2) && isDriverAlive) return true;
      return false;
    }
    return false;
  }
  /**
   * Do a temp action.
   * @param {TEMPACTION} tempAction Type of the temp action.
   * @param {int} actionMS Action millisecond
   */
  doTempAction(tempAction, actionMS) {
    log(
      "| Do Temp Action | Taxi doing a temp action -> " +
        tempAction +
        " MS: " +
        actionMS
    );
    this.taxihandler.setTempAction(tempAction, actionMS);
  }
  /**
   * Can taxi change lane?
   * @param {boolean} canChangeLane Change lane bool.
   */
  canChangeLane(canChangeLane){
    this.taxihandler.setChangeLane(canChangeLane);
  }
}
