import { normalizeStr } from "./string_helpers";

/**
 * helpers
 */
export function getDetailsCSSOptions(el) {
    let els = ['details', 'summary'];
    let options = {
        right: false,
        round: false,
        plus: false,
        icon: '',
        type: ''
    }

    let hasOptions = false;
    if (!el) return {}

    let classList = [...el.classList];

    classList.forEach(cl => {
        let preArr = cl.split('-')
        let prop = preArr[1];
        let val = preArr[preArr.length - 1];

        if (els.includes(preArr[0])) {
            if (options.hasOwnProperty(prop)) {
                if(prop===val) {
                    options[prop] = true;
                }else{
                    options[prop] = val;
                }
                hasOptions = true;
            }
        }
    })

    //console.log(options);
    return hasOptions ? options : {};
}


// helper sanitize text for anchors
export function textToAnchorUrl(text) {
    text = normalizeStr(text);
    let anchorId = text.trim().toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')

    //prefix numeric anchor ids
    if (!isNaN(anchorId.substr(0, 1))) anchorId = 'a-' + anchorId;
    return anchorId;
}