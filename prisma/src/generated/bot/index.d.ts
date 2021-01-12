
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
 * Model games
 */

export type games = {
  game_id: BigInt
  guild_id: Prisma.Decimal | null
  connect_code: string
  start_time: number
  win_type: number | null
  end_time: number | null
}

/**
 * Model guilds
 */

export type guilds = {
  guild_id: Prisma.Decimal
  guild_name: string
  premium: number
  tx_time_unix: number | null
}

/**
 * Model users
 */

export type users = {
  user_id: Prisma.Decimal
  opt: boolean | null
}

/**
 * Model users_games
 */

export type users_games = {
  user_id: Prisma.Decimal
  guild_id: Prisma.Decimal | null
  game_id: BigInt
  player_name: string
  player_color: number
  player_role: number
  player_won: boolean
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Games
 * const games = await prisma.games.findMany()
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
   * // Fetch zero or more Games
   * const games = await prisma.games.findMany()
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
   * `prisma.games`: Exposes CRUD operations for the **games** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Games
    * const games = await prisma.games.findMany()
    * ```
    */
  get games(): Prisma.gamesDelegate;

  /**
   * `prisma.guilds`: Exposes CRUD operations for the **guilds** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guilds
    * const guilds = await prisma.guilds.findMany()
    * ```
    */
  get guilds(): Prisma.guildsDelegate;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate;

  /**
   * `prisma.users_games`: Exposes CRUD operations for the **users_games** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users_games
    * const users_games = await prisma.users_games.findMany()
    * ```
    */
  get users_games(): Prisma.users_gamesDelegate;
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
    games: 'games',
    guilds: 'guilds',
    users: 'users',
    users_games: 'users_games'
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
   * Model games
   */


  export type AggregateGames = {
    count: number | null
    avg: GamesAvgAggregateOutputType | null
    sum: GamesSumAggregateOutputType | null
    min: GamesMinAggregateOutputType | null
    max: GamesMaxAggregateOutputType | null
  }

  export type GamesAvgAggregateOutputType = {
    game_id: number
    guild_id: Decimal | null
    start_time: number
    win_type: number | null
    end_time: number | null
  }

  export type GamesSumAggregateOutputType = {
    game_id: BigInt
    guild_id: Decimal | null
    start_time: number
    win_type: number | null
    end_time: number | null
  }

  export type GamesMinAggregateOutputType = {
    game_id: BigInt
    guild_id: Decimal | null
    connect_code: string | null
    start_time: number
    win_type: number | null
    end_time: number | null
  }

  export type GamesMaxAggregateOutputType = {
    game_id: BigInt
    guild_id: Decimal | null
    connect_code: string | null
    start_time: number
    win_type: number | null
    end_time: number | null
  }

  export type GamesCountAggregateOutputType = {
    game_id: number
    guild_id: number | null
    connect_code: number | null
    start_time: number
    win_type: number | null
    end_time: number | null
    _all: number
  }


  export type GamesAvgAggregateInputType = {
    game_id?: true
    guild_id?: true
    start_time?: true
    win_type?: true
    end_time?: true
  }

  export type GamesSumAggregateInputType = {
    game_id?: true
    guild_id?: true
    start_time?: true
    win_type?: true
    end_time?: true
  }

  export type GamesMinAggregateInputType = {
    game_id?: true
    guild_id?: true
    connect_code?: true
    start_time?: true
    win_type?: true
    end_time?: true
  }

  export type GamesMaxAggregateInputType = {
    game_id?: true
    guild_id?: true
    connect_code?: true
    start_time?: true
    win_type?: true
    end_time?: true
  }

  export type GamesCountAggregateInputType = {
    game_id?: true
    guild_id?: true
    connect_code?: true
    start_time?: true
    win_type?: true
    end_time?: true
    _all?: true
  }

  export type AggregateGamesArgs = {
    /**
     * Filter which games to aggregate.
    **/
    where?: gamesWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of games to fetch.
    **/
    orderBy?: Enumerable<gamesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: gamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` games from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` games.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned games
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: GamesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: GamesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: GamesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: GamesMaxAggregateInputType
  }

  export type GetGamesAggregateType<T extends AggregateGamesArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetGamesAggregateScalarType<T[P]>
  }

  export type GetGamesAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof GamesAvgAggregateOutputType ? GamesAvgAggregateOutputType[P] : never
  }

    



  export type gamesSelect = {
    game_id?: boolean
    guild_id?: boolean
    connect_code?: boolean
    start_time?: boolean
    win_type?: boolean
    end_time?: boolean
    guilds?: boolean | guildsArgs
    users_games?: boolean | FindManyusers_gamesArgs
  }

  export type gamesInclude = {
    guilds?: boolean | guildsArgs
    users_games?: boolean | FindManyusers_gamesArgs
  }

  export type gamesGetPayload<
    S extends boolean | null | undefined | gamesArgs,
    U = keyof S
      > = S extends true
        ? games
    : S extends undefined
    ? never
    : S extends gamesArgs | FindManygamesArgs
    ?'include' extends U
    ? games  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'guilds'
        ? guildsGetPayload<S['include'][P]> | null :
        P extends 'users_games'
        ? Array < users_gamesGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof games ?games [P]
  : 
          P extends 'guilds'
        ? guildsGetPayload<S['select'][P]> | null :
        P extends 'users_games'
        ? Array < users_gamesGetPayload<S['select'][P]>>  : never
  } 
    : games
  : games


  export interface gamesDelegate {
    /**
     * Find zero or one Games that matches the filter.
     * @param {FindUniquegamesArgs} args - Arguments to find a Games
     * @example
     * // Get one Games
     * const games = await prisma.games.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniquegamesArgs>(
      args: Subset<T, FindUniquegamesArgs>
    ): CheckSelect<T, Prisma__gamesClient<games | null>, Prisma__gamesClient<gamesGetPayload<T> | null>>

    /**
     * Find the first Games that matches the filter.
     * @param {FindFirstgamesArgs} args - Arguments to find a Games
     * @example
     * // Get one Games
     * const games = await prisma.games.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstgamesArgs>(
      args?: Subset<T, FindFirstgamesArgs>
    ): CheckSelect<T, Prisma__gamesClient<games | null>, Prisma__gamesClient<gamesGetPayload<T> | null>>

    /**
     * Find zero or more Games that matches the filter.
     * @param {FindManygamesArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.games.findMany()
     * 
     * // Get first 10 Games
     * const games = await prisma.games.findMany({ take: 10 })
     * 
     * // Only select the `game_id`
     * const gamesWithGame_idOnly = await prisma.games.findMany({ select: { game_id: true } })
     * 
    **/
    findMany<T extends FindManygamesArgs>(
      args?: Subset<T, FindManygamesArgs>
    ): CheckSelect<T, Promise<Array<games>>, Promise<Array<gamesGetPayload<T>>>>

    /**
     * Create a Games.
     * @param {gamesCreateArgs} args - Arguments to create a Games.
     * @example
     * // Create one Games
     * const Games = await prisma.games.create({
     *   data: {
     *     // ... data to create a Games
     *   }
     * })
     * 
    **/
    create<T extends gamesCreateArgs>(
      args: Subset<T, gamesCreateArgs>
    ): CheckSelect<T, Prisma__gamesClient<games>, Prisma__gamesClient<gamesGetPayload<T>>>

    /**
     * Delete a Games.
     * @param {gamesDeleteArgs} args - Arguments to delete one Games.
     * @example
     * // Delete one Games
     * const Games = await prisma.games.delete({
     *   where: {
     *     // ... filter to delete one Games
     *   }
     * })
     * 
    **/
    delete<T extends gamesDeleteArgs>(
      args: Subset<T, gamesDeleteArgs>
    ): CheckSelect<T, Prisma__gamesClient<games>, Prisma__gamesClient<gamesGetPayload<T>>>

    /**
     * Update one Games.
     * @param {gamesUpdateArgs} args - Arguments to update one Games.
     * @example
     * // Update one Games
     * const games = await prisma.games.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends gamesUpdateArgs>(
      args: Subset<T, gamesUpdateArgs>
    ): CheckSelect<T, Prisma__gamesClient<games>, Prisma__gamesClient<gamesGetPayload<T>>>

    /**
     * Delete zero or more Games.
     * @param {gamesDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.games.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends gamesDeleteManyArgs>(
      args?: Subset<T, gamesDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Games.
     * @param {gamesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const games = await prisma.games.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends gamesUpdateManyArgs>(
      args: Subset<T, gamesUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Games.
     * @param {gamesUpsertArgs} args - Arguments to update or create a Games.
     * @example
     * // Update or create a Games
     * const games = await prisma.games.upsert({
     *   create: {
     *     // ... data to create a Games
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Games we want to update
     *   }
     * })
    **/
    upsert<T extends gamesUpsertArgs>(
      args: Subset<T, gamesUpsertArgs>
    ): CheckSelect<T, Prisma__gamesClient<games>, Prisma__gamesClient<gamesGetPayload<T>>>

    /**
     * Find zero or one Games that matches the filter.
     * @param {FindUniquegamesArgs} args - Arguments to find a Games
     * @deprecated This will be deprecated please use prisma.games.findUnique
     * @example
     * // Get one Games
     * const games = await prisma.games.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniquegamesArgs>(
      args: Subset<T, FindUniquegamesArgs>
    ): CheckSelect<T, Prisma__gamesClient<games | null>, Prisma__gamesClient<gamesGetPayload<T> | null>>

    /**
     * Count the number of Games.
     * @param {FindManygamesArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.games.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManygamesArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Games.
     * @param {AggregateGamesArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AggregateGamesArgs>(args: Subset<T, AggregateGamesArgs>): Promise<GetGamesAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for games.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__gamesClient<T> implements Promise<T> {
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

    guilds<T extends guildsArgs = {}>(args?: Subset<T, guildsArgs>): CheckSelect<T, Prisma__guildsClient<guilds | null>, Prisma__guildsClient<guildsGetPayload<T> | null>>;

    users_games<T extends FindManyusers_gamesArgs = {}>(args?: Subset<T, FindManyusers_gamesArgs>): CheckSelect<T, Promise<Array<users_games>>, Promise<Array<users_gamesGetPayload<T>>>>;

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
   * games findUnique
   */
  export type FindUniquegamesArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * Filter, which games to fetch.
    **/
    where: gamesWhereUniqueInput
  }


  /**
   * games findFirst
   */
  export type FindFirstgamesArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * Filter, which games to fetch.
    **/
    where?: gamesWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of games to fetch.
    **/
    orderBy?: Enumerable<gamesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for games.
    **/
    cursor?: gamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` games from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` games.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of games.
    **/
    distinct?: Enumerable<GamesScalarFieldEnum>
  }


  /**
   * games findMany
   */
  export type FindManygamesArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * Filter, which games to fetch.
    **/
    where?: gamesWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of games to fetch.
    **/
    orderBy?: Enumerable<gamesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing games.
    **/
    cursor?: gamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` games from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` games.
    **/
    skip?: number
    distinct?: Enumerable<GamesScalarFieldEnum>
  }


  /**
   * games create
   */
  export type gamesCreateArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * The data needed to create a games.
    **/
    data: gamesCreateInput
  }


  /**
   * games update
   */
  export type gamesUpdateArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * The data needed to update a games.
    **/
    data: gamesUpdateInput
    /**
     * Choose, which games to update.
    **/
    where: gamesWhereUniqueInput
  }


  /**
   * games updateMany
   */
  export type gamesUpdateManyArgs = {
    data: gamesUpdateManyMutationInput
    where?: gamesWhereInput
  }


  /**
   * games upsert
   */
  export type gamesUpsertArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * The filter to search for the games to update in case it exists.
    **/
    where: gamesWhereUniqueInput
    /**
     * In case the games found by the `where` argument doesn't exist, create a new games with this data.
    **/
    create: gamesCreateInput
    /**
     * In case the games was found with the provided `where` argument, update it with this data.
    **/
    update: gamesUpdateInput
  }


  /**
   * games delete
   */
  export type gamesDeleteArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
    /**
     * Filter which games to delete.
    **/
    where: gamesWhereUniqueInput
  }


  /**
   * games deleteMany
   */
  export type gamesDeleteManyArgs = {
    where?: gamesWhereInput
  }


  /**
   * games without action
   */
  export type gamesArgs = {
    /**
     * Select specific fields to fetch from the games
    **/
    select?: gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: gamesInclude | null
  }



  /**
   * Model guilds
   */


  export type AggregateGuilds = {
    count: number | null
    avg: GuildsAvgAggregateOutputType | null
    sum: GuildsSumAggregateOutputType | null
    min: GuildsMinAggregateOutputType | null
    max: GuildsMaxAggregateOutputType | null
  }

  export type GuildsAvgAggregateOutputType = {
    guild_id: Decimal
    premium: number
    tx_time_unix: number | null
  }

  export type GuildsSumAggregateOutputType = {
    guild_id: Decimal
    premium: number
    tx_time_unix: number | null
  }

  export type GuildsMinAggregateOutputType = {
    guild_id: Decimal
    guild_name: string | null
    premium: number
    tx_time_unix: number | null
  }

  export type GuildsMaxAggregateOutputType = {
    guild_id: Decimal
    guild_name: string | null
    premium: number
    tx_time_unix: number | null
  }

  export type GuildsCountAggregateOutputType = {
    guild_id: number
    guild_name: number | null
    premium: number
    tx_time_unix: number | null
    _all: number
  }


  export type GuildsAvgAggregateInputType = {
    guild_id?: true
    premium?: true
    tx_time_unix?: true
  }

  export type GuildsSumAggregateInputType = {
    guild_id?: true
    premium?: true
    tx_time_unix?: true
  }

  export type GuildsMinAggregateInputType = {
    guild_id?: true
    guild_name?: true
    premium?: true
    tx_time_unix?: true
  }

  export type GuildsMaxAggregateInputType = {
    guild_id?: true
    guild_name?: true
    premium?: true
    tx_time_unix?: true
  }

  export type GuildsCountAggregateInputType = {
    guild_id?: true
    guild_name?: true
    premium?: true
    tx_time_unix?: true
    _all?: true
  }

  export type AggregateGuildsArgs = {
    /**
     * Filter which guilds to aggregate.
    **/
    where?: guildsWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of guilds to fetch.
    **/
    orderBy?: Enumerable<guildsOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned guilds
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: GuildsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: GuildsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: GuildsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: GuildsMaxAggregateInputType
  }

  export type GetGuildsAggregateType<T extends AggregateGuildsArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetGuildsAggregateScalarType<T[P]>
  }

  export type GetGuildsAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof GuildsAvgAggregateOutputType ? GuildsAvgAggregateOutputType[P] : never
  }

    



  export type guildsSelect = {
    guild_id?: boolean
    guild_name?: boolean
    premium?: boolean
    tx_time_unix?: boolean
    games?: boolean | FindManygamesArgs
    users_games?: boolean | FindManyusers_gamesArgs
  }

  export type guildsInclude = {
    games?: boolean | FindManygamesArgs
    users_games?: boolean | FindManyusers_gamesArgs
  }

  export type guildsGetPayload<
    S extends boolean | null | undefined | guildsArgs,
    U = keyof S
      > = S extends true
        ? guilds
    : S extends undefined
    ? never
    : S extends guildsArgs | FindManyguildsArgs
    ?'include' extends U
    ? guilds  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'games'
        ? Array < gamesGetPayload<S['include'][P]>>  :
        P extends 'users_games'
        ? Array < users_gamesGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof guilds ?guilds [P]
  : 
          P extends 'games'
        ? Array < gamesGetPayload<S['select'][P]>>  :
        P extends 'users_games'
        ? Array < users_gamesGetPayload<S['select'][P]>>  : never
  } 
    : guilds
  : guilds


  export interface guildsDelegate {
    /**
     * Find zero or one Guilds that matches the filter.
     * @param {FindUniqueguildsArgs} args - Arguments to find a Guilds
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueguildsArgs>(
      args: Subset<T, FindUniqueguildsArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds | null>, Prisma__guildsClient<guildsGetPayload<T> | null>>

    /**
     * Find the first Guilds that matches the filter.
     * @param {FindFirstguildsArgs} args - Arguments to find a Guilds
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstguildsArgs>(
      args?: Subset<T, FindFirstguildsArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds | null>, Prisma__guildsClient<guildsGetPayload<T> | null>>

    /**
     * Find zero or more Guilds that matches the filter.
     * @param {FindManyguildsArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guilds
     * const guilds = await prisma.guilds.findMany()
     * 
     * // Get first 10 Guilds
     * const guilds = await prisma.guilds.findMany({ take: 10 })
     * 
     * // Only select the `guild_id`
     * const guildsWithGuild_idOnly = await prisma.guilds.findMany({ select: { guild_id: true } })
     * 
    **/
    findMany<T extends FindManyguildsArgs>(
      args?: Subset<T, FindManyguildsArgs>
    ): CheckSelect<T, Promise<Array<guilds>>, Promise<Array<guildsGetPayload<T>>>>

    /**
     * Create a Guilds.
     * @param {guildsCreateArgs} args - Arguments to create a Guilds.
     * @example
     * // Create one Guilds
     * const Guilds = await prisma.guilds.create({
     *   data: {
     *     // ... data to create a Guilds
     *   }
     * })
     * 
    **/
    create<T extends guildsCreateArgs>(
      args: Subset<T, guildsCreateArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds>, Prisma__guildsClient<guildsGetPayload<T>>>

    /**
     * Delete a Guilds.
     * @param {guildsDeleteArgs} args - Arguments to delete one Guilds.
     * @example
     * // Delete one Guilds
     * const Guilds = await prisma.guilds.delete({
     *   where: {
     *     // ... filter to delete one Guilds
     *   }
     * })
     * 
    **/
    delete<T extends guildsDeleteArgs>(
      args: Subset<T, guildsDeleteArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds>, Prisma__guildsClient<guildsGetPayload<T>>>

    /**
     * Update one Guilds.
     * @param {guildsUpdateArgs} args - Arguments to update one Guilds.
     * @example
     * // Update one Guilds
     * const guilds = await prisma.guilds.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends guildsUpdateArgs>(
      args: Subset<T, guildsUpdateArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds>, Prisma__guildsClient<guildsGetPayload<T>>>

    /**
     * Delete zero or more Guilds.
     * @param {guildsDeleteManyArgs} args - Arguments to filter Guilds to delete.
     * @example
     * // Delete a few Guilds
     * const { count } = await prisma.guilds.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends guildsDeleteManyArgs>(
      args?: Subset<T, guildsDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Guilds.
     * @param {guildsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guilds
     * const guilds = await prisma.guilds.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends guildsUpdateManyArgs>(
      args: Subset<T, guildsUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Guilds.
     * @param {guildsUpsertArgs} args - Arguments to update or create a Guilds.
     * @example
     * // Update or create a Guilds
     * const guilds = await prisma.guilds.upsert({
     *   create: {
     *     // ... data to create a Guilds
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guilds we want to update
     *   }
     * })
    **/
    upsert<T extends guildsUpsertArgs>(
      args: Subset<T, guildsUpsertArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds>, Prisma__guildsClient<guildsGetPayload<T>>>

    /**
     * Find zero or one Guilds that matches the filter.
     * @param {FindUniqueguildsArgs} args - Arguments to find a Guilds
     * @deprecated This will be deprecated please use prisma.guilds.findUnique
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueguildsArgs>(
      args: Subset<T, FindUniqueguildsArgs>
    ): CheckSelect<T, Prisma__guildsClient<guilds | null>, Prisma__guildsClient<guildsGetPayload<T> | null>>

    /**
     * Count the number of Guilds.
     * @param {FindManyguildsArgs} args - Arguments to filter Guilds to count.
     * @example
     * // Count the number of Guilds
     * const count = await prisma.guilds.count({
     *   where: {
     *     // ... the filter for the Guilds we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyguildsArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Guilds.
     * @param {AggregateGuildsArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AggregateGuildsArgs>(args: Subset<T, AggregateGuildsArgs>): Promise<GetGuildsAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for guilds.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__guildsClient<T> implements Promise<T> {
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

    games<T extends FindManygamesArgs = {}>(args?: Subset<T, FindManygamesArgs>): CheckSelect<T, Promise<Array<games>>, Promise<Array<gamesGetPayload<T>>>>;

    users_games<T extends FindManyusers_gamesArgs = {}>(args?: Subset<T, FindManyusers_gamesArgs>): CheckSelect<T, Promise<Array<users_games>>, Promise<Array<users_gamesGetPayload<T>>>>;

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
   * guilds findUnique
   */
  export type FindUniqueguildsArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * Filter, which guilds to fetch.
    **/
    where: guildsWhereUniqueInput
  }


  /**
   * guilds findFirst
   */
  export type FindFirstguildsArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * Filter, which guilds to fetch.
    **/
    where?: guildsWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of guilds to fetch.
    **/
    orderBy?: Enumerable<guildsOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for guilds.
    **/
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of guilds.
    **/
    distinct?: Enumerable<GuildsScalarFieldEnum>
  }


  /**
   * guilds findMany
   */
  export type FindManyguildsArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * Filter, which guilds to fetch.
    **/
    where?: guildsWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of guilds to fetch.
    **/
    orderBy?: Enumerable<guildsOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing guilds.
    **/
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
    **/
    skip?: number
    distinct?: Enumerable<GuildsScalarFieldEnum>
  }


  /**
   * guilds create
   */
  export type guildsCreateArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * The data needed to create a guilds.
    **/
    data: guildsCreateInput
  }


  /**
   * guilds update
   */
  export type guildsUpdateArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * The data needed to update a guilds.
    **/
    data: guildsUpdateInput
    /**
     * Choose, which guilds to update.
    **/
    where: guildsWhereUniqueInput
  }


  /**
   * guilds updateMany
   */
  export type guildsUpdateManyArgs = {
    data: guildsUpdateManyMutationInput
    where?: guildsWhereInput
  }


  /**
   * guilds upsert
   */
  export type guildsUpsertArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * The filter to search for the guilds to update in case it exists.
    **/
    where: guildsWhereUniqueInput
    /**
     * In case the guilds found by the `where` argument doesn't exist, create a new guilds with this data.
    **/
    create: guildsCreateInput
    /**
     * In case the guilds was found with the provided `where` argument, update it with this data.
    **/
    update: guildsUpdateInput
  }


  /**
   * guilds delete
   */
  export type guildsDeleteArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
    /**
     * Filter which guilds to delete.
    **/
    where: guildsWhereUniqueInput
  }


  /**
   * guilds deleteMany
   */
  export type guildsDeleteManyArgs = {
    where?: guildsWhereInput
  }


  /**
   * guilds without action
   */
  export type guildsArgs = {
    /**
     * Select specific fields to fetch from the guilds
    **/
    select?: guildsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: guildsInclude | null
  }



  /**
   * Model users
   */


  export type AggregateUsers = {
    count: number | null
    avg: UsersAvgAggregateOutputType | null
    sum: UsersSumAggregateOutputType | null
    min: UsersMinAggregateOutputType | null
    max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    user_id: Decimal
  }

  export type UsersSumAggregateOutputType = {
    user_id: Decimal
  }

  export type UsersMinAggregateOutputType = {
    user_id: Decimal
    opt: boolean | null
  }

  export type UsersMaxAggregateOutputType = {
    user_id: Decimal
    opt: boolean | null
  }

  export type UsersCountAggregateOutputType = {
    user_id: number
    opt: number | null
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    user_id?: true
  }

  export type UsersSumAggregateInputType = {
    user_id?: true
  }

  export type UsersMinAggregateInputType = {
    user_id?: true
    opt?: true
  }

  export type UsersMaxAggregateInputType = {
    user_id?: true
    opt?: true
  }

  export type UsersCountAggregateInputType = {
    user_id?: true
    opt?: true
    _all?: true
  }

  export type AggregateUsersArgs = {
    /**
     * Filter which users to aggregate.
    **/
    where?: usersWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of users to fetch.
    **/
    orderBy?: Enumerable<usersOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends AggregateUsersArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetUsersAggregateScalarType<T[P]>
  }

  export type GetUsersAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof UsersAvgAggregateOutputType ? UsersAvgAggregateOutputType[P] : never
  }

    



  export type usersSelect = {
    user_id?: boolean
    opt?: boolean
    users_games?: boolean | FindManyusers_gamesArgs
  }

  export type usersInclude = {
    users_games?: boolean | FindManyusers_gamesArgs
  }

  export type usersGetPayload<
    S extends boolean | null | undefined | usersArgs,
    U = keyof S
      > = S extends true
        ? users
    : S extends undefined
    ? never
    : S extends usersArgs | FindManyusersArgs
    ?'include' extends U
    ? users  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'users_games'
        ? Array < users_gamesGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof users ?users [P]
  : 
          P extends 'users_games'
        ? Array < users_gamesGetPayload<S['select'][P]>>  : never
  } 
    : users
  : users


  export interface usersDelegate {
    /**
     * Find zero or one Users that matches the filter.
     * @param {FindUniqueusersArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueusersArgs>(
      args: Subset<T, FindUniqueusersArgs>
    ): CheckSelect<T, Prisma__usersClient<users | null>, Prisma__usersClient<usersGetPayload<T> | null>>

    /**
     * Find the first Users that matches the filter.
     * @param {FindFirstusersArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstusersArgs>(
      args?: Subset<T, FindFirstusersArgs>
    ): CheckSelect<T, Prisma__usersClient<users | null>, Prisma__usersClient<usersGetPayload<T> | null>>

    /**
     * Find zero or more Users that matches the filter.
     * @param {FindManyusersArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const usersWithUser_idOnly = await prisma.users.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends FindManyusersArgs>(
      args?: Subset<T, FindManyusersArgs>
    ): CheckSelect<T, Promise<Array<users>>, Promise<Array<usersGetPayload<T>>>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
    **/
    create<T extends usersCreateArgs>(
      args: Subset<T, usersCreateArgs>
    ): CheckSelect<T, Prisma__usersClient<users>, Prisma__usersClient<usersGetPayload<T>>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
    **/
    delete<T extends usersDeleteArgs>(
      args: Subset<T, usersDeleteArgs>
    ): CheckSelect<T, Prisma__usersClient<users>, Prisma__usersClient<usersGetPayload<T>>>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends usersUpdateArgs>(
      args: Subset<T, usersUpdateArgs>
    ): CheckSelect<T, Prisma__usersClient<users>, Prisma__usersClient<usersGetPayload<T>>>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends usersDeleteManyArgs>(
      args?: Subset<T, usersDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Users.
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends usersUpdateManyArgs>(
      args: Subset<T, usersUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
    **/
    upsert<T extends usersUpsertArgs>(
      args: Subset<T, usersUpsertArgs>
    ): CheckSelect<T, Prisma__usersClient<users>, Prisma__usersClient<usersGetPayload<T>>>

    /**
     * Find zero or one Users that matches the filter.
     * @param {FindUniqueusersArgs} args - Arguments to find a Users
     * @deprecated This will be deprecated please use prisma.users.findUnique
     * @example
     * // Get one Users
     * const users = await prisma.users.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueusersArgs>(
      args: Subset<T, FindUniqueusersArgs>
    ): CheckSelect<T, Prisma__usersClient<users | null>, Prisma__usersClient<usersGetPayload<T> | null>>

    /**
     * Count the number of Users.
     * @param {FindManyusersArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyusersArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Users.
     * @param {AggregateUsersArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AggregateUsersArgs>(args: Subset<T, AggregateUsersArgs>): Promise<GetUsersAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__usersClient<T> implements Promise<T> {
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

    users_games<T extends FindManyusers_gamesArgs = {}>(args?: Subset<T, FindManyusers_gamesArgs>): CheckSelect<T, Promise<Array<users_games>>, Promise<Array<users_gamesGetPayload<T>>>>;

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
   * users findUnique
   */
  export type FindUniqueusersArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * Filter, which users to fetch.
    **/
    where: usersWhereUniqueInput
  }


  /**
   * users findFirst
   */
  export type FindFirstusersArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * Filter, which users to fetch.
    **/
    where?: usersWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of users to fetch.
    **/
    orderBy?: Enumerable<usersOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
    **/
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of users.
    **/
    distinct?: Enumerable<UsersScalarFieldEnum>
  }


  /**
   * users findMany
   */
  export type FindManyusersArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * Filter, which users to fetch.
    **/
    where?: usersWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of users to fetch.
    **/
    orderBy?: Enumerable<usersOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
    **/
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
    **/
    skip?: number
    distinct?: Enumerable<UsersScalarFieldEnum>
  }


  /**
   * users create
   */
  export type usersCreateArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * The data needed to create a users.
    **/
    data: usersCreateInput
  }


  /**
   * users update
   */
  export type usersUpdateArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * The data needed to update a users.
    **/
    data: usersUpdateInput
    /**
     * Choose, which users to update.
    **/
    where: usersWhereUniqueInput
  }


  /**
   * users updateMany
   */
  export type usersUpdateManyArgs = {
    data: usersUpdateManyMutationInput
    where?: usersWhereInput
  }


  /**
   * users upsert
   */
  export type usersUpsertArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * The filter to search for the users to update in case it exists.
    **/
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
    **/
    create: usersCreateInput
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
    **/
    update: usersUpdateInput
  }


  /**
   * users delete
   */
  export type usersDeleteArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
    /**
     * Filter which users to delete.
    **/
    where: usersWhereUniqueInput
  }


  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs = {
    where?: usersWhereInput
  }


  /**
   * users without action
   */
  export type usersArgs = {
    /**
     * Select specific fields to fetch from the users
    **/
    select?: usersSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: usersInclude | null
  }



  /**
   * Model users_games
   */


  export type AggregateUsers_games = {
    count: number | null
    avg: Users_gamesAvgAggregateOutputType | null
    sum: Users_gamesSumAggregateOutputType | null
    min: Users_gamesMinAggregateOutputType | null
    max: Users_gamesMaxAggregateOutputType | null
  }

  export type Users_gamesAvgAggregateOutputType = {
    user_id: Decimal
    guild_id: Decimal | null
    game_id: number
    player_color: number
    player_role: number
  }

  export type Users_gamesSumAggregateOutputType = {
    user_id: Decimal
    guild_id: Decimal | null
    game_id: BigInt
    player_color: number
    player_role: number
  }

  export type Users_gamesMinAggregateOutputType = {
    user_id: Decimal
    guild_id: Decimal | null
    game_id: BigInt
    player_name: string | null
    player_color: number
    player_role: number
    player_won: boolean | null
  }

  export type Users_gamesMaxAggregateOutputType = {
    user_id: Decimal
    guild_id: Decimal | null
    game_id: BigInt
    player_name: string | null
    player_color: number
    player_role: number
    player_won: boolean | null
  }

  export type Users_gamesCountAggregateOutputType = {
    user_id: number
    guild_id: number | null
    game_id: number
    player_name: number | null
    player_color: number
    player_role: number
    player_won: number | null
    _all: number
  }


  export type Users_gamesAvgAggregateInputType = {
    user_id?: true
    guild_id?: true
    game_id?: true
    player_color?: true
    player_role?: true
  }

  export type Users_gamesSumAggregateInputType = {
    user_id?: true
    guild_id?: true
    game_id?: true
    player_color?: true
    player_role?: true
  }

  export type Users_gamesMinAggregateInputType = {
    user_id?: true
    guild_id?: true
    game_id?: true
    player_name?: true
    player_color?: true
    player_role?: true
    player_won?: true
  }

  export type Users_gamesMaxAggregateInputType = {
    user_id?: true
    guild_id?: true
    game_id?: true
    player_name?: true
    player_color?: true
    player_role?: true
    player_won?: true
  }

  export type Users_gamesCountAggregateInputType = {
    user_id?: true
    guild_id?: true
    game_id?: true
    player_name?: true
    player_color?: true
    player_role?: true
    player_won?: true
    _all?: true
  }

  export type AggregateUsers_gamesArgs = {
    /**
     * Filter which users_games to aggregate.
    **/
    where?: users_gamesWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of users_games to fetch.
    **/
    orderBy?: Enumerable<users_gamesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: users_gamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users_games from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users_games.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users_games
    **/
    count?: true
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    avg?: Users_gamesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    sum?: Users_gamesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: Users_gamesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: Users_gamesMaxAggregateInputType
  }

  export type GetUsers_gamesAggregateType<T extends AggregateUsers_gamesArgs> = {
    [P in keyof T]: P extends 'count' ? number : GetUsers_gamesAggregateScalarType<T[P]>
  }

  export type GetUsers_gamesAggregateScalarType<T extends any> = {
    [P in keyof T]: P extends keyof Users_gamesAvgAggregateOutputType ? Users_gamesAvgAggregateOutputType[P] : never
  }

    



  export type users_gamesSelect = {
    user_id?: boolean
    guild_id?: boolean
    game_id?: boolean
    player_name?: boolean
    player_color?: boolean
    player_role?: boolean
    player_won?: boolean
    games?: boolean | gamesArgs
    guilds?: boolean | guildsArgs
    users?: boolean | usersArgs
  }

  export type users_gamesInclude = {
    games?: boolean | gamesArgs
    guilds?: boolean | guildsArgs
    users?: boolean | usersArgs
  }

  export type users_gamesGetPayload<
    S extends boolean | null | undefined | users_gamesArgs,
    U = keyof S
      > = S extends true
        ? users_games
    : S extends undefined
    ? never
    : S extends users_gamesArgs | FindManyusers_gamesArgs
    ?'include' extends U
    ? users_games  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'games'
        ? gamesGetPayload<S['include'][P]> :
        P extends 'guilds'
        ? guildsGetPayload<S['include'][P]> | null :
        P extends 'users'
        ? usersGetPayload<S['include'][P]> : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof users_games ?users_games [P]
  : 
          P extends 'games'
        ? gamesGetPayload<S['select'][P]> :
        P extends 'guilds'
        ? guildsGetPayload<S['select'][P]> | null :
        P extends 'users'
        ? usersGetPayload<S['select'][P]> : never
  } 
    : users_games
  : users_games


  export interface users_gamesDelegate {
    /**
     * Find zero or one Users_games that matches the filter.
     * @param {FindUniqueusers_gamesArgs} args - Arguments to find a Users_games
     * @example
     * // Get one Users_games
     * const users_games = await prisma.users_games.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FindUniqueusers_gamesArgs>(
      args: Subset<T, FindUniqueusers_gamesArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games | null>, Prisma__users_gamesClient<users_gamesGetPayload<T> | null>>

    /**
     * Find the first Users_games that matches the filter.
     * @param {FindFirstusers_gamesArgs} args - Arguments to find a Users_games
     * @example
     * // Get one Users_games
     * const users_games = await prisma.users_games.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FindFirstusers_gamesArgs>(
      args?: Subset<T, FindFirstusers_gamesArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games | null>, Prisma__users_gamesClient<users_gamesGetPayload<T> | null>>

    /**
     * Find zero or more Users_games that matches the filter.
     * @param {FindManyusers_gamesArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users_games
     * const users_games = await prisma.users_games.findMany()
     * 
     * // Get first 10 Users_games
     * const users_games = await prisma.users_games.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const users_gamesWithUser_idOnly = await prisma.users_games.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends FindManyusers_gamesArgs>(
      args?: Subset<T, FindManyusers_gamesArgs>
    ): CheckSelect<T, Promise<Array<users_games>>, Promise<Array<users_gamesGetPayload<T>>>>

    /**
     * Create a Users_games.
     * @param {users_gamesCreateArgs} args - Arguments to create a Users_games.
     * @example
     * // Create one Users_games
     * const Users_games = await prisma.users_games.create({
     *   data: {
     *     // ... data to create a Users_games
     *   }
     * })
     * 
    **/
    create<T extends users_gamesCreateArgs>(
      args: Subset<T, users_gamesCreateArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games>, Prisma__users_gamesClient<users_gamesGetPayload<T>>>

    /**
     * Delete a Users_games.
     * @param {users_gamesDeleteArgs} args - Arguments to delete one Users_games.
     * @example
     * // Delete one Users_games
     * const Users_games = await prisma.users_games.delete({
     *   where: {
     *     // ... filter to delete one Users_games
     *   }
     * })
     * 
    **/
    delete<T extends users_gamesDeleteArgs>(
      args: Subset<T, users_gamesDeleteArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games>, Prisma__users_gamesClient<users_gamesGetPayload<T>>>

    /**
     * Update one Users_games.
     * @param {users_gamesUpdateArgs} args - Arguments to update one Users_games.
     * @example
     * // Update one Users_games
     * const users_games = await prisma.users_games.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends users_gamesUpdateArgs>(
      args: Subset<T, users_gamesUpdateArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games>, Prisma__users_gamesClient<users_gamesGetPayload<T>>>

    /**
     * Delete zero or more Users_games.
     * @param {users_gamesDeleteManyArgs} args - Arguments to filter Users_games to delete.
     * @example
     * // Delete a few Users_games
     * const { count } = await prisma.users_games.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends users_gamesDeleteManyArgs>(
      args?: Subset<T, users_gamesDeleteManyArgs>
    ): Promise<BatchPayload>

    /**
     * Update zero or more Users_games.
     * @param {users_gamesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users_games
     * const users_games = await prisma.users_games.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends users_gamesUpdateManyArgs>(
      args: Subset<T, users_gamesUpdateManyArgs>
    ): Promise<BatchPayload>

    /**
     * Create or update one Users_games.
     * @param {users_gamesUpsertArgs} args - Arguments to update or create a Users_games.
     * @example
     * // Update or create a Users_games
     * const users_games = await prisma.users_games.upsert({
     *   create: {
     *     // ... data to create a Users_games
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users_games we want to update
     *   }
     * })
    **/
    upsert<T extends users_gamesUpsertArgs>(
      args: Subset<T, users_gamesUpsertArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games>, Prisma__users_gamesClient<users_gamesGetPayload<T>>>

    /**
     * Find zero or one Users_games that matches the filter.
     * @param {FindUniqueusers_gamesArgs} args - Arguments to find a Users_games
     * @deprecated This will be deprecated please use prisma.users_games.findUnique
     * @example
     * // Get one Users_games
     * const users_games = await prisma.users_games.findOne({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findOne<T extends FindUniqueusers_gamesArgs>(
      args: Subset<T, FindUniqueusers_gamesArgs>
    ): CheckSelect<T, Prisma__users_gamesClient<users_games | null>, Prisma__users_gamesClient<users_gamesGetPayload<T> | null>>

    /**
     * Count the number of Users_games.
     * @param {FindManyusers_gamesArgs} args - Arguments to filter Users_games to count.
     * @example
     * // Count the number of Users_games
     * const count = await prisma.users_games.count({
     *   where: {
     *     // ... the filter for the Users_games we want to count
     *   }
     * })
    **/
    count(args?: Omit<FindManyusers_gamesArgs, 'select' | 'include'>): Promise<number>

    /**
     * Allows you to perform aggregations operations on a Users_games.
     * @param {AggregateUsers_gamesArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AggregateUsers_gamesArgs>(args: Subset<T, AggregateUsers_gamesArgs>): Promise<GetUsers_gamesAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for users_games.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__users_gamesClient<T> implements Promise<T> {
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

    games<T extends gamesArgs = {}>(args?: Subset<T, gamesArgs>): CheckSelect<T, Prisma__gamesClient<games | null>, Prisma__gamesClient<gamesGetPayload<T> | null>>;

    guilds<T extends guildsArgs = {}>(args?: Subset<T, guildsArgs>): CheckSelect<T, Prisma__guildsClient<guilds | null>, Prisma__guildsClient<guildsGetPayload<T> | null>>;

    users<T extends usersArgs = {}>(args?: Subset<T, usersArgs>): CheckSelect<T, Prisma__usersClient<users | null>, Prisma__usersClient<usersGetPayload<T> | null>>;

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
   * users_games findUnique
   */
  export type FindUniqueusers_gamesArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * Filter, which users_games to fetch.
    **/
    where: users_gamesWhereUniqueInput
  }


  /**
   * users_games findFirst
   */
  export type FindFirstusers_gamesArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * Filter, which users_games to fetch.
    **/
    where?: users_gamesWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of users_games to fetch.
    **/
    orderBy?: Enumerable<users_gamesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users_games.
    **/
    cursor?: users_gamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users_games from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users_games.
    **/
    skip?: number
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs
     * 
     * Filter by unique combinations of users_games.
    **/
    distinct?: Enumerable<Users_gamesScalarFieldEnum>
  }


  /**
   * users_games findMany
   */
  export type FindManyusers_gamesArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * Filter, which users_games to fetch.
    **/
    where?: users_gamesWhereInput
    /**
     * @link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs
     * 
     * Determine the order of users_games to fetch.
    **/
    orderBy?: Enumerable<users_gamesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users_games.
    **/
    cursor?: users_gamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users_games from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users_games.
    **/
    skip?: number
    distinct?: Enumerable<Users_gamesScalarFieldEnum>
  }


  /**
   * users_games create
   */
  export type users_gamesCreateArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * The data needed to create a users_games.
    **/
    data: users_gamesCreateInput
  }


  /**
   * users_games update
   */
  export type users_gamesUpdateArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * The data needed to update a users_games.
    **/
    data: users_gamesUpdateInput
    /**
     * Choose, which users_games to update.
    **/
    where: users_gamesWhereUniqueInput
  }


  /**
   * users_games updateMany
   */
  export type users_gamesUpdateManyArgs = {
    data: users_gamesUpdateManyMutationInput
    where?: users_gamesWhereInput
  }


  /**
   * users_games upsert
   */
  export type users_gamesUpsertArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * The filter to search for the users_games to update in case it exists.
    **/
    where: users_gamesWhereUniqueInput
    /**
     * In case the users_games found by the `where` argument doesn't exist, create a new users_games with this data.
    **/
    create: users_gamesCreateInput
    /**
     * In case the users_games was found with the provided `where` argument, update it with this data.
    **/
    update: users_gamesUpdateInput
  }


  /**
   * users_games delete
   */
  export type users_gamesDeleteArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
    /**
     * Filter which users_games to delete.
    **/
    where: users_gamesWhereUniqueInput
  }


  /**
   * users_games deleteMany
   */
  export type users_gamesDeleteManyArgs = {
    where?: users_gamesWhereInput
  }


  /**
   * users_games without action
   */
  export type users_gamesArgs = {
    /**
     * Select specific fields to fetch from the users_games
    **/
    select?: users_gamesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: users_gamesInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const GamesScalarFieldEnum: {
    game_id: 'game_id',
    guild_id: 'guild_id',
    connect_code: 'connect_code',
    start_time: 'start_time',
    win_type: 'win_type',
    end_time: 'end_time'
  };

  export type GamesScalarFieldEnum = (typeof GamesScalarFieldEnum)[keyof typeof GamesScalarFieldEnum]


  export const GuildsScalarFieldEnum: {
    guild_id: 'guild_id',
    guild_name: 'guild_name',
    premium: 'premium',
    tx_time_unix: 'tx_time_unix'
  };

  export type GuildsScalarFieldEnum = (typeof GuildsScalarFieldEnum)[keyof typeof GuildsScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    user_id: 'user_id',
    opt: 'opt'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const Users_gamesScalarFieldEnum: {
    user_id: 'user_id',
    guild_id: 'guild_id',
    game_id: 'game_id',
    player_name: 'player_name',
    player_color: 'player_color',
    player_role: 'player_role',
    player_won: 'player_won'
  };

  export type Users_gamesScalarFieldEnum = (typeof Users_gamesScalarFieldEnum)[keyof typeof Users_gamesScalarFieldEnum]


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


  export type gamesWhereInput = {
    AND?: Enumerable<gamesWhereInput>
    OR?: Enumerable<gamesWhereInput>
    NOT?: Enumerable<gamesWhereInput>
    game_id?: BigIntFilter | BigInt | number
    guild_id?: DecimalNullableFilter | Decimal | number | string | null
    connect_code?: StringFilter | string
    start_time?: IntFilter | number
    win_type?: IntNullableFilter | number | null
    end_time?: IntNullableFilter | number | null
    guilds?: XOR<guildsWhereInput, GuildsRelationFilter> | null
    users_games?: Users_gamesListRelationFilter
  }

  export type gamesOrderByInput = {
    game_id?: SortOrder
    guild_id?: SortOrder
    connect_code?: SortOrder
    start_time?: SortOrder
    win_type?: SortOrder
    end_time?: SortOrder
  }

  export type gamesWhereUniqueInput = {
    game_id?: BigInt | number
  }

  export type guildsWhereInput = {
    AND?: Enumerable<guildsWhereInput>
    OR?: Enumerable<guildsWhereInput>
    NOT?: Enumerable<guildsWhereInput>
    guild_id?: DecimalFilter | Decimal | number | string
    guild_name?: StringFilter | string
    premium?: IntFilter | number
    tx_time_unix?: IntNullableFilter | number | null
    games?: GamesListRelationFilter
    users_games?: Users_gamesListRelationFilter
  }

  export type guildsOrderByInput = {
    guild_id?: SortOrder
    guild_name?: SortOrder
    premium?: SortOrder
    tx_time_unix?: SortOrder
  }

  export type guildsWhereUniqueInput = {
    guild_id?: Decimal | number | string
  }

  export type usersWhereInput = {
    AND?: Enumerable<usersWhereInput>
    OR?: Enumerable<usersWhereInput>
    NOT?: Enumerable<usersWhereInput>
    user_id?: DecimalFilter | Decimal | number | string
    opt?: BoolNullableFilter | boolean | null
    users_games?: Users_gamesListRelationFilter
  }

  export type usersOrderByInput = {
    user_id?: SortOrder
    opt?: SortOrder
  }

  export type usersWhereUniqueInput = {
    user_id?: Decimal | number | string
  }

  export type users_gamesWhereInput = {
    AND?: Enumerable<users_gamesWhereInput>
    OR?: Enumerable<users_gamesWhereInput>
    NOT?: Enumerable<users_gamesWhereInput>
    user_id?: DecimalFilter | Decimal | number | string
    guild_id?: DecimalNullableFilter | Decimal | number | string | null
    game_id?: BigIntFilter | BigInt | number
    player_name?: StringFilter | string
    player_color?: IntFilter | number
    player_role?: IntFilter | number
    player_won?: BoolFilter | boolean
    games?: XOR<gamesWhereInput, GamesRelationFilter>
    guilds?: XOR<guildsWhereInput, GuildsRelationFilter> | null
    users?: XOR<usersWhereInput, UsersRelationFilter>
  }

  export type users_gamesOrderByInput = {
    user_id?: SortOrder
    guild_id?: SortOrder
    game_id?: SortOrder
    player_name?: SortOrder
    player_color?: SortOrder
    player_role?: SortOrder
    player_won?: SortOrder
  }

  export type users_gamesWhereUniqueInput = {
    user_id_game_id?: users_gamesUser_idGame_idCompoundUniqueInput
  }

  export type gamesCreateInput = {
    game_id?: BigInt | number
    connect_code: string
    start_time: number
    win_type?: number | null
    end_time?: number | null
    guilds?: guildsCreateOneWithoutGamesInput
    users_games?: users_gamesCreateManyWithoutGamesInput
  }

  export type gamesUpdateInput = {
    game_id?: BigIntFieldUpdateOperationsInput | BigInt | number
    connect_code?: StringFieldUpdateOperationsInput | string
    start_time?: IntFieldUpdateOperationsInput | number
    win_type?: NullableIntFieldUpdateOperationsInput | number | null
    end_time?: NullableIntFieldUpdateOperationsInput | number | null
    guilds?: guildsUpdateOneWithoutGamesInput
    users_games?: users_gamesUpdateManyWithoutGamesInput
  }

  export type gamesUpdateManyMutationInput = {
    game_id?: BigIntFieldUpdateOperationsInput | BigInt | number
    connect_code?: StringFieldUpdateOperationsInput | string
    start_time?: IntFieldUpdateOperationsInput | number
    win_type?: NullableIntFieldUpdateOperationsInput | number | null
    end_time?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type guildsCreateInput = {
    guild_id: Decimal | number | string
    guild_name: string
    premium: number
    tx_time_unix?: number | null
    games?: gamesCreateManyWithoutGuildsInput
    users_games?: users_gamesCreateManyWithoutGuildsInput
  }

  export type guildsUpdateInput = {
    guild_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    guild_name?: StringFieldUpdateOperationsInput | string
    premium?: IntFieldUpdateOperationsInput | number
    tx_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
    games?: gamesUpdateManyWithoutGuildsInput
    users_games?: users_gamesUpdateManyWithoutGuildsInput
  }

  export type guildsUpdateManyMutationInput = {
    guild_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    guild_name?: StringFieldUpdateOperationsInput | string
    premium?: IntFieldUpdateOperationsInput | number
    tx_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type usersCreateInput = {
    user_id: Decimal | number | string
    opt?: boolean | null
    users_games?: users_gamesCreateManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    user_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    opt?: NullableBoolFieldUpdateOperationsInput | boolean | null
    users_games?: users_gamesUpdateManyWithoutUsersInput
  }

  export type usersUpdateManyMutationInput = {
    user_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    opt?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type users_gamesCreateInput = {
    player_name: string
    player_color: number
    player_role: number
    player_won: boolean
    games: gamesCreateOneWithoutUsers_gamesInput
    guilds?: guildsCreateOneWithoutUsers_gamesInput
    users: usersCreateOneWithoutUsers_gamesInput
  }

  export type users_gamesUpdateInput = {
    player_name?: StringFieldUpdateOperationsInput | string
    player_color?: IntFieldUpdateOperationsInput | number
    player_role?: IntFieldUpdateOperationsInput | number
    player_won?: BoolFieldUpdateOperationsInput | boolean
    games?: gamesUpdateOneRequiredWithoutUsers_gamesInput
    guilds?: guildsUpdateOneWithoutUsers_gamesInput
    users?: usersUpdateOneRequiredWithoutUsers_gamesInput
  }

  export type users_gamesUpdateManyMutationInput = {
    player_name?: StringFieldUpdateOperationsInput | string
    player_color?: IntFieldUpdateOperationsInput | number
    player_role?: IntFieldUpdateOperationsInput | number
    player_won?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BigIntFilter = {
    equals?: BigInt | number
    in?: Enumerable<BigInt> | Enumerable<number>
    notIn?: Enumerable<BigInt> | Enumerable<number>
    lt?: BigInt | number
    lte?: BigInt | number
    gt?: BigInt | number
    gte?: BigInt | number
    not?: NestedBigIntFilter | BigInt | number
  }

  export type DecimalNullableFilter = {
    equals?: Decimal | number | string | null
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null
    lt?: Decimal | number | string
    lte?: Decimal | number | string
    gt?: Decimal | number | string
    gte?: Decimal | number | string
    not?: NestedDecimalNullableFilter | Decimal | number | string | null
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

  export type GuildsRelationFilter = {
    is?: guildsWhereInput | null
    isNot?: guildsWhereInput | null
  }

  export type Users_gamesListRelationFilter = {
    every?: users_gamesWhereInput
    some?: users_gamesWhereInput
    none?: users_gamesWhereInput
  }

  export type DecimalFilter = {
    equals?: Decimal | number | string
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>
    lt?: Decimal | number | string
    lte?: Decimal | number | string
    gt?: Decimal | number | string
    gte?: Decimal | number | string
    not?: NestedDecimalFilter | Decimal | number | string
  }

  export type GamesListRelationFilter = {
    every?: gamesWhereInput
    some?: gamesWhereInput
    none?: gamesWhereInput
  }

  export type BoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type GamesRelationFilter = {
    is?: gamesWhereInput
    isNot?: gamesWhereInput
  }

  export type UsersRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type users_gamesUser_idGame_idCompoundUniqueInput = {
    user_id: Decimal | number | string
    game_id: BigInt | number
  }

  export type guildsCreateOneWithoutGamesInput = {
    create?: guildsCreateWithoutGamesInput
    connect?: guildsWhereUniqueInput
    connectOrCreate?: guildsCreateOrConnectWithoutgamesInput
  }

  export type users_gamesCreateManyWithoutGamesInput = {
    create?: Enumerable<users_gamesCreateWithoutGamesInput>
    connect?: Enumerable<users_gamesWhereUniqueInput>
    connectOrCreate?: Enumerable<users_gamesCreateOrConnectWithoutgamesInput>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: BigInt | number
    increment?: BigInt | number
    decrement?: BigInt | number
    multiply?: BigInt | number
    divide?: BigInt | number
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

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type guildsUpdateOneWithoutGamesInput = {
    create?: guildsCreateWithoutGamesInput
    connect?: guildsWhereUniqueInput
    disconnect?: boolean
    delete?: boolean
    update?: guildsUpdateWithoutGamesInput
    upsert?: guildsUpsertWithoutGamesInput
    connectOrCreate?: guildsCreateOrConnectWithoutgamesInput
  }

  export type users_gamesUpdateManyWithoutGamesInput = {
    create?: Enumerable<users_gamesCreateWithoutGamesInput>
    connect?: Enumerable<users_gamesWhereUniqueInput>
    set?: Enumerable<users_gamesWhereUniqueInput>
    disconnect?: Enumerable<users_gamesWhereUniqueInput>
    delete?: Enumerable<users_gamesWhereUniqueInput>
    update?: Enumerable<users_gamesUpdateWithWhereUniqueWithoutGamesInput>
    updateMany?: Enumerable<users_gamesUpdateManyWithWhereWithoutGamesInput>
    deleteMany?: Enumerable<users_gamesScalarWhereInput>
    upsert?: Enumerable<users_gamesUpsertWithWhereUniqueWithoutGamesInput>
    connectOrCreate?: Enumerable<users_gamesCreateOrConnectWithoutgamesInput>
  }

  export type gamesCreateManyWithoutGuildsInput = {
    create?: Enumerable<gamesCreateWithoutGuildsInput>
    connect?: Enumerable<gamesWhereUniqueInput>
    connectOrCreate?: Enumerable<gamesCreateOrConnectWithoutguildsInput>
  }

  export type users_gamesCreateManyWithoutGuildsInput = {
    create?: Enumerable<users_gamesCreateWithoutGuildsInput>
    connect?: Enumerable<users_gamesWhereUniqueInput>
    connectOrCreate?: Enumerable<users_gamesCreateOrConnectWithoutguildsInput>
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | number | string
    increment?: Decimal | number | string
    decrement?: Decimal | number | string
    multiply?: Decimal | number | string
    divide?: Decimal | number | string
  }

  export type gamesUpdateManyWithoutGuildsInput = {
    create?: Enumerable<gamesCreateWithoutGuildsInput>
    connect?: Enumerable<gamesWhereUniqueInput>
    set?: Enumerable<gamesWhereUniqueInput>
    disconnect?: Enumerable<gamesWhereUniqueInput>
    delete?: Enumerable<gamesWhereUniqueInput>
    update?: Enumerable<gamesUpdateWithWhereUniqueWithoutGuildsInput>
    updateMany?: Enumerable<gamesUpdateManyWithWhereWithoutGuildsInput>
    deleteMany?: Enumerable<gamesScalarWhereInput>
    upsert?: Enumerable<gamesUpsertWithWhereUniqueWithoutGuildsInput>
    connectOrCreate?: Enumerable<gamesCreateOrConnectWithoutguildsInput>
  }

  export type users_gamesUpdateManyWithoutGuildsInput = {
    create?: Enumerable<users_gamesCreateWithoutGuildsInput>
    connect?: Enumerable<users_gamesWhereUniqueInput>
    set?: Enumerable<users_gamesWhereUniqueInput>
    disconnect?: Enumerable<users_gamesWhereUniqueInput>
    delete?: Enumerable<users_gamesWhereUniqueInput>
    update?: Enumerable<users_gamesUpdateWithWhereUniqueWithoutGuildsInput>
    updateMany?: Enumerable<users_gamesUpdateManyWithWhereWithoutGuildsInput>
    deleteMany?: Enumerable<users_gamesScalarWhereInput>
    upsert?: Enumerable<users_gamesUpsertWithWhereUniqueWithoutGuildsInput>
    connectOrCreate?: Enumerable<users_gamesCreateOrConnectWithoutguildsInput>
  }

  export type users_gamesCreateManyWithoutUsersInput = {
    create?: Enumerable<users_gamesCreateWithoutUsersInput>
    connect?: Enumerable<users_gamesWhereUniqueInput>
    connectOrCreate?: Enumerable<users_gamesCreateOrConnectWithoutusersInput>
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type users_gamesUpdateManyWithoutUsersInput = {
    create?: Enumerable<users_gamesCreateWithoutUsersInput>
    connect?: Enumerable<users_gamesWhereUniqueInput>
    set?: Enumerable<users_gamesWhereUniqueInput>
    disconnect?: Enumerable<users_gamesWhereUniqueInput>
    delete?: Enumerable<users_gamesWhereUniqueInput>
    update?: Enumerable<users_gamesUpdateWithWhereUniqueWithoutUsersInput>
    updateMany?: Enumerable<users_gamesUpdateManyWithWhereWithoutUsersInput>
    deleteMany?: Enumerable<users_gamesScalarWhereInput>
    upsert?: Enumerable<users_gamesUpsertWithWhereUniqueWithoutUsersInput>
    connectOrCreate?: Enumerable<users_gamesCreateOrConnectWithoutusersInput>
  }

  export type gamesCreateOneWithoutUsers_gamesInput = {
    create?: gamesCreateWithoutUsers_gamesInput
    connect?: gamesWhereUniqueInput
    connectOrCreate?: gamesCreateOrConnectWithoutusers_gamesInput
  }

  export type guildsCreateOneWithoutUsers_gamesInput = {
    create?: guildsCreateWithoutUsers_gamesInput
    connect?: guildsWhereUniqueInput
    connectOrCreate?: guildsCreateOrConnectWithoutusers_gamesInput
  }

  export type usersCreateOneWithoutUsers_gamesInput = {
    create?: usersCreateWithoutUsers_gamesInput
    connect?: usersWhereUniqueInput
    connectOrCreate?: usersCreateOrConnectWithoutusers_gamesInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type gamesUpdateOneRequiredWithoutUsers_gamesInput = {
    create?: gamesCreateWithoutUsers_gamesInput
    connect?: gamesWhereUniqueInput
    update?: gamesUpdateWithoutUsers_gamesInput
    upsert?: gamesUpsertWithoutUsers_gamesInput
    connectOrCreate?: gamesCreateOrConnectWithoutusers_gamesInput
  }

  export type guildsUpdateOneWithoutUsers_gamesInput = {
    create?: guildsCreateWithoutUsers_gamesInput
    connect?: guildsWhereUniqueInput
    disconnect?: boolean
    delete?: boolean
    update?: guildsUpdateWithoutUsers_gamesInput
    upsert?: guildsUpsertWithoutUsers_gamesInput
    connectOrCreate?: guildsCreateOrConnectWithoutusers_gamesInput
  }

  export type usersUpdateOneRequiredWithoutUsers_gamesInput = {
    create?: usersCreateWithoutUsers_gamesInput
    connect?: usersWhereUniqueInput
    update?: usersUpdateWithoutUsers_gamesInput
    upsert?: usersUpsertWithoutUsers_gamesInput
    connectOrCreate?: usersCreateOrConnectWithoutusers_gamesInput
  }

  export type NestedBigIntFilter = {
    equals?: BigInt | number
    in?: Enumerable<BigInt> | Enumerable<number>
    notIn?: Enumerable<BigInt> | Enumerable<number>
    lt?: BigInt | number
    lte?: BigInt | number
    gt?: BigInt | number
    gte?: BigInt | number
    not?: NestedBigIntFilter | BigInt | number
  }

  export type NestedDecimalNullableFilter = {
    equals?: Decimal | number | string | null
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null
    lt?: Decimal | number | string
    lte?: Decimal | number | string
    gt?: Decimal | number | string
    gte?: Decimal | number | string
    not?: NestedDecimalNullableFilter | Decimal | number | string | null
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

  export type NestedDecimalFilter = {
    equals?: Decimal | number | string
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>
    lt?: Decimal | number | string
    lte?: Decimal | number | string
    gt?: Decimal | number | string
    gte?: Decimal | number | string
    not?: NestedDecimalFilter | Decimal | number | string
  }

  export type NestedBoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type guildsCreateWithoutGamesInput = {
    guild_id: Decimal | number | string
    guild_name: string
    premium: number
    tx_time_unix?: number | null
    users_games?: users_gamesCreateManyWithoutGuildsInput
  }

  export type guildsCreateOrConnectWithoutgamesInput = {
    where: guildsWhereUniqueInput
    create: guildsCreateWithoutGamesInput
  }

  export type users_gamesCreateWithoutGamesInput = {
    player_name: string
    player_color: number
    player_role: number
    player_won: boolean
    guilds?: guildsCreateOneWithoutUsers_gamesInput
    users: usersCreateOneWithoutUsers_gamesInput
  }

  export type users_gamesCreateOrConnectWithoutgamesInput = {
    where: users_gamesWhereUniqueInput
    create: users_gamesCreateWithoutGamesInput
  }

  export type guildsUpdateWithoutGamesInput = {
    guild_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    guild_name?: StringFieldUpdateOperationsInput | string
    premium?: IntFieldUpdateOperationsInput | number
    tx_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
    users_games?: users_gamesUpdateManyWithoutGuildsInput
  }

  export type guildsUpsertWithoutGamesInput = {
    update: guildsUpdateWithoutGamesInput
    create: guildsCreateWithoutGamesInput
  }

  export type users_gamesUpdateWithWhereUniqueWithoutGamesInput = {
    where: users_gamesWhereUniqueInput
    data: users_gamesUpdateWithoutGamesInput
  }

  export type users_gamesUpdateManyWithWhereWithoutGamesInput = {
    where: users_gamesScalarWhereInput
    data: users_gamesUpdateManyMutationInput
  }

  export type users_gamesScalarWhereInput = {
    AND?: Enumerable<users_gamesScalarWhereInput>
    OR?: Enumerable<users_gamesScalarWhereInput>
    NOT?: Enumerable<users_gamesScalarWhereInput>
    user_id?: DecimalFilter | Decimal | number | string
    guild_id?: DecimalNullableFilter | Decimal | number | string | null
    game_id?: BigIntFilter | BigInt | number
    player_name?: StringFilter | string
    player_color?: IntFilter | number
    player_role?: IntFilter | number
    player_won?: BoolFilter | boolean
  }

  export type users_gamesUpsertWithWhereUniqueWithoutGamesInput = {
    where: users_gamesWhereUniqueInput
    update: users_gamesUpdateWithoutGamesInput
    create: users_gamesCreateWithoutGamesInput
  }

  export type gamesCreateWithoutGuildsInput = {
    game_id?: BigInt | number
    connect_code: string
    start_time: number
    win_type?: number | null
    end_time?: number | null
    users_games?: users_gamesCreateManyWithoutGamesInput
  }

  export type gamesCreateOrConnectWithoutguildsInput = {
    where: gamesWhereUniqueInput
    create: gamesCreateWithoutGuildsInput
  }

  export type users_gamesCreateWithoutGuildsInput = {
    player_name: string
    player_color: number
    player_role: number
    player_won: boolean
    games: gamesCreateOneWithoutUsers_gamesInput
    users: usersCreateOneWithoutUsers_gamesInput
  }

  export type users_gamesCreateOrConnectWithoutguildsInput = {
    where: users_gamesWhereUniqueInput
    create: users_gamesCreateWithoutGuildsInput
  }

  export type gamesUpdateWithWhereUniqueWithoutGuildsInput = {
    where: gamesWhereUniqueInput
    data: gamesUpdateWithoutGuildsInput
  }

  export type gamesUpdateManyWithWhereWithoutGuildsInput = {
    where: gamesScalarWhereInput
    data: gamesUpdateManyMutationInput
  }

  export type gamesScalarWhereInput = {
    AND?: Enumerable<gamesScalarWhereInput>
    OR?: Enumerable<gamesScalarWhereInput>
    NOT?: Enumerable<gamesScalarWhereInput>
    game_id?: BigIntFilter | BigInt | number
    guild_id?: DecimalNullableFilter | Decimal | number | string | null
    connect_code?: StringFilter | string
    start_time?: IntFilter | number
    win_type?: IntNullableFilter | number | null
    end_time?: IntNullableFilter | number | null
  }

  export type gamesUpsertWithWhereUniqueWithoutGuildsInput = {
    where: gamesWhereUniqueInput
    update: gamesUpdateWithoutGuildsInput
    create: gamesCreateWithoutGuildsInput
  }

  export type users_gamesUpdateWithWhereUniqueWithoutGuildsInput = {
    where: users_gamesWhereUniqueInput
    data: users_gamesUpdateWithoutGuildsInput
  }

  export type users_gamesUpdateManyWithWhereWithoutGuildsInput = {
    where: users_gamesScalarWhereInput
    data: users_gamesUpdateManyMutationInput
  }

  export type users_gamesUpsertWithWhereUniqueWithoutGuildsInput = {
    where: users_gamesWhereUniqueInput
    update: users_gamesUpdateWithoutGuildsInput
    create: users_gamesCreateWithoutGuildsInput
  }

  export type users_gamesCreateWithoutUsersInput = {
    player_name: string
    player_color: number
    player_role: number
    player_won: boolean
    games: gamesCreateOneWithoutUsers_gamesInput
    guilds?: guildsCreateOneWithoutUsers_gamesInput
  }

  export type users_gamesCreateOrConnectWithoutusersInput = {
    where: users_gamesWhereUniqueInput
    create: users_gamesCreateWithoutUsersInput
  }

  export type users_gamesUpdateWithWhereUniqueWithoutUsersInput = {
    where: users_gamesWhereUniqueInput
    data: users_gamesUpdateWithoutUsersInput
  }

  export type users_gamesUpdateManyWithWhereWithoutUsersInput = {
    where: users_gamesScalarWhereInput
    data: users_gamesUpdateManyMutationInput
  }

  export type users_gamesUpsertWithWhereUniqueWithoutUsersInput = {
    where: users_gamesWhereUniqueInput
    update: users_gamesUpdateWithoutUsersInput
    create: users_gamesCreateWithoutUsersInput
  }

  export type gamesCreateWithoutUsers_gamesInput = {
    game_id?: BigInt | number
    connect_code: string
    start_time: number
    win_type?: number | null
    end_time?: number | null
    guilds?: guildsCreateOneWithoutGamesInput
  }

  export type gamesCreateOrConnectWithoutusers_gamesInput = {
    where: gamesWhereUniqueInput
    create: gamesCreateWithoutUsers_gamesInput
  }

  export type guildsCreateWithoutUsers_gamesInput = {
    guild_id: Decimal | number | string
    guild_name: string
    premium: number
    tx_time_unix?: number | null
    games?: gamesCreateManyWithoutGuildsInput
  }

  export type guildsCreateOrConnectWithoutusers_gamesInput = {
    where: guildsWhereUniqueInput
    create: guildsCreateWithoutUsers_gamesInput
  }

  export type usersCreateWithoutUsers_gamesInput = {
    user_id: Decimal | number | string
    opt?: boolean | null
  }

  export type usersCreateOrConnectWithoutusers_gamesInput = {
    where: usersWhereUniqueInput
    create: usersCreateWithoutUsers_gamesInput
  }

  export type gamesUpdateWithoutUsers_gamesInput = {
    game_id?: BigIntFieldUpdateOperationsInput | BigInt | number
    connect_code?: StringFieldUpdateOperationsInput | string
    start_time?: IntFieldUpdateOperationsInput | number
    win_type?: NullableIntFieldUpdateOperationsInput | number | null
    end_time?: NullableIntFieldUpdateOperationsInput | number | null
    guilds?: guildsUpdateOneWithoutGamesInput
  }

  export type gamesUpsertWithoutUsers_gamesInput = {
    update: gamesUpdateWithoutUsers_gamesInput
    create: gamesCreateWithoutUsers_gamesInput
  }

  export type guildsUpdateWithoutUsers_gamesInput = {
    guild_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    guild_name?: StringFieldUpdateOperationsInput | string
    premium?: IntFieldUpdateOperationsInput | number
    tx_time_unix?: NullableIntFieldUpdateOperationsInput | number | null
    games?: gamesUpdateManyWithoutGuildsInput
  }

  export type guildsUpsertWithoutUsers_gamesInput = {
    update: guildsUpdateWithoutUsers_gamesInput
    create: guildsCreateWithoutUsers_gamesInput
  }

  export type usersUpdateWithoutUsers_gamesInput = {
    user_id?: DecimalFieldUpdateOperationsInput | Decimal | number | string
    opt?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type usersUpsertWithoutUsers_gamesInput = {
    update: usersUpdateWithoutUsers_gamesInput
    create: usersCreateWithoutUsers_gamesInput
  }

  export type users_gamesUpdateWithoutGamesInput = {
    player_name?: StringFieldUpdateOperationsInput | string
    player_color?: IntFieldUpdateOperationsInput | number
    player_role?: IntFieldUpdateOperationsInput | number
    player_won?: BoolFieldUpdateOperationsInput | boolean
    guilds?: guildsUpdateOneWithoutUsers_gamesInput
    users?: usersUpdateOneRequiredWithoutUsers_gamesInput
  }

  export type gamesUpdateWithoutGuildsInput = {
    game_id?: BigIntFieldUpdateOperationsInput | BigInt | number
    connect_code?: StringFieldUpdateOperationsInput | string
    start_time?: IntFieldUpdateOperationsInput | number
    win_type?: NullableIntFieldUpdateOperationsInput | number | null
    end_time?: NullableIntFieldUpdateOperationsInput | number | null
    users_games?: users_gamesUpdateManyWithoutGamesInput
  }

  export type users_gamesUpdateWithoutGuildsInput = {
    player_name?: StringFieldUpdateOperationsInput | string
    player_color?: IntFieldUpdateOperationsInput | number
    player_role?: IntFieldUpdateOperationsInput | number
    player_won?: BoolFieldUpdateOperationsInput | boolean
    games?: gamesUpdateOneRequiredWithoutUsers_gamesInput
    users?: usersUpdateOneRequiredWithoutUsers_gamesInput
  }

  export type users_gamesUpdateWithoutUsersInput = {
    player_name?: StringFieldUpdateOperationsInput | string
    player_color?: IntFieldUpdateOperationsInput | number
    player_role?: IntFieldUpdateOperationsInput | number
    player_won?: BoolFieldUpdateOperationsInput | boolean
    games?: gamesUpdateOneRequiredWithoutUsers_gamesInput
    guilds?: guildsUpdateOneWithoutUsers_gamesInput
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
 * @deprecated Renamed to `Prisma.GamesScalarFieldEnum`
 */
export type GamesScalarFieldEnum = Prisma.GamesScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.GuildsScalarFieldEnum`
 */
export type GuildsScalarFieldEnum = Prisma.GuildsScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.UsersScalarFieldEnum`
 */
export type UsersScalarFieldEnum = Prisma.UsersScalarFieldEnum

/**
 * @deprecated Renamed to `Prisma.Users_gamesScalarFieldEnum`
 */
export type Users_gamesScalarFieldEnum = Prisma.Users_gamesScalarFieldEnum

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
 * @deprecated Renamed to `Prisma.AggregateGames`
 */
export type AggregateGames = Prisma.AggregateGames

/**
 * @deprecated Renamed to `Prisma.GamesAvgAggregateOutputType`
 */
export type GamesAvgAggregateOutputType = Prisma.GamesAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GamesSumAggregateOutputType`
 */
export type GamesSumAggregateOutputType = Prisma.GamesSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GamesMinAggregateOutputType`
 */
export type GamesMinAggregateOutputType = Prisma.GamesMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GamesMaxAggregateOutputType`
 */
export type GamesMaxAggregateOutputType = Prisma.GamesMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GamesCountAggregateOutputType`
 */
export type GamesCountAggregateOutputType = Prisma.GamesCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateGamesArgs`
 */
export type AggregateGamesArgs = Prisma.AggregateGamesArgs

/**
 * @deprecated Renamed to `Prisma.GamesAvgAggregateInputType`
 */
export type GamesAvgAggregateInputType = Prisma.GamesAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GamesSumAggregateInputType`
 */
export type GamesSumAggregateInputType = Prisma.GamesSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GamesMinAggregateInputType`
 */
export type GamesMinAggregateInputType = Prisma.GamesMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GamesMaxAggregateInputType`
 */
export type GamesMaxAggregateInputType = Prisma.GamesMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GamesCountAggregateInputType`
 */
export type GamesCountAggregateInputType = Prisma.GamesCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.gamesSelect`
 */
export type gamesSelect = Prisma.gamesSelect

/**
 * @deprecated Renamed to `Prisma.gamesInclude`
 */
export type gamesInclude = Prisma.gamesInclude

/**
 * @deprecated Renamed to `Prisma.FindUniquegamesArgs`
 */
export type FindUniquegamesArgs = Prisma.FindUniquegamesArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstgamesArgs`
 */
export type FindFirstgamesArgs = Prisma.FindFirstgamesArgs

/**
 * @deprecated Renamed to `Prisma.FindManygamesArgs`
 */
export type FindManygamesArgs = Prisma.FindManygamesArgs

/**
 * @deprecated Renamed to `Prisma.gamesCreateArgs`
 */
export type gamesCreateArgs = Prisma.gamesCreateArgs

/**
 * @deprecated Renamed to `Prisma.gamesUpdateArgs`
 */
export type gamesUpdateArgs = Prisma.gamesUpdateArgs

/**
 * @deprecated Renamed to `Prisma.gamesUpdateManyArgs`
 */
export type gamesUpdateManyArgs = Prisma.gamesUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.gamesUpsertArgs`
 */
export type gamesUpsertArgs = Prisma.gamesUpsertArgs

/**
 * @deprecated Renamed to `Prisma.gamesDeleteArgs`
 */
export type gamesDeleteArgs = Prisma.gamesDeleteArgs

/**
 * @deprecated Renamed to `Prisma.gamesDeleteManyArgs`
 */
export type gamesDeleteManyArgs = Prisma.gamesDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateGuilds`
 */
export type AggregateGuilds = Prisma.AggregateGuilds

/**
 * @deprecated Renamed to `Prisma.GuildsAvgAggregateOutputType`
 */
export type GuildsAvgAggregateOutputType = Prisma.GuildsAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildsSumAggregateOutputType`
 */
export type GuildsSumAggregateOutputType = Prisma.GuildsSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildsMinAggregateOutputType`
 */
export type GuildsMinAggregateOutputType = Prisma.GuildsMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildsMaxAggregateOutputType`
 */
export type GuildsMaxAggregateOutputType = Prisma.GuildsMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.GuildsCountAggregateOutputType`
 */
export type GuildsCountAggregateOutputType = Prisma.GuildsCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateGuildsArgs`
 */
export type AggregateGuildsArgs = Prisma.AggregateGuildsArgs

/**
 * @deprecated Renamed to `Prisma.GuildsAvgAggregateInputType`
 */
export type GuildsAvgAggregateInputType = Prisma.GuildsAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildsSumAggregateInputType`
 */
export type GuildsSumAggregateInputType = Prisma.GuildsSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildsMinAggregateInputType`
 */
export type GuildsMinAggregateInputType = Prisma.GuildsMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildsMaxAggregateInputType`
 */
export type GuildsMaxAggregateInputType = Prisma.GuildsMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.GuildsCountAggregateInputType`
 */
export type GuildsCountAggregateInputType = Prisma.GuildsCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.guildsSelect`
 */
export type guildsSelect = Prisma.guildsSelect

/**
 * @deprecated Renamed to `Prisma.guildsInclude`
 */
export type guildsInclude = Prisma.guildsInclude

/**
 * @deprecated Renamed to `Prisma.FindUniqueguildsArgs`
 */
export type FindUniqueguildsArgs = Prisma.FindUniqueguildsArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstguildsArgs`
 */
export type FindFirstguildsArgs = Prisma.FindFirstguildsArgs

/**
 * @deprecated Renamed to `Prisma.FindManyguildsArgs`
 */
export type FindManyguildsArgs = Prisma.FindManyguildsArgs

/**
 * @deprecated Renamed to `Prisma.guildsCreateArgs`
 */
export type guildsCreateArgs = Prisma.guildsCreateArgs

/**
 * @deprecated Renamed to `Prisma.guildsUpdateArgs`
 */
export type guildsUpdateArgs = Prisma.guildsUpdateArgs

/**
 * @deprecated Renamed to `Prisma.guildsUpdateManyArgs`
 */
export type guildsUpdateManyArgs = Prisma.guildsUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.guildsUpsertArgs`
 */
export type guildsUpsertArgs = Prisma.guildsUpsertArgs

/**
 * @deprecated Renamed to `Prisma.guildsDeleteArgs`
 */
export type guildsDeleteArgs = Prisma.guildsDeleteArgs

/**
 * @deprecated Renamed to `Prisma.guildsDeleteManyArgs`
 */
export type guildsDeleteManyArgs = Prisma.guildsDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateUsers`
 */
export type AggregateUsers = Prisma.AggregateUsers

/**
 * @deprecated Renamed to `Prisma.UsersAvgAggregateOutputType`
 */
export type UsersAvgAggregateOutputType = Prisma.UsersAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersSumAggregateOutputType`
 */
export type UsersSumAggregateOutputType = Prisma.UsersSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersMinAggregateOutputType`
 */
export type UsersMinAggregateOutputType = Prisma.UsersMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersMaxAggregateOutputType`
 */
export type UsersMaxAggregateOutputType = Prisma.UsersMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.UsersCountAggregateOutputType`
 */
export type UsersCountAggregateOutputType = Prisma.UsersCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateUsersArgs`
 */
export type AggregateUsersArgs = Prisma.AggregateUsersArgs

/**
 * @deprecated Renamed to `Prisma.UsersAvgAggregateInputType`
 */
export type UsersAvgAggregateInputType = Prisma.UsersAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersSumAggregateInputType`
 */
export type UsersSumAggregateInputType = Prisma.UsersSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersMinAggregateInputType`
 */
export type UsersMinAggregateInputType = Prisma.UsersMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersMaxAggregateInputType`
 */
export type UsersMaxAggregateInputType = Prisma.UsersMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.UsersCountAggregateInputType`
 */
export type UsersCountAggregateInputType = Prisma.UsersCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.usersSelect`
 */
export type usersSelect = Prisma.usersSelect

/**
 * @deprecated Renamed to `Prisma.usersInclude`
 */
export type usersInclude = Prisma.usersInclude

/**
 * @deprecated Renamed to `Prisma.FindUniqueusersArgs`
 */
export type FindUniqueusersArgs = Prisma.FindUniqueusersArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstusersArgs`
 */
export type FindFirstusersArgs = Prisma.FindFirstusersArgs

/**
 * @deprecated Renamed to `Prisma.FindManyusersArgs`
 */
export type FindManyusersArgs = Prisma.FindManyusersArgs

/**
 * @deprecated Renamed to `Prisma.usersCreateArgs`
 */
export type usersCreateArgs = Prisma.usersCreateArgs

/**
 * @deprecated Renamed to `Prisma.usersUpdateArgs`
 */
export type usersUpdateArgs = Prisma.usersUpdateArgs

/**
 * @deprecated Renamed to `Prisma.usersUpdateManyArgs`
 */
export type usersUpdateManyArgs = Prisma.usersUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.usersUpsertArgs`
 */
export type usersUpsertArgs = Prisma.usersUpsertArgs

/**
 * @deprecated Renamed to `Prisma.usersDeleteArgs`
 */
export type usersDeleteArgs = Prisma.usersDeleteArgs

/**
 * @deprecated Renamed to `Prisma.usersDeleteManyArgs`
 */
export type usersDeleteManyArgs = Prisma.usersDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.AggregateUsers_games`
 */
export type AggregateUsers_games = Prisma.AggregateUsers_games

/**
 * @deprecated Renamed to `Prisma.Users_gamesAvgAggregateOutputType`
 */
export type Users_gamesAvgAggregateOutputType = Prisma.Users_gamesAvgAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesSumAggregateOutputType`
 */
export type Users_gamesSumAggregateOutputType = Prisma.Users_gamesSumAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesMinAggregateOutputType`
 */
export type Users_gamesMinAggregateOutputType = Prisma.Users_gamesMinAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesMaxAggregateOutputType`
 */
export type Users_gamesMaxAggregateOutputType = Prisma.Users_gamesMaxAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesCountAggregateOutputType`
 */
export type Users_gamesCountAggregateOutputType = Prisma.Users_gamesCountAggregateOutputType

/**
 * @deprecated Renamed to `Prisma.AggregateUsers_gamesArgs`
 */
export type AggregateUsers_gamesArgs = Prisma.AggregateUsers_gamesArgs

/**
 * @deprecated Renamed to `Prisma.Users_gamesAvgAggregateInputType`
 */
export type Users_gamesAvgAggregateInputType = Prisma.Users_gamesAvgAggregateInputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesSumAggregateInputType`
 */
export type Users_gamesSumAggregateInputType = Prisma.Users_gamesSumAggregateInputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesMinAggregateInputType`
 */
export type Users_gamesMinAggregateInputType = Prisma.Users_gamesMinAggregateInputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesMaxAggregateInputType`
 */
export type Users_gamesMaxAggregateInputType = Prisma.Users_gamesMaxAggregateInputType

/**
 * @deprecated Renamed to `Prisma.Users_gamesCountAggregateInputType`
 */
export type Users_gamesCountAggregateInputType = Prisma.Users_gamesCountAggregateInputType

/**
 * @deprecated Renamed to `Prisma.users_gamesSelect`
 */
export type users_gamesSelect = Prisma.users_gamesSelect

/**
 * @deprecated Renamed to `Prisma.users_gamesInclude`
 */
export type users_gamesInclude = Prisma.users_gamesInclude

/**
 * @deprecated Renamed to `Prisma.FindUniqueusers_gamesArgs`
 */
export type FindUniqueusers_gamesArgs = Prisma.FindUniqueusers_gamesArgs

/**
 * @deprecated Renamed to `Prisma.FindFirstusers_gamesArgs`
 */
export type FindFirstusers_gamesArgs = Prisma.FindFirstusers_gamesArgs

/**
 * @deprecated Renamed to `Prisma.FindManyusers_gamesArgs`
 */
export type FindManyusers_gamesArgs = Prisma.FindManyusers_gamesArgs

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateArgs`
 */
export type users_gamesCreateArgs = Prisma.users_gamesCreateArgs

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateArgs`
 */
export type users_gamesUpdateArgs = Prisma.users_gamesUpdateArgs

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyArgs`
 */
export type users_gamesUpdateManyArgs = Prisma.users_gamesUpdateManyArgs

/**
 * @deprecated Renamed to `Prisma.users_gamesUpsertArgs`
 */
export type users_gamesUpsertArgs = Prisma.users_gamesUpsertArgs

/**
 * @deprecated Renamed to `Prisma.users_gamesDeleteArgs`
 */
export type users_gamesDeleteArgs = Prisma.users_gamesDeleteArgs

/**
 * @deprecated Renamed to `Prisma.users_gamesDeleteManyArgs`
 */
export type users_gamesDeleteManyArgs = Prisma.users_gamesDeleteManyArgs

/**
 * @deprecated Renamed to `Prisma.gamesWhereInput`
 */
export type gamesWhereInput = Prisma.gamesWhereInput

/**
 * @deprecated Renamed to `Prisma.gamesOrderByInput`
 */
export type gamesOrderByInput = Prisma.gamesOrderByInput

/**
 * @deprecated Renamed to `Prisma.gamesWhereUniqueInput`
 */
export type gamesWhereUniqueInput = Prisma.gamesWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.guildsWhereInput`
 */
export type guildsWhereInput = Prisma.guildsWhereInput

/**
 * @deprecated Renamed to `Prisma.guildsOrderByInput`
 */
export type guildsOrderByInput = Prisma.guildsOrderByInput

/**
 * @deprecated Renamed to `Prisma.guildsWhereUniqueInput`
 */
export type guildsWhereUniqueInput = Prisma.guildsWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.usersWhereInput`
 */
export type usersWhereInput = Prisma.usersWhereInput

/**
 * @deprecated Renamed to `Prisma.usersOrderByInput`
 */
export type usersOrderByInput = Prisma.usersOrderByInput

/**
 * @deprecated Renamed to `Prisma.usersWhereUniqueInput`
 */
export type usersWhereUniqueInput = Prisma.usersWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.users_gamesWhereInput`
 */
export type users_gamesWhereInput = Prisma.users_gamesWhereInput

/**
 * @deprecated Renamed to `Prisma.users_gamesOrderByInput`
 */
export type users_gamesOrderByInput = Prisma.users_gamesOrderByInput

/**
 * @deprecated Renamed to `Prisma.users_gamesWhereUniqueInput`
 */
export type users_gamesWhereUniqueInput = Prisma.users_gamesWhereUniqueInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateInput`
 */
export type gamesCreateInput = Prisma.gamesCreateInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateInput`
 */
export type gamesUpdateInput = Prisma.gamesUpdateInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateManyMutationInput`
 */
export type gamesUpdateManyMutationInput = Prisma.gamesUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.guildsCreateInput`
 */
export type guildsCreateInput = Prisma.guildsCreateInput

/**
 * @deprecated Renamed to `Prisma.guildsUpdateInput`
 */
export type guildsUpdateInput = Prisma.guildsUpdateInput

/**
 * @deprecated Renamed to `Prisma.guildsUpdateManyMutationInput`
 */
export type guildsUpdateManyMutationInput = Prisma.guildsUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.usersCreateInput`
 */
export type usersCreateInput = Prisma.usersCreateInput

/**
 * @deprecated Renamed to `Prisma.usersUpdateInput`
 */
export type usersUpdateInput = Prisma.usersUpdateInput

/**
 * @deprecated Renamed to `Prisma.usersUpdateManyMutationInput`
 */
export type usersUpdateManyMutationInput = Prisma.usersUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateInput`
 */
export type users_gamesCreateInput = Prisma.users_gamesCreateInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateInput`
 */
export type users_gamesUpdateInput = Prisma.users_gamesUpdateInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyMutationInput`
 */
export type users_gamesUpdateManyMutationInput = Prisma.users_gamesUpdateManyMutationInput

/**
 * @deprecated Renamed to `Prisma.BigIntFilter`
 */
export type BigIntFilter = Prisma.BigIntFilter

/**
 * @deprecated Renamed to `Prisma.DecimalNullableFilter`
 */
export type DecimalNullableFilter = Prisma.DecimalNullableFilter

/**
 * @deprecated Renamed to `Prisma.StringFilter`
 */
export type StringFilter = Prisma.StringFilter

/**
 * @deprecated Renamed to `Prisma.IntFilter`
 */
export type IntFilter = Prisma.IntFilter

/**
 * @deprecated Renamed to `Prisma.IntNullableFilter`
 */
export type IntNullableFilter = Prisma.IntNullableFilter

/**
 * @deprecated Renamed to `Prisma.GuildsRelationFilter`
 */
export type GuildsRelationFilter = Prisma.GuildsRelationFilter

/**
 * @deprecated Renamed to `Prisma.Users_gamesListRelationFilter`
 */
export type Users_gamesListRelationFilter = Prisma.Users_gamesListRelationFilter

/**
 * @deprecated Renamed to `Prisma.DecimalFilter`
 */
export type DecimalFilter = Prisma.DecimalFilter

/**
 * @deprecated Renamed to `Prisma.GamesListRelationFilter`
 */
export type GamesListRelationFilter = Prisma.GamesListRelationFilter

/**
 * @deprecated Renamed to `Prisma.BoolNullableFilter`
 */
export type BoolNullableFilter = Prisma.BoolNullableFilter

/**
 * @deprecated Renamed to `Prisma.BoolFilter`
 */
export type BoolFilter = Prisma.BoolFilter

/**
 * @deprecated Renamed to `Prisma.GamesRelationFilter`
 */
export type GamesRelationFilter = Prisma.GamesRelationFilter

/**
 * @deprecated Renamed to `Prisma.UsersRelationFilter`
 */
export type UsersRelationFilter = Prisma.UsersRelationFilter

/**
 * @deprecated Renamed to `Prisma.users_gamesUser_idGame_idCompoundUniqueInput`
 */
export type users_gamesUser_idGame_idCompoundUniqueInput = Prisma.users_gamesUser_idGame_idCompoundUniqueInput

/**
 * @deprecated Renamed to `Prisma.guildsCreateOneWithoutGamesInput`
 */
export type guildsCreateOneWithoutGamesInput = Prisma.guildsCreateOneWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateManyWithoutGamesInput`
 */
export type users_gamesCreateManyWithoutGamesInput = Prisma.users_gamesCreateManyWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.BigIntFieldUpdateOperationsInput`
 */
export type BigIntFieldUpdateOperationsInput = Prisma.BigIntFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.StringFieldUpdateOperationsInput`
 */
export type StringFieldUpdateOperationsInput = Prisma.StringFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.IntFieldUpdateOperationsInput`
 */
export type IntFieldUpdateOperationsInput = Prisma.IntFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.NullableIntFieldUpdateOperationsInput`
 */
export type NullableIntFieldUpdateOperationsInput = Prisma.NullableIntFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.guildsUpdateOneWithoutGamesInput`
 */
export type guildsUpdateOneWithoutGamesInput = Prisma.guildsUpdateOneWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyWithoutGamesInput`
 */
export type users_gamesUpdateManyWithoutGamesInput = Prisma.users_gamesUpdateManyWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateManyWithoutGuildsInput`
 */
export type gamesCreateManyWithoutGuildsInput = Prisma.gamesCreateManyWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateManyWithoutGuildsInput`
 */
export type users_gamesCreateManyWithoutGuildsInput = Prisma.users_gamesCreateManyWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.DecimalFieldUpdateOperationsInput`
 */
export type DecimalFieldUpdateOperationsInput = Prisma.DecimalFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateManyWithoutGuildsInput`
 */
export type gamesUpdateManyWithoutGuildsInput = Prisma.gamesUpdateManyWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyWithoutGuildsInput`
 */
export type users_gamesUpdateManyWithoutGuildsInput = Prisma.users_gamesUpdateManyWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateManyWithoutUsersInput`
 */
export type users_gamesCreateManyWithoutUsersInput = Prisma.users_gamesCreateManyWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.NullableBoolFieldUpdateOperationsInput`
 */
export type NullableBoolFieldUpdateOperationsInput = Prisma.NullableBoolFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyWithoutUsersInput`
 */
export type users_gamesUpdateManyWithoutUsersInput = Prisma.users_gamesUpdateManyWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateOneWithoutUsers_gamesInput`
 */
export type gamesCreateOneWithoutUsers_gamesInput = Prisma.gamesCreateOneWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.guildsCreateOneWithoutUsers_gamesInput`
 */
export type guildsCreateOneWithoutUsers_gamesInput = Prisma.guildsCreateOneWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.usersCreateOneWithoutUsers_gamesInput`
 */
export type usersCreateOneWithoutUsers_gamesInput = Prisma.usersCreateOneWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.BoolFieldUpdateOperationsInput`
 */
export type BoolFieldUpdateOperationsInput = Prisma.BoolFieldUpdateOperationsInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateOneRequiredWithoutUsers_gamesInput`
 */
export type gamesUpdateOneRequiredWithoutUsers_gamesInput = Prisma.gamesUpdateOneRequiredWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.guildsUpdateOneWithoutUsers_gamesInput`
 */
export type guildsUpdateOneWithoutUsers_gamesInput = Prisma.guildsUpdateOneWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.usersUpdateOneRequiredWithoutUsers_gamesInput`
 */
export type usersUpdateOneRequiredWithoutUsers_gamesInput = Prisma.usersUpdateOneRequiredWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.NestedBigIntFilter`
 */
export type NestedBigIntFilter = Prisma.NestedBigIntFilter

/**
 * @deprecated Renamed to `Prisma.NestedDecimalNullableFilter`
 */
export type NestedDecimalNullableFilter = Prisma.NestedDecimalNullableFilter

/**
 * @deprecated Renamed to `Prisma.NestedStringFilter`
 */
export type NestedStringFilter = Prisma.NestedStringFilter

/**
 * @deprecated Renamed to `Prisma.NestedIntFilter`
 */
export type NestedIntFilter = Prisma.NestedIntFilter

/**
 * @deprecated Renamed to `Prisma.NestedIntNullableFilter`
 */
export type NestedIntNullableFilter = Prisma.NestedIntNullableFilter

/**
 * @deprecated Renamed to `Prisma.NestedDecimalFilter`
 */
export type NestedDecimalFilter = Prisma.NestedDecimalFilter

/**
 * @deprecated Renamed to `Prisma.NestedBoolNullableFilter`
 */
export type NestedBoolNullableFilter = Prisma.NestedBoolNullableFilter

/**
 * @deprecated Renamed to `Prisma.NestedBoolFilter`
 */
export type NestedBoolFilter = Prisma.NestedBoolFilter

/**
 * @deprecated Renamed to `Prisma.guildsCreateWithoutGamesInput`
 */
export type guildsCreateWithoutGamesInput = Prisma.guildsCreateWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.guildsCreateOrConnectWithoutgamesInput`
 */
export type guildsCreateOrConnectWithoutgamesInput = Prisma.guildsCreateOrConnectWithoutgamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateWithoutGamesInput`
 */
export type users_gamesCreateWithoutGamesInput = Prisma.users_gamesCreateWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateOrConnectWithoutgamesInput`
 */
export type users_gamesCreateOrConnectWithoutgamesInput = Prisma.users_gamesCreateOrConnectWithoutgamesInput

/**
 * @deprecated Renamed to `Prisma.guildsUpdateWithoutGamesInput`
 */
export type guildsUpdateWithoutGamesInput = Prisma.guildsUpdateWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.guildsUpsertWithoutGamesInput`
 */
export type guildsUpsertWithoutGamesInput = Prisma.guildsUpsertWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateWithWhereUniqueWithoutGamesInput`
 */
export type users_gamesUpdateWithWhereUniqueWithoutGamesInput = Prisma.users_gamesUpdateWithWhereUniqueWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyWithWhereWithoutGamesInput`
 */
export type users_gamesUpdateManyWithWhereWithoutGamesInput = Prisma.users_gamesUpdateManyWithWhereWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesScalarWhereInput`
 */
export type users_gamesScalarWhereInput = Prisma.users_gamesScalarWhereInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpsertWithWhereUniqueWithoutGamesInput`
 */
export type users_gamesUpsertWithWhereUniqueWithoutGamesInput = Prisma.users_gamesUpsertWithWhereUniqueWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateWithoutGuildsInput`
 */
export type gamesCreateWithoutGuildsInput = Prisma.gamesCreateWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateOrConnectWithoutguildsInput`
 */
export type gamesCreateOrConnectWithoutguildsInput = Prisma.gamesCreateOrConnectWithoutguildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateWithoutGuildsInput`
 */
export type users_gamesCreateWithoutGuildsInput = Prisma.users_gamesCreateWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateOrConnectWithoutguildsInput`
 */
export type users_gamesCreateOrConnectWithoutguildsInput = Prisma.users_gamesCreateOrConnectWithoutguildsInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateWithWhereUniqueWithoutGuildsInput`
 */
export type gamesUpdateWithWhereUniqueWithoutGuildsInput = Prisma.gamesUpdateWithWhereUniqueWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateManyWithWhereWithoutGuildsInput`
 */
export type gamesUpdateManyWithWhereWithoutGuildsInput = Prisma.gamesUpdateManyWithWhereWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.gamesScalarWhereInput`
 */
export type gamesScalarWhereInput = Prisma.gamesScalarWhereInput

/**
 * @deprecated Renamed to `Prisma.gamesUpsertWithWhereUniqueWithoutGuildsInput`
 */
export type gamesUpsertWithWhereUniqueWithoutGuildsInput = Prisma.gamesUpsertWithWhereUniqueWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateWithWhereUniqueWithoutGuildsInput`
 */
export type users_gamesUpdateWithWhereUniqueWithoutGuildsInput = Prisma.users_gamesUpdateWithWhereUniqueWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyWithWhereWithoutGuildsInput`
 */
export type users_gamesUpdateManyWithWhereWithoutGuildsInput = Prisma.users_gamesUpdateManyWithWhereWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpsertWithWhereUniqueWithoutGuildsInput`
 */
export type users_gamesUpsertWithWhereUniqueWithoutGuildsInput = Prisma.users_gamesUpsertWithWhereUniqueWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateWithoutUsersInput`
 */
export type users_gamesCreateWithoutUsersInput = Prisma.users_gamesCreateWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.users_gamesCreateOrConnectWithoutusersInput`
 */
export type users_gamesCreateOrConnectWithoutusersInput = Prisma.users_gamesCreateOrConnectWithoutusersInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateWithWhereUniqueWithoutUsersInput`
 */
export type users_gamesUpdateWithWhereUniqueWithoutUsersInput = Prisma.users_gamesUpdateWithWhereUniqueWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateManyWithWhereWithoutUsersInput`
 */
export type users_gamesUpdateManyWithWhereWithoutUsersInput = Prisma.users_gamesUpdateManyWithWhereWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpsertWithWhereUniqueWithoutUsersInput`
 */
export type users_gamesUpsertWithWhereUniqueWithoutUsersInput = Prisma.users_gamesUpsertWithWhereUniqueWithoutUsersInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateWithoutUsers_gamesInput`
 */
export type gamesCreateWithoutUsers_gamesInput = Prisma.gamesCreateWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.gamesCreateOrConnectWithoutusers_gamesInput`
 */
export type gamesCreateOrConnectWithoutusers_gamesInput = Prisma.gamesCreateOrConnectWithoutusers_gamesInput

/**
 * @deprecated Renamed to `Prisma.guildsCreateWithoutUsers_gamesInput`
 */
export type guildsCreateWithoutUsers_gamesInput = Prisma.guildsCreateWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.guildsCreateOrConnectWithoutusers_gamesInput`
 */
export type guildsCreateOrConnectWithoutusers_gamesInput = Prisma.guildsCreateOrConnectWithoutusers_gamesInput

/**
 * @deprecated Renamed to `Prisma.usersCreateWithoutUsers_gamesInput`
 */
export type usersCreateWithoutUsers_gamesInput = Prisma.usersCreateWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.usersCreateOrConnectWithoutusers_gamesInput`
 */
export type usersCreateOrConnectWithoutusers_gamesInput = Prisma.usersCreateOrConnectWithoutusers_gamesInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateWithoutUsers_gamesInput`
 */
export type gamesUpdateWithoutUsers_gamesInput = Prisma.gamesUpdateWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.gamesUpsertWithoutUsers_gamesInput`
 */
export type gamesUpsertWithoutUsers_gamesInput = Prisma.gamesUpsertWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.guildsUpdateWithoutUsers_gamesInput`
 */
export type guildsUpdateWithoutUsers_gamesInput = Prisma.guildsUpdateWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.guildsUpsertWithoutUsers_gamesInput`
 */
export type guildsUpsertWithoutUsers_gamesInput = Prisma.guildsUpsertWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.usersUpdateWithoutUsers_gamesInput`
 */
export type usersUpdateWithoutUsers_gamesInput = Prisma.usersUpdateWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.usersUpsertWithoutUsers_gamesInput`
 */
export type usersUpsertWithoutUsers_gamesInput = Prisma.usersUpsertWithoutUsers_gamesInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateWithoutGamesInput`
 */
export type users_gamesUpdateWithoutGamesInput = Prisma.users_gamesUpdateWithoutGamesInput

/**
 * @deprecated Renamed to `Prisma.gamesUpdateWithoutGuildsInput`
 */
export type gamesUpdateWithoutGuildsInput = Prisma.gamesUpdateWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateWithoutGuildsInput`
 */
export type users_gamesUpdateWithoutGuildsInput = Prisma.users_gamesUpdateWithoutGuildsInput

/**
 * @deprecated Renamed to `Prisma.users_gamesUpdateWithoutUsersInput`
 */
export type users_gamesUpdateWithoutUsersInput = Prisma.users_gamesUpdateWithoutUsersInput