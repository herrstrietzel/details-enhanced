
//import { summaryIcons } from './constants';
import { bindDetailsEvents, bindDetailsOpenbtns, closeDetails, openDetails } from './details_state_toggle.js';
import { getDetailsCSSOptions, textToAnchorUrl } from './details_helpers';

export const summaryIcons = {
    'arrow': `<svg class="icn-svg" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>`,
    'arrow-right': `<svg class="icn-svg" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>`,
    'chevron': `<svg class="icn-svg" viewBox="0 0 24 24" ><path d="m8.3 4.5 7.5 7.5-7.5 7.5" /></svg>`,
    'plus': `<svg  class="icn-svg" viewBox="0 0 24 24" ><path class="path1" d="M5 12h14 " /> <path class="path2" d="M12 4.5v15"/></svg>`,
    'minus': `<svg  class="icn-svg" viewBox="0 0 24 24" ><path d="M5 12h14" /></svg>`
}


export function enhanceDetailsAutoInit() {
    let detailsToEnhance = document.querySelectorAll('.details-enhanced, [data-details], [data-enhance-inputs]');
    if (detailsToEnhance.length) {
        enhanceDetails()
    }
}


export function enhanceDetails(options = {}) {


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
    }
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
        //let parent = detail.parentNode.closest('[class*=details-], [data-details]');
        let parent = detail.parentNode;
        let nestedDetails = detail.parentNode.closest('details');

        if(parent!==lastGroup){
            groupIndex++
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

        //get summary options - highest priority
        let summaryOptions = getDetailsCSSOptions(summary)
        let summaryDataAtt = summary.dataset.details || summary.dataset.summary;
        let summaryDataOptions = summaryDataAtt ? JSON.parse(summaryDataAtt) : {};
        //console.log('summaryDataOptions', summaryDataOptions);

        summaryOptions = {
            ...summaryOptions,
            ...summaryDataOptions
        }

        let optionsFinal = summaryOptions

        if (!Object.keys(summaryOptions).length) {
            // get custom parent options
            let dataParent = detail.closest('[data-details]')
            let optionsDataDetails = dataParent ? JSON.parse(dataParent.dataset.details) : {}

            // CSS option parent
            //let cssInitEl = detail.closest('[class*=details-]:not(.details-content, .details-content-inner)');
            let cssInitEl = detail.closest('.details-plus','.details-chevron', '.details-round', '.details-right');
            //console.log('cssInitEl', cssInitEl);
            let cssOptions = cssInitEl ? getDetailsCSSOptions(cssInitEl) : {}

            
            optionsFinal = {
                ...cssOptions,
                ...optionsDataDetails
            }

            //console.log('cssOptions', nestedDetails, cssInitEl, optionsFinal, cssOptions);
        }

        //extract final options
        let { icon='chevron', round, right, plus=false, type='default' } = optionsFinal;
        //console.log('optionsFinal', optionsFinal);

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
            detail.parentNode.classList.add(`details-${type}`)
        }
        

        //add custom class names to prevent multiple processing
        detail.classList.add('details', 'details-enhanced', 'details-enhanced-active' );




        summary.classList.add("summary");

        // add event listeners
        bindDetailsEvents(detail, detailsContent, summary, expanded, type)

    }

    bindDetailsOpenbtns()

}


