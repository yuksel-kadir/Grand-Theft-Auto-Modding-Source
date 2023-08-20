/// <reference path=".config/vc.d.ts" />
import { SCM } from "./weapon_store_exports/scm";
import {
  OceanBeachAmmunationSetting,
  VicePointAmmuNationSetting,
  DowntownAmmuNationSetting,
} from "./weapon_store_exports/weaponStoreAmmunationStores";
import {
  LittleHavanaScrewThisSetting,
  VicePointTooledUpSetting,
  WashingtonBeachBunchOfToolsSetting,
} from "./weapon_store_exports/weaponStoreToolStores";
import {
  SHIFT,
  LEFTKEY,
  RIGHTKEY,
  AKEY,
  DKEY,
  EKEY,
  AMMUCLERK_ID,
  TOOLCLERK_ID,
  SOUNDAMMUNATIONBUYWEAPON,
  SOUNDAMMUNATIONBUYWEAPONDENIED,
  StoreType,
} from "./weapon_store_exports/weaponStoreRequiredConstants";

const storeSettingsList = [
  OceanBeachAmmunationSetting,
  WashingtonBeachBunchOfToolsSetting,
  VicePointTooledUpSetting,
  VicePointAmmuNationSetting,
  DowntownAmmuNationSetting,
  LittleHavanaScrewThisSetting,
];

let isWeaponMenuOpen = false;

let currentStoreSetting = OceanBeachAmmunationSetting;
let currentWeapon = null;
let currentCycleIndex = 0;

let player = new Player(0);
let canBuyWeapon = true;

/**
 *
 * @param {int} modelID
 * ID Number of the model.
 */
function LoadModel(modelID) {
  let isLoaded = Streaming.IsModelAvailable(modelID);
  log("LOADING WEAPON MODEL: " + modelID);
  if (!isLoaded) {
    Streaming.RequestModel(modelID);
    //Streaming.LoadAllModelsNow();
    while (true) {
      if (Streaming.HasModelLoaded(modelID)) {
        log("WEAPON MODEL LOADED: " + modelID);
        break;
      }
      wait(0);
    }
  } else {
    log("WEAPON MODEL IS ALREADY LOADED: " + modelID);
    Streaming.MarkModelAsNoLongerNeeded(modelID);
  }
}

function openWeaponMenu() {
  isWeaponMenuOpen = true;
  //player.setControl(false);
  player.getChar().freezePosition(true);
  Hud.DisplayRadar(false);
  let camPos = player.getCoordinates();
  Sound.AddOneOffSound(camPos.x, camPos.y, camPos.z, 7);
  //printMoney();
  showWeapon();
}

function closeWeaponMenu() {
  Text.ClearHelp();
  Text.ClearPrints();
  Text.UseCommands(false);
  currentCycleIndex = 0;
  deleteWeapon();
  Camera.SetBehindPlayer();
  Camera.Restore();
  //player.setControl(true);
  player.getChar().freezePosition(false);
  Hud.DisplayRadar(true);
  isWeaponMenuOpen = false;
}

function findStoreClerk() {
  let clerkFound = World.CheckForPedModelAroundPlayer(
    player,
    3.5,
    3.5,
    3.5,
    AMMUCLERK_ID,
    AMMUCLERK_ID
  );
  if (!clerkFound) {
    clerkFound = World.CheckForPedModelAroundPlayer(
      player,
      3.5,
      3.5,
      3.5, 
      TOOLCLERK_ID,
      TOOLCLERK_ID
    );
  }

  log("CLERK FOUND: " + clerkFound);
  let maxShopDistance = 10;
  if (clerkFound) {
    let playerCoor = player.getCoordinates();
    storeSettingsList.forEach((store) => {
      let distance = Math.GetDistanceBetweenCoords3D(
        playerCoor.x,
        playerCoor.y,
        playerCoor.z,
        store.storeLocationX,
        store.storeLocationY,
        store.storeLocationZ
      );
      if (distance < maxShopDistance) {
        maxShopDistance = distance;
        currentStoreSetting = store;
        log("Current Store Is: " + currentStoreSetting.storeName + " type:" +currentStoreSetting.weaponStoreInfos.weaponStoreType);
      }
    });
    return true;
  }

  return false;
}

/**
 * Slide the weapon up.
 */
