/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	images: {
		domains: ['cdn.prod.alabarra.com'],
	}
}

module.exports = nextConfig;


/*
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})
  
module.exports = withBundleAnalyzer({
    env: {
        NEXT_PUBLIC_ENV: 'PRODUCTION', //your next configs goes here
    },
})
*/

/*
if (process.env.ANALYZE === 'true') {
	console.warn("----> EXCECUTING BUNDLE ANALYSER <----");
	const withBundleAnalyzer = require('@next/bundle-analyzer')({
		enabled: process.env.ANALYZE === 'true',
		openAnalyzer: false
	});
	module.exports = withBundleAnalyzer({})
}

*/