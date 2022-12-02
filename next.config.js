/** @type {import('next').NextConfig} */

// TODO: Correct insife style and script error from Stripe

// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src 'self';
//   child-src stripe.com;
//   style-src 'self' stripe.com;
//   font-src 'self';  
// `

const nextConfig = {
	reactStrictMode: true,

	images: {
		domains: ['cdn.prod.alabarra.com'],
	},

	// headers: () => [
	// 	{
	// 		source: '/:path*',
	// 		headers: [{
	// 			key: 'Content-Security-Policy',
	// 			value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
	// 		}]
	// 	}
	// ]
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