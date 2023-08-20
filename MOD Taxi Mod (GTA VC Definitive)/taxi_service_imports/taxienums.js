export const TEMPACTION = {
  None: 0,
  Wait: 1,
  Reverse: 2,
  HandbrakeTurnLeft: 3,
  HandbrakeTurnRight: 4,
  HandbrakeStraight: 5,
  TurnLeft: 6,
  TurnRight: 7,
  GoForward: 8,
  SwerveLeft: 9,
  SwerveRight: 10,
};

export const CARLOCK = {
  NotUsed: 0,
  Unlocked: 1,
  Locked: 2,
  LockoutPlayerOnly: 3,
  LockedPlayerInside: 4,
  LockedInitially: 5,
  ForceShutDoors: 6,
  SkipShutDoors: 7,
};

export const CARMISSON = {
  None: 0,
  Cruise: 1,
  RamPlayerFaraway: 2,
  RamPlayerClose: 3,
  BlockPlayerFaraway: 4,
  BlockPlayerClose: 5,
  BlockPlayerHandbrakeStop: 6,
  WaitForDeletion: 7,
  GotoCoords: 8,
  GotoCoordsStraight: 9,
  EmergencyVehicleStop: 10,
  StopForever: 11,
  GotoCoordsAccurate: 12,
  GotoCoordsStraightAccurate: 13,
  GotoCoordsAsthecrowSwims: 14,
  RamCarFaraway: 15,
  RamCarClose: 16,
  BlockCarFaraway: 17,
  BlockCarClose: 18,
  BlockCarHandbrakeStop: 19,
  HeliFlyToCoors: 20,
  AttackPlayer: 21,
  PlaneFlyToCoors: 22,
  HeliLand: 23,
  SlowlyDriveTowardsPlayer1: 24,
  SlowlyDriveTowardsPlayer2: 25,
  BlockPlayerForwardAndBack: 26,
};

export const CARDRIVINGSTYLE = {
  StopForCars: 0,
  SlowDownForCars: 1,
  AvoidCars: 2,
  PloughThrough: 3,
  StopForCarsIgnoreLights: 4,
};

export const KEYCODES = {
  ENTER_KEY: 13,
  CTRL_KEY: 17,
  ALT_KEY: 18,
  LEFT_KEY: 37,
  UP_KEY: 38,
  RIGHT_KEY: 39,
  DOWN_KEY: 40,
  NUM_1_KEY: 49,
  NUM_2_KEY: 50,
  NUM_3_KEY: 51,
  B_KEY: 66,
  E_KEY: 69,
  F_KEY: 70,
  M_KEY: 77,
  N_KEY: 78,
  Y_KEY: 89
};
