import { RegisterUseCase } from '@application/use-cases/user/RegisterUseCase';
import { validateRegisterInput } from '@application/dto/authentication';
import { Request, Response } from 'express';

import { container } from '@di/container';
import { REGISTER_USE_CASE } from '@di/tokens';

export const registerController = async (request: Request, response: Response): Promise<void> => {
  const { username, email, password } = validateRegisterInput(request.body);

  const registerUseCase = container.get<RegisterUseCase>(REGISTER_USE_CASE);
  await registerUseCase.execute({ username, email, password });

  response.status(201).json({ content: 'User created successfully' });
};
