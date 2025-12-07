import { ReactNode } from 'react';

import { GlobalProvider } from '#components/context';
import { montserrat } from '#utils/helper/fontHelper';

import './globals.scss';
import PreloadCss from '#components/base/PreloadCss';

export const metadata = {
	title: 'OrderWorder',
};
export default function RootLayout ({ children }: IRootProps) {
	return (
		<html lang='en' className={montserrat.variable} suppressHydrationWarning>
			<head>
				<script src='https://kit.fontawesome.com/9af3102438.js' crossOrigin='anonymous' async></script>
				<PreloadCss />
			</head>
			<body>
			<GlobalProvider>
				{ children }
			</GlobalProvider>
			</body>
		</html>
	);
}

interface IRootProps {
	children?: ReactNode;
}
