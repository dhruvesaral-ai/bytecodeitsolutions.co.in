import { get } from "@/lib/api-method";

interface CarouselConfig {
  id: string;
  position: string;
  carousalSlideIds: string[];
}

export interface CarouselSlide {
  id: string;
  bgImgUrl?: string | null;
  order: number;
  title?: string | null;
  description?: string | null;
  btnHrefLink?: string | null;
  textContainerAlign?: string | null;
  imgUrl?: string | null;
  bannerHrefLink?: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function isCarouselConfig(value: unknown): value is CarouselConfig {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.position === "string" &&
    Array.isArray(value.carousalSlideIds) &&
    value.carousalSlideIds.every((id) => typeof id === "string")
  );
}

function isCarouselSlide(value: unknown): value is CarouselSlide {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.order === "number" &&
    isOptionalString(value.bgImgUrl) &&
    isOptionalString(value.title) &&
    isOptionalString(value.description) &&
    isOptionalString(value.btnHrefLink) &&
    isOptionalString(value.textContainerAlign) &&
    isOptionalString(value.imgUrl) &&
    isOptionalString(value.bannerHrefLink)
  );
}

export default class CarousalSliderService {
  async getCarousals(): Promise<CarouselConfig[]> {
    const carouselResponse = await get<{ data: unknown[] }>("carousals");

    if (!carouselResponse || !Array.isArray(carouselResponse.data)) {
      throw new Error("Carousel API response must contain a data array.");
    }

    const carousels = carouselResponse.data;
    if (!carousels.every(isCarouselConfig)) {
      throw new Error("Carousel API response contains an invalid carousel.");
    }

    return carousels;
  }

  async getCarouselSlide(id: string): Promise<CarouselSlide> {
    const slideResponse = await get<{ data: unknown }>(
      `carousel-slides/${encodeURIComponent(id)}`
    );

    if (!slideResponse || !isCarouselSlide(slideResponse.data)) {
      throw new Error(`Carousel slide API response is invalid for slide "${id}".`);
    }

    return slideResponse.data;
  }
}

export const carousalSliderService = new CarousalSliderService();