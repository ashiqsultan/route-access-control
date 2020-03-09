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

**There are two ways to authenticate roles**
1. Authenticating in Middleware using  `checkRole`
2. Authenticating inside route handler function using `isRoleAuthorized`

  

### Middleware:  `checkRole`

**The middleware expects the claimed role to be inside req.role**

* Extract the requester role from the **JWT token** and store it in **req.role**

* Use the Middleware `checkRole(admin)`
* You can check for any number of roles: `checkRole(admin, student, teacher)`
* The Middleware sends 401 Error if the role is not authorized

**Example**

The below route will only allow users with **role admin**
```
router.post('/protected', [checkJwt, checkRole(admin)], async (req, res, next) => {
	try {
		res.json('This is a protected route');
	} catch (error) {
		next(error);
	}
});
```

The below route will allow users with **role admin or teacher**
```
router.post('/protected', [checkJwt, checkRole(admin, teacher)], async (req, res, next) => {
	try {
		res.json('This is a protected route');
	} catch (error) {
		next(error);
	}
});

```
### Function :`isRoleAuthorized()`
Use this inside your route handler
* Returns a boolean

*  `isRoleAuthorized(requesterRole, arrayOfAllowedRoles)`

**Example**

```
router.post('/protected', checkJwt, async (req, res, next) => {
	try {
		const claimedRole = req.role;
		const allowedRoles = [admin];
		const isAuthorized = await isRoleAuthorized(claimedRole, allowedRoles);
		if (isAuthorized) {
			res.json('This is private route');
		} else {
			const message = 'User not authorized';
			res.status(401).json({ message });
		}
	} catch (error) {
		next(error);
	}
});
```
