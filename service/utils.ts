export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type PrettifyPick<
  T extends object,
  K extends keyof T,
  L extends keyof T = never,
> = Prettify<Pick<T, K> & Partial<Pick<T, L>>>

export type PrettifyOmit<
  T extends object,
  K extends keyof T,
  L extends keyof T = never,
> = Prettify<Omit<T, K> & Partial<Omit<T, L>>>

export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
) {
  const newObj: any = {}
  keys.forEach((key) => {
    const value = obj[key]
    if (value !== undefined) newObj[key] = value
  })

  return newObj as PrettifyPick<T, K>
}

export function createIncludeQuery<T extends readonly string[]>(args: T) {
  return Object.fromEntries(args.map((a) => [a, true])) as Prettify<
    Record<T[number], true>
  >
}

export function isUUID(uuidString: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(uuidString)
}

export function queryToNumber(query: unknown) {
  return typeof query === 'string' ? Number(query) : undefined
}

