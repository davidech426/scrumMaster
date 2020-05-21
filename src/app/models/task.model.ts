export interface FireDate {
    value: any;
    toDate(): any;
}

export interface Task {
    name: string;
    description: string;
    projected_start_date: FireDate;
    projected_end_date: FireDate;
    status: string;
    owner_id: string;
    assignee_id: string;
    project_id: string;
}