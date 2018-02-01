interface PagerOptions {
    pageNumber?: number,
    pageRange?: number,
    pageSize?: number,
    pagerClass?: string,
    pagerItemClass?: string,
    dataClass?: string,
    showNext?: boolean,
    showPrev?: boolean,
    totalCount?: number,
}

namespace UI {
    class PagerObject {

        public pageNumber?: number = 0;
        public pageRange?: number = 2;
        public pageSize?: number = 0;
        public showNext?: boolean = true;
        public showPrev?: boolean = true;
        public totalCount?: number = 0;

        public pagerClass: string = ".m-pager";
        public pagerItemClass: string = ".m-pager-item";
        public dataClass: string = ".m-table";

        private activeClass: string = ".is-active";
        private disabledClass: string = ".is-disabled";

        private element: Element;
        private nextLabel: string = "Next";
        private previousLabel: string = "Previous";

        constructor(element: Element, options?: PagerOptions) {
            console.log(element);
            console.log(options);
            this.setOptions(options);

            this.element = element;
            this.renderPager();

            let navigation = this.element.querySelectorAll(this.pagerItemClass);
            for (let i = 0; i < navigation.length; i++) {
                this.handleClick(navigation[i]);
            }
            if (this.pageNumber == 0) {
                this.first();
            }
        }

        public gotoPage(pageIndex: number) {
            let pageNumber: number = 0;
            if (pageIndex === undefined) {
                pageNumber = this.pageNumber
            } else if (pageIndex > 0 && this.getTotalPages() >= pageIndex) {
                this.pageNumber = pageIndex;
            } else {

            }
            this.updatePageStatus();
            return pageNumber;
        }

        public first() {
            this.gotoPage(1);
        }

        public prev() {
            this.gotoPage(this.pageNumber - 1);
        }

        public next() {
            this.gotoPage(this.pageNumber + 1);
        }

        public last() {
            this.gotoPage(this.getTotalPages());
        }

        private getPageNumberHtml(page: number) {
            let pageNode = document.createElement("span");
            pageNode.classList.add(this.pagerItemClass.substring(1));
            pageNode.setAttribute("data-page", page.toString());
            pageNode.innerHTML = page.toString();
            return pageNode;
        }

        private getTotalPages() {
            let pages: number = 0;
            if (this.pageSize !== 0) {
                pages = Math.floor(this.totalCount / this.pageSize);
                if (this.totalCount % this.pageSize !== 0)
                    pages += 1;
            }
            return pages;
        }

        private handleClick(link: Element) {
            let that = this;
            let value = link.getAttribute("data-page");
            link.addEventListener('click', function (e) {
                if (value.match(/^-?\d+$/)) {
                    that.gotoPage(parseInt(value));
                } else {
                    that[value]();
                }
            });
        }

        private renderPager() {
            let totalNumPages = this.getTotalPages();
            if (totalNumPages < 1) {
                return;
            }
            let nextLabel = this.nextLabel;
            let previousLabel = this.previousLabel;

            // create Next/Previous
            let nextNode = document.createElement("span");
            nextNode.classList.add(this.pagerItemClass.substring(1));
            nextNode.setAttribute("title", this.nextLabel)
            nextNode.setAttribute("data-page", "next");
            nextNode.innerHTML = "Next";
            if (this.pageNumber === 1) {
                nextNode.classList.add(this.disabledClass.substring(1));
            }
            let prevNode = document.createElement("span");
            prevNode.classList.add(this.pagerItemClass.substring(1));
            prevNode.setAttribute("title", this.previousLabel)
            prevNode.setAttribute("data-page", "prev");
            prevNode.innerHTML = "Previous";
            if (this.pageNumber === totalNumPages) {
                nextNode.classList.add(this.disabledClass.substring(1));
            }

            let moreNode = document.createElement("span");
            nextNode.classList.add(this.pagerItemClass.substring(1));
            moreNode.innerHTML = "...";

            let rangeStart = this.pageNumber - this.pageRange;
            let rangeEnd = this.pageNumber + this.pageRange;
            let pagerContainer = document.createElement("ul");
            pagerContainer.classList.add(this.pagerClass.substring(1));
            let pagerItems: Array<HTMLElement> = [];

            if (this.showPrev) {
                pagerItems.push(prevNode);
            }

            if (rangeEnd > totalNumPages) {
                rangeEnd = totalNumPages;
                rangeStart = totalNumPages - (this.pageRange * 2);
                rangeStart = rangeStart < 1 ? 1 : rangeStart;
            }

            if (rangeStart <= 1) {
                rangeStart = 1;
                rangeEnd = Math.min((this.pageRange * 2) + 1, totalNumPages);
            }

            if (rangeStart < 3) {
                for (let i = 1; i < rangeStart; i++) {
                    pagerItems.push(this.getPageNumberHtml(i));
                }
            } else {
                pagerItems.push(moreNode);
            }

            for (let i = rangeStart; i <= rangeEnd; i++) {
                pagerItems.push(this.getPageNumberHtml(i));
            }

            if (rangeEnd >= totalNumPages - 2) {
                for (let i = rangeEnd + 1; i <= totalNumPages; i++) {
                    pagerItems.push(moreNode);
                    pagerItems.push(this.getPageNumberHtml(totalNumPages));
                }
            }

            if (this.showNext) {
                pagerItems.push(nextNode);
            }

            for (let i = 0; i < pagerItems.length; i++) {
                let li = document.createElement("li");
                li.innerHTML = pagerItems[i].outerHTML;
                pagerContainer.appendChild(li);
            }
            this.element.innerHTML = pagerContainer.outerHTML;
        }

        private setOptions(options?: PagerOptions) {
            options = options || {};
            this.pageNumber = options.pageNumber || this.pageNumber;
            this.pageRange = options.pageRange || this.pageRange;
            this.pageSize = options.pageSize || this.pageSize;
            this.showNext = options.showNext || this.showNext;
            this.showPrev = options.showPrev || this.showPrev;
            this.totalCount = options.totalCount || this.totalCount;
        }

        private updatePageStatus() {
            let selectorReset = this.element.querySelectorAll(this.pagerItemClass);
            for (let i = 0; i < selectorReset.length; i++) {
                selectorReset[i].parentElement.classList.remove(this.disabledClass.substring(1));
                selectorReset[i].parentElement.classList.remove(this.activeClass.substring(1));
                if (parseInt(selectorReset[i].getAttribute("data-page")) === this.pageNumber) {
                    selectorReset[i].parentElement.classList.add(this.activeClass.substring(1));
                }
                if (this.pageNumber <= 1 && selectorReset[i].getAttribute("data-page") === "prev") {
                    selectorReset[i].parentElement.classList.add(this.disabledClass.substring(1));
                }
                if (this.pageNumber >= this.getTotalPages() && selectorReset[i].getAttribute("data-page") === "next") {
                    selectorReset[i].parentElement.classList.add(this.disabledClass.substring(1));
                }
            }
        }

    }

    export namespace PagerWidget {
        let pagers = [];

        export function init(selector: string, options?: PagerOptions) {
            let elements = document.querySelectorAll(selector);

            for (let i = 0; i < elements.length; i++) {
                pagers.push(new PagerObject(elements[i], options));
            }
        }
    }
}

(() => {
    UI.PagerWidget.init('.js-pagerWidget', {
            pageSize: 10,
            totalCount: 30
        }
    );

})();
