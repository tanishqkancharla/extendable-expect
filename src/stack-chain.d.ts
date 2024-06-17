declare module "stack-chain" {
	interface Filter {
		attach(
			fn: (error: Error, frames: NodeJS.CallSite[]) => NodeJS.CallSite[]
		): void
	}

	export const filter: Filter
}
