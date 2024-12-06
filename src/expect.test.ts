import { describe, it } from "vitest"
import { expect } from "./expect"

describe("Expect", () => {
	it("Works with custom matchers", () => {
		const numberMatchers = {
			doubledToBe(value: number, expected: number) {
				expect(value * 2).toEqual(expected)
			},
		}

		const expectNumber = expect.extend(numberMatchers)

		expectNumber(4 + 1).doubledToBe(10)
		expectNumber("hello").toEqual("hello")
	})

	it("Custom matcher with return type", () => {
		const numberMatchers = {
			doubledToBe(value: number, expected: number): boolean {
				expect(value * 2).toEqual(expected)
				return true
			},
		}

		const expectNumber = expect.extend(numberMatchers)

		const result = expectNumber(4 + 1).doubledToBe(10)
		expect(result).toEqual(true)
	})
})
