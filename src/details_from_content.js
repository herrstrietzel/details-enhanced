
/**
 * convert to details wrapped in content class
 * "details-content-init"
 */
export function content2Details(parentEl=null) {
    parentEl = parentEl ? parentEl : document.body
    let detailsCnt = parentEl.querySelectorAll('.details-content-init');
    detailsCnt.forEach(cnt => {
        let summaryPrev = cnt.previousElementSibling;
        let details = document.createElement('details');
        details.classList.add('details-enhanced');
        details.open = cnt.hasAttribute('open') || cnt.classList.contains('details-expanded');

        // get options
        let dataAtt = cnt.getAttribute('data-details');
        if (dataAtt) details.setAttribute('data-details', dataAtt);
        let summary = document.createElement('summary');

        details.append(summary, cnt);
        summaryPrev.parentNode.insertBefore(details, summaryPrev);
        summary.classList.add('summary');
        summary.append(summaryPrev)

    })
}
