export class BlackList {
    participantId: number;
    blacklist: Array<String>;
    updated: number;
    constructor(
        participantId: number,
        blacklist: Array<String>,
        updated: number,
    ) {
        this.participantId = participantId;
        this.blacklist =blacklist;
        this.updated = updated;
    }
}
