# Role Based Access Control
This module is used to implement role based access to API endpoints.
## Create Role
Create a new role
```
const { Role } = require('./route-access-control)

const admin = new Role('admin');
const student = new Role('student');
const roleName = new Role('role-name');
```
## Check Role
You can check roles in two ways
* Using `checkRole` Middleware
* Inside Route Handler Function using `isRoleAuthorized`

### Middleware `checkRole`
**The middleware expects the claimed role to be inside req.role**
* Extract the requester role from the JWT token and store it in req.role
* Use the Middleware `checkRole(admin)`
* You can check for any nuber of roles inside `checkRole(admin, student, teacher)` middleware
* The Middleware sends 401 Error if thr role is not authorized

**Example**
The below route will only allow users with role admin
```
router.post('/protected', [checkJwt, checkRole(admin)], async (req, res, next) => {
	try {
		res.json('This is a protected route');
	} catch (error) {
		next(error);
	}
});
```

The below route will allow users with role admin or teacher
```
router.post('/protected', [checkJwt, checkRole(admin, teacher)], async (req, res, next) => {
	try {
		res.json('This is a protected route');
	} catch (error) {
		next(error);
	}
});
```

### Function `isRoleAuthorized()`
* Returns a boolean 
* `isRoleAuthorized(requesterRole, arrayOfAllowedRoles)`
* Use this inside your route handler

**Example**
```
router.post('/private', checkJwt, async (req, res, next) => {
	try {
		const requesterRole = req.role;
		const allowedRoles = [admin, teacher];
		if (await isRoleAuthorized(claimedRole, allowedRoles)) {
			res.json('This is private route');
		} else {
			const message = 'User not authorized';
			res.status(401).json({ message });
		}
	} catch (error) {
		next(error);
	}
};
```