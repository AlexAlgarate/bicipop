import { LoginUseCase } from '@application/use-cases/user/LoginUseCase';
import { validateLoginInput } from '@application/dto/authentication';
import { container } from '@di/container';
import { LOGIN_USE_CASE } from '@di/tokens';
import { Request, Response } from 'express';

export const loginController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = validateLoginInput(request.body);

  const loginUseCase = container.get<LoginUseCase>(LOGIN_USE_CASE);
  const { token, user } = await loginUseCase.execute({ email, password });

  response.cookie('bicipop_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  response.status(200).json({
    user,
  });
};
