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
