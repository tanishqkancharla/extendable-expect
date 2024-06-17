import { intersection, isArray, isPlainObject } from "lodash-es"

export function isShallowEqual(a: any, b: any) {
	return isEqualToDepth(a, b, 1)
}

/**
 * At depth=0, if a and b are not referentially equal (or primitive and equal),
 * return false.
 * Only nested plain objects, arrays, primitives accepted
 */
export function isEqualToDepth(a: any, b: any, depth: number): boolean {
	if (a == b) {
		return true
	} else if (depth === 0) {
		return false
	} else if (isArray(a)) {
		if (!isArray(b)) return false
		if (a.length !== b.length) return false
		return a.every((ai, i) => isEqualToDepth(ai, b[i], depth - 1))
	} else if (isPlainObject(a)) {
		if (!isPlainObject(b)) return false
		const keys = Object.keys(a)
		const sameKeys = intersection(keys, Object.keys(b))
		if (keys.length !== sameKeys.length) return false
		return keys.every((key) => a[key] == b[key])
	}
	return false
}
