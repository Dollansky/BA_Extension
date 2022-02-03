
export class Goal {
    participantId: string;
    goal: string;
    domain: string;
    setGoalTime: number;
    reason?: string;

    constructor(
        participantId: string,
        goal: string,
        reason: string,
        domain: string,
        setGoalTime: number
    ) {
        this.participantId = participantId;
        this.goal = goal;
        this.reason = reason;
        this.domain = domain;
        this.setGoalTime = setGoalTime
    }
}
