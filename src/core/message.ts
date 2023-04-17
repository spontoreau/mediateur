export interface Message<TType extends symbol = symbol, TData = {}, TResult = void> {
  type: TType;
  data: TData;
};