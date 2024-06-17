import { mapValues } from "lodash-es"
import { FallbackMatchers, TypedBaseMatchers, baseMatchers } from "./matchers"

type Assert<Expected, Actual extends Expected> = null

type TupleRest<Values extends any[]> = Values extends [any, ...infer Rest]
	? Rest
	: never

export type MatcherThisArg = ExpectImpl<AnyMatchers>

export type AnyMatcher<T> = (
	this: MatcherThisArg,
	value: T,
	...args: any[]
) => void

export type AnyMatchers = {
	[key: string]: AnyMatcher<any>
}

type MatchersToObjects<Matchers extends AnyMatchers> = {
	[Key in keyof Matchers]: { key: Key; value: Matchers[Key] }
}[keyof Matchers]

type FilterMatchersByValueType<T, Matchers extends AnyMatchers> = Extract<
	MatchersToObjects<Matchers>,
	{ value: AnyMatcher<T> }
>

type MatchersForValue<T, Matchers extends AnyMatchers> = {
	[Key in FilterMatchersByValueType<T, Matchers>["key"]]: (
		...args: TupleRest<Parameters<Matchers[Key]>>
	) => void
} & {
	[key in keyof FallbackMatchers<T>]: (
		...args: TupleRest<Parameters<FallbackMatchers<T>[key]>>
	) => void
}

type X = MatchersForValue<Array<number>, TypedBaseMatchers>

type MatchersForValueTest = Assert<
	{
		toBeGreaterThan: (expected: number) => void
		toBeGreaterThanOrEqual: (expected: number) => void
		toBeLessThan: (expected: number) => void
		toBeLessThanOrEqual: (expected: number) => void

		toReferenceEqual: (expected: number) => void
		toEqual: (expected: number) => void
		toShallowEqual: (expected: number) => void
		toBeTruthy: () => void
		toBeFalsy: () => void
	},
	MatchersForValue<number, TypedBaseMatchers>
>

type ExpectWithMatchers<Matchers extends AnyMatchers> = {
	<T>(value: T): MatchersForValue<T, Matchers>
	matchers: Matchers
	extend<ExtraMatchers extends AnyMatchers>(
		extraMatchers: ExtraMatchers,
	): ExpectWithMatchers<Matchers & ExtraMatchers>
}

class ExpectImpl<Matchers extends AnyMatchers> {
	readonly expect: ExpectWithMatchers<Matchers>

	constructor(private matchers: AnyMatchers) {
		const expect: any = this._expect
		expect.matchers = matchers
		expect.extend = this._extend

		this.expect = expect
	}

	_expect = <T>(value: T): MatchersForValue<T, Matchers> => {
		return mapValues(this.matchers, (matcher) => {
			return matcher.bind(this, value)
		}) as any
	}

	_extend = (extraMatchers: AnyMatchers) => {
		return new ExpectImpl({ ...this.matchers, ...extraMatchers }).expect
	}
}

export const expect = new ExpectImpl<TypedBaseMatchers>(baseMatchers).expect
