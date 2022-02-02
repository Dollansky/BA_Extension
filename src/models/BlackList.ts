export class BlackList {
    participantId: string;
    blacklist: Array<String>;
    updated: number;
    constructor(
        participantId: string,
        blacklist: Array<String>,
        updated: number,
    ) {
        this.participantId = participantId;
        this.blacklist =blacklist;
        this.updated = updated;
    }
}
