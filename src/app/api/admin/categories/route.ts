import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { Profiles, TProfile } from '#utils/database/models/profile';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function POST (req: Request) {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: 'Authentication Required' };

		const body = await req.json();
		const { categories } = body;

		if (!categories || !Array.isArray(categories)) {
			throw { status: 400, message: 'Categories array is required' };
		}

		const account = await Accounts.findOne<TAccount>({ username: session.username }).populate('profile');
		if (!account || !account.profile) throw { status: 404, message: 'Profile not found' };

		const profile = await Profiles.findById<TProfile>(account.profile._id);
		if (!profile) throw { status: 404, message: 'Profile not found' };

		profile.categories = categories.map(cat => cat.trim().toLowerCase()).filter(Boolean);
		await profile.save();

		return NextResponse.json({ 
			status: 200, 
			message: 'Categories updated successfully', 
			categories: profile.categories 
		});
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = 'force-dynamic';
