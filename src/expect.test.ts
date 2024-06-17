import test from "vitest"
import { expect } from "./expect"

test.describe("Expect", () => {
	test.it("Works with custom matchers", () => {
		const numberMatchers = {
			doubledToBe(value: number, expected: number) {
				expect(value * 2).toEqual(expected)
			},
		}

		const expectNumber = expect.extend(numberMatchers)

		expectNumber(4 + 1).doubledToBe(10)

		expectNumber("hello").toEqual("hello")
	})
})
