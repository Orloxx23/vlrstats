import { fenix, fenix2, raze, saifer, yoru } from "../assets/images/404";

export const images404 = [
    fenix,
    fenix2,
    raze,
    saifer,
    yoru
]

export const randomImg = (images) => {
  const random = Math.floor(Math.random() * images.length);
  return images[random];
};
