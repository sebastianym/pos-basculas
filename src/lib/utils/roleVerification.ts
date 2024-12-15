const allowedRoles = ['ADMIN', 'EMPLOYEE', 'INSTRUCTOR'];

const roleVerification = (role: string) => {
    
    if (allowedRoles.includes(role)) {
        return true;
    }

    return false;
};

export default roleVerification;