import { WeaponLocationInfo } from "./weaponLocationInfo";
import { WeaponStoreInfos } from "./weaponStoreInfos";

export class StoreSetting {
    /**
     * @param {float} offsetX
     * X offset for main camera.
     * @param {float} offsetY
     * Y offset for main camera.
     * @param {float} offsetZ
     * Z offset for main camera.
     * @param {float} pointingOffsetX
     * X offset for the pointing location.
     * @param {float} pointingOffsetY
     * Y offset for the pointing location.
     * @param {float} pointingOffsetZ
     * Z offset for the pointing location.
     * @param {float} storeLocationX
     * X position of the store.
     * @param {float} storeLocationY
     * Y position of the store.
     * @param {float} storeLocationZ
     * Z position of the store.
     * @param {string} storeName
     * Name of the store.
     * @param {WeaponStoreInfos} weaponStoreInfos
     * @param {WeaponLocationInfo[]} weaponLocationOffsetList
     * @param {WeaponLocationInfo[]} weaponRotationList
     */
    constructor(
      offsetX,
      offsetY,
      offsetZ,
  
      pointingOffsetX,
      pointingOffsetY,
      pointingOffsetZ,
  
      storeLocationX,
      storeLocationY,
      storeLocationZ,
      storeName,
      weaponStoreInfos,
  
      weaponLocationOffsetList,
      weaponRotationList
    ) {
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.offsetZ = offsetZ;
  
      this.pointingOffsetX = pointingOffsetX;
      this.pointingOffsetY = pointingOffsetY;
      this.pointingOffsetZ = pointingOffsetZ;
  
      this.storeLocationX = storeLocationX;
      this.storeLocationY = storeLocationY;
      this.storeLocationZ = storeLocationZ;
  
      this.storeName = storeName;
      this.weaponStoreInfos = weaponStoreInfos;
  
      this.weaponLocationOffsetList = weaponLocationOffsetList;
      this.weaponRotationList = weaponRotationList;
    }
  
    DisplayInfo() {
      log("storeName: " + this.storeName);
      log("storeType: " + this.storeType);
  
      log("offsetX: " + this.offsetX);
      log("offsetY: " + this.offsetY);
      log("offsetZ: " + this.offsetZ);
  
      log("pointingOffsetX: " + this.pointingOffsetX);
      log("pointingOffsetY: " + this.pointingOffsetY);
      log("pointingOffsetZ: " + this.pointingOffsetZ);
  
      log("storeLocationX: " + this.storeLocationX);
      log("storeLocationX: " + this.storeLocationY);
      log("weaponStoreInfos: " + this.weaponStoreInfos);
  
      log("weaponLocationOffsetList: " + weaponLocationOffsetList);
      log("weaponRotationList: " + weaponRotationList);
    }
  }