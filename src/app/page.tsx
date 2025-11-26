import { themeController } from 'xtreme-ui';

import { DashboardProvider } from '#components/context';

import PageContainer from './_homepage/PageContainer';
import { getThemeColor } from '#utils/database/helper/getThemeColor';
import { DEFAULT_THEME_COLOR } from '#utils/constants/common';

export default async function Homepage () {
	const color = (await getThemeColor()) ?? DEFAULT_THEME_COLOR;
	return (
		<>
				<script dangerouslySetInnerHTML={{ __html: themeController({ color }) }} suppressHydrationWarning />
				<DashboardProvider>
					<PageContainer />
				</DashboardProvider>
		</>
	);
}
