"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const sitemap_create_event_1 = require("../events/impl/sitemap-create.event");
const sitemap_update_event_1 = require("../events/impl/sitemap-update.event");
class Sitemap extends cqrs_1.AggregateRoot {
    constructor(id) {
        super();
        this.id = id;
    }
    updatexml(enemyId) {
        this.apply(new sitemap_update_event_1.SitemapUpdateEvent(enemyId));
    }
    createxml(createParam) {
        this.apply(new sitemap_create_event_1.SitemapCreateEvent(createParam));
    }
}
exports.Sitemap = Sitemap;
