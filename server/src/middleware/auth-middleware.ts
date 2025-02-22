import { createMiddleware } from 'hono/factory';
import { auth } from '../lib/auth.js';
import type { User } from '../../../shared/types.js';
import { HTTPException } from 'hono/http-exception';

export type ContextWithAuth = {
  Variables: {
    user: User | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export const authMiddleware = createMiddleware<ContextWithAuth>(
  async (c, next) => {
    const authData = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!authData) {
      c.set('user', null);
      c.set('session', null);
      throw new HTTPException(401);
    }

    c.set('user', authData.user as User);
    c.set('session', authData.session);
    return next();
  }
);
