export interface RentEstimateSegment {
    medianAmount: number;
    sampleSize: number;
    confidenceScore: number;
    confidenceLabel: string;
}

export interface RentEstimateResponse {
    areaId: string;
    areaName: string;
    houseType: string;
    utilitiesIncluded: RentEstimateSegment;
    utilitiesExcluded: RentEstimateSegment;
}