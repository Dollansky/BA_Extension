export class TimeIntervall {
    domain: string;
    blacklisted: boolean;
    workMode: boolean;
    startTime: number;
    endTime: number;
    baselineFinished: boolean;
    goal?: string;
    reason?: string;

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
    participantId: string;
    blacklisted: boolean;
    timeSpend: number;
    baselineFinished: boolean;
    mode: boolean;
    domain: string;
    started: number;
    ended: number;
    goalId?: string;
    goal?: string;
    reason?: string;

    constructor(participantId: string,
                mode: boolean,
                domain: string,
                blacklisted: boolean,
                timeSpend: number,
                baselineFinished: boolean,
                started: number,
                ended: number,
                goalId?: string,
                goal?: string,
                reason?: string
    ) {
        this.participantId = participantId;
        this.mode = mode;
        this.domain = domain;
        this.blacklisted = blacklisted;
        this.timeSpend = timeSpend;
        this.baselineFinished = baselineFinished;
        this.started = started;
        this.ended = ended;
        this.goalId = goalId;
        this.goal = goal;
        this.reason = reason;
    }
}

