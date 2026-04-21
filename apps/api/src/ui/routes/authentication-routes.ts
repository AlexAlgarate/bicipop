import { loginController } from '@ui/controllers/user/login-controller';
import { registerController } from '@ui/controllers/user/register-controller';
import { siginRateLimit, sigupRateLimit } from '@ui/middlewares/rate-limit-middleware';
import { Router } from 'express';

const authenticationRouter: Router = Router();

authenticationRouter.post('/register', sigupRateLimit, registerController);
authenticationRouter.post('/login', siginRateLimit, loginController);

export default authenticationRouter;
