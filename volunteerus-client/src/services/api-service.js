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

    searchUsers(token, search) {
        return this.req.get(`/users/search?query=${search}`, this.options(token));
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

    createEvent(token, formData, role) {
        return this.req.post(`/events?role=${role}`, formData, this.multipartOptions(token));
    },

    createEventGrouping(token, body, role) {
        return this.req.post(`/events/groupings/create?role=${role}`, body, this.options(token));
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

    getUpcomingEventsByOrganization(organizationId, page, limit) {
        return this.req.get(`/events/upcoming?organization_id=${organizationId}&page=${page}&limit=${limit}`);
    },

    getPastEventsByOrganization(organizationId, page, limit) {
        return this.req.get(`/events/past?organization_id=${organizationId}&page=${page}&limit=${limit}`);
    },

    updateEvent(token, eventId, formData, role) {
        return this.req.patch(`/events/${eventId}?role=${role}`, formData, this.multipartOptions(token));
    },

    deleteEvent(token, eventId, role) {
        return this.req.delete(`/events/${eventId}?role=${role}`, this.options(token));
    },

    createOrganization(token, formData, role) {
        return this.req.post(`/organizations?role=${role}`, formData, this.multipartOptions(token));
    },

    createOrganizationContact(token, organizationId, body, role) {
        return this.req.post(`/organizations/${organizationId}/contacts?role=${role}`, body, this.options(token));
    },

    createOrganizationCommitteeMembers(token, organizationId, body, role) {
        return this.req.post(`/organizations/${organizationId}/committeeMembers?role=${role}`, body, this.options(token));
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

    checkCommitteeMember(token, body) {
        return this.req.post('/organizations/checkCommitteeMember', body, this.options(token));
    },

    updateOrganization(token, organizationId, formData, role) {
        return this.req.patch(`/organizations/${organizationId}?role=${role}`, formData, this.multipartOptions(token));
    },

    updateOrganizationContact(token, organizationId, body, role) {
        return this.req.patch(`/organizations/${organizationId}/contacts?role=${role}`, body, this.options(token));
    },

    updateOrganizationCommitteeMembers(token, organizationId, body, role) {
        return this.req.patch(`/organizations/${organizationId}/committeeMembers?role=${role}`, body, this.options(token));
    },

    deleteOrganization(token, organizationId, role) {
        return this.req.delete(`/organizations/${organizationId}?role=${role}`, this.options(token));
    },

    getNotificationsForUser(token, userId) {
        return this.req.get(`/notifications/${userId}`, this.options(token));
    },

    markNotificationAsRead(token, notificationId) {
        return this.req.patch(`/notifications/${notificationId}`, {}, this.options(token));
    },

    createResponse(token, body, role) {
        return this.req.post(`/responses?role=${role}`, body, this.options(token));
    },

    getResponses(token) {
        return this.req.get('/responses', this.options(token));
    },

    getResponse(token, responseId) {
        return this.req.get(`/responses/${responseId}`, this.options(token));
    },

    getResponsesByEvent(token, eventId) {
        return this.req.get(`/responses?event_id=${eventId}`, this.options(token));
    },

    getResponsesByUser(token, userId) {
        return this.req.get(`/responses?user_id=${userId}`, this.options(token));
    },

    getAcceptedResponsesByUser(token, userId, page, limit) {
        return this.req.get(`/responses/accepted?user_id=${userId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getAcceptedResponsesByEvent(token, eventId, page, limit) {
        return this.req.get(`/responses/accepted?event_id=${eventId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getPendingResponsesByUser(token, userId, page, limit) {
        return this.req.get(`/responses/pending?user_id=${userId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getPendingResponsesByEvent(token, eventId, page, limit) {
        return this.req.get(`/responses/pending?event_id=${eventId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getRejectedResponsesByUser(token, userId, page, limit) {
        return this.req.get(`/responses/rejected?user_id=${userId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getRejectedResponsesByEvent(token, eventId, page, limit) {
        return this.req.get(`/responses/rejected?event_id=${eventId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getAttendanceForEvent(token, eventId, days, page, limit) {
        return this.req.get(`/responses/accepted?event_id=${eventId}&numberOfDays=${days}&page=${page}&limit=${limit}`, this.options(token));
    },

    getVolunteeringHistory(token, userId, page, limit) {
        return this.req.get(`/responses/history?user_id=${userId}&page=${page}&limit=${limit}`, this.options(token));
    },

    getVolunteeringHours(token, userId) {
        return this.req.get(`/responses/totalHours?user_id=${userId}`, this.options(token));
    },

    updateResponse(token, responseId, body, role) {
        return this.req.patch(`/responses/${responseId}?role=${role}`, body, this.options(token));
    },

    updateResponses(token, body, role) {
        return this.req.patch(`/responses?role=${role}`, body, this.options(token));
    },

    deleteResponse(token, responseId, role) {
        return this.req.delete(`/responses/${responseId}?role=${role}`, this.options(token));
    },

    createQuestions(token, body, role) {
        return this.req.post(`/questions?role=${role}`, body, this.options(token));
    },

    getAllQuestions(token) {
        return this.req.get(`/questions`, this.options(token));
    },

    getQuestions(token, questionId) {
        return this.req.get(`/questions/${questionId}`, this.options(token));
    },

    getQuestionsByEvent(token, eventId) {
        return this.req.get(`/questions?event_id=${eventId}`, this.options(token));
    },

    updateQuestion(token, questionId, body, role) {
        return this.req.patch(`/questions/${questionId}?role=${role}`, body, this.options(token));
    },

    deleteQuestion(token, questionId, role) {
        return this.req.delete(`/questions/${questionId}?role=${role}`, this.options(token));
    },

    getCommitteeMembersCount() {
        return this.req.get('/users/committeeMemberCount');
    },

    getSignUpCountByDate(date) {
        return this.req.get(`/events/signUpCount?date=${date}`);
    },
}