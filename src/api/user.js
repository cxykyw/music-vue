import request from '../utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function sendResetEmail(email) {
  return request({
    url: '/user/reset-password/email',
    method: 'post',
    data: { email }
  })
}

export function verifyResetToken(token) {
  return request({
    url: '/user/reset-password/verify',
    method: 'post',
    data: { token }
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/reset-password',
    method: 'post',
    data
  })
}

export function verifyEmail(token) {
  return request({
    url: '/user/verify-email',
    method: 'post',
    data: { token }
  })
}

export function resendVerificationEmail() {
  return request({
    url: '/user/verify-email/resend',
    method: 'post'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/user/change-password',
    method: 'post',
    data
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getDevices() {
  return request({
    url: '/user/devices',
    method: 'get'
  })
}

export function logoutDevice(deviceId) {
  return request({
    url: `/user/devices/${deviceId}/logout`,
    method: 'post'
  })
}

export function deleteAccount(password) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: { password }
  })
} 