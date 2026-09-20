export type HouseType =
    | "SINGLE_ROOM"
    | "BEDSITTER"
    | "STUDIO"
    | "ONE_BEDROOM"
    | "TWO_BEDROOM"
    | "THREE_BEDROOM"
    | "BUNGALOW"
    | "MAISONETTE";

export const HOUSE_TYPE_OPTIONS: { value: HouseType; label: string }[] = [
    {value: "SINGLE_ROOM", label: "Single Room"},
    {value: "BEDSITTER", label: "Bedsitter"},
    {value: "STUDIO", label: "Studio"},
    {value: "ONE_BEDROOM", label: "One Bedroom"},
    {value: "TWO_BEDROOM", label: "Two Bedroom"},
    {value: "THREE_BEDROOM", label: "Three Bedroom"},
    {value: "BUNGALOW", label: "Bungalow"},
    {value: "MAISONETTE", label: "Maisonette"},
];

export interface AreaResponse {
    id: string;
    name: string;
    regionId: string;
    regionName: string;
}

export interface RentEstimateSegment {
    medianAmount: number;
    sampleSize: number;
    confidenceScore: number;
    confidenceLabel: string;
}

export interface RentEstimateResponse {
    areaId: string;
    areaName: string;
    houseType: HouseType;
    utilitiesIncluded: RentEstimateSegment;
    utilitiesExcluded: RentEstimateSegment;
}

export type SubmissionStatus = string;

export interface RentSubmissionRequest {
    areaId: string;
    houseType: HouseType;
    amount: number;
    utilitiesIncluded: boolean;
}

export interface RentSubmissionResponse {
    id: string;
    contributorId: string;
    areaId: string;
    houseType: HouseType;
    amount: number;
    status: SubmissionStatus;
    utilitiesIncluded: boolean;
}
export interface QuoteCheckRequest {
    quotedAmount: number;
    utilitiesIncluded: boolean;
}

export interface QuoteCheckResponse {
    quotedAmount: number;
    medianAmount: number;
    percentageDifference: number | null;
    verdict: string;
    confidenceScore: number;
    confidenceLabel: string;
}