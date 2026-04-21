import { RegisterUseCase } from '@application/use-cases/user/RegisterUseCase';
import { Request, Response } from 'express';

import { container } from '@di/container';
import { authenticationBodySchema } from '@ui/validators/authentication-validator';
import { REGISTER_USE_CASE } from '@di/tokens';

export const registerController = async (request: Request, response: Response): Promise<void> => {
  const { username, email, password } = authenticationBodySchema.parse(request.body);

  const registerUseCase = container.get<RegisterUseCase>(REGISTER_USE_CASE);
  await registerUseCase.execute({ username, email, password });

  response.status(201).json({ content: 'User created successfully' });
};