function slideWeaponUp() {
  let clerkCoor = {
    x: currentStoreSetting.storeLocationX,
    y: currentStoreSetting.storeLocationY,
    z: currentStoreSetting.storeLocationZ,
  };
  let weaponOffsetX =
    currentStoreSetting.weaponLocationOffsetList[currentCycleIndex].x;
  let weaponOffsetY =
    currentStoreSetting.weaponLocationOffsetList[currentCycleIndex].y;
  let weaponOffsetZ =
    currentStoreSetting.weaponLocationOffsetList[currentCycleIndex].z;

  let weaponRotationX =
    currentStoreSetting.weaponRotationList[currentCycleIndex].x;
  let weaponRotationY =
    currentStoreSetting.weaponRotationList[currentCycleIndex].y;
  let weaponRotationZ =
    currentStoreSetting.weaponRotationList[currentCycleIndex].z;

  //LOAD WEAPON MODEL
  LoadModel(
    currentStoreSetting.weaponStoreInfos.weaponList[currentCycleIndex]
      .weaponModel
  );

  //CREATE WEAPON OBJECT
  currentWeapon = ScriptObject.Create(
    currentStoreSetting.weaponStoreInfos.weaponList[currentCycleIndex]
      .weaponModel,
    clerkCoor.x + currentStoreSetting.pointingOffsetX + weaponOffsetX,
    clerkCoor.y + weaponOffsetY,
    clerkCoor.z + weaponOffsetZ
  );

  //SET ROTATION
  currentWeapon.setRotation(weaponRotationX, weaponRotationY, weaponRotationZ);

  //SLIDE THE WEAPON UP
  let weaponCoor = currentWeapon.getCoordinates();
  let zDelta = 0;
  while (zDelta < 2.55) {
    zDelta += 0.15;
    zDelta = parseFloat(zDelta.toPrecision(5));
    currentWeapon.setCoordinates(
      weaponCoor.x,
      weaponCoor.y,
      weaponCoor.z + zDelta
    );
    wait(10);
  }
}

/**
 *
 * Look at the clerk of the weapon shop.
 */
function lookAtClerk() {
  let fCoor = {
    x: currentStoreSetting.storeLocationX,
    y: currentStoreSetting.storeLocationY,
    z: currentStoreSetting.storeLocationZ,
  };
  Camera.SetFixedPosition(
    fCoor.x + currentStoreSetting.offsetX,
    fCoor.y + currentStoreSetting.offsetY,
    fCoor.z + currentStoreSetting.offsetZ,
    0,
    0,
    0
  );

  Camera.PointAtPoint(
    fCoor.x + currentStoreSetting.pointingOffsetX,
    fCoor.y + currentStoreSetting.pointingOffsetY,
    fCoor.z + currentStoreSetting.pointingOffsetZ,
    1
  );
}

function cycleNext() {
  if (
    currentCycleIndex + 1 >
    currentStoreSetting.weaponStoreInfos.weaponList.length - 1
  ) {
    currentCycleIndex = 0;
  } else {
    currentCycleIndex += 1;
  }
}

function cyclePrevious() {
  if (currentCycleIndex - 1 < 0) {
    currentCycleIndex =
      currentStoreSetting.weaponStoreInfos.weaponList.length - 1;
  } else {
    currentCycleIndex -= 1;
  }
}

function deleteWeapon() {
  if (currentWeapon) {
    currentWeapon.delete();
    currentWeapon = null;
  }
}

function printWeaponName() {
  let duration = 100000;
  Text.ClearPrints();
  let weaponGxt =
    currentStoreSetting.weaponStoreInfos.weaponList[currentCycleIndex]
      .weaponGxtKey;
  let weaponGlobalNumber =
    currentStoreSetting.weaponStoreInfos.weaponList[currentCycleIndex]
      .weaponGlobal;
  let weaponValue =
    currentStoreSetting.weaponStoreInfos.weaponList[currentCycleIndex]
      .weaponPrice;

  //PRINT WEAPON NAME
  if (weaponGxt != "") {
    Text.PrintBig(weaponGxt, duration, 5);
  }

  //CHECK IF THE WEAPON HAS A DIFFERENT GLOBAL NUMBER THAN 0
  if (weaponGlobalNumber == 0) {
    canBuyWeapon = true;
    Text.PrintWithNumber("G_COST", weaponValue, duration, 0);
  } else {
    let weaponGlobalValue = SCM.readVar(weaponGlobalNumber);

    //CHECK GLOBAL VARIABLE VALUE TO FIND OUT IF THE WEAPON UNLOCKED
    if (weaponGlobalValue != 0) {
      canBuyWeapon = true;
      Text.PrintWithNumber("G_COST", weaponValue, duration, 0);
    } else {
      canBuyWeapon = false;

      //PRINT OUT OF STOCK
      Text.Print("STOCK", duration, 0);
    }
  }
}

function showWeapon() {
  deleteWeapon();
  slideWeaponUp();
  printWeaponName();
}

/**
 *
 * Buy selected weapon.
 */
