export class TimeIntervall {
    domain: string;
    goal?: string;
    blacklisted: boolean;
    workMode: boolean;
    startTime: number;
    endTime: number;
    baselineFinished: boolean;

    constructor(domain: string,
                blacklisted: boolean,
                workMode: boolean,
                startTime: number,
                endTime: number,
                baselineFinished: boolean,
                goal?: string,
    ) {

        this.domain = domain;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.workMode = workMode;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
export class TimeIntervallDto {
    participantId: number;
    blacklisted: boolean;
    timeSpend: number;
    baselineFinished: boolean;
    mode: boolean;
    goal?: string;

    constructor(participantId: number,
                mode: boolean,
                blacklisted: boolean,
                timeSpend: number,
                baselineFinished: boolean,
                goal?: string,
    ) {
        this.participantId = participantId;
        this.mode = mode
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.timeSpend = timeSpend;
        this.baselineFinished = baselineFinished;
    }
}

