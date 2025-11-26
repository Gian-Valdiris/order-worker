import { NextResponse } from 'next/server';

import connectDB from '#utils/database/connect';
import { Accounts } from '#utils/database/models/account';
import { Profiles } from '#utils/database/models/profile';
import { CatchNextResponse } from '#utils/helper/common';

export async function POST (req: Request) {
	await connectDB();

	try {
		const body = await req.json();
		const { username, email, password, restaurantName, description, address, themeColor } = body;

		// 1. Validation
		if (!username || !email || !password || !restaurantName) {
			return NextResponse.json(
				{ success: false, message: 'Missing required fields: username, email, password, restaurantName' },
				{ status: 400 },
			);
		}

		// Check if account already exists
		const existingAccount = await Accounts.findOne({ $or: [{ username }, { email }] });
		if (existingAccount) {
			return NextResponse.json(
				{ success: false, message: 'Account with this username or email already exists' },
				{ status: 409 },
			);
		}

		// 2. Create Account
		// Password hashing is handled by the pre-save hook in the Account model
		const newAccount = await new Accounts({
			username,
			email,
			password,
			verified: true, // Auto-verify for simplicity
			accountActive: true,
			subscriptionActive: true,
		}).save();

		// 3. Create Profile
		// The Profile model's post-save hook will automatically link this profile to the account
		// based on the matching restaurantID (which is the username)
		const newProfile = await new Profiles({
			name: restaurantName,
			restaurantID: username, // MUST match the account username
			description: description || 'New Restaurant',
			address: address || '',
			themeColor: themeColor || { h: 0, s: 0, l: 0 },
			categories: [],
			avatar: '',
			cover: '',
		}).save();

		// Return success (exclude sensitive data)
		const accountResponse = newAccount.toObject();
		delete accountResponse.password;

		return NextResponse.json({
			success: true,
			message: 'Account created successfully',
			account: accountResponse,
			profile: newProfile,
		});

	} catch (err: any) {
		console.error('Registration error:', err);
		return CatchNextResponse(err);
	}
}
