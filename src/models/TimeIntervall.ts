export class TimeIntervall {
    domain: string;
    goal?: string;
    blacklisted: boolean;
    mode: string;
    startTime: string;
    endTime: string;

    constructor(domain: string,
                blacklisted: boolean,
                mode: string,
                startTime: string,
                endTime: string,
                goal?: string
    ) {
        this.domain = domain;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.mode = mode;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
