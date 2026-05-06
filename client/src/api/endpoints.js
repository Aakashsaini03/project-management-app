import axiosInstance from './axios'

// Authentication endpoints
export const signup = (data) =>
  axiosInstance.post('/auth/signup', data)

export const login = (data) =>
  axiosInstance.post('/auth/login', data)

export const getCurrentUser = () =>
  axiosInstance.get('/auth/me')

// Project endpoints
export const createProject = (data) =>
  axiosInstance.post('/projects', data)

export const getAllProjects = () =>
  axiosInstance.get('/projects')

export const getProject = (projectId) =>
  axiosInstance.get(`/projects/${projectId}`)

export const updateProject = (projectId, data) =>
  axiosInstance.put(`/projects/${projectId}`, data)

export const getProjectMembers = (projectId) =>
  axiosInstance.get(`/projects/${projectId}/members`)

export const addProjectMember = (projectId, data) =>
  axiosInstance.post(`/projects/${projectId}/members`, data)

// Task endpoints
export const createTask = (data) =>
  axiosInstance.post('/tasks', data)

export const getProjectTasks = (projectId) =>
  axiosInstance.get(`/tasks/project/${projectId}`)

export const getTask = (taskId) =>
  axiosInstance.get(`/tasks/${taskId}`)

export const updateTask = (taskId, data) =>
  axiosInstance.put(`/tasks/${taskId}`, data)

export const deleteTask = (taskId) =>
  axiosInstance.delete(`/tasks/${taskId}`)

// Dashboard endpoints
export const getDashboardStats = () =>
  axiosInstance.get('/dashboard/stats')

export const getMyTasks = (status = null) =>
  axiosInstance.get('/dashboard/my-tasks', { params: { status } })

export const getOverdueTasks = () =>
  axiosInstance.get('/dashboard/overdue')
