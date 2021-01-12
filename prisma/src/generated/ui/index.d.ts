
/**
 * Client
**/

import * as runtime from './runtime';

export import DMMF = runtime.DMMF

/**
 * Prisma Errors
 */
export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
export import PrismaClientValidationError = runtime.PrismaClientValidationError

/**
 * Re-export of sql-template-tag
 */
export import sql = runtime.sqltag
export import empty = runtime.empty
export import join = runtime.join
export import raw = runtime.raw
export import Sql = runtime.Sql

/**
 * Decimal.js
 */
export import Decimal = runtime.Decimal

/**
 * Prisma Client JS version: 2.14.0
 * Query Engine version: 5d491261d382a2a5ffdc71de17072b0e409f1cc1
 */
export type PrismaVersion = {
  client: string
}

export const prismaVersion: PrismaVersion 

/**
 * Utility Types
 */

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON object.
 * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
 */
export type JsonObject = {[Key in string]?: JsonValue}
 
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON array.
 */
export interface JsonArray extends Array<JsonValue> {}
 
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches any valid JSON value.
 */
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

/**
 * Same as JsonObject, but allows undefined
 */
export type InputJsonObject = {[Key in string]?: JsonValue}
 
export interface InputJsonArray extends Array<JsonValue> {}
 
export type InputJsonValue = undefined |  string | number | boolean | null | InputJsonObject | InputJsonArray
 type SelectAndInclude = {
  select: any
  include: any
}
type HasSelect = {
  select: any
}
type HasInclude = {
  include: any
}
type CheckSelect<T, S, U> = T extends SelectAndInclude
  ? 'Please either choose `select` or `include`'
  : T extends HasSelect
  ? U
  : T extends HasInclude
  ? U
  : S

/**
 * Get the type of the value, that the Promise holds.
 */
export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

/**
 * Get the return type of a function which returns a Promise.
 */
export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>


export type Enumerable<T> = T | Array<T>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export type TruthyKeys<T> = {
  [key in keyof T]: T[key] extends false | undefined | null ? never : key
}[keyof T]

export type TrueKeys<T> = TruthyKeys<Pick<T, RequiredKeys<T>>>

/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};

/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
  [key in keyof T]: key extends keyof U ? T[key] : never
} &
  K

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;


/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any>
? False
: T extends Date
? False
: T extends Buffer
? False
: T extends BigInt
? False
: T extends object
? True
: False


/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

/**
 * From ts-toolbelt
 */

export type Union = any

/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};

type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;

type Key = string | number | symbol;
type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];

export type ComputeRaw<A extends any> = A extends Function ? A : {
  [K in keyof A]: A[K];
} & {};

export type OptionalFlat<O> = {
  [K in keyof O]?: O[K];
} & {};

type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<Record<Exclude<Keys<_U>, keyof U>, never>> : never;

export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/

export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

/**
A [[Boolean]]
*/
export type Boolean = True | False

// /**
// 1
// */
export type True = 1

/**
0
*/
export type False = 0

export type Not<B extends Boolean> = {
  0: 1
  1: 0
}[B]

export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
  ? 0 // anything `never` is false
  : A1 extends A2
  ? 1
  : 0

export type Has<U extends Union, U1 extends Union> = Not<
  Extends<Exclude<U1, U>, U1>
>

export type Or<B1 extends Boolean, B2 extends Boolean> = {
  0: {
    0: 0
    1: 1
  }
  1: {
    0: 1
    1: 1
  }
}[B1][B2]

export type Keys<U extends Union> = U extends unknown ? keyof U : never



/**
 * Used by group by
 */

export type GetScalarType<T, O> = O extends object ? {
  [P in keyof T]: P extends keyof O
    ? O[P]
    : never
} : never

type FieldPaths<
  T,
  U = Omit<T, 'avg' | 'sum' | 'count' | 'min' | 'max'>
> = IsObject<T> extends True ? U : T

type GetHavingFields<T> = {
  [K in keyof T]: Or<
    Or<Extends<'OR', K>, Extends<'AND', K>>,
    Extends<'NOT', K>
  > extends True
    ? // infer is only needed to not hit TS limit
      // based on the brilliant idea of Pierre-Antoine Mills
      // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
      T[K] extends infer TK
      ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
      : never
    : {} extends FieldPaths<T[K]>
    ? never
    : K
}[keyof T]

/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

/**
 * Like `Pick`, but with an array
 */
type PickArray<T, K extends Array<keyof T>> = Pick<T, TupleToUnion<K>>





/**
 * Model Account
 */

