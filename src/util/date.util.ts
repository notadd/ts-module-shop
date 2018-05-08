import { Component } from "@nestjs/common";

@Component()
export class DateUtil {

    getString(date: Date): string {
        return date.getFullYear()
            + this.zero(date.getMonth() + 1)
            + this.zero(date.getDate())
            + this.zero(date.getHours())
            + this.zero(date.getMinutes())
            + this.zero(date.getSeconds());
    }

    zero(a: number): string {
        if (a >= 10) { return a + ""; }
        return "0" + a;
    }

}
