import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../../generated/prisma/client.js';

export const ROLES_KEY = 'roles';

export const ADMIN_ROLE: UserRole = 'ADMIN';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
