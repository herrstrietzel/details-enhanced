const {
    abs, acos, asin, atan, atan2, ceil, cos, exp, floor,
    log, hypot, max, min, pow, random, round, sin, sqrt, tan, PI
} = Math;

/**
 * Custom open, close or toggle 
 * buttons
 */
function bindDetailsOpenbtns() {

    let btns = document.querySelectorAll('button[data-details], a[data-details]');

    btns.forEach(btn => {

        if (!btn.classList.contains('btn-active')) {

            let {details, detailsToggle=''} = btn.dataset;

            // toggle mode
            let toggle = detailsToggle;

            // specific details Ids to toggle
            let targetIds = details.split(' ').filter(Boolean);

            // details with ID
            let targets = targetIds.map(id => document.getElementById(id)).filter(Boolean);
            if (btn.nodeName.toLocaleLowerCase() === 'button') {
                btn.type = 'button';
            }

            btn.addEventListener('click', (e) => {
                // no spcific target
                if (!targetIds.length) {

                    // reset if no explicit details IDs are targeted
                    targets = [];

                    // query groups to apply group based behavior - e.g accordion
                    let groups = document.querySelectorAll('[data-details-group]');

                    for (let i = 0, l = groups.length; l && i < l; i++) {
                        let group = groups[i];

                        // ignore accordions
                        let isAccordion = group.closest('.details-accordion');
                        if (isAccordion) continue;

                        let details = [...group.querySelectorAll('details')];
                        let detailsOpen = details.filter(det => det.open);
                        let detailsClosed = details.filter(det => !det.open);

                        let detailsRest = detailsOpen.length > detailsClosed.length ? detailsOpen : detailsClosed;

                        let mode = toggle === 'expand' || toggle === 'collapse' ? toggle : 'toggle';
                        let targetsGroup = mode === 'expand' ? detailsClosed : (mode === 'collapse' ? detailsOpen : detailsRest);

                        if (targetsGroup.length) targets.push(...targetsGroup);

                    }

                    // deduplicate
                    targets = Array.from(new Set([...targets])).filter(Boolean);
                }

                if(targets.length) toggleDetails(targets);

            });

            btn.classList.add('btn-active');
        }
    });
}

function closeDetails(parentEl = null, exclude = null) {
    parentEl = parentEl ? parentEl : document.body;
    let details = parentEl.querySelectorAll('details[open]');
    toggleDetails(details, exclude);
}

function toggleDetails(details = null, exclude = null) {

    console.log('toggleDetails');

    details.forEach(detail => {
        let nodeName = detail.nodeName.toLowerCase();
        let summary = nodeName === 'summary' ? detail : detail.querySelector('summary');
        if (!exclude || summary !== exclude) {
            summary.dispatchEvent(new Event('click'));
        }
    });
}

function bindDetailsEvents(detail, detailsContent, summary, expanded, type = '') {

    // prevent duplicate events
    if (!summary.classList.contains('summary-active')) {

        /**
         * events and 
         * animation
         */

        // toggle open state after transition end
        detailsContent.addEventListener("transitionend", (e) => {

            if (!expanded) {
                detail.open = false;
            } else {
                detailsContent.classList.add("details-content-open");
            }
        });

        // toggle states on click
        summary.addEventListener("click", (e) => {
            e.preventDefault();
            let current = e.currentTarget;
            let detail = current.closest("details");
            let detailsContent = current.parentNode.querySelector('.details-content');
            let summaryMarker = current.querySelector('.summary-marker');

            // close others in accordion mode
            if (type === 'accordion') {
                let parent = detail.parentNode.closest('[data-details]') || detail.parentNode.closest('.details-type-accordion');

                closeDetails(parent, summary);
            }

            // collapse
            if (expanded) {
                expanded = false;
                detail.classList.remove("details-expanded");
                detailsContent.classList.remove("details-content-expanded");
                detailsContent.classList.remove("details-content-open");

                summary.classList.remove("summary-expanded");
                summaryMarker.classList.replace("summary-marker-expanded", "summary-marker-collapsed");

            }
            // expand
            else if (!expanded) {
                expanded = true;
                detail.open = true;
                summary.classList.add("summary-expanded");
                summaryMarker.classList.replace("summary-marker-collapsed", "summary-marker-expanded");

                // tiny delay for expand transition
                setTimeout(() => {
                    detail.classList.add("details-expanded");
                    detailsContent.classList.add("details-content-expanded");
                }, 10);

            }

        });

        summary.classList.add('summary-active');

    }

}

