export class WeaponLocationInfo {
  constructor(x, y, z, locationInfoType) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.locationInfoType = locationInfoType;
  }

  displayWeaponLocationInfo() {
    log(locationInfoType + ": " + this.x + " " + this.y + " " + this.z + " ");
  }
}
