create table accounts
(
    id                   serial                                             not null
        constraint accounts_pkey
            primary key,
    compound_id          varchar(255)                                       not null,
    user_id              integer                                            not null,
    provider_type        varchar(255)                                       not null,
    provider_id          varchar(255)                                       not null,
    provider_account_id  varchar(255)                                       not null,
    refresh_token        text,
    access_token         text,
    access_token_expires timestamp with time zone,
    created_at           timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at           timestamp with time zone default CURRENT_TIMESTAMP not null
);

create unique index compound_id
    on accounts (compound_id);

create index provider_account_id
    on accounts (provider_account_id);

create index provider_id
    on accounts (provider_id);

create index user_id
    on accounts (user_id);

create table sessions
(
    id            serial                                             not null
        constraint sessions_pkey
            primary key,
    user_id       integer                                            not null,
    expires       timestamp with time zone                           not null,
    session_token varchar(255)                                       not null,
    access_token  varchar(255)                                       not null,
    created_at    timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at    timestamp with time zone default CURRENT_TIMESTAMP not null
);

create unique index session_token
    on sessions (session_token);

create unique index access_token
    on sessions (access_token);

create table users
(
    id             serial                                             not null
        constraint users_pkey
            primary key,
    name           varchar(255),
    email          varchar(255),
    email_verified timestamp with time zone,
    image          varchar(255),
    created_at     timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at     timestamp with time zone default CURRENT_TIMESTAMP not null,
    access_token   text
);

create unique index email
    on users (email);

create table verification_requests
(
    id         serial                                             not null
        constraint verification_requests_pkey
            primary key,
    identifier varchar(255)                                       not null,
    token      varchar(255)                                       not null,
    expires    timestamp with time zone                           not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);

create unique index token
    on verification_requests (token);

create table guilds
(
    name          varchar(100) not null,
    icon          text,
    premium       smallint     not null,
    txn_time_unix integer,
    guild_id      varchar(20)  not null
        constraint guilds_pk
            primary key,
    last_updated  timestamp default CURRENT_TIMESTAMP
);

create table users_guilds
(
    user_id  integer     not null
        constraint users_guilds_users_id_fk
            references users,
    guild_id varchar(20) not null
        constraint users_guilds_guilds_guild_id_fk
            references guilds,
    active   boolean,
    constraint users_guilds_pk
        primary key (user_id, guild_id)
);

