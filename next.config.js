/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	env: {
		CurrencyNumberFormat: {
			thousandSeparator: '.',
			decimalSeparator: ",",
			prefix: "$"
		}
	}
}

module.exports = nextConfig
