type Arrayable<T> = T | T[]

type Tuple2<T> = [T, T]

type UnionToArray<T> = T extends unknown ? Array<T> : never

type UnionToArrayable<T> = T extends unknown ? Arrayable<T> : never

type UnionToTuple2<T> = T extends unknown ? Tuple2<T> : never

type PickArray<T> = T extends unknown[] ? T : never
