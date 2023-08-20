import { StoreType } from "./weaponStoreRequiredConstants";
import { WEAPONLIST, MELEE_WEAPONLIST } from "./weaponLists";

export class WeaponStoreInfos {
  /**
   * @param {WeaponInfo[]} weaponList
   * @param {StoreType} weaponStoreType
   */
  constructor(weaponList, weaponStoreType) {
    this.weaponList = weaponList;
    this.weaponStoreType = weaponStoreType;
  }
}

export const AMMUNATIONSTOREINFO = new WeaponStoreInfos(
  WEAPONLIST,
  StoreType.AMMUNATION
);

export const TOOLSTOREINFO = new WeaponStoreInfos(
  MELEE_WEAPONLIST,
  StoreType.TOOLSTORE
);