function normalizeStr(str) {
  // Step 1: Replace German umlauts and ß
  const germanMap = {
    'ä': 'ae', 'ö': 'oe', 'ü': 'ue',
    'Ä': 'ae', 'Ö': 'oe', 'Ü': 'ue',
    'ß': 'ss'
  };
  str = str.replace(/[äöüÄÖÜß]/g, match => germanMap[match]);

  // Step 2: Remove accents (e.g., é → e)
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Step 3: Remove emojis and symbols using regex ranges
  str = str.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    ''
  );

  // Step 4: Convert to lowercase
  str = str.toLowerCase();

  // Step 5: Replace spaces, dots, and underscores with dashes
  str = str.replace(/[\s._]+/g, '-');

  // Step 6: Remove invalid characters
  str = str.replace(/[^a-z0-9-]/g, '');

  // Step 7: Collapse multiple dashes
  str = str.replace(/-+/g, '-');

  // Step 8: Trim leading and trailing dashes
  str = str.replace(/^-+|-+$/g, '');

  return str;
}

/**
 * helpers
 */
function getDetailsCSSOptions(el) {
    let els = ['details', 'summary'];
    let options = {
        right: false,
        round: false,
        plus: false,
        icon: '',
        type: ''
    };

    let hasOptions = false;
    if (!el) return {}

    let classList = [...el.classList];

    classList.forEach(cl => {
        let preArr = cl.split('-');
        let prop = preArr[1];
        let val = preArr[preArr.length - 1];

        if (els.includes(preArr[0])) {
            if (options.hasOwnProperty(prop)) {
                if(prop===val) {
                    options[prop] = true;
                }else {
                    options[prop] = val;
                }
                hasOptions = true;
            }
        }
    });

    return hasOptions ? options : {};
}

// helper sanitize text for anchors
function textToAnchorUrl(text) {
    text = normalizeStr(text);
    let anchorId = text.trim().toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

    if (!isNaN(anchorId.substr(0, 1))) anchorId = 'a-' + anchorId;
    return anchorId;
}

const summaryIcons = {
    'arrow': `<svg class="icn-svg" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>`,
    'arrow-right': `<svg class="icn-svg" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>`,
    'chevron': `<svg class="icn-svg" viewBox="0 0 24 24" ><path d="m8.3 4.5 7.5 7.5-7.5 7.5" /></svg>`,
    'plus': `<svg  class="icn-svg" viewBox="0 0 24 24" ><path class="path1" d="M5 12h14 " /> <path class="path2" d="M12 4.5v15"/></svg>`,
    'minus': `<svg  class="icn-svg" viewBox="0 0 24 24" ><path d="M5 12h14" /></svg>`
};

function enhanceDetailsAutoInit() {
    let detailsToEnhance = document.querySelectorAll('.details-enhanced, [data-details], [data-enhance-inputs]');
    if (detailsToEnhance.length) {
        enhanceDetails();
    }
}

