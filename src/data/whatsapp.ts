import { business } from './business';

export const waLink = (message?: string) =>
  `https://wa.me/965${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const waGeneral = () => waLink(`مرحبًا ${business.short}، أريد طلب حاوية.`);
export const waGeneralEn = () => waLink(`Hello ${business.shortEn}, I would like to order a container.`);
export const waContainer = (title: string) => waLink(`مرحبًا ${business.short}، أريد طلب ${title}.`);
export const waContainerEn = (title: string) => waLink(`Hello ${business.shortEn}, I would like to order a ${title}.`);
