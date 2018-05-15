import { Injectable } from "@nestjs/common";

@Injectable()
export class RandomUtil {

    private readonly chars: Array<string> = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    getRandom(n: number): string {
        let res = "";
        for (let i = 0; i < n; i++) {
            const id = Math.ceil(Math.random() * 9);
            res += this.chars[id];
        }
        return res;
    }
}
