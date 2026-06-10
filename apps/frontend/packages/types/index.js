/**
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} email
 * @property {string} name
 * @property {'ADMIN' | 'PROCUREMENT' | 'VENDOR'} role
 * @property {string} [vendorId] - Associated vendor ID if role is VENDOR
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Vendor
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} registrationNumber
 * @property {'PENDING' | 'APPROVED' | 'REJECTED'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} RFQ
 * @property {string} id - UUID
 * @property {string} title
 * @property {string} description
 * @property {string} deadline - ISO Date String
 * @property {'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED'} status
 * @property {string} createdById - UUID of Procurement user
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const TypesPlaceholder = {};
