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

    deleteAccount(token) {
        return this.req.delete(`/auth/deleteAccount`, this.options(token));
    },

    getAllUsers(token, search, role, sort, page, limit) {
        return this.req.get(`/users?search=${search}&role=${role}&sortBy=${sort}&page=${page}&limit=${limit}`, this.options(token));
    },

    getUser(token, userId) {
        return this.req.get(`/users/${userId}`, this.options(token));
    },

    getUserCount(token) {
        return this.req.get('/users/count', this.options(token));
    },

    getUserOrganizations(token, userId) {
        const requestBody = {
            userId: userId
        };

        return this.req.post('/organizations/getUserOrganizations', requestBody, this.options(token));
    },

    getUserRecommendedEvents(token, userId) {
        return this.req.get(`/users/${userId}/recommendedEvents`, this.options(token));
    },

    getUserUpcomingEvents(token, userId) {
        return this.req.get(`/users/${userId}/upcomingEvents`, this.options(token));
    },

    updateUser(token, userId, formData) {
        return this.req.patch(`/users/${userId}`, formData, this.multipartOptions(token));
    },

    deleteUser(token, userId, role) {
        return this.req.delete(`/users/${userId}?role=${role}`, this.options(token));
    },

    getVolunteeringHistory(token, userId, page, limit) {
        return this.req.get(`/responses/history?user_id=${userId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getAllEvents(search, page, limit, categories) {
        return this.req.get(`/events?search=${search}&page=${page}&limit=${limit}&categories=${categories}`);
    },

    getEvent(eventId) {
        return this.req.get(`/events/${eventId}`);
    },

    getEventCount() {
        return this.req.get('/events/count');
    },

    getLatestEvents() {
        return this.req.get('/events/latest');
    },

    getUpcomingEvents(page, limit, search, categories) {
        return this.req.get(`/events/upcoming?page=${page}&limit=${limit}&search=${search}&categories=${categories}`);
    },

    deleteEvent(token, eventId, role) {
        return this.req.delete(`/events/${eventId}?role=${role}`, this.options(token));
    },

    getAllOrganizations(search, page, limit, sort) {
        return this.req.get(`/organizations?search=${search}&page=${page}&limit=${limit}&sort=${sort}`);
    },

    getOrganization(organizationId) {
        return this.req.get(`/organizations/${organizationId}`);
    },

    getOrganizationCount() {
        return this.req.get('/organizations/count');
    },

    deleteOrganization(token, organizationId, role) {
        return this.req.delete(`/organizations/${organizationId}?role=${role}`, this.options(token));
    },

    getCommitteeMembersCount() {
        return this.req.get('/users/committeeMemberCount');
    },

    getSignUpCountByDate(date) {
        return this.req.get(`/events/signUpCount?date=${date}`);
    },
}