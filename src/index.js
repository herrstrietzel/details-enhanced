export {
    abs, acos, asin, atan, atan2, ceil, cos, exp, floor, hypot,
    log, max, min, pow, random, round, sin, sqrt, tan, PI
} from './constants';


import { enhanceDetails, enhanceDetailsAutoInit } from './enhanceDetails';
export {enhanceDetails as enhanceDetails}

if (typeof window !== 'undefined') {
    window.enhanceDetails = enhanceDetails;
    enhanceDetailsAutoInit();
}
