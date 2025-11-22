export enum DressType {
  Jacket = 'Structured Jacket',
  Gown = 'Evening Gown',
  Trench = 'Trench Coat',
  Vest = 'Utility Vest',
  Blazer = 'Modern Blazer',
}

export enum MaterialColor {
  Natural = 'Natural Beige Mycelium',
  Noir = 'Charcoal Black',
  Oxblood = 'Deep Oxblood Red',
  Forest = 'Forest Green',
  Saffron = 'Saffron Yellow',
}

export enum AccessoryType {
  None = 'None',
  Bag = 'Crossbody Bag',
  Hat = 'Wide Brim Hat',
  Belt = 'Corset Belt',
  Scarf = 'Textured Scarf',
}

export interface CustomizationState {
  dressType: DressType;
  color: MaterialColor;
  accessory: AccessoryType;
}

export interface GeminiResponse {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}
