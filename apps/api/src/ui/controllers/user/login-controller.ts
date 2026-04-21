import { LoginUseCase } from '@application/use-cases/user/LoginUseCase';
import { container } from '@di/container';
import { LOGIN_USE_CASE } from '@di/tokens';
import { authenticationBodySchema } from '@ui/validators/authentication-validator';
import { Request, Response } from 'express';

export const loginController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const loginUseCase = container.get<LoginUseCase>(LOGIN_USE_CASE);
  const { token } = await loginUseCase.execute({ email, password });

  response.json({ content: token });
};
