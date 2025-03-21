export interface Price {
  currencyCode: string;
  centAmount: number;
}

export interface Attribute {
  name: string;
  value: {
    key: string;
    label: string;
  };
  size?: string,
  color?: string,
}

export interface Image {
  url: string;
}

export interface Variant {
  id: string;
  sku: string;
  prices: { value: Price }[];
  images: Image[];
  attributes: Attribute[];
  slug: string;
  name: string;
}