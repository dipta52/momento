/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	productionBrowserSourceMaps: true,
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},

	images: {
		domains: [
			"source.unsplash.com",
			"lh3.googleusercontent.com",
			"images.unsplash.com",
		],
	},
};

module.exports =
	process.env.NODE_ENV === "development"
		? withBundleAnalyzer(nextConfig)
		: withBundleAnalyzer(
				withPWA({
					...nextConfig,
					pwa: {
						dest: "public",
						register: true,
						skipWaiting: true,
						runtimeCaching,
						disable: process.env.NODE_ENV === "development",
					},
				})
		);
