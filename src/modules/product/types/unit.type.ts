export enum Unit {
  KG = 'KG',
  GRAM = 'GRAM',
  POUND = 'POUND',
  LITER = 'LITER',
  PIECE = 'PIECE',
  DOZEN = 'DOZEN',
  BUNCH = 'BUNCH',
  BAG = 'BAG',
  BOTTLE = 'BOTTLE',
  BOX = 'BOX',
  BUNDLE = 'BUNDLE',
  CARTON = 'CARTON',
}
export type UnitType = keyof typeof Unit;