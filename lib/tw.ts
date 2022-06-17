import { create } from "twrnc";

// create the customized version...
const twa = create(require(`../tailwind.config.js`)); // <- your path may differ

// ... and then this becomes the main function your app uses
export const tw = twa;
export const style = twa.style;
