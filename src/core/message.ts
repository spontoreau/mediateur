export interface Message<
	TType extends string = string,
	TData = Record<string, unknown>,
	TResult = void,
> {
	type: TType;
	data: TData;
}
