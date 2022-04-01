export interface Command {
    command: string;
    subcommands?: Command[];
    description?: Array<string | React.ReactFragment>;
    arguments?: Array<CommandArg>;
    example?: string;
    image?: boolean;
    isPremium?: boolean;
    isDisabled?: boolean;
}

export interface CommandArg {
    name: string;
    type: string;
    description: Array<string | React.ReactFragment>;
    values?: Array<any>;
    level: "required" | "optional";
}
