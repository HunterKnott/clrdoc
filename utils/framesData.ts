export interface StyleConfiguration {
    ManufacturerFramesMasterID: number;
    BrandFramesMasterID: number;
    CollectionFramesMasterID: number;
    StyleFramesMasterID: number;
    ManufacturerName: string;
    BrandName: string;
    CollectionName: string;
    StyleName: string;
    StyleStatus: string;
    StyleCreatedOn: string;
    StyleDiscontinuedOn: string;
    StyleLastModifiedOn: string;
    ProductGroup: string;
    Age: string;
    Gender: string;
    Material: string;
    MaterialDescription: string;
    PreciousMetal: string;
    PreciousMetalDescription: string;
    Country: string;
    Temple: string;
    TempleDescription: string;
    Bridge: string;
    BridgeDescription: string;
    Lens: string;
    LensDescription: string;
    Trim: string;
    TrimDescription: string;
    ClipSunglass: string;
    ClipSunglassDescription: string;
    Sideshields: string;
    SideshieldsDescription: string;
    EdgeType: string;
    CaseType: string;
    CaseDescription: string;
    Hinge: string;
    Rim: string;
    FrameShape: string;
    ShapeDescription: string;
    MonthIntro: string;
    YearIntro: string;
    Features: string;
    FramePDID: number | null;
    FramesPD: string;
    FramesPDDescription: string;
    LensVision: string;
    LensVisionDescription: string;
    RX: string;
    RXDescription: string;
    Warranty: string;
    WarrantyDescription: string;
    StyleNew: boolean;
    BestSeller: boolean;
    Market: string;
    FrameType: string;
    Configurations: Configuration[];
  }
  
  export interface Configuration {
    StyleFramesMasterID: number;
    ConfigurationFramesMasterID: number;
    ConfigurationFPC: string;
    UPC: string;
    SKU: string;
    FrameColorGroup: string;
    FrameColor: string;
    FrameColorCode: string;
    LensColor: string;
    LensColorCode: string;
    EyeSize: string;
    A: string;
    B: string;
    ED: string;
    EDAngle: string;
    TempleLength: string;
    BridgeSize: string;
    DBL: string;
    STS: string;
    Circumference: string;
    ZTilt: string;
    FCRV: string;
    ChangedPrice: boolean;
    NewPrice: boolean;
    CompletePrice: string;
    FrontPrice: string;
    TemplesPrice: string;
    HalfTemplesPrice: string;
    PriceDescription: string;
    PriceLastModifiedOn: string;
    ConfigurationImageName: string;
    ConfigurationLastModifiedOn: string;
    ConfigurationCreatedOn: string;
    ConfigurationStatus: string;
    ConfigurationDefault: boolean;
    Market: string;
    Currency: string;
  }
  
  export interface StyleConfigurationsResponse {
    StyleConfigurations: StyleConfiguration[];
  }

const API_BASE_URL = 'http://testapi.framesdata.com:80/api';
const AUTH_TOKEN = '4046ecc3-bc75-4bdf-ba48-e11ef8c8a0c1';

export async function fetchStyleConfigurations(brandId: number, market: string = 'USA'): Promise<StyleConfigurationsResponse> {
  const url = `${API_BASE_URL}/brands/${brandId}/styleconfigurations?auth=${AUTH_TOKEN}&mkt=${market}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: StyleConfigurationsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching style configurations:', error);
    throw error;
  }
}

export type ImageSize = 'Thumb' | 'Small' | 'Large' | 'XL';

export async function fetchFrameImage(fpc: string, size: ImageSize = 'Large'): Promise<string> {
  const url = `${API_BASE_URL}/images?auth=${AUTH_TOKEN}&size=${size}&fpc=${fpc}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching frame image:', error);
    throw error;
  }
}
