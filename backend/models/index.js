import mongoose from 'mongoose';
import dbConfig from '../config/db.config.js';

import User from './user.model.js';
import Role from './role.model.js';

const db = {};

db.mongoose = mongoose;
db.User = User;
db.Role = Role;

db.ROLES = ['admin', 'tutor', 'student'];
db.config = dbConfig;

export default db;