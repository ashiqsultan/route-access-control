'use strict';
class Role {
	constructor(name) {
		this.name = name;
	}
	check(calimName) {
		return calimName === this.name ? true : false;
	}
}

const sendUnauthorized = res => {
	const message = 'Unauthorized';
	res.status(401).json({ message });
};

const rolesChecker = async (requesterRole, allowedRoles) => {
	const results = [];
	for await (let role of allowedRoles) {
		results.push(role.check(requesterRole));
	}
	return results;
};

// rolesAuth is a Middleware, it requires the claimed role to be inside req.role
const checkRole = (...allowedRoles) => {
	return async (req, res, next) => {
		try {
			const results = await rolesChecker(req.role, allowedRoles);
			results.includes(true) ? next() : sendUnauthorized(res);
		} catch (error) {
			next(error);
		}
	};
};

// rolesValidate is an async function which returns a boolean, Use it inside a route handler function with await
const isRoleAuthorized = async (requesterRole, allowedRoles) => {
	try {
		const results = await rolesChecker(requesterRole, allowedRoles);
		return results.includes(true) ? true : false;
	} catch (error) {
		console.error(error);
		return false;
	}
};
module.exports = { Role, checkRole, isRoleAuthorized };
