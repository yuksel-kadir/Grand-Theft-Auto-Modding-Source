import { WeaponInfo } from "./weaponInfo";

//PISTOL +
//357 +

//MP +
//UZI +
//TEC9 -
//Ingram Mac 10 -

//Chrome +
//SPAS +
//Stubby +

//Ruger+
//M4 +

//308 SNIPER -
//Sniper Rifle -

//Rocket Launcher +
//Flamethrower +
//M60 +
//Minigun -

//grenade +
//molotov +
//teargas +
export const WEAPONLIST = [
  //MODEL ID, WEAPON NAME, GLOBAL, WEAPON TYPE, WEAPON PRICE
  new WeaponInfo(274, "PISTOL", 0, 17, 100),
  new WeaponInfo(275, "PYTHON", 1213, 18, 2000),
  new WeaponInfo(283, "INGRAM", 0, 24, 300),
  new WeaponInfo(282, "UZI", 0, 23, 400),
  new WeaponInfo(284, "MP5", 1212, 25, 3000),
  new WeaponInfo(277, "SHOTGN1", 1208, 19, 500),
  new WeaponInfo(278, "SHOTGN2", 1154, 20, 4000),
  new WeaponInfo(279, "SHOTGN3", 1174, 21, 4000), //STUBBY
  new WeaponInfo(276, "RUGER", 1209, 27, 1000),
  new WeaponInfo(280, "M4", 1161, 26, 5000),
  new WeaponInfo(287, "ROCKET", 559, 30, 8000), //Rocket Launcher
  new WeaponInfo(288, "", 559, 31, 8000), //Flamethrower
  new WeaponInfo(289, "M60", 559, 32, 10000), //M60
  new WeaponInfo(270, "GRENADE", 0, 12, 300),
  new WeaponInfo(272, "MOLOTOV", 0, 15, 300), //Molotov
  new WeaponInfo(271, "TEARGAS", 0, 14, 300), //Teargas
  new WeaponInfo(368, "ARMOUR", 0, -1, 200),
];

export const MELEE_WEAPONLIST = [
  //MODEL ID, WEAPON NAME, GLOBAL, WEAPON TYPE, WEAPON PRICE
  new WeaponInfo(260, "SCREWD", 0, 2, 10),
  new WeaponInfo(265, "HAMMER", 0, 7, 20),
  new WeaponInfo(266, "CLEVER", 0, 8, 50),
  new WeaponInfo(264, "BASEBAT", 0, 6, 80),
  new WeaponInfo(267, "MACHETE", 0, 9, 100),
  new WeaponInfo(263, "KNIFE", 0, 5, 90),
  new WeaponInfo(268, "KATANA", 1180, 10, 300),
  new WeaponInfo(269, "CHAINSA", 1153, 11, 500),
];
