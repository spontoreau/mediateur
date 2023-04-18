export interface Message<
  TType extends symbol = symbol,
  TData = Record<string, never>,
  TResult = void,
> {
  type: TType;
  data: TData;
}
