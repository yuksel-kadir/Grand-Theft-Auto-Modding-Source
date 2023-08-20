export class WeaponInfo {
    /**
   * @param {int} weaponModel
   * Model id of the weapon.
   * @param {string} weaponGxtKey
   * GXT key of the weapon name.
   * @param {int} weaponGlobal
   * Global variable id of the weapon.
   * @param {int} weaponType
   * Type of the weapon
   * @param {int} weaponPrice
   * Price of the weapon.
   */
    constructor(
      weaponModel,
      weaponGxtKey,
      weaponGlobal,
      weaponType,
      weaponPrice
    ) {
      this.weaponModel = weaponModel;
      this.weaponGxtKey = weaponGxtKey;
      this.weaponGlobal = weaponGlobal;
      this.weaponType = weaponType;
      this.weaponPrice = weaponPrice;
    }
  
    displayWeaponInfo() {
      log("WEAPON MODEL: " + this.weaponModel);
      log("WEAPON GXT KEY: " + this.weaponGxtKey);
      log("WEAPON GLOBAL: " + this.weaponGlobal);
      log("WEAPON TYPE: " + this.weaponType);
      log("WEAPON PRICE: " + this.weaponPrice);
    }
  }