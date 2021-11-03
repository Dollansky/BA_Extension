export class TimeIntervall {
    domain: string;
    goal?: string;
    blacklisted: boolean;
    workMode: boolean;
    startTime: number;
    endTime: number;

    constructor(domain: string,
                blacklisted: boolean,
                workMode: boolean,
                startTime: number,
                endTime: number,
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
    goal?: string;




    constructor(participantId: number,
                blacklisted: boolean,
                timeSpend: number,
                goal?: string,
    ) {
        this.participantId = participantId;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.timeSpend = timeSpend;
    }
}
