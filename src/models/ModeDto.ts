export class ModeDto {
    participantId: number;
    mode: boolean;
    dateWhenModeEnds: number;
    duration: number;
    constructor(
        participantId: number,
        mode: boolean,
        dateWhenModeEnds: number,
        duration: number,
    ) {
        this.participantId = participantId;
        this.mode = mode;
        this.dateWhenModeEnds = dateWhenModeEnds;
        this.duration = duration;
    }
}
