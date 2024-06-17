import { isEqual } from "lodash-es"
import * as chain from "stack-chain"
import { unifiedDiff } from "./diff"
import type { AnyMatchers, MatcherThisArg } from "./expect"
import { isShallowEqual } from "./shallowEqual"
import { stringify } from "./stringify"

chain.filter?.attach(function (error, frames) {
	// Filter out traces related to this file
	const rewrite = frames.filter(function (callSite) {
		return callSite.getFileName() !== module.filename
	})

	return rewrite
})

const numericMatchers = {
	toBeGreaterThan(this, value: number, expected: number) {
		if (value <= expected) {
			throw new Error(`Value ${value} is not greater than ${expected}`)
		}
	},
	toBeGreaterThanOrEqual(this, value: number, expected: number) {
		if (value < expected) {
			throw new Error(
				`Value ${value} is not greater than or equal to ${expected}`,
			)
		}
	},
	toBeLessThan(this, value: number, expected: number) {
		if (value >= expected) {
			throw new Error(`Value ${value} is not less than ${expected}`)
		}
	},
	toBeLessThanOrEqual(this, value: number, expected: number) {
		if (value > expected) {
			throw new Error(`Value ${value} is not less than or equal to ${expected}`)
		}
	},
} satisfies AnyMatchers

const booleanMatchers = {
	toBeTruthy(this, value: boolean): value is true {
		if (!value) {
			throw new Error(`Value ${value} is not true`)
		}
		return true
	},
	toBeFalsy(this, value: boolean): value is false {
		if (value) {
			throw new Error(`Value ${value} is not false`)
		}
		return true
	},
} satisfies AnyMatchers

const promiseMatchers = {
	async toAwaitToEqual<T>(
		this: MatcherThisArg,
		promise: Promise<T>,
		expected: T,
	) {
		return promise.then((value) => {
			if (!isEqual(value, expected)) {
				throw new Error(
					`Promise did not resolve to expected value:\n` +
						unifiedDiff(stringify(value), stringify(expected)),
				)
			}
		})
	},
} satisfies AnyMatchers

const arrayMatchers = {
	toHaveUniqueValues<T extends number | string>(
		this: MatcherThisArg,
		values: T[],
	) {
		for (let index = 0; index < values.length; index++) {
			const value = values[index]

			for (let testIndex = index + 1; testIndex < values.length; testIndex++) {
				const testValue = values[testIndex]
				if (testValue === value) {
					throw new Error(
						`Values ${values} had duplicate at index ${index} and ${testIndex}`,
					)
				}
			}
		}
	},
	toContain<T>(this: MatcherThisArg, values: T[], valueToTest: T) {
		const contained = values.some((value) => isEqual(value, valueToTest))
		if (!contained) {
			throw new Error(
				`Values ${values} did not contain value to test: ${valueToTest}`,
			)
		}
	},
	toHaveLength<T>(this: MatcherThisArg, values: T[], expectedLength: number) {
		const actualLength = values.length
		if (actualLength !== expectedLength) {
			throw new Error(
				`Values ${values} did not have expected length ${expectedLength} (actual length is ${actualLength})`,
			)
		}
	},
} satisfies AnyMatchers

export type FallbackMatchers<T> = {
	toReferenceEqual(this: MatcherThisArg, value: T, expected: T): void
	toEqual(this: MatcherThisArg, value: T, expected: T): void
	toShallowEqual(this: MatcherThisArg, value: T, expected: T): void
	toBeTruthy(this: MatcherThisArg, value: T): void
	toBeFalsy(this: MatcherThisArg, value: T): void
}

const fallbackMatchers: FallbackMatchers<any> = {
	toReferenceEqual<T>(this: MatcherThisArg, value: T, expected: T) {
		if (!Object.is(value, expected)) {
			throw new Error(
				"Value did not reference equal to expected:\n" +
					unifiedDiff(stringify(value), stringify(expected)),
			)
		}
	},

	toEqual<T>(this: MatcherThisArg, value: T, expected: T) {
		if (!isEqual(value, expected)) {
			throw new Error(
				"Value was not deep equal to expected:\n" +
					unifiedDiff(stringify(value), stringify(expected)),
			)
		}
	},

	toShallowEqual<T>(this: MatcherThisArg, value: T, expected: T) {
		if (!isShallowEqual(value, expected)) {
			throw new Error(
				`Value is not shallow equal to expected:\n` +
					unifiedDiff(stringify(value), stringify(expected)),
			)
		}
	},

	toBeTruthy<T>(this: MatcherThisArg, value: T) {
		if (!value) {
			throw new Error(`Value ${value} is not truthy`)
		}
	},
	toBeFalsy<T>(this: MatcherThisArg, value: T) {
		if (value) {
			throw new Error(`Value ${value} is not falsy`)
		}
	},
} satisfies AnyMatchers

export type TypedBaseMatchers = typeof numericMatchers &
	typeof booleanMatchers &
	typeof promiseMatchers &
	typeof arrayMatchers

export const baseMatchers = {
	...numericMatchers,
	...booleanMatchers,
	...promiseMatchers,
	...arrayMatchers,
	...fallbackMatchers,
}
