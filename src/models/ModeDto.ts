export class ModeDto {
    participantId: string;
    mode: boolean;
    dateWhenModeEnds: number;
    duration: number;
    constructor(
        participantId: string,
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
