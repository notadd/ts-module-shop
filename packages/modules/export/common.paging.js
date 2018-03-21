"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
class PagerService {
    getPager(totalItems, currentPage, pageSize) {
        if (pageSize == null || pageSize == 0) {
            pageSize = 1;
        }
        if (currentPage == null || currentPage == 0) {
            currentPage = 1;
        }
        let totalPages = Math.ceil(totalItems / pageSize);
        let startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        }
        else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            }
            else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            }
            else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        let pages = _.range(startPage, endPage + 1);
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
exports.PagerService = PagerService;
class ReturnPage {
}
exports.ReturnPage = ReturnPage;
