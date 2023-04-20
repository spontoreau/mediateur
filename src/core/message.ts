export interface Message<
  TType extends symbol = symbol,
  TData = Record<string, unknown>,
  TResult = void,
> {
  type: TType;
  data: TData;
}