function buyWeapon() {
  let hasWeapon = false;
  let coor = {
    x: currentStoreSetting.storeLocationX,
    y: currentStoreSetting.storeLocationY,
    z: currentStoreSetting.storeLocationZ,
  };
  let armorAmount = player.getChar().getArmor();
  let playerMoney = player.storeScore();
  let selectedWeapon =
    currentStoreSetting.weaponStoreInfos.weaponList[currentCycleIndex];

  //CHECK TYPE FOR IF THE PLAYER IS BUYING BODY ARMOR
  if (selectedWeapon.weaponType == -1) {
    if (playerMoney >= selectedWeapon.weaponPrice && armorAmount < 100) {
      //SUBTRACT THE WEAPON MONEY FROM PLAYER'S MONEY. REFRESH MONEY TEXT. PLAY BUY SOUND.
      player.addScore(-selectedWeapon.weaponPrice);
      player.addArmour(100);
      //printMoney();
      Sound.AddOneOffSound(coor.x, coor.y, coor.z, SOUNDAMMUNATIONBUYWEAPON);
      return;
    } else {
      //PLAY REJECTED SOUND.
      Sound.AddOneOffSound(
        coor.x,
        coor.y,
        coor.z,
        SOUNDAMMUNATIONBUYWEAPONDENIED
      );
      return;
    }
  }

  //CHECK IF THE STORE TYPE IS TOOLS STORE
  log(
    "WEAPON STORE TYPE: " + currentStoreSetting.weaponStoreInfos.weaponStoreType
  );
  if (
    currentStoreSetting.weaponStoreInfos.weaponStoreType == StoreType.TOOLSTORE
  ) {
    hasWeapon = player.hasGotWeapon(selectedWeapon.weaponType);
    log("HAS WEAPON: " + hasWeapon);
  }
  //WEAPONPRICES[cycleIndex]
  if (playerMoney >= selectedWeapon.weaponPrice && canBuyWeapon) {
    //CHECK IF THE CURRENT SHOP IS A TOOL SHOP AND THE PLAYER HAS ALREADY OWNED THE WEAPON
    if (
      currentStoreSetting.weaponStoreInfos.weaponStoreType ==
        StoreType.TOOLSTORE &&
      hasWeapon
    ) {
      //PLAY REJECTED SOUND.
      Sound.AddOneOffSound(
        coor.x,
        coor.y,
        coor.z,
        SOUNDAMMUNATIONBUYWEAPONDENIED
      );
    } else {
      //LOAD WEAPON MODEL
      LoadModel(selectedWeapon.weaponModel);
      //SUBTRACT WEAPON MONEY FROM PLAYER'S MONEY. REFRESH MONEY TEXT. PLAY BUY SOUND.
      player.addScore(-selectedWeapon.weaponPrice);
      //printMoney();
      Sound.AddOneOffSound(coor.x, coor.y, coor.z, SOUNDAMMUNATIONBUYWEAPON);
      //GIVE THE WEAPON TO THE PLAYER
      player.giveWeapon(selectedWeapon.weaponType, 120);
    }
  } else {
    Sound.AddOneOffSound(
      coor.x,
      coor.y,
      coor.z,
      SOUNDAMMUNATIONBUYWEAPONDENIED
    );
  }
}

while (true) {
  //CHECK IF THE PLAYER PRESSED E KEY
  if (Pad.IsKeyDown(EKEY)) {
    //CHECK IF THE WEAPON MENU IS OPEN
    if (isWeaponMenuOpen) {
      closeWeaponMenu();
    } else {
      //FIND SHOP CLERK
      let clerk = findStoreClerk();
      if (clerk) {
        //currentClerk = clerk;
        lookAtClerk();
        openWeaponMenu();
      }
    }
  }

  //CHECK IF THE WEAPON MENU IS OPEN
  if (isWeaponMenuOpen) {
    //CYCLE NEXT Pad.IsKeyDown(NUM_3_KEY) ||
    if (Pad.IsKeyDown(RIGHTKEY) || Pad.IsKeyDown(DKEY)) {
      cycleNext();
      showWeapon();
    }
    //CYCLE PREVIOUS Pad.IsKeyDown(NUM_2_KEY) ||
    if (Pad.IsKeyDown(LEFTKEY) || Pad.IsKeyDown(AKEY)) {
      cyclePrevious();
      showWeapon();
    }

    //BUY WEAPON
    if (Pad.IsKeyDown(SHIFT)) {
      buyWeapon();
    }
  }

  wait(10);
}

/*
function printMoney() {
  Text.UseCommands(false);
  wait(100);
  Text.SetColor(17, 140, 79, 255);
  Text.SetScale(0.55, 2.3);
  Text.SetJustify(true);
  Text.SetBackground(true);
  Text.DisplayWithNumber(470, 399, "TSCORE", player.storeScore());
}
*/

/**
 * let rugerStock = SCM.readVar(1209);
  let bridgeStatus = SCM.readVar(1153);
  log("rugerStock:" + rugerStock);
  log("Bridge status: " + bridgeStatus);
 */

///// <reference path="../CLEO/CLEO_PLUGINS/scm.ts" />
//import { SCM } from "./scm";
//import { SCM } from "./CLEO_PLUGINS/scm";
