import axios from 'axios';

export const api = {
    req: axios.create({
        baseURL: process.env.REACT_APP_BACKEND_API,
    }),

    options: (token) => {
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    },

    multipartOptions: (token) => {
        return {
            "Content-Type": "multipart/form-data",
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    },

    login(email, password) {
        const requestBody = {
            email: email,
            password: password
        };

        return this.req.post('/auth/login', requestBody); 
    },

    profile(token) {
        return this.req.get('/auth/profile', this.options(token));
    },

    register(body) {
        return this.req.post('/users', body);
    },

    changePassword(token, body) {
        return this.req.post('/auth/changePassword', body, this.options(token));
    },

    passwordResetRequest(body) {
        return this.req.post('/auth/passwordResetRequest', body);
    },

    resetPassword(body) {
        return this.req.post('/auth/passwordReset', body);
    },

    getUser(token, userId) {
        return this.req.get(`/users/${userId}`, this.options(token));
    },

    getUserOrganizations(token, userId) {
        const requestBody = {
            userId: userId
        };

        return this.req.post('/organizations/getUserOrganizations', requestBody, this.options(token));
    },

    updateUser(token, userId, formData) {
        return this.req.patch(`/users/${userId}`, formData, this.multipartOptions(token));
    },

    deleteUser(token) {
        return this.req.delete(`/auth/deleteAccount`, this.options(token));
    },

    getVolunteeringHistory(token, userId, page, limit) {
        return this.req.get(`/responses/history?user_id=${userId}&page=${page}&limit=${limit}`, this.options(token));
    },

}