export type Account = {
  id: number
  compoundId: string
  userId: number
  providerType: string
  providerId: string
  providerAccountId: string
  refreshToken: string | null
  accessToken: string | null
  accessTokenExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Session
 */

export type Session = {
  id: number
  userId: number
  expires: Date
  sessionToken: string
  accessToken: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model User
 */

export type User = {
  id: number
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
  accessToken: string | null
}

/**
 * Model VerificationRequest
 */

export type VerificationRequest = {
  id: number
  identifier: string
  token: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Guild
 */

export type Guild = {
  name: string
  icon: string | null
  premium: number
  txn_time_unix: number | null
  guild_id: string
  last_updated: Date | null
}

/**
 * Model UsersGuild
 */

export type UsersGuild = {
  user_id: number
  guild_id: string
  active: boolean | null
  permissions: string | null
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js (ORM replacement)
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: T);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<any>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Executes a raw query and returns the number of affected rows
   * @example
   * ```
   * // With parameters use prisma.executeRaw``, values will be escaped automatically
   * const result = await prisma.executeRaw`UPDATE User SET cool = ${true} WHERE id = ${1};`
   * // Or
   * const result = await prisma.executeRaw('UPDATE User SET cool = $1 WHERE id = $2 ;', true, 1)
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $executeRaw < T = any > (query: string | TemplateStringsArray | Prisma.Sql, ...values: any[]): Promise<number>;

  /**
   * Performs a raw query and returns the SELECT data
   * @example
   * ```
   * // With parameters use prisma.queryRaw``, values will be escaped automatically
   * const result = await prisma.queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'ema.il'};`
   * // Or
   * const result = await prisma.queryRaw('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'ema.il')
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $queryRaw < T = any > (query: string | TemplateStringsArray | Prisma.Sql, ...values: any[]): Promise<T>;

  /**
   * Execute queries in a transaction
   * @example
   * ```
   * const [george, bob, alice] = await prisma.transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   */
  $transaction: PromiseConstructor['all']

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate;

  /**
   * `prisma.verificationRequest`: Exposes CRUD operations for the **VerificationRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationRequests
    * const verificationRequests = await prisma.verificationRequest.findMany()
    * ```
    */
  get verificationRequest(): Prisma.VerificationRequestDelegate;

  /**
   * `prisma.guild`: Exposes CRUD operations for the **Guild** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guilds
    * const guilds = await prisma.guild.findMany()
    * ```
    */
  get guild(): Prisma.GuildDelegate;

  /**
   * `prisma.usersGuild`: Exposes CRUD operations for the **UsersGuild** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsersGuilds
    * const usersGuilds = await prisma.usersGuild.findMany()
    * ```
    */
  get usersGuild(): Prisma.UsersGuildDelegate;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  /**
   * Prisma Client JS version: 2.14.0
   * Query Engine version: 5d491261d382a2a5ffdc71de17072b0e409f1cc1
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}
 
  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}
 
  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

  /**
   * Same as JsonObject, but allows undefined
   */
  export type InputJsonObject = {[Key in string]?: JsonValue}
 
  export interface InputJsonArray extends Array<JsonValue> {}
 
  export type InputJsonValue = undefined |  string | number | boolean | null | InputJsonObject | InputJsonArray
   type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Buffer
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  export type Union = any

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, 'avg' | 'sum' | 'count' | 'min' | 'max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Pick<T, TupleToUnion<K>>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Account: 'Account',
    Session: 'Session',
    User: 'User',
    VerificationRequest: 'VerificationRequest',
    Guild: 'Guild',
    UsersGuild: 'UsersGuild'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined; 
  export type Datasource = {
    url?: string
  }


  /**
   * Model Account
   */


  export type AggregateAccount = {
    count: number | null
    avg: AccountAvgAggregateOutputType | null
    sum: AccountSumAggregateOutputType | null
    min: AccountMinAggregateOutputType | null
    max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    id: number
    userId: number
  }

  export type AccountSumAggregateOutputType = {
    id: number
    userId: number
  }

  export type AccountMinAggregateOutputType = {
    id: number
    compoundId: string | null
    userId: number
    providerType: string | null
    providerId: string | null
    providerAccountId: string | null
    refreshToken: string | null
    accessToken: string | null
    accessTokenExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: number
    compoundId: string | null
    userId: number
    providerType: string | null
    providerId: string | null
    providerAccountId: string | null
    refreshToken: string | null
    accessToken: string | null
    accessTokenExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    compoundId: number | null
    userId: number
    providerType: number | null
    providerId: number | null
    providerAccountId: number | null
    refreshToken: number | null
    accessToken: number | null
    accessTokenExpires: number | null
    createdAt: number | null
    updatedAt: number | null
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AccountSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    compoundId?: true
    userId?: true
    providerType?: true
    providerId?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    accessTokenExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    compoundId?: true
    userId?: true
    providerType?: true
    providerId?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    accessTokenExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    compoundId?: true
    userId?: true
    providerType?: true
    providerId?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    accessTokenExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AggregateAccountArgs = {
    /**
     * Filter which Account to aggregate.
    **/
    where?: AccountWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Accounts to fetch.
    **/
    orderBy?: Enumerable<AccountOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AggregateAccountArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetAccountAggregateScalarType<T[P]>
  }

  export type GetAccountAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof AccountAvgAggregateOutputType ? AccountAvgAggregateOutputType[P] : never
  }

    



  export type AccountSelect = {
    id?: boolean
    compoundId?: boolean
    userId?: boolean
    providerType?: boolean
    providerId?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    accessTokenExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountGetPayload<
    S extends boolean | null | undefined | AccountArgs,
    U = keyof S
      > = S extends true
        ? Account
    : S extends undefined
    ? never
    : S extends AccountArgs | FindManyAccountArgs
    ?'include' extends U
    ? Account 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof Account ?Account [P]
  : 
     never
  } 
    : Account
  : Account


  export interface AccountDelegate {
    /**
     * Find zero or one Account that matches the filter.
     * @param {FindUniqueAccountArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueAccountArgs>(
      args: Subset<T, FindUniqueAccountArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account | null>, Prisma__AccountClient<AccountGetPayload<T> | null>>

    /**
     * Find the first Account that matches the filter.
     * @param {FindFirstAccountArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstAccountArgs>(
      args?: Subset<T, FindFirstAccountArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account | null>, Prisma__AccountClient<AccountGetPayload<T> | null>>

    /**
     * Find zero or more Accounts that matches the filter.
     * @param {FindManyAccountArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FindManyAccountArgs>(
      args?: Subset<T, FindManyAccountArgs>
    ): CheckSelect<T, Promise<Array<Account>>, Promise<Array<AccountGetPayload<T>>>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
    **/
    create<T extends AccountCreateArgs>(
      args: Subset<T, AccountCreateArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
    **/
    delete<T extends AccountDeleteArgs>(
      args: Subset<T, AccountDeleteArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AccountUpdateArgs>(
      args: Subset<T, AccountUpdateArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AccountDeleteManyArgs>(
      args?: Subset<T, AccountDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AccountUpdateManyArgs>(
      args: Subset<T, AccountUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
    **/
    upsert<T extends AccountUpsertArgs>(
      args: Subset<T, AccountUpsertArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Find zero or one Account that matches the filter.
     * @param {FindUniqueAccountArgs} args - Arguments to find a Account
     * @deprecated This will be deprecated please use prisma.account.findUnique
     * @example
     * // Get one Account
     * const account = await prisma.account.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueAccountArgs>(
      args: Subset<T, FindUniqueAccountArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account | null>, Prisma__AccountClient<AccountGetPayload<T> | null>>

    /**
     * Count the number of Accounts.
     * @param {FindManyAccountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyAccountArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Account.
     * @param {AggregateAccountArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AggregateAccountArgs>(args: Subset<T, AggregateAccountArgs>): Promise<GetAccountAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AccountClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Account findUnique
   */
  export type FindUniqueAccountArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * Filter, which Account to fetch.
    **/
    where: AccountWhereUniqueInput
  }


  /**
   * Account findFirst
   */
  export type FindFirstAccountArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * Filter, which Account to fetch.
    **/
    where?: AccountWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Accounts to fetch.
    **/
    orderBy?: Enumerable<AccountOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
    **/
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of Accounts.
    **/
    distinct?: Enumerable<AccountScalarFieldEnum>
  }


  /**
   * Account findMany
   */
  export type FindManyAccountArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * Filter, which Accounts to fetch.
    **/
    where?: AccountWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Accounts to fetch.
    **/
    orderBy?: Enumerable<AccountOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
    **/
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
    **/
    skip?: number
    distinct?: Enumerable<AccountScalarFieldEnum>
  }


  /**
   * Account create
   */
  export type AccountCreateArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * The data needed to create a Account.
    **/
    data: AccountCreateInput
  }


  /**
   * Account update
   */
  export type AccountUpdateArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * The data needed to update a Account.
    **/
    data: AccountUpdateInput
    /**
     * Choose, which Account to update.
    **/
    where: AccountWhereUniqueInput
  }


  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs = {
    data: AccountUpdateManyMutationInput
    where?: AccountWhereInput
  }


  /**
   * Account upsert
   */
  export type AccountUpsertArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * The filter to search for the Account to update in case it exists.
    **/
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
    **/
    create: AccountCreateInput
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
    **/
    update: AccountUpdateInput
  }


  /**
   * Account delete
   */
  export type AccountDeleteArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
    /**
     * Filter which Account to delete.
    **/
    where: AccountWhereUniqueInput
  }


  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs = {
    where?: AccountWhereInput
  }


  /**
   * Account without action
   */
  export type AccountArgs = {
    /**
     * Select specific fields to fetch from the Account
    **/
    select?: AccountSelect | null
  }



  /**
   * Model Session
   */


  export type AggregateSession = {
    count: number | null
    avg: SessionAvgAggregateOutputType | null
    sum: SessionSumAggregateOutputType | null
    min: SessionMinAggregateOutputType | null
    max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    id: number
    userId: number
  }

  export type SessionSumAggregateOutputType = {
    id: number
    userId: number
  }

  export type SessionMinAggregateOutputType = {
    id: number
    userId: number
    expires: Date | null
    sessionToken: string | null
    accessToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: number
    userId: number
    expires: Date | null
    sessionToken: string | null
    accessToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    expires: number | null
    sessionToken: number | null
    accessToken: number | null
    createdAt: number | null
    updatedAt: number | null
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SessionSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    expires?: true
    sessionToken?: true
    accessToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    expires?: true
    sessionToken?: true
    accessToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    expires?: true
    sessionToken?: true
    accessToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AggregateSessionArgs = {
    /**
     * Filter which Session to aggregate.
    **/
    where?: SessionWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Sessions to fetch.
    **/
    orderBy?: Enumerable<SessionOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: SessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends AggregateSessionArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetSessionAggregateScalarType<T[P]>
  }

  export type GetSessionAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof SessionAvgAggregateOutputType ? SessionAvgAggregateOutputType[P] : never
  }

    



  export type SessionSelect = {
    id?: boolean
    userId?: boolean
    expires?: boolean
    sessionToken?: boolean
    accessToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionGetPayload<
    S extends boolean | null | undefined | SessionArgs,
    U = keyof S
      > = S extends true
        ? Session
    : S extends undefined
    ? never
    : S extends SessionArgs | FindManySessionArgs
    ?'include' extends U
    ? Session 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof Session ?Session [P]
  : 
     never
  } 
    : Session
  : Session


  export interface SessionDelegate {
    /**
     * Find zero or one Session that matches the filter.
     * @param {FindUniqueSessionArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueSessionArgs>(
      args: Subset<T, FindUniqueSessionArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session | null>, Prisma__SessionClient<SessionGetPayload<T> | null>>

    /**
     * Find the first Session that matches the filter.
     * @param {FindFirstSessionArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstSessionArgs>(
      args?: Subset<T, FindFirstSessionArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session | null>, Prisma__SessionClient<SessionGetPayload<T> | null>>

    /**
     * Find zero or more Sessions that matches the filter.
     * @param {FindManySessionArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FindManySessionArgs>(
      args?: Subset<T, FindManySessionArgs>
    ): CheckSelect<T, Promise<Array<Session>>, Promise<Array<SessionGetPayload<T>>>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
    **/
    create<T extends SessionCreateArgs>(
      args: Subset<T, SessionCreateArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session>, Prisma__SessionClient<SessionGetPayload<T>>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
    **/
    delete<T extends SessionDeleteArgs>(
      args: Subset<T, SessionDeleteArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session>, Prisma__SessionClient<SessionGetPayload<T>>>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SessionUpdateArgs>(
      args: Subset<T, SessionUpdateArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session>, Prisma__SessionClient<SessionGetPayload<T>>>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: Subset<T, SessionDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SessionUpdateManyArgs>(
      args: Subset<T, SessionUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
    **/
    upsert<T extends SessionUpsertArgs>(
      args: Subset<T, SessionUpsertArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session>, Prisma__SessionClient<SessionGetPayload<T>>>

    /**
     * Find zero or one Session that matches the filter.
     * @param {FindUniqueSessionArgs} args - Arguments to find a Session
     * @deprecated This will be deprecated please use prisma.session.findUnique
     * @example
     * // Get one Session
     * const session = await prisma.session.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueSessionArgs>(
      args: Subset<T, FindUniqueSessionArgs>
    ): CheckSelect<T, Prisma__SessionClient<Session | null>, Prisma__SessionClient<SessionGetPayload<T> | null>>

    /**
     * Count the number of Sessions.
     * @param {FindManySessionArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManySessionArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Session.
     * @param {AggregateSessionArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AggregateSessionArgs>(args: Subset<T, AggregateSessionArgs>): Promise<GetSessionAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SessionClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Session findUnique
   */
  export type FindUniqueSessionArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * Filter, which Session to fetch.
    **/
    where: SessionWhereUniqueInput
  }


  /**
   * Session findFirst
   */
  export type FindFirstSessionArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * Filter, which Session to fetch.
    **/
    where?: SessionWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Sessions to fetch.
    **/
    orderBy?: Enumerable<SessionOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
    **/
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of Sessions.
    **/
    distinct?: Enumerable<SessionScalarFieldEnum>
  }


  /**
   * Session findMany
   */
  export type FindManySessionArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * Filter, which Sessions to fetch.
    **/
    where?: SessionWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Sessions to fetch.
    **/
    orderBy?: Enumerable<SessionOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
    **/
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
    **/
    skip?: number
    distinct?: Enumerable<SessionScalarFieldEnum>
  }


  /**
   * Session create
   */
  export type SessionCreateArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * The data needed to create a Session.
    **/
    data: SessionCreateInput
  }


  /**
   * Session update
   */
  export type SessionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * The data needed to update a Session.
    **/
    data: SessionUpdateInput
    /**
     * Choose, which Session to update.
    **/
    where: SessionWhereUniqueInput
  }


  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs = {
    data: SessionUpdateManyMutationInput
    where?: SessionWhereInput
  }


  /**
   * Session upsert
   */
  export type SessionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * The filter to search for the Session to update in case it exists.
    **/
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
    **/
    create: SessionCreateInput
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
    **/
    update: SessionUpdateInput
  }


  /**
   * Session delete
   */
  export type SessionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
    /**
     * Filter which Session to delete.
    **/
    where: SessionWhereUniqueInput
  }


  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs = {
    where?: SessionWhereInput
  }


  /**
   * Session without action
   */
  export type SessionArgs = {
    /**
     * Select specific fields to fetch from the Session
    **/
    select?: SessionSelect | null
  }



  /**
   * Model User
   */


  export type AggregateUser = {
    count: number | null
    avg: UserAvgAggregateOutputType | null
    sum: UserSumAggregateOutputType | null
    min: UserMinAggregateOutputType | null
    max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number
  }

  export type UserSumAggregateOutputType = {
    id: number
  }

  export type UserMinAggregateOutputType = {
    id: number
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accessToken: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accessToken: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number | null
    email: number | null
    emailVerified: number | null
    image: number | null
    createdAt: number | null
    updatedAt: number | null
    accessToken: number | null
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    accessToken?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    accessToken?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    accessToken?: true
    _all?: true
  }

  export type AggregateUserArgs = {
    /**
     * Filter which User to aggregate.
    **/
    where?: UserWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Users to fetch.
    **/
    orderBy?: Enumerable<UserOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends AggregateUserArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetUserAggregateScalarType<T[P]>
  }

  export type GetUserAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof UserAvgAggregateOutputType ? UserAvgAggregateOutputType[P] : never
  }

    



  export type UserSelect = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accessToken?: boolean
    users_guilds?: boolean | FindManyUsersGuildArgs
  }

  export type UserInclude = {
    users_guilds?: boolean | FindManyUsersGuildArgs
  }

  export type UserGetPayload<
    S extends boolean | null | undefined | UserArgs,
    U = keyof S
      > = S extends true
        ? User
    : S extends undefined
    ? never
    : S extends UserArgs | FindManyUserArgs
    ?'include' extends U
    ? User  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'users_guilds'
        ? Array < UsersGuildGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof User ?User [P]
  : 
          P extends 'users_guilds'
        ? Array < UsersGuildGetPayload<S['select'][P]>>  : never
  } 
    : User
  : User


  export interface UserDelegate {
    /**
     * Find zero or one User that matches the filter.
     * @param {FindUniqueUserArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueUserArgs>(
      args: Subset<T, FindUniqueUserArgs>
    ): CheckSelect<T, Prisma__UserClient<User | null>, Prisma__UserClient<UserGetPayload<T> | null>>

    /**
     * Find the first User that matches the filter.
     * @param {FindFirstUserArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstUserArgs>(
      args?: Subset<T, FindFirstUserArgs>
    ): CheckSelect<T, Prisma__UserClient<User | null>, Prisma__UserClient<UserGetPayload<T> | null>>

    /**
     * Find zero or more Users that matches the filter.
     * @param {FindManyUserArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FindManyUserArgs>(
      args?: Subset<T, FindManyUserArgs>
    ): CheckSelect<T, Promise<Array<User>>, Promise<Array<UserGetPayload<T>>>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs>(
      args: Subset<T, UserCreateArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs>(
      args: Subset<T, UserDeleteArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs>(
      args: Subset<T, UserUpdateArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs>(
      args?: Subset<T, UserDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Users.
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs>(
      args: Subset<T, UserUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs>(
      args: Subset<T, UserUpsertArgs>
    ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>

    /**
     * Find zero or one User that matches the filter.
     * @param {FindUniqueUserArgs} args - Arguments to find a User
     * @deprecated This will be deprecated please use prisma.user.findUnique
     * @example
     * // Get one User
     * const user = await prisma.user.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueUserArgs>(
      args: Subset<T, FindUniqueUserArgs>
    ): CheckSelect<T, Prisma__UserClient<User | null>, Prisma__UserClient<UserGetPayload<T> | null>>

    /**
     * Count the number of Users.
     * @param {FindManyUserArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyUserArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a User.
     * @param {AggregateUserArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AggregateUserArgs>(args: Subset<T, AggregateUserArgs>): Promise<GetUserAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    users_guilds<T extends FindManyUsersGuildArgs = {}>(args?: Subset<T, FindManyUsersGuildArgs>): CheckSelect<T, Promise<Array<UsersGuild>>, Promise<Array<UsersGuildGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * User findUnique
   */
  export type FindUniqueUserArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User findFirst
   */
  export type FindFirstUserArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
    **/
    where?: UserWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Users to fetch.
    **/
    orderBy?: Enumerable<UserOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of Users.
    **/
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User findMany
   */
  export type FindManyUserArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * Filter, which Users to fetch.
    **/
    where?: UserWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Users to fetch.
    **/
    orderBy?: Enumerable<UserOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
    **/
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * The data needed to create a User.
    **/
    data: UserCreateInput
  }


  /**
   * User update
   */
  export type UserUpdateArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * The data needed to update a User.
    **/
    data: UserUpdateInput
    /**
     * Choose, which User to update.
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs = {
    data: UserUpdateManyMutationInput
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * The filter to search for the User to update in case it exists.
    **/
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
    **/
    create: UserCreateInput
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
    **/
    update: UserUpdateInput
  }


  /**
   * User delete
   */
  export type UserDeleteArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
    /**
     * Filter which User to delete.
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs = {
    where?: UserWhereInput
  }


  /**
   * User without action
   */
  export type UserArgs = {
    /**
     * Select specific fields to fetch from the User
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UserInclude | null
  }



  /**
   * Model VerificationRequest
   */


  export type AggregateVerificationRequest = {
    count: number | null
    avg: VerificationRequestAvgAggregateOutputType | null
    sum: VerificationRequestSumAggregateOutputType | null
    min: VerificationRequestMinAggregateOutputType | null
    max: VerificationRequestMaxAggregateOutputType | null
  }

  export type VerificationRequestAvgAggregateOutputType = {
    id: number
  }

  export type VerificationRequestSumAggregateOutputType = {
    id: number
  }

  export type VerificationRequestMinAggregateOutputType = {
    id: number
    identifier: string | null
    token: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationRequestMaxAggregateOutputType = {
    id: number
    identifier: string | null
    token: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationRequestCountAggregateOutputType = {
    id: number
    identifier: number | null
    token: number | null
    expires: number | null
    createdAt: number | null
    updatedAt: number | null
    _all: number
  }


  export type VerificationRequestAvgAggregateInputType = {
    id?: true
  }

  export type VerificationRequestSumAggregateInputType = {
    id?: true
  }

  export type VerificationRequestMinAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationRequestMaxAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationRequestCountAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AggregateVerificationRequestArgs = {
    /**
     * Filter which VerificationRequest to aggregate.
    **/
    where?: VerificationRequestWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of VerificationRequests to fetch.
    **/
    orderBy?: Enumerable<VerificationRequestOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationRequests
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: VerificationRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: VerificationRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: VerificationRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: VerificationRequestMaxAggregateInputType
  }

  export type GetVerificationRequestAggregateType<T extends AggregateVerificationRequestArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetVerificationRequestAggregateScalarType<T[P]>
  }

  export type GetVerificationRequestAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof VerificationRequestAvgAggregateOutputType ? VerificationRequestAvgAggregateOutputType[P] : never
  }

    



  export type VerificationRequestSelect = {
    id?: boolean
    identifier?: boolean
    token?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationRequestGetPayload<
    S extends boolean | null | undefined | VerificationRequestArgs,
    U = keyof S
      > = S extends true
        ? VerificationRequest
    : S extends undefined
    ? never
    : S extends VerificationRequestArgs | FindManyVerificationRequestArgs
    ?'include' extends U
    ? VerificationRequest 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof VerificationRequest ?VerificationRequest [P]
  : 
     never
  } 
    : VerificationRequest
  : VerificationRequest


  export interface VerificationRequestDelegate {
    /**
     * Find zero or one VerificationRequest that matches the filter.
     * @param {FindUniqueVerificationRequestArgs} args - Arguments to find a VerificationRequest
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueVerificationRequestArgs>(
      args: Subset<T, FindUniqueVerificationRequestArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest | null>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T> | null>>

    /**
     * Find the first VerificationRequest that matches the filter.
     * @param {FindFirstVerificationRequestArgs} args - Arguments to find a VerificationRequest
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstVerificationRequestArgs>(
      args?: Subset<T, FindFirstVerificationRequestArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest | null>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T> | null>>

    /**
     * Find zero or more VerificationRequests that matches the filter.
     * @param {FindManyVerificationRequestArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationRequests
     * const verificationRequests = await prisma.verificationRequest.findMany()
     * 
     * // Get first 10 VerificationRequests
     * const verificationRequests = await prisma.verificationRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationRequestWithIdOnly = await prisma.verificationRequest.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FindManyVerificationRequestArgs>(
      args?: Subset<T, FindManyVerificationRequestArgs>
    ): CheckSelect<T, Promise<Array<VerificationRequest>>, Promise<Array<VerificationRequestGetPayload<T>>>>

    /**
     * Create a VerificationRequest.
     * @param {VerificationRequestCreateArgs} args - Arguments to create a VerificationRequest.
     * @example
     * // Create one VerificationRequest
     * const VerificationRequest = await prisma.verificationRequest.create({
     *   data: {
     *     // ... data to create a VerificationRequest
     *   }
     * })
     * 
    **/
    create<T extends VerificationRequestCreateArgs>(
      args: Subset<T, VerificationRequestCreateArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T>>>

    /**
     * Delete a VerificationRequest.
     * @param {VerificationRequestDeleteArgs} args - Arguments to delete one VerificationRequest.
     * @example
     * // Delete one VerificationRequest
     * const VerificationRequest = await prisma.verificationRequest.delete({
     *   where: {
     *     // ... filter to delete one VerificationRequest
     *   }
     * })
     * 
    **/
    delete<T extends VerificationRequestDeleteArgs>(
      args: Subset<T, VerificationRequestDeleteArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T>>>

    /**
     * Update one VerificationRequest.
     * @param {VerificationRequestUpdateArgs} args - Arguments to update one VerificationRequest.
     * @example
     * // Update one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends VerificationRequestUpdateArgs>(
      args: Subset<T, VerificationRequestUpdateArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T>>>

    /**
     * Delete zero or more VerificationRequests.
     * @param {VerificationRequestDeleteManyArgs} args - Arguments to filter VerificationRequests to delete.
     * @example
     * // Delete a few VerificationRequests
     * const { count } = await prisma.verificationRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends VerificationRequestDeleteManyArgs>(
      args?: Subset<T, VerificationRequestDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more VerificationRequests.
     * @param {VerificationRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationRequests
     * const verificationRequest = await prisma.verificationRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends VerificationRequestUpdateManyArgs>(
      args: Subset<T, VerificationRequestUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one VerificationRequest.
     * @param {VerificationRequestUpsertArgs} args - Arguments to update or create a VerificationRequest.
     * @example
     * // Update or create a VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.upsert({
     *   create: {
     *     // ... data to create a VerificationRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationRequest we want to update
     *   }
     * })
    **/
    upsert<T extends VerificationRequestUpsertArgs>(
      args: Subset<T, VerificationRequestUpsertArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T>>>

    /**
     * Find zero or one VerificationRequest that matches the filter.
     * @param {FindUniqueVerificationRequestArgs} args - Arguments to find a VerificationRequest
     * @deprecated This will be deprecated please use prisma.verificationRequest.findUnique
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueVerificationRequestArgs>(
      args: Subset<T, FindUniqueVerificationRequestArgs>
    ): CheckSelect<T, Prisma__VerificationRequestClient<VerificationRequest | null>, Prisma__VerificationRequestClient<VerificationRequestGetPayload<T> | null>>

    /**
     * Count the number of VerificationRequests.
     * @param {FindManyVerificationRequestArgs} args - Arguments to filter VerificationRequests to count.
     * @example
     * // Count the number of VerificationRequests
     * const count = await prisma.verificationRequest.count({
     *   where: {
     *     // ... the filter for the VerificationRequests we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyVerificationRequestArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a VerificationRequest.
     * @param {AggregateVerificationRequestArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AggregateVerificationRequestArgs>(args: Subset<T, AggregateVerificationRequestArgs>): Promise<GetVerificationRequestAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__VerificationRequestClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * VerificationRequest findUnique
   */
  export type FindUniqueVerificationRequestArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * Filter, which VerificationRequest to fetch.
    **/
    where: VerificationRequestWhereUniqueInput
  }


  /**
   * VerificationRequest findFirst
   */
  export type FindFirstVerificationRequestArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * Filter, which VerificationRequest to fetch.
    **/
    where?: VerificationRequestWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of VerificationRequests to fetch.
    **/
    orderBy?: Enumerable<VerificationRequestOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationRequests.
    **/
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of VerificationRequests.
    **/
    distinct?: Enumerable<VerificationRequestScalarFieldEnum>
  }


  /**
   * VerificationRequest findMany
   */
  export type FindManyVerificationRequestArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * Filter, which VerificationRequests to fetch.
    **/
    where?: VerificationRequestWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of VerificationRequests to fetch.
    **/
    orderBy?: Enumerable<VerificationRequestOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationRequests.
    **/
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
    **/
    skip?: number
    distinct?: Enumerable<VerificationRequestScalarFieldEnum>
  }


  /**
   * VerificationRequest create
   */
  export type VerificationRequestCreateArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * The data needed to create a VerificationRequest.
    **/
    data: VerificationRequestCreateInput
  }


  /**
   * VerificationRequest update
   */
  export type VerificationRequestUpdateArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * The data needed to update a VerificationRequest.
    **/
    data: VerificationRequestUpdateInput
    /**
     * Choose, which VerificationRequest to update.
    **/
    where: VerificationRequestWhereUniqueInput
  }


  /**
   * VerificationRequest updateMany
   */
  export type VerificationRequestUpdateManyArgs = {
    data: VerificationRequestUpdateManyMutationInput
    where?: VerificationRequestWhereInput
  }


  /**
   * VerificationRequest upsert
   */
  export type VerificationRequestUpsertArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * The filter to search for the VerificationRequest to update in case it exists.
    **/
    where: VerificationRequestWhereUniqueInput
    /**
     * In case the VerificationRequest found by the `where` argument doesn't exist, create a new VerificationRequest with this data.
    **/
    create: VerificationRequestCreateInput
    /**
     * In case the VerificationRequest was found with the provided `where` argument, update it with this data.
    **/
    update: VerificationRequestUpdateInput
  }


  /**
   * VerificationRequest delete
   */
  export type VerificationRequestDeleteArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
    /**
     * Filter which VerificationRequest to delete.
    **/
    where: VerificationRequestWhereUniqueInput
  }


  /**
   * VerificationRequest deleteMany
   */
  export type VerificationRequestDeleteManyArgs = {
    where?: VerificationRequestWhereInput
  }


  /**
   * VerificationRequest without action
   */
  export type VerificationRequestArgs = {
    /**
     * Select specific fields to fetch from the VerificationRequest
    **/
    select?: VerificationRequestSelect | null
  }



  /**
   * Model Guild
   */


  export type AggregateGuild = {
    count: number | null
    avg: GuildAvgAggregateOutputType | null
    sum: GuildSumAggregateOutputType | null
    min: GuildMinAggregateOutputType | null
    max: GuildMaxAggregateOutputType | null
  }

  export type GuildAvgAggregateOutputType = {
    premium: number
    txn_time_unix: number | null
  }

  export type GuildSumAggregateOutputType = {
    premium: number
    txn_time_unix: number | null
  }

  export type GuildMinAggregateOutputType = {
    name: string | null
    icon: string | null
    premium: number
    txn_time_unix: number | null
    guild_id: string | null
    last_updated: Date | null
  }

  export type GuildMaxAggregateOutputType = {
    name: string | null
    icon: string | null
    premium: number
    txn_time_unix: number | null
    guild_id: string | null
    last_updated: Date | null
  }

  export type GuildCountAggregateOutputType = {
    name: number | null
    icon: number | null
    premium: number
    txn_time_unix: number | null
    guild_id: number | null
    last_updated: number | null
    _all: number
  }


  export type GuildAvgAggregateInputType = {
    premium?: true
    txn_time_unix?: true
  }

  export type GuildSumAggregateInputType = {
    premium?: true
    txn_time_unix?: true
  }

  export type GuildMinAggregateInputType = {
    name?: true
    icon?: true
    premium?: true
    txn_time_unix?: true
    guild_id?: true
    last_updated?: true
  }

  export type GuildMaxAggregateInputType = {
    name?: true
    icon?: true
    premium?: true
    txn_time_unix?: true
    guild_id?: true
    last_updated?: true
  }

  export type GuildCountAggregateInputType = {
    name?: true
    icon?: true
    premium?: true
    txn_time_unix?: true
    guild_id?: true
    last_updated?: true
    _all?: true
  }

  export type AggregateGuildArgs = {
    /**
     * Filter which Guild to aggregate.
    **/
    where?: GuildWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Guilds to fetch.
    **/
    orderBy?: Enumerable<GuildOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guilds
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: GuildAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: GuildSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: GuildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: GuildMaxAggregateInputType
  }

  export type GetGuildAggregateType<T extends AggregateGuildArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetGuildAggregateScalarType<T[P]>
  }

  export type GetGuildAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof GuildAvgAggregateOutputType ? GuildAvgAggregateOutputType[P] : never
  }

    



  export type GuildSelect = {
    name?: boolean
    icon?: boolean
    premium?: boolean
    txn_time_unix?: boolean
    guild_id?: boolean
    last_updated?: boolean
    users_guilds?: boolean | FindManyUsersGuildArgs
  }

  export type GuildInclude = {
    users_guilds?: boolean | FindManyUsersGuildArgs
  }

  export type GuildGetPayload<
    S extends boolean | null | undefined | GuildArgs,
    U = keyof S
      > = S extends true
        ? Guild
    : S extends undefined
    ? never
    : S extends GuildArgs | FindManyGuildArgs
    ?'include' extends U
    ? Guild  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'users_guilds'
        ? Array < UsersGuildGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof Guild ?Guild [P]
  : 
          P extends 'users_guilds'
        ? Array < UsersGuildGetPayload<S['select'][P]>>  : never
  } 
    : Guild
  : Guild


  export interface GuildDelegate {
    /**
     * Find zero or one Guild that matches the filter.
     * @param {FindUniqueGuildArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueGuildArgs>(
      args: Subset<T, FindUniqueGuildArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild | null>, Prisma__GuildClient<GuildGetPayload<T> | null>>

    /**
     * Find the first Guild that matches the filter.
     * @param {FindFirstGuildArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstGuildArgs>(
      args?: Subset<T, FindFirstGuildArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild | null>, Prisma__GuildClient<GuildGetPayload<T> | null>>

    /**
     * Find zero or more Guilds that matches the filter.
     * @param {FindManyGuildArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guilds
     * const guilds = await prisma.guild.findMany()
     * 
     * // Get first 10 Guilds
     * const guilds = await prisma.guild.findMany({ take: 10 })
     * 
     * // Only select the `name`
     * const guildWithNameOnly = await prisma.guild.findMany({ select: { name: true } })
     * 
    **/
    findMany<T extends FindManyGuildArgs>(
      args?: Subset<T, FindManyGuildArgs>
    ): CheckSelect<T, Promise<Array<Guild>>, Promise<Array<GuildGetPayload<T>>>>

    /**
     * Create a Guild.
     * @param {GuildCreateArgs} args - Arguments to create a Guild.
     * @example
     * // Create one Guild
     * const Guild = await prisma.guild.create({
     *   data: {
     *     // ... data to create a Guild
     *   }
     * })
     * 
    **/
    create<T extends GuildCreateArgs>(
      args: Subset<T, GuildCreateArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild>, Prisma__GuildClient<GuildGetPayload<T>>>

    /**
     * Delete a Guild.
     * @param {GuildDeleteArgs} args - Arguments to delete one Guild.
     * @example
     * // Delete one Guild
     * const Guild = await prisma.guild.delete({
     *   where: {
     *     // ... filter to delete one Guild
     *   }
     * })
     * 
    **/
    delete<T extends GuildDeleteArgs>(
      args: Subset<T, GuildDeleteArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild>, Prisma__GuildClient<GuildGetPayload<T>>>

    /**
     * Update one Guild.
     * @param {GuildUpdateArgs} args - Arguments to update one Guild.
     * @example
     * // Update one Guild
     * const guild = await prisma.guild.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends GuildUpdateArgs>(
      args: Subset<T, GuildUpdateArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild>, Prisma__GuildClient<GuildGetPayload<T>>>

    /**
     * Delete zero or more Guilds.
     * @param {GuildDeleteManyArgs} args - Arguments to filter Guilds to delete.
     * @example
     * // Delete a few Guilds
     * const { count } = await prisma.guild.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends GuildDeleteManyArgs>(
      args?: Subset<T, GuildDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Guilds.
     * @param {GuildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guilds
     * const guild = await prisma.guild.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends GuildUpdateManyArgs>(
      args: Subset<T, GuildUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Guild.
     * @param {GuildUpsertArgs} args - Arguments to update or create a Guild.
     * @example
     * // Update or create a Guild
     * const guild = await prisma.guild.upsert({
     *   create: {
     *     // ... data to create a Guild
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guild we want to update
     *   }
     * })
    **/
    upsert<T extends GuildUpsertArgs>(
      args: Subset<T, GuildUpsertArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild>, Prisma__GuildClient<GuildGetPayload<T>>>

    /**
     * Find zero or one Guild that matches the filter.
     * @param {FindUniqueGuildArgs} args - Arguments to find a Guild
     * @deprecated This will be deprecated please use prisma.guild.findUnique
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueGuildArgs>(
      args: Subset<T, FindUniqueGuildArgs>
    ): CheckSelect<T, Prisma__GuildClient<Guild | null>, Prisma__GuildClient<GuildGetPayload<T> | null>>

    /**
     * Count the number of Guilds.
     * @param {FindManyGuildArgs} args - Arguments to filter Guilds to count.
     * @example
     * // Count the number of Guilds
     * const count = await prisma.guild.count({
     *   where: {
     *     // ... the filter for the Guilds we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyGuildArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Guild.
     * @param {AggregateGuildArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AggregateGuildArgs>(args: Subset<T, AggregateGuildArgs>): Promise<GetGuildAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for Guild.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__GuildClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    users_guilds<T extends FindManyUsersGuildArgs = {}>(args?: Subset<T, FindManyUsersGuildArgs>): CheckSelect<T, Promise<Array<UsersGuild>>, Promise<Array<UsersGuildGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Guild findUnique
   */
  export type FindUniqueGuildArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * Filter, which Guild to fetch.
    **/
    where: GuildWhereUniqueInput
  }


  /**
   * Guild findFirst
   */
  export type FindFirstGuildArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * Filter, which Guild to fetch.
    **/
    where?: GuildWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Guilds to fetch.
    **/
    orderBy?: Enumerable<GuildOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guilds.
    **/
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of Guilds.
    **/
    distinct?: Enumerable<GuildScalarFieldEnum>
  }


  /**
   * Guild findMany
   */
  export type FindManyGuildArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * Filter, which Guilds to fetch.
    **/
    where?: GuildWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of Guilds to fetch.
    **/
    orderBy?: Enumerable<GuildOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guilds.
    **/
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
    **/
    skip?: number
    distinct?: Enumerable<GuildScalarFieldEnum>
  }


  /**
   * Guild create
   */
  export type GuildCreateArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * The data needed to create a Guild.
    **/
    data: GuildCreateInput
  }


  /**
   * Guild update
   */
  export type GuildUpdateArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * The data needed to update a Guild.
    **/
    data: GuildUpdateInput
    /**
     * Choose, which Guild to update.
    **/
    where: GuildWhereUniqueInput
  }


  /**
   * Guild updateMany
   */
  export type GuildUpdateManyArgs = {
    data: GuildUpdateManyMutationInput
    where?: GuildWhereInput
  }


  /**
   * Guild upsert
   */
  export type GuildUpsertArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * The filter to search for the Guild to update in case it exists.
    **/
    where: GuildWhereUniqueInput
    /**
     * In case the Guild found by the `where` argument doesn't exist, create a new Guild with this data.
    **/
    create: GuildCreateInput
    /**
     * In case the Guild was found with the provided `where` argument, update it with this data.
    **/
    update: GuildUpdateInput
  }


  /**
   * Guild delete
   */
  export type GuildDeleteArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
    /**
     * Filter which Guild to delete.
    **/
    where: GuildWhereUniqueInput
  }


  /**
   * Guild deleteMany
   */
  export type GuildDeleteManyArgs = {
    where?: GuildWhereInput
  }


  /**
   * Guild without action
   */
  export type GuildArgs = {
    /**
     * Select specific fields to fetch from the Guild
    **/
    select?: GuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: GuildInclude | null
  }



  /**
   * Model UsersGuild
   */


  export type AggregateUsersGuild = {
    count: number | null
    avg: UsersGuildAvgAggregateOutputType | null
    sum: UsersGuildSumAggregateOutputType | null
    min: UsersGuildMinAggregateOutputType | null
    max: UsersGuildMaxAggregateOutputType | null
  }

  export type UsersGuildAvgAggregateOutputType = {
    user_id: number
  }

  export type UsersGuildSumAggregateOutputType = {
    user_id: number
  }

  export type UsersGuildMinAggregateOutputType = {
    user_id: number
    guild_id: string | null
    active: boolean | null
    permissions: string | null
  }

  export type UsersGuildMaxAggregateOutputType = {
    user_id: number
    guild_id: string | null
    active: boolean | null
    permissions: string | null
  }

  export type UsersGuildCountAggregateOutputType = {
    user_id: number
    guild_id: number | null
    active: number | null
    permissions: number | null
    _all: number
  }


  export type UsersGuildAvgAggregateInputType = {
    user_id?: true
  }

  export type UsersGuildSumAggregateInputType = {
    user_id?: true
  }

  export type UsersGuildMinAggregateInputType = {
    user_id?: true
    guild_id?: true
    active?: true
    permissions?: true
  }

  export type UsersGuildMaxAggregateInputType = {
    user_id?: true
    guild_id?: true
    active?: true
    permissions?: true
  }

  export type UsersGuildCountAggregateInputType = {
    user_id?: true
    guild_id?: true
    active?: true
    permissions?: true
    _all?: true
  }

  export type AggregateUsersGuildArgs = {
    /**
     * Filter which UsersGuild to aggregate.
    **/
    where?: UsersGuildWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of UsersGuilds to fetch.
    **/
    orderBy?: Enumerable<UsersGuildOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: UsersGuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersGuilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersGuilds.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsersGuilds
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: UsersGuildAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: UsersGuildSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: UsersGuildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: UsersGuildMaxAggregateInputType
  }

  export type GetUsersGuildAggregateType<T extends AggregateUsersGuildArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetUsersGuildAggregateScalarType<T[P]>
  }

  export type GetUsersGuildAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof UsersGuildAvgAggregateOutputType ? UsersGuildAvgAggregateOutputType[P] : never
  }

    



  export type UsersGuildSelect = {
    user_id?: boolean
    guild_id?: boolean
    active?: boolean
    permissions?: boolean
    guilds?: boolean | GuildArgs
    users?: boolean | UserArgs
  }

  export type UsersGuildInclude = {
    guilds?: boolean | GuildArgs
    users?: boolean | UserArgs
  }

  export type UsersGuildGetPayload<
    S extends boolean | null | undefined | UsersGuildArgs,
    U = keyof S
      > = S extends true
        ? UsersGuild
    : S extends undefined
    ? never
    : S extends UsersGuildArgs | FindManyUsersGuildArgs
    ?'include' extends U
    ? UsersGuild  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'guilds'
        ? GuildGetPayload<S['include'][P]> :
        P extends 'users'
        ? UserGetPayload<S['include'][P]> : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof UsersGuild ?UsersGuild [P]
  : 
          P extends 'guilds'
        ? GuildGetPayload<S['select'][P]> :
        P extends 'users'
        ? UserGetPayload<S['select'][P]> : never
  } 
    : UsersGuild
  : UsersGuild


  export interface UsersGuildDelegate {
    /**
     * Find zero or one UsersGuild that matches the filter.
     * @param {FindUniqueUsersGuildArgs} args - Arguments to find a UsersGuild
     * @example
     * // Get one UsersGuild
     * const usersGuild = await prisma.usersGuild.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueUsersGuildArgs>(
      args: Subset<T, FindUniqueUsersGuildArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild | null>, Prisma__UsersGuildClient<UsersGuildGetPayload<T> | null>>

    /**
     * Find the first UsersGuild that matches the filter.
     * @param {FindFirstUsersGuildArgs} args - Arguments to find a UsersGuild
     * @example
     * // Get one UsersGuild
     * const usersGuild = await prisma.usersGuild.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstUsersGuildArgs>(
      args?: Subset<T, FindFirstUsersGuildArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild | null>, Prisma__UsersGuildClient<UsersGuildGetPayload<T> | null>>

    /**
     * Find zero or more UsersGuilds that matches the filter.
     * @param {FindManyUsersGuildArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsersGuilds
     * const usersGuilds = await prisma.usersGuild.findMany()
     * 
     * // Get first 10 UsersGuilds
     * const usersGuilds = await prisma.usersGuild.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const usersGuildWithUser_idOnly = await prisma.usersGuild.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends FindManyUsersGuildArgs>(
      args?: Subset<T, FindManyUsersGuildArgs>
    ): CheckSelect<T, Promise<Array<UsersGuild>>, Promise<Array<UsersGuildGetPayload<T>>>>

    /**
     * Create a UsersGuild.
     * @param {UsersGuildCreateArgs} args - Arguments to create a UsersGuild.
     * @example
     * // Create one UsersGuild
     * const UsersGuild = await prisma.usersGuild.create({
     *   data: {
     *     // ... data to create a UsersGuild
     *   }
     * })
     * 
    **/
    create<T extends UsersGuildCreateArgs>(
      args: Subset<T, UsersGuildCreateArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild>, Prisma__UsersGuildClient<UsersGuildGetPayload<T>>>

    /**
     * Delete a UsersGuild.
     * @param {UsersGuildDeleteArgs} args - Arguments to delete one UsersGuild.
     * @example
     * // Delete one UsersGuild
     * const UsersGuild = await prisma.usersGuild.delete({
     *   where: {
     *     // ... filter to delete one UsersGuild
     *   }
     * })
     * 
    **/
    delete<T extends UsersGuildDeleteArgs>(
      args: Subset<T, UsersGuildDeleteArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild>, Prisma__UsersGuildClient<UsersGuildGetPayload<T>>>

    /**
     * Update one UsersGuild.
     * @param {UsersGuildUpdateArgs} args - Arguments to update one UsersGuild.
     * @example
     * // Update one UsersGuild
     * const usersGuild = await prisma.usersGuild.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UsersGuildUpdateArgs>(
      args: Subset<T, UsersGuildUpdateArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild>, Prisma__UsersGuildClient<UsersGuildGetPayload<T>>>

    /**
     * Delete zero or more UsersGuilds.
     * @param {UsersGuildDeleteManyArgs} args - Arguments to filter UsersGuilds to delete.
     * @example
     * // Delete a few UsersGuilds
     * const { count } = await prisma.usersGuild.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UsersGuildDeleteManyArgs>(
      args?: Subset<T, UsersGuildDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more UsersGuilds.
     * @param {UsersGuildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsersGuilds
     * const usersGuild = await prisma.usersGuild.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UsersGuildUpdateManyArgs>(
      args: Subset<T, UsersGuildUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one UsersGuild.
     * @param {UsersGuildUpsertArgs} args - Arguments to update or create a UsersGuild.
     * @example
     * // Update or create a UsersGuild
     * const usersGuild = await prisma.usersGuild.upsert({
     *   create: {
     *     // ... data to create a UsersGuild
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsersGuild we want to update
     *   }
     * })
    **/
    upsert<T extends UsersGuildUpsertArgs>(
      args: Subset<T, UsersGuildUpsertArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild>, Prisma__UsersGuildClient<UsersGuildGetPayload<T>>>

    /**
     * Find zero or one UsersGuild that matches the filter.
     * @param {FindUniqueUsersGuildArgs} args - Arguments to find a UsersGuild
     * @deprecated This will be deprecated please use prisma.usersGuild.findUnique
     * @example
     * // Get one UsersGuild
     * const usersGuild = await prisma.usersGuild.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueUsersGuildArgs>(
      args: Subset<T, FindUniqueUsersGuildArgs>
    ): CheckSelect<T, Prisma__UsersGuildClient<UsersGuild | null>, Prisma__UsersGuildClient<UsersGuildGetPayload<T> | null>>

    /**
     * Count the number of UsersGuilds.
     * @param {FindManyUsersGuildArgs} args - Arguments to filter UsersGuilds to count.
     * @example
     * // Count the number of UsersGuilds
     * const count = await prisma.usersGuild.count({
     *   where: {
     *     // ... the filter for the UsersGuilds we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyUsersGuildArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a UsersGuild.
     * @param {AggregateUsersGuildArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AggregateUsersGuildArgs>(args: Subset<T, AggregateUsersGuildArgs>): Promise<GetUsersGuildAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for UsersGuild.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UsersGuildClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    guilds<T extends GuildArgs = {}>(args?: Subset<T, GuildArgs>): CheckSelect<T, Prisma__GuildClient<Guild | null>, Prisma__GuildClient<GuildGetPayload<T> | null>>;

    users<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null>, Prisma__UserClient<UserGetPayload<T> | null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * UsersGuild findUnique
   */
  export type FindUniqueUsersGuildArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * Filter, which UsersGuild to fetch.
    **/
    where: UsersGuildWhereUniqueInput
  }


  /**
   * UsersGuild findFirst
   */
  export type FindFirstUsersGuildArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * Filter, which UsersGuild to fetch.
    **/
    where?: UsersGuildWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of UsersGuilds to fetch.
    **/
    orderBy?: Enumerable<UsersGuildOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsersGuilds.
    **/
    cursor?: UsersGuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersGuilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersGuilds.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of UsersGuilds.
    **/
    distinct?: Enumerable<UsersGuildScalarFieldEnum>
  }


  /**
   * UsersGuild findMany
   */
  export type FindManyUsersGuildArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * Filter, which UsersGuilds to fetch.
    **/
    where?: UsersGuildWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of UsersGuilds to fetch.
    **/
    orderBy?: Enumerable<UsersGuildOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsersGuilds.
    **/
    cursor?: UsersGuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersGuilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersGuilds.
    **/
    skip?: number
    distinct?: Enumerable<UsersGuildScalarFieldEnum>
  }


  /**
   * UsersGuild create
   */
  export type UsersGuildCreateArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * The data needed to create a UsersGuild.
    **/
    data: UsersGuildCreateInput
  }


  /**
   * UsersGuild update
   */
  export type UsersGuildUpdateArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * The data needed to update a UsersGuild.
    **/
    data: UsersGuildUpdateInput
    /**
     * Choose, which UsersGuild to update.
    **/
    where: UsersGuildWhereUniqueInput
  }


  /**
   * UsersGuild updateMany
   */
  export type UsersGuildUpdateManyArgs = {
    data: UsersGuildUpdateManyMutationInput
    where?: UsersGuildWhereInput
  }


  /**
   * UsersGuild upsert
   */
  export type UsersGuildUpsertArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * The filter to search for the UsersGuild to update in case it exists.
    **/
    where: UsersGuildWhereUniqueInput
    /**
     * In case the UsersGuild found by the `where` argument doesn't exist, create a new UsersGuild with this data.
    **/
    create: UsersGuildCreateInput
    /**
     * In case the UsersGuild was found with the provided `where` argument, update it with this data.
    **/
    update: UsersGuildUpdateInput
  }


  /**
   * UsersGuild delete
   */
  export type UsersGuildDeleteArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
    /**
     * Filter which UsersGuild to delete.
    **/
    where: UsersGuildWhereUniqueInput
  }


  /**
   * UsersGuild deleteMany
   */
  export type UsersGuildDeleteManyArgs = {
    where?: UsersGuildWhereInput
  }


  /**
   * UsersGuild without action
   */
  export type UsersGuildArgs = {
    /**
     * Select specific fields to fetch from the UsersGuild
    **/
    select?: UsersGuildSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: UsersGuildInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const AccountScalarFieldEnum: {
    id: 'id',
    compoundId: 'compoundId',
    userId: 'userId',
    providerType: 'providerType',
    providerId: 'providerId',
    providerAccountId: 'providerAccountId',
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
    accessTokenExpires: 'accessTokenExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    expires: 'expires',
    sessionToken: 'sessionToken',
    accessToken: 'accessToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    accessToken: 'accessToken'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VerificationRequestScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    token: 'token',
    expires: 'expires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationRequestScalarFieldEnum = (typeof VerificationRequestScalarFieldEnum)[keyof typeof VerificationRequestScalarFieldEnum]


  export const GuildScalarFieldEnum: {
    name: 'name',
    icon: 'icon',
    premium: 'premium',
    txn_time_unix: 'txn_time_unix',
    guild_id: 'guild_id',
    last_updated: 'last_updated'
  };

  export type GuildScalarFieldEnum = (typeof GuildScalarFieldEnum)[keyof typeof GuildScalarFieldEnum]


  export const UsersGuildScalarFieldEnum: {
    user_id: 'user_id',
    guild_id: 'guild_id',
    active: 'active',
    permissions: 'permissions'
  };

  export type UsersGuildScalarFieldEnum = (typeof UsersGuildScalarFieldEnum)[keyof typeof UsersGuildScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: Enumerable<AccountWhereInput>
    OR?: Enumerable<AccountWhereInput>
    NOT?: Enumerable<AccountWhereInput>
    id?: IntFilter | number
    compoundId?: StringFilter | string
    userId?: IntFilter | number
    providerType?: StringFilter | string
    providerId?: StringFilter | string
    providerAccountId?: StringFilter | string
    refreshToken?: StringNullableFilter | string | null
    accessToken?: StringNullableFilter | string | null
    accessTokenExpires?: DateTimeNullableFilter | Date | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type AccountOrderByInput = {
    id?: SortOrder
    compoundId?: SortOrder
    userId?: SortOrder
    providerType?: SortOrder
    providerId?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    accessTokenExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountWhereUniqueInput = {
    id?: number
    compoundId?: string
  }

  export type SessionWhereInput = {
    AND?: Enumerable<SessionWhereInput>
    OR?: Enumerable<SessionWhereInput>
    NOT?: Enumerable<SessionWhereInput>
    id?: IntFilter | number
    userId?: IntFilter | number
    expires?: DateTimeFilter | Date | string
    sessionToken?: StringFilter | string
    accessToken?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type SessionOrderByInput = {
    id?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    sessionToken?: SortOrder
    accessToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionWhereUniqueInput = {
    id?: number
    sessionToken?: string
    accessToken?: string
  }

  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    id?: IntFilter | number
    name?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    emailVerified?: DateTimeNullableFilter | Date | string | null
    image?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    accessToken?: StringNullableFilter | string | null
    users_guilds?: UsersGuildListRelationFilter
  }

  export type UserOrderByInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accessToken?: SortOrder
  }

  export type UserWhereUniqueInput = {
    id?: number
    email?: string
  }

  export type VerificationRequestWhereInput = {
    AND?: Enumerable<VerificationRequestWhereInput>
    OR?: Enumerable<VerificationRequestWhereInput>
    NOT?: Enumerable<VerificationRequestWhereInput>
    id?: IntFilter | number
    identifier?: StringFilter | string
    token?: StringFilter | string
    expires?: DateTimeFilter | Date | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type VerificationRequestOrderByInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationRequestWhereUniqueInput = {
    id?: number
    token?: string
  }

  export type GuildWhereInput = {
    AND?: Enumerable<GuildWhereInput>
    OR?: Enumerable<GuildWhereInput>
    NOT?: Enumerable<GuildWhereInput>
    name?: StringFilter | string
    icon?: StringNullableFilter | string | null
    premium?: IntFilter | number
    txn_time_unix?: IntNullableFilter | number | null
    guild_id?: StringFilter | string
    last_updated?: DateTimeNullableFilter | Date | string | null
    users_guilds?: UsersGuildListRelationFilter
  }

  export type GuildOrderByInput = {
    name?: SortOrder
    icon?: SortOrder
    premium?: SortOrder
    txn_time_unix?: SortOrder
    guild_id?: SortOrder
    last_updated?: SortOrder
  }

  export type GuildWhereUniqueInput = {
    guild_id?: string
  }

  export type UsersGuildWhereInput = {
    AND?: Enumerable<UsersGuildWhereInput>
    OR?: Enumerable<UsersGuildWhereInput>
    NOT?: Enumerable<UsersGuildWhereInput>
    user_id?: IntFilter | number
    guild_id?: StringFilter | string
    active?: BoolNullableFilter | boolean | null
    permissions?: StringNullableFilter | string | null
    guilds?: XOR<GuildWhereInput, GuildRelationFilter>
    users?: XOR<UserWhereInput, UserRelationFilter>
  }

  export type UsersGuildOrderByInput = {
    user_id?: SortOrder
    guild_id?: SortOrder
    active?: SortOrder
    permissions?: SortOrder
  }

  export type UsersGuildWhereUniqueInput = {
    user_id_guild_id?: UsersGuildUser_idGuild_idCompoundUniqueInput
  }

  export type AccountCreateInput = {
    compoundId: string
    userId: number
    providerType: string
    providerId: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    accessTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    compoundId?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    providerType?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUpdateManyMutationInput = {
    compoundId?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    providerType?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    userId: number
    expires: Date | string
    sessionToken: string
    accessToken: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateManyMutationInput = {
    userId?: IntFieldUpdateOperationsInput | number
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accessToken?: string | null
    users_guilds?: UsersGuildCreateManyWithoutUsersInput
  }

  export type UserUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    users_guilds?: UsersGuildUpdateManyWithoutUsersInput
  }

  export type UserUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VerificationRequestCreateInput = {
    identifier: string
    token: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationRequestUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationRequestUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildCreateInput = {
    name: string
    icon?: string | null
    premium: number
    txn_time_unix?: number | null
    guild_id: string
    last_updated?: Date | string | null
    users_guilds?: UsersGuildCreateManyWithoutGuildsInput
  }

  export type GuildUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: IntFieldUpdateOperationsInput | number
    txn_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
    guild_id?: StringFieldUpdateOperationsInput | string
    last_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users_guilds?: UsersGuildUpdateManyWithoutGuildsInput
  }

  export type GuildUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: IntFieldUpdateOperationsInput | number
    txn_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
    guild_id?: StringFieldUpdateOperationsInput | string
    last_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UsersGuildCreateInput = {
    active?: boolean | null
    permissions?: string | null
    guilds: GuildCreateOneWithoutUsers_guildsInput
    users: UserCreateOneWithoutUsers_guildsInput
  }

  export type UsersGuildUpdateInput = {
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    guilds?: GuildUpdateOneRequiredWithoutUsers_guildsInput
    users?: UserUpdateOneRequiredWithoutUsers_guildsInput
  }

  export type UsersGuildUpdateManyMutationInput = {
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type UsersGuildListRelationFilter = {
    every?: UsersGuildWhereInput
    some?: UsersGuildWhereInput
    none?: UsersGuildWhereInput
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type BoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type GuildRelationFilter = {
    is?: GuildWhereInput
    isNot?: GuildWhereInput
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UsersGuildUser_idGuild_idCompoundUniqueInput = {
    user_id: number
    guild_id: string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UsersGuildCreateManyWithoutUsersInput = {
    create?: Enumerable<UsersGuildCreateWithoutUsersInput>
    connect?: Enumerable<UsersGuildWhereUniqueInput>
    connectOrCreate?: Enumerable<UsersGuildCreateOrConnectWithoutusersInput>
  }

  export type UsersGuildUpdateManyWithoutUsersInput = {
    create?: Enumerable<UsersGuildCreateWithoutUsersInput>
    connect?: Enumerable<UsersGuildWhereUniqueInput>
    set?: Enumerable<UsersGuildWhereUniqueInput>
    disconnect?: Enumerable<UsersGuildWhereUniqueInput>
    delete?: Enumerable<UsersGuildWhereUniqueInput>
    update?: Enumerable<UsersGuildUpdateWithWhereUniqueWithoutUsersInput>
    updateMany?: Enumerable<UsersGuildUpdateManyWithWhereWithoutUsersInput>
    deleteMany?: Enumerable<UsersGuildScalarWhereInput>
    upsert?: Enumerable<UsersGuildUpsertWithWhereUniqueWithoutUsersInput>
    connectOrCreate?: Enumerable<UsersGuildCreateOrConnectWithoutusersInput>
  }

  export type UsersGuildCreateManyWithoutGuildsInput = {
    create?: Enumerable<UsersGuildCreateWithoutGuildsInput>
    connect?: Enumerable<UsersGuildWhereUniqueInput>
    connectOrCreate?: Enumerable<UsersGuildCreateOrConnectWithoutguildsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsersGuildUpdateManyWithoutGuildsInput = {
    create?: Enumerable<UsersGuildCreateWithoutGuildsInput>
    connect?: Enumerable<UsersGuildWhereUniqueInput>
    set?: Enumerable<UsersGuildWhereUniqueInput>
    disconnect?: Enumerable<UsersGuildWhereUniqueInput>
    delete?: Enumerable<UsersGuildWhereUniqueInput>
    update?: Enumerable<UsersGuildUpdateWithWhereUniqueWithoutGuildsInput>
    updateMany?: Enumerable<UsersGuildUpdateManyWithWhereWithoutGuildsInput>
    deleteMany?: Enumerable<UsersGuildScalarWhereInput>
    upsert?: Enumerable<UsersGuildUpsertWithWhereUniqueWithoutGuildsInput>
    connectOrCreate?: Enumerable<UsersGuildCreateOrConnectWithoutguildsInput>
  }

  export type GuildCreateOneWithoutUsers_guildsInput = {
    create?: GuildCreateWithoutUsers_guildsInput
    connect?: GuildWhereUniqueInput
    connectOrCreate?: GuildCreateOrConnectWithoutusers_guildsInput
  }

  export type UserCreateOneWithoutUsers_guildsInput = {
    create?: UserCreateWithoutUsers_guildsInput
    connect?: UserWhereUniqueInput
    connectOrCreate?: UserCreateOrConnectWithoutusers_guildsInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type GuildUpdateOneRequiredWithoutUsers_guildsInput = {
    create?: GuildCreateWithoutUsers_guildsInput
    connect?: GuildWhereUniqueInput
    update?: GuildUpdateWithoutUsers_guildsInput
    upsert?: GuildUpsertWithoutUsers_guildsInput
    connectOrCreate?: GuildCreateOrConnectWithoutusers_guildsInput
  }

  export type UserUpdateOneRequiredWithoutUsers_guildsInput = {
    create?: UserCreateWithoutUsers_guildsInput
    connect?: UserWhereUniqueInput
    update?: UserUpdateWithoutUsers_guildsInput
    upsert?: UserUpsertWithoutUsers_guildsInput
    connectOrCreate?: UserCreateOrConnectWithoutusers_guildsInput
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedBoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type UsersGuildCreateWithoutUsersInput = {
    active?: boolean | null
    permissions?: string | null
    guilds: GuildCreateOneWithoutUsers_guildsInput
  }

  export type UsersGuildCreateOrConnectWithoutusersInput = {
    where: UsersGuildWhereUniqueInput
    create: UsersGuildCreateWithoutUsersInput
  }

  export type UsersGuildUpdateWithWhereUniqueWithoutUsersInput = {
    where: UsersGuildWhereUniqueInput
    data: UsersGuildUpdateWithoutUsersInput
  }

  export type UsersGuildUpdateManyWithWhereWithoutUsersInput = {
    where: UsersGuildScalarWhereInput
    data: UsersGuildUpdateManyMutationInput
  }

  export type UsersGuildScalarWhereInput = {
    AND?: Enumerable<UsersGuildScalarWhereInput>
    OR?: Enumerable<UsersGuildScalarWhereInput>
    NOT?: Enumerable<UsersGuildScalarWhereInput>
    user_id?: IntFilter | number
    guild_id?: StringFilter | string
    active?: BoolNullableFilter | boolean | null
    permissions?: StringNullableFilter | string | null
  }

  export type UsersGuildUpsertWithWhereUniqueWithoutUsersInput = {
    where: UsersGuildWhereUniqueInput
    update: UsersGuildUpdateWithoutUsersInput
    create: UsersGuildCreateWithoutUsersInput
  }

  export type UsersGuildCreateWithoutGuildsInput = {
    active?: boolean | null
    permissions?: string | null
    users: UserCreateOneWithoutUsers_guildsInput
  }

  export type UsersGuildCreateOrConnectWithoutguildsInput = {
    where: UsersGuildWhereUniqueInput
    create: UsersGuildCreateWithoutGuildsInput
  }

  export type UsersGuildUpdateWithWhereUniqueWithoutGuildsInput = {
    where: UsersGuildWhereUniqueInput
    data: UsersGuildUpdateWithoutGuildsInput
  }

  export type UsersGuildUpdateManyWithWhereWithoutGuildsInput = {
    where: UsersGuildScalarWhereInput
    data: UsersGuildUpdateManyMutationInput
  }

  export type UsersGuildUpsertWithWhereUniqueWithoutGuildsInput = {
    where: UsersGuildWhereUniqueInput
    update: UsersGuildUpdateWithoutGuildsInput
    create: UsersGuildCreateWithoutGuildsInput
  }

  export type GuildCreateWithoutUsers_guildsInput = {
    name: string
    icon?: string | null
    premium: number
    txn_time_unix?: number | null
    guild_id: string
    last_updated?: Date | string | null
  }

  export type GuildCreateOrConnectWithoutusers_guildsInput = {
    where: GuildWhereUniqueInput
    create: GuildCreateWithoutUsers_guildsInput
  }

  export type UserCreateWithoutUsers_guildsInput = {
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accessToken?: string | null
  }

  export type UserCreateOrConnectWithoutusers_guildsInput = {
    where: UserWhereUniqueInput
    create: UserCreateWithoutUsers_guildsInput
  }

  export type GuildUpdateWithoutUsers_guildsInput = {
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    premium?: IntFieldUpdateOperationsInput | number
    txn_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
    guild_id?: StringFieldUpdateOperationsInput | string
    last_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuildUpsertWithoutUsers_guildsInput = {
    update: GuildUpdateWithoutUsers_guildsInput
    create: GuildCreateWithoutUsers_guildsInput
  }

  export type UserUpdateWithoutUsers_guildsInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpsertWithoutUsers_guildsInput = {
    update: UserUpdateWithoutUsers_guildsInput
    create: UserCreateWithoutUsers_guildsInput
  }

  export type UsersGuildUpdateWithoutUsersInput = {
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    guilds?: GuildUpdateOneRequiredWithoutUsers_guildsInput
  }

  export type UsersGuildUpdateWithoutGuildsInput = {
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUpdateOneRequiredWithoutUsers_guildsInput
  }



  /**
   * Batch Payload for updateMany & deleteMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}

/*
* Exports for compatibility introduced in 2.12.0
* Please import from the Prisma namespace instead
*/

/**
 * @deprecated Renamed to `Prisma.AccountScalarFieldEnum`
 */
export type AccountScalarFieldEnum = Prisma.AccountScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.SessionScalarFieldEnum`
 */
export type SessionScalarFieldEnum = Prisma.SessionScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.UserScalarFieldEnum`
 */
export type UserScalarFieldEnum = Prisma.UserScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.VerificationRequestScalarFieldEnum`
 */
export type VerificationRequestScalarFieldEnum = Prisma.VerificationRequestScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.GuildScalarFieldEnum`
 */
export type GuildScalarFieldEnum = Prisma.GuildScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.UsersGuildScalarFieldEnum`
 */
export type UsersGuildScalarFieldEnum = Prisma.UsersGuildScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.SortOrder`
 */
export type SortOrder = Prisma.SortOrder

/**
 * @deprecated Renamed to `Prisma.QueryMode`
 */
export type QueryMode = Prisma.QueryMode

/**
 * @deprecated Renamed to `Prisma.ModelName`
 */
export type ModelName = Prisma.ModelName

/**
 * @deprecated Renamed to `Prisma.AggregateAccount`
 */
export type AggregateAccount = Prisma.AggregateAccount

/**
 * @deprecated Renamed to `Prisma.AccountAvgAggregateOutputType`
 */
export type AccountAvgAggregateOutputType = Prisma.AccountAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AccountSumAggregateOutputType`
 */
export type AccountSumAggregateOutputType = Prisma.AccountSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AccountMinAggregateOutputType`
 */
export type AccountMinAggregateOutputType = Prisma.AccountMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AccountMaxAggregateOutputType`
 */
export type AccountMaxAggregateOutputType = Prisma.AccountMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AccountCountAggregateOutputType`
 */
export type AccountCountAggregateOutputType = Prisma.AccountCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateAccountArgs`
 */
export type AggregateAccountArgs = Prisma.AggregateAccountArgs

/**
 * @deprecated Renamed to `Prisma.AccountAvgAggregateInputType`
 */
export type AccountAvgAggregateInputType = Prisma.AccountAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.AccountSumAggregateInputType`
 */
export type AccountSumAggregateInputType = Prisma.AccountSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.AccountMinAggregateInputType`
 */
export type AccountMinAggregateInputType = Prisma.AccountMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.AccountMaxAggregateInputType`
 */
export type AccountMaxAggregateInputType = Prisma.AccountMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.AccountCountAggregateInputType`
 */
export type AccountCountAggregateInputType = Prisma.AccountCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.AccountSelect`
 */
export type AccountSelect = Prisma.AccountSelect

/**
 * @deprecated Renamed to `Prisma.FindUniqueAccountArgs`
 */
export type FindUniqueAccountArgs = Prisma.FindUniqueAccountArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstAccountArgs`
 */
export type FindFirstAccountArgs = Prisma.FindFirstAccountArgs

/**
 * @deprecated Renamed to `Prisma.FindManyAccountArgs`
 */
export type FindManyAccountArgs = Prisma.FindManyAccountArgs

/**
 * @deprecated Renamed to `Prisma.AccountCreateArgs`
 */
export type AccountCreateArgs = Prisma.AccountCreateArgs

/**
 * @deprecated Renamed to `Prisma.AccountUpdateArgs`
 */
export type AccountUpdateArgs = Prisma.AccountUpdateArgs

/**
 * @deprecated Renamed to `Prisma.AccountUpdateManyArgs`
 */
export type AccountUpdateManyArgs = Prisma.AccountUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.AccountUpsertArgs`
 */
export type AccountUpsertArgs = Prisma.AccountUpsertArgs

/**
 * @deprecated Renamed to `Prisma.AccountDeleteArgs`
 */
export type AccountDeleteArgs = Prisma.AccountDeleteArgs

/**
 * @deprecated Renamed to `Prisma.AccountDeleteManyArgs`
 */
export type AccountDeleteManyArgs = Prisma.AccountDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateSession`
 */
export type AggregateSession = Prisma.AggregateSession

/**
 * @deprecated Renamed to `Prisma.SessionAvgAggregateOutputType`
 */
export type SessionAvgAggregateOutputType = Prisma.SessionAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.SessionSumAggregateOutputType`
 */
export type SessionSumAggregateOutputType = Prisma.SessionSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.SessionMinAggregateOutputType`
 */
export type SessionMinAggregateOutputType = Prisma.SessionMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.SessionMaxAggregateOutputType`
 */
export type SessionMaxAggregateOutputType = Prisma.SessionMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.SessionCountAggregateOutputType`
 */
export type SessionCountAggregateOutputType = Prisma.SessionCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateSessionArgs`
 */
export type AggregateSessionArgs = Prisma.AggregateSessionArgs

/**
 * @deprecated Renamed to `Prisma.SessionAvgAggregateInputType`
 */
export type SessionAvgAggregateInputType = Prisma.SessionAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.SessionSumAggregateInputType`
 */
export type SessionSumAggregateInputType = Prisma.SessionSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.SessionMinAggregateInputType`
 */
export type SessionMinAggregateInputType = Prisma.SessionMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.SessionMaxAggregateInputType`
 */
export type SessionMaxAggregateInputType = Prisma.SessionMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.SessionCountAggregateInputType`
 */
export type SessionCountAggregateInputType = Prisma.SessionCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.SessionSelect`
 */
export type SessionSelect = Prisma.SessionSelect

/**
 * @deprecated Renamed to `Prisma.FindUniqueSessionArgs`
 */
export type FindUniqueSessionArgs = Prisma.FindUniqueSessionArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstSessionArgs`
 */
export type FindFirstSessionArgs = Prisma.FindFirstSessionArgs

/**
 * @deprecated Renamed to `Prisma.FindManySessionArgs`
 */
export type FindManySessionArgs = Prisma.FindManySessionArgs

/**
 * @deprecated Renamed to `Prisma.SessionCreateArgs`
 */
export type SessionCreateArgs = Prisma.SessionCreateArgs

/**
 * @deprecated Renamed to `Prisma.SessionUpdateArgs`
 */
export type SessionUpdateArgs = Prisma.SessionUpdateArgs

/**
 * @deprecated Renamed to `Prisma.SessionUpdateManyArgs`
 */
export type SessionUpdateManyArgs = Prisma.SessionUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.SessionUpsertArgs`
 */
export type SessionUpsertArgs = Prisma.SessionUpsertArgs

/**
 * @deprecated Renamed to `Prisma.SessionDeleteArgs`
 */
export type SessionDeleteArgs = Prisma.SessionDeleteArgs

/**
 * @deprecated Renamed to `Prisma.SessionDeleteManyArgs`
 */
export type SessionDeleteManyArgs = Prisma.SessionDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateUser`
 */
export type AggregateUser = Prisma.AggregateUser

/**
 * @deprecated Renamed to `Prisma.UserAvgAggregateOutputType`
 */
export type UserAvgAggregateOutputType = Prisma.UserAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UserSumAggregateOutputType`
 */
export type UserSumAggregateOutputType = Prisma.UserSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UserMinAggregateOutputType`
 */
export type UserMinAggregateOutputType = Prisma.UserMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UserMaxAggregateOutputType`
 */
export type UserMaxAggregateOutputType = Prisma.UserMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UserCountAggregateOutputType`
 */
export type UserCountAggregateOutputType = Prisma.UserCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateUserArgs`
 */
export type AggregateUserArgs = Prisma.AggregateUserArgs

/**
 * @deprecated Renamed to `Prisma.UserAvgAggregateInputType`
 */
export type UserAvgAggregateInputType = Prisma.UserAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UserSumAggregateInputType`
 */
export type UserSumAggregateInputType = Prisma.UserSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UserMinAggregateInputType`
 */
export type UserMinAggregateInputType = Prisma.UserMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UserMaxAggregateInputType`
 */
export type UserMaxAggregateInputType = Prisma.UserMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UserCountAggregateInputType`
 */
export type UserCountAggregateInputType = Prisma.UserCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UserSelect`
 */
export type UserSelect = Prisma.UserSelect

/**
 * @deprecated Renamed to `Prisma.UserInclude`
 */
export type UserInclude = Prisma.UserInclude

/**
 * @deprecated Renamed to `Prisma.FindUniqueUserArgs`
 */
export type FindUniqueUserArgs = Prisma.FindUniqueUserArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstUserArgs`
 */
export type FindFirstUserArgs = Prisma.FindFirstUserArgs

/**
 * @deprecated Renamed to `Prisma.FindManyUserArgs`
 */
export type FindManyUserArgs = Prisma.FindManyUserArgs

/**
 * @deprecated Renamed to `Prisma.UserCreateArgs`
 */
export type UserCreateArgs = Prisma.UserCreateArgs

/**
 * @deprecated Renamed to `Prisma.UserUpdateArgs`
 */
export type UserUpdateArgs = Prisma.UserUpdateArgs

/**
 * @deprecated Renamed to `Prisma.UserUpdateManyArgs`
 */
export type UserUpdateManyArgs = Prisma.UserUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.UserUpsertArgs`
 */
export type UserUpsertArgs = Prisma.UserUpsertArgs

/**
 * @deprecated Renamed to `Prisma.UserDeleteArgs`
 */
export type UserDeleteArgs = Prisma.UserDeleteArgs

/**
 * @deprecated Renamed to `Prisma.UserDeleteManyArgs`
 */
export type UserDeleteManyArgs = Prisma.UserDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateVerificationRequest`
 */
export type AggregateVerificationRequest = Prisma.AggregateVerificationRequest

/**
 * @deprecated Renamed to `Prisma.VerificationRequestAvgAggregateOutputType`
 */
export type VerificationRequestAvgAggregateOutputType = Prisma.VerificationRequestAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestSumAggregateOutputType`
 */
export type VerificationRequestSumAggregateOutputType = Prisma.VerificationRequestSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestMinAggregateOutputType`
 */
export type VerificationRequestMinAggregateOutputType = Prisma.VerificationRequestMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestMaxAggregateOutputType`
 */
export type VerificationRequestMaxAggregateOutputType = Prisma.VerificationRequestMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestCountAggregateOutputType`
 */
export type VerificationRequestCountAggregateOutputType = Prisma.VerificationRequestCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateVerificationRequestArgs`
 */
export type AggregateVerificationRequestArgs = Prisma.AggregateVerificationRequestArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestAvgAggregateInputType`
 */
export type VerificationRequestAvgAggregateInputType = Prisma.VerificationRequestAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestSumAggregateInputType`
 */
export type VerificationRequestSumAggregateInputType = Prisma.VerificationRequestSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestMinAggregateInputType`
 */
export type VerificationRequestMinAggregateInputType = Prisma.VerificationRequestMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestMaxAggregateInputType`
 */
export type VerificationRequestMaxAggregateInputType = Prisma.VerificationRequestMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestCountAggregateInputType`
 */
export type VerificationRequestCountAggregateInputType = Prisma.VerificationRequestCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.VerificationRequestSelect`
 */
export type VerificationRequestSelect = Prisma.VerificationRequestSelect

/**
 * @deprecated Renamed to `Prisma.FindUniqueVerificationRequestArgs`
 */
export type FindUniqueVerificationRequestArgs = Prisma.FindUniqueVerificationRequestArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstVerificationRequestArgs`
 */
export type FindFirstVerificationRequestArgs = Prisma.FindFirstVerificationRequestArgs

/**
 * @deprecated Renamed to `Prisma.FindManyVerificationRequestArgs`
 */
export type FindManyVerificationRequestArgs = Prisma.FindManyVerificationRequestArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestCreateArgs`
 */
export type VerificationRequestCreateArgs = Prisma.VerificationRequestCreateArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestUpdateArgs`
 */
export type VerificationRequestUpdateArgs = Prisma.VerificationRequestUpdateArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestUpdateManyArgs`
 */
export type VerificationRequestUpdateManyArgs = Prisma.VerificationRequestUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestUpsertArgs`
 */
export type VerificationRequestUpsertArgs = Prisma.VerificationRequestUpsertArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestDeleteArgs`
 */
export type VerificationRequestDeleteArgs = Prisma.VerificationRequestDeleteArgs

/**
 * @deprecated Renamed to `Prisma.VerificationRequestDeleteManyArgs`
 */
export type VerificationRequestDeleteManyArgs = Prisma.VerificationRequestDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateGuild`
 */
export type AggregateGuild = Prisma.AggregateGuild

/**
 * @deprecated Renamed to `Prisma.GuildAvgAggregateOutputType`
 */
export type GuildAvgAggregateOutputType = Prisma.GuildAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildSumAggregateOutputType`
 */
export type GuildSumAggregateOutputType = Prisma.GuildSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildMinAggregateOutputType`
 */
export type GuildMinAggregateOutputType = Prisma.GuildMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildMaxAggregateOutputType`
 */
export type GuildMaxAggregateOutputType = Prisma.GuildMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildCountAggregateOutputType`
 */
export type GuildCountAggregateOutputType = Prisma.GuildCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateGuildArgs`
 */
export type AggregateGuildArgs = Prisma.AggregateGuildArgs

/**
 * @deprecated Renamed to `Prisma.GuildAvgAggregateInputType`
 */
export type GuildAvgAggregateInputType = Prisma.GuildAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildSumAggregateInputType`
 */
export type GuildSumAggregateInputType = Prisma.GuildSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildMinAggregateInputType`
 */
export type GuildMinAggregateInputType = Prisma.GuildMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildMaxAggregateInputType`
 */
export type GuildMaxAggregateInputType = Prisma.GuildMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildCountAggregateInputType`
 */
export type GuildCountAggregateInputType = Prisma.GuildCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildSelect`
 */
export type GuildSelect = Prisma.GuildSelect

/**
 * @deprecated Renamed to `Prisma.GuildInclude`
 */
export type GuildInclude = Prisma.GuildInclude

/**
 * @deprecated Renamed to `Prisma.FindUniqueGuildArgs`
 */
export type FindUniqueGuildArgs = Prisma.FindUniqueGuildArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstGuildArgs`
 */
export type FindFirstGuildArgs = Prisma.FindFirstGuildArgs

/**
 * @deprecated Renamed to `Prisma.FindManyGuildArgs`
 */
export type FindManyGuildArgs = Prisma.FindManyGuildArgs

/**
 * @deprecated Renamed to `Prisma.GuildCreateArgs`
 */
export type GuildCreateArgs = Prisma.GuildCreateArgs

/**
 * @deprecated Renamed to `Prisma.GuildUpdateArgs`
 */
export type GuildUpdateArgs = Prisma.GuildUpdateArgs

/**
 * @deprecated Renamed to `Prisma.GuildUpdateManyArgs`
 */
export type GuildUpdateManyArgs = Prisma.GuildUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.GuildUpsertArgs`
 */
export type GuildUpsertArgs = Prisma.GuildUpsertArgs

/**
 * @deprecated Renamed to `Prisma.GuildDeleteArgs`
 */
export type GuildDeleteArgs = Prisma.GuildDeleteArgs

/**
 * @deprecated Renamed to `Prisma.GuildDeleteManyArgs`
 */
export type GuildDeleteManyArgs = Prisma.GuildDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateUsersGuild`
 */
export type AggregateUsersGuild = Prisma.AggregateUsersGuild

/**
 * @deprecated Renamed to `Prisma.UsersGuildAvgAggregateOutputType`
 */
export type UsersGuildAvgAggregateOutputType = Prisma.UsersGuildAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildSumAggregateOutputType`
 */
export type UsersGuildSumAggregateOutputType = Prisma.UsersGuildSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildMinAggregateOutputType`
 */
export type UsersGuildMinAggregateOutputType = Prisma.UsersGuildMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildMaxAggregateOutputType`
 */
export type UsersGuildMaxAggregateOutputType = Prisma.UsersGuildMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildCountAggregateOutputType`
 */
export type UsersGuildCountAggregateOutputType = Prisma.UsersGuildCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateUsersGuildArgs`
 */
export type AggregateUsersGuildArgs = Prisma.AggregateUsersGuildArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildAvgAggregateInputType`
 */
export type UsersGuildAvgAggregateInputType = Prisma.UsersGuildAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildSumAggregateInputType`
 */
export type UsersGuildSumAggregateInputType = Prisma.UsersGuildSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildMinAggregateInputType`
 */
export type UsersGuildMinAggregateInputType = Prisma.UsersGuildMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildMaxAggregateInputType`
 */
export type UsersGuildMaxAggregateInputType = Prisma.UsersGuildMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildCountAggregateInputType`
 */
export type UsersGuildCountAggregateInputType = Prisma.UsersGuildCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersGuildSelect`
 */
export type UsersGuildSelect = Prisma.UsersGuildSelect

/**
 * @deprecated Renamed to `Prisma.UsersGuildInclude`
 */
export type UsersGuildInclude = Prisma.UsersGuildInclude

/**
 * @deprecated Renamed to `Prisma.FindUniqueUsersGuildArgs`
 */
export type FindUniqueUsersGuildArgs = Prisma.FindUniqueUsersGuildArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstUsersGuildArgs`
 */
export type FindFirstUsersGuildArgs = Prisma.FindFirstUsersGuildArgs

/**
 * @deprecated Renamed to `Prisma.FindManyUsersGuildArgs`
 */
export type FindManyUsersGuildArgs = Prisma.FindManyUsersGuildArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateArgs`
 */
export type UsersGuildCreateArgs = Prisma.UsersGuildCreateArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateArgs`
 */
export type UsersGuildUpdateArgs = Prisma.UsersGuildUpdateArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateManyArgs`
 */
export type UsersGuildUpdateManyArgs = Prisma.UsersGuildUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpsertArgs`
 */
export type UsersGuildUpsertArgs = Prisma.UsersGuildUpsertArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildDeleteArgs`
 */
export type UsersGuildDeleteArgs = Prisma.UsersGuildDeleteArgs

/**
 * @deprecated Renamed to `Prisma.UsersGuildDeleteManyArgs`
 */
export type UsersGuildDeleteManyArgs = Prisma.UsersGuildDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AccountWhereInput`
 */
export type AccountWhereInput = Prisma.AccountWhereInput

/**
 * @deprecated Renamed to `Prisma.AccountOrderByInput`
 */
export type AccountOrderByInput = Prisma.AccountOrderByInput

/**
 * @deprecated Renamed to `Prisma.AccountWhereUniqueInput`
 */
export type AccountWhereUniqueInput = Prisma.AccountWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.SessionWhereInput`
 */
export type SessionWhereInput = Prisma.SessionWhereInput

/**
 * @deprecated Renamed to `Prisma.SessionOrderByInput`
 */
export type SessionOrderByInput = Prisma.SessionOrderByInput

/**
 * @deprecated Renamed to `Prisma.SessionWhereUniqueInput`
 */
export type SessionWhereUniqueInput = Prisma.SessionWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.UserWhereInput`
 */
export type UserWhereInput = Prisma.UserWhereInput

/**
 * @deprecated Renamed to `Prisma.UserOrderByInput`
 */
export type UserOrderByInput = Prisma.UserOrderByInput

/**
 * @deprecated Renamed to `Prisma.UserWhereUniqueInput`
 */
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.VerificationRequestWhereInput`
 */
export type VerificationRequestWhereInput = Prisma.VerificationRequestWhereInput

/**
 * @deprecated Renamed to `Prisma.VerificationRequestOrderByInput`
 */
export type VerificationRequestOrderByInput = Prisma.VerificationRequestOrderByInput

/**
 * @deprecated Renamed to `Prisma.VerificationRequestWhereUniqueInput`
 */
export type VerificationRequestWhereUniqueInput = Prisma.VerificationRequestWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.GuildWhereInput`
 */
export type GuildWhereInput = Prisma.GuildWhereInput

/**
 * @deprecated Renamed to `Prisma.GuildOrderByInput`
 */
export type GuildOrderByInput = Prisma.GuildOrderByInput

/**
 * @deprecated Renamed to `Prisma.GuildWhereUniqueInput`
 */
export type GuildWhereUniqueInput = Prisma.GuildWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildWhereInput`
 */
export type UsersGuildWhereInput = Prisma.UsersGuildWhereInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildOrderByInput`
 */
export type UsersGuildOrderByInput = Prisma.UsersGuildOrderByInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildWhereUniqueInput`
 */
export type UsersGuildWhereUniqueInput = Prisma.UsersGuildWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.AccountCreateInput`
 */
export type AccountCreateInput = Prisma.AccountCreateInput

/**
 * @deprecated Renamed to `Prisma.AccountUpdateInput`
 */
export type AccountUpdateInput = Prisma.AccountUpdateInput

/**
 * @deprecated Renamed to `Prisma.AccountUpdateManyMutationInput`
 */
export type AccountUpdateManyMutationInput = Prisma.AccountUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.SessionCreateInput`
 */
export type SessionCreateInput = Prisma.SessionCreateInput

/**
 * @deprecated Renamed to `Prisma.SessionUpdateInput`
 */
export type SessionUpdateInput = Prisma.SessionUpdateInput

/**
 * @deprecated Renamed to `Prisma.SessionUpdateManyMutationInput`
 */
export type SessionUpdateManyMutationInput = Prisma.SessionUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.UserCreateInput`
 */
export type UserCreateInput = Prisma.UserCreateInput

/**
 * @deprecated Renamed to `Prisma.UserUpdateInput`
 */
export type UserUpdateInput = Prisma.UserUpdateInput

/**
 * @deprecated Renamed to `Prisma.UserUpdateManyMutationInput`
 */
export type UserUpdateManyMutationInput = Prisma.UserUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.VerificationRequestCreateInput`
 */
export type VerificationRequestCreateInput = Prisma.VerificationRequestCreateInput

/**
 * @deprecated Renamed to `Prisma.VerificationRequestUpdateInput`
 */
export type VerificationRequestUpdateInput = Prisma.VerificationRequestUpdateInput

/**
 * @deprecated Renamed to `Prisma.VerificationRequestUpdateManyMutationInput`
 */
export type VerificationRequestUpdateManyMutationInput = Prisma.VerificationRequestUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.GuildCreateInput`
 */
export type GuildCreateInput = Prisma.GuildCreateInput

/**
 * @deprecated Renamed to `Prisma.GuildUpdateInput`
 */
export type GuildUpdateInput = Prisma.GuildUpdateInput

/**
 * @deprecated Renamed to `Prisma.GuildUpdateManyMutationInput`
 */
export type GuildUpdateManyMutationInput = Prisma.GuildUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateInput`
 */
export type UsersGuildCreateInput = Prisma.UsersGuildCreateInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateInput`
 */
export type UsersGuildUpdateInput = Prisma.UsersGuildUpdateInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateManyMutationInput`
 */
export type UsersGuildUpdateManyMutationInput = Prisma.UsersGuildUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.IntFilter`
 */
export type IntFilter = Prisma.IntFilter

/**
 * @deprecated Renamed to `Prisma.StringFilter`
 */
export type StringFilter = Prisma.StringFilter

/**
 * @deprecated Renamed to `Prisma.StringNullableFilter`
 */
export type StringNullableFilter = Prisma.StringNullableFilter

/**
 * @deprecated Renamed to `Prisma.DateTimeNullableFilter`
 */
export type DateTimeNullableFilter = Prisma.DateTimeNullableFilter

/**
 * @deprecated Renamed to `Prisma.DateTimeFilter`
 */
export type DateTimeFilter = Prisma.DateTimeFilter

/**
 * @deprecated Renamed to `Prisma.UsersGuildListRelationFilter`
 */
export type UsersGuildListRelationFilter = Prisma.UsersGuildListRelationFilter

/**
 * @deprecated Renamed to `Prisma.IntNullableFilter`
 */
export type IntNullableFilter = Prisma.IntNullableFilter

/**
 * @deprecated Renamed to `Prisma.BoolNullableFilter`
 */
export type BoolNullableFilter = Prisma.BoolNullableFilter

/**
 * @deprecated Renamed to `Prisma.GuildRelationFilter`
 */
export type GuildRelationFilter = Prisma.GuildRelationFilter

/**
 * @deprecated Renamed to `Prisma.UserRelationFilter`
 */
export type UserRelationFilter = Prisma.UserRelationFilter

/**
 * @deprecated Renamed to `Prisma.UsersGuildUser_idGuild_idCompoundUniqueInput`
 */
export type UsersGuildUser_idGuild_idCompoundUniqueInput = Prisma.UsersGuildUser_idGuild_idCompoundUniqueInput

/**
 * @deprecated Renamed to `Prisma.StringFieldUpdateOperationsInput`
 */
export type StringFieldUpdateOperationsInput = Prisma.StringFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.IntFieldUpdateOperationsInput`
 */
export type IntFieldUpdateOperationsInput = Prisma.IntFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.NullableStringFieldUpdateOperationsInput`
 */
export type NullableStringFieldUpdateOperationsInput = Prisma.NullableStringFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.NullableDateTimeFieldUpdateOperationsInput`
 */
export type NullableDateTimeFieldUpdateOperationsInput = Prisma.NullableDateTimeFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.DateTimeFieldUpdateOperationsInput`
 */
export type DateTimeFieldUpdateOperationsInput = Prisma.DateTimeFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateManyWithoutUsersInput`
 */
export type UsersGuildCreateManyWithoutUsersInput = Prisma.UsersGuildCreateManyWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateManyWithoutUsersInput`
 */
export type UsersGuildUpdateManyWithoutUsersInput = Prisma.UsersGuildUpdateManyWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateManyWithoutGuildsInput`
 */
export type UsersGuildCreateManyWithoutGuildsInput = Prisma.UsersGuildCreateManyWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.NullableIntFieldUpdateOperationsInput`
 */
export type NullableIntFieldUpdateOperationsInput = Prisma.NullableIntFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateManyWithoutGuildsInput`
 */
export type UsersGuildUpdateManyWithoutGuildsInput = Prisma.UsersGuildUpdateManyWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.GuildCreateOneWithoutUsers_guildsInput`
 */
export type GuildCreateOneWithoutUsers_guildsInput = Prisma.GuildCreateOneWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UserCreateOneWithoutUsers_guildsInput`
 */
export type UserCreateOneWithoutUsers_guildsInput = Prisma.UserCreateOneWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.NullableBoolFieldUpdateOperationsInput`
 */
export type NullableBoolFieldUpdateOperationsInput = Prisma.NullableBoolFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.GuildUpdateOneRequiredWithoutUsers_guildsInput`
 */
export type GuildUpdateOneRequiredWithoutUsers_guildsInput = Prisma.GuildUpdateOneRequiredWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UserUpdateOneRequiredWithoutUsers_guildsInput`
 */
export type UserUpdateOneRequiredWithoutUsers_guildsInput = Prisma.UserUpdateOneRequiredWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.NestedIntFilter`
 */
export type NestedIntFilter = Prisma.NestedIntFilter

/**
 * @deprecated Renamed to `Prisma.NestedStringFilter`
 */
export type NestedStringFilter = Prisma.NestedStringFilter

/**
 * @deprecated Renamed to `Prisma.NestedStringNullableFilter`
 */
export type NestedStringNullableFilter = Prisma.NestedStringNullableFilter

/**
 * @deprecated Renamed to `Prisma.NestedDateTimeNullableFilter`
 */
export type NestedDateTimeNullableFilter = Prisma.NestedDateTimeNullableFilter

/**
 * @deprecated Renamed to `Prisma.NestedDateTimeFilter`
 */
export type NestedDateTimeFilter = Prisma.NestedDateTimeFilter

/**
 * @deprecated Renamed to `Prisma.NestedIntNullableFilter`
 */
export type NestedIntNullableFilter = Prisma.NestedIntNullableFilter

/**
 * @deprecated Renamed to `Prisma.NestedBoolNullableFilter`
 */
export type NestedBoolNullableFilter = Prisma.NestedBoolNullableFilter

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateWithoutUsersInput`
 */
export type UsersGuildCreateWithoutUsersInput = Prisma.UsersGuildCreateWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateOrConnectWithoutusersInput`
 */
export type UsersGuildCreateOrConnectWithoutusersInput = Prisma.UsersGuildCreateOrConnectWithoutusersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateWithWhereUniqueWithoutUsersInput`
 */
export type UsersGuildUpdateWithWhereUniqueWithoutUsersInput = Prisma.UsersGuildUpdateWithWhereUniqueWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateManyWithWhereWithoutUsersInput`
 */
export type UsersGuildUpdateManyWithWhereWithoutUsersInput = Prisma.UsersGuildUpdateManyWithWhereWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildScalarWhereInput`
 */
export type UsersGuildScalarWhereInput = Prisma.UsersGuildScalarWhereInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpsertWithWhereUniqueWithoutUsersInput`
 */
export type UsersGuildUpsertWithWhereUniqueWithoutUsersInput = Prisma.UsersGuildUpsertWithWhereUniqueWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateWithoutGuildsInput`
 */
export type UsersGuildCreateWithoutGuildsInput = Prisma.UsersGuildCreateWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildCreateOrConnectWithoutguildsInput`
 */
export type UsersGuildCreateOrConnectWithoutguildsInput = Prisma.UsersGuildCreateOrConnectWithoutguildsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateWithWhereUniqueWithoutGuildsInput`
 */
export type UsersGuildUpdateWithWhereUniqueWithoutGuildsInput = Prisma.UsersGuildUpdateWithWhereUniqueWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateManyWithWhereWithoutGuildsInput`
 */
export type UsersGuildUpdateManyWithWhereWithoutGuildsInput = Prisma.UsersGuildUpdateManyWithWhereWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpsertWithWhereUniqueWithoutGuildsInput`
 */
export type UsersGuildUpsertWithWhereUniqueWithoutGuildsInput = Prisma.UsersGuildUpsertWithWhereUniqueWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.GuildCreateWithoutUsers_guildsInput`
 */
export type GuildCreateWithoutUsers_guildsInput = Prisma.GuildCreateWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.GuildCreateOrConnectWithoutusers_guildsInput`
 */
export type GuildCreateOrConnectWithoutusers_guildsInput = Prisma.GuildCreateOrConnectWithoutusers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UserCreateWithoutUsers_guildsInput`
 */
export type UserCreateWithoutUsers_guildsInput = Prisma.UserCreateWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UserCreateOrConnectWithoutusers_guildsInput`
 */
export type UserCreateOrConnectWithoutusers_guildsInput = Prisma.UserCreateOrConnectWithoutusers_guildsInput

/**
 * @deprecated Renamed to `Prisma.GuildUpdateWithoutUsers_guildsInput`
 */
export type GuildUpdateWithoutUsers_guildsInput = Prisma.GuildUpdateWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.GuildUpsertWithoutUsers_guildsInput`
 */
export type GuildUpsertWithoutUsers_guildsInput = Prisma.GuildUpsertWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UserUpdateWithoutUsers_guildsInput`
 */
export type UserUpdateWithoutUsers_guildsInput = Prisma.UserUpdateWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UserUpsertWithoutUsers_guildsInput`
 */
export type UserUpsertWithoutUsers_guildsInput = Prisma.UserUpsertWithoutUsers_guildsInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateWithoutUsersInput`
 */
export type UsersGuildUpdateWithoutUsersInput = Prisma.UsersGuildUpdateWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.UsersGuildUpdateWithoutGuildsInput`
 */
export type UsersGuildUpdateWithoutGuildsInput = Prisma.UsersGuildUpdateWithoutGuildsInput