function enhanceDetails(options = {}) {

    // default options
    options = {
        ...{
            target: 'body',
            icon: '',
            round: false,
            right: false,
            plus: false
        },
        ...options
    };
    let { target, icon, round, right } = options;

    // selector el
    let selection = document.querySelector(target);

    // details wraps
    let details = selection.querySelectorAll('details');

    // current hash
    let hash = window.location.hash.replace('#', '');

    /**
     *  loop through details
     */

    // group details
    let lastGroup = null;
    let groupIndex=-1;

    for(let i=0, l=details.length; l&&i<l; i++ ){

        let detail = details[i];

        // prevent duplicate initialization
        if(detail.classList.contains('details-enhanced-active') || detail.closest('.details-ignore')){
            continue
        }

        /**
         * skip if 
         * already wrapped/processed
         */
        let wrapped = detail.querySelector('.details-content') ? true : false;
        if (wrapped) continue;

       /**
         * apply group 
         * data attributes
         */

        let parent = detail.parentNode;
        detail.parentNode.closest('details');

        if(parent!==lastGroup){
            groupIndex++;
            if(!parent.dataset.detailsGroup) parent.dataset.detailsGroup = groupIndex;
        }

        // parent to last group
        lastGroup = parent;

        let classModifiers = '', summarMarkerStyle = '', summarMarkerAlignment = '', summaryMarkerState = '';

        /**
        * all wrap detail's content: 
        * outer wrap for grid display context
        * and inner for hidden overflow
        */
        let detailsContent = document.createElement("div");
        detailsContent.classList.add("details-content");
        let detailsContentInner = document.createElement("div");
        detailsContentInner.classList.add("details-content-inner");

        let children = [...detail.children];
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.nodeName.toLowerCase() !== "summary") detailsContentInner.append(child);
        }
        detailsContent.append(detailsContentInner);
        detail.append(detailsContent);

        /**
        * add anchor ids - if not present
        * add expanded classes for
        * auto expand targeted details by hash/anchor id
        * expand current hash
        */

        let summary = detail.querySelector('summary');
        let anchorID = summary.id;
        if (!summary.id) {
            anchorID = textToAnchorUrl(summary.textContent);

            // if ID is already reserved - add numeric suffix
            if (document.getElementById(anchorID)) {
                let len = document.querySelectorAll(`#${anchorID}`).length;
                anchorID = `${anchorID}-${len + 1}`;
            }
            summary.id = anchorID;
        }

        if (hash === anchorID) detail.open = true;
        let expanded = detail.hasAttribute("open");

        // expand when "open" attribute is set
        if (expanded) {
            detail.classList.add("details-expanded");
            summary.classList.add("summary-expanded");
            summaryMarkerState = 'summary-marker-expanded';
            detailsContent.classList.add("details-content-expanded");
        } else {
            summaryMarkerState = 'summary-marker-collapsed';
        }

        /**
         * merge options from data attribute
         * css class applied to parent, details
         * or summary element
         */

        let summaryOptions = getDetailsCSSOptions(summary);
        let summaryDataAtt = summary.dataset.details || summary.dataset.summary;
        let summaryDataOptions = summaryDataAtt ? JSON.parse(summaryDataAtt) : {};

        summaryOptions = {
            ...summaryOptions,
            ...summaryDataOptions
        };

        let optionsFinal = summaryOptions;

        if (!Object.keys(summaryOptions).length) {
            // get custom parent options
            let dataParent = detail.closest('[data-details]');
            let optionsDataDetails = dataParent ? JSON.parse(dataParent.dataset.details) : {};

            // CSS option parent

            let cssInitEl = detail.closest('.details-plus','.details-chevron', '.details-round', '.details-right');

            let cssOptions = cssInitEl ? getDetailsCSSOptions(cssInitEl) : {};

            
            optionsFinal = {
                ...cssOptions,
                ...optionsDataDetails
            };

        }

        let { icon='chevron', round, right, plus=false, type='default' } = optionsFinal;

        /** 
         * add toggle icon
         * 1. add round background
         * 2. customize icon
         */

        // plus/minus style
        if(plus) icon = 'plus';

        let markerIconCustom = summaryIcons[icon] ? summaryIcons[icon] : (icon ? icon : '');

        // round background
        if (round) {
            classModifiers = ' summary-marker-round';
        }

        // right or left alignment
        if (right) {
            summarMarkerAlignment = 'summary-marker-right';
        }

        // custom svg icon
        if (markerIconCustom) summarMarkerStyle = `summary-marker-icon summary-marker-icon-${icon}`;

        let markerIcon = `<span class="summary-marker ${classModifiers} ${summarMarkerStyle} ${summarMarkerAlignment} ${summaryMarkerState}" aria-hidden="true" focusable="false">${markerIconCustom}</span>`;
        summary.insertAdjacentHTML("afterbegin", markerIcon);

        if(type==='accordion'){
            detail.parentNode.classList.add(`details-${type}`);
        }
        

        detail.classList.add('details', 'details-enhanced', 'details-enhanced-active' );

        summary.classList.add("summary");

        // add event listeners
        bindDetailsEvents(detail, detailsContent, summary, expanded, type);

    }

    bindDetailsOpenbtns();

}

if (typeof window !== 'undefined') {
    window.enhanceDetails = enhanceDetails;
    enhanceDetailsAutoInit();
}

export { PI, abs, acos, asin, atan, atan2, ceil, cos, enhanceDetails, exp, floor, hypot, log, max, min, pow, random, round, sin, sqrt, tan };
