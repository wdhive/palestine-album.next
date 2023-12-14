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

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
  const newObj: any = {}
  keys.forEach((key) => {
    newObj[key] = obj[key]
  })

  return newObj as PrettifyPick<T, K>
}