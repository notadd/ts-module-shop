import { Component, Inject } from '@nestjs/common';
const allowExtension = require('../allowExtension.json')

@Component()
export class KindUtil {

    constructor() { }

    getKind(type: string) {
        if (allowExtension.image.includes(type)) {
            return 'image'
        } else if (allowExtension.audio.includes(type)) {
            return 'audio'
        } else if (allowExtension.video.includes(type)) {
            return 'video'
        } else if (allowExtension.document.includes(type)) {
            return 'document'
        } else {
            return 'file'
        }
    }

    isImage(type: string) {
        return allowExtension.image.includes(type)
    }
}

