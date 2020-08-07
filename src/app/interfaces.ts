export interface ITask {
    priority?: string;
    milestone?: string;
    status?: string;
    deadline?: Date;
    estimation?: number;
    hours_spent?: number;
    createdAt?: Date | string;
    assignee?: ITeamMember;
    labels?: ILabel[];
    body?: string;
    title?: string;
    number?: number;
    url?: string;
    id?: number;
    pullRequest?: string;
}

export interface ITeamMember {
    id: number;
    email?: string;
    login: string;
    url?: string;
    avatarUrl: string;
}

export interface ILabel {
  id: number;
  url: string;
  name: string;
  color: string;
  description: string;
  default: boolean;
}
