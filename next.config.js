/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	env: {
		
	}
}

if (process.env.ANALYZE === 'true') {
	console.warn("----> EXCECUTING BUNDLE ANALYSER <----");
	const withBundleAnalyzer = require('@next/bundle-analyzer')({
		enabled: process.env.ANALYZE === 'true',
		openAnalyzer: false
	});
	module.exports = withBundleAnalyzer({})
}

module.exports = nextConfig
