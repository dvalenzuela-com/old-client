/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,

	images: {
		domains: ['cdn.prod.alabarra.com'],
	}
}


if (process.env.ANALYZE === 'true') {
	console.warn("----> EXCECUTING BUNDLE ANALYSER <----");
	const withBundleAnalyzer = require('@next/bundle-analyzer')({
		enabled: process.env.ANALYZE === 'true'
	});
	module.exports = withBundleAnalyzer(nextConfig)
} else {
	module.exports = nextConfig;
}

/*
module.exports = withBundleAnalyzer({
		env: {
			NEXT_PUBLIC_ENV: 'PRODUCTION', //your next configs goes here
		},
	})

*/