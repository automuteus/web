export interface Command {
    command: string;
    subcommands?: Command[];
    /** Key in the `commands` namespace (under `command.`); may hold <settingsLink>/<statsLink> markup. */
    description?: string;
    arguments?: Array<CommandArg>;
    example?: string;
    image?: boolean;
    isPremium?: boolean;
    isDisabled?: boolean;
}

export interface CommandArg {
    name: string;
    type: string;
    /** Key in the `commands` namespace (under `command.`). */
    description: string;
    values?: Array<any>;
    level: "required" | "optional";
}
