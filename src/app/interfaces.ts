export interface ITask {
    id?: number;
    issue?: string;
    isActive?: boolean;
    priority?: string;
    milestone?: string;
    description?: string;
    status?: string;
    owner?: {
      id: number;
      name: string;
      sex: string;
      team: string;
      avatar: string;
    };
    created_by?: string;
    started_on?: Date;
    deadline?: Date;
    estimation?: number;
    hours_spent?: number;
}

export interface ITeamMember {
    id: number;
    name: string;
    sex: string;
    team: string;
    avatar: string;
}