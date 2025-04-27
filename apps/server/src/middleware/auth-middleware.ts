import { createMiddleware } from 'hono/factory';
import { auth } from '../lib/auth.js';
import type { User } from '@jigsaw/shared';
import { HTTPException } from 'hono/http-exception';

export type ContextWithAuth = {
  Variables: {
    user: User;
    session: typeof auth.$Infer.Session.session;
  };
};

export const authMiddleware = createMiddleware<ContextWithAuth>(
  async (c, next) => {
    const authData = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!authData) {
      throw new HTTPException(401);
    }

    c.set('user', authData.user as unknown as User);
    c.set('session', authData.session);
    return next();
  }
);
