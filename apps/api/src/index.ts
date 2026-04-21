import { EnvironmentService } from '@infrastructure/services/environment-service';
import { registerInfrastructure } from '@di/infrastructure-bindings';
import { registerUseCases } from '@di/usecase-bindings';
import { createApp, startHttpApi } from '@ui/api';

const executeApp = async (): Promise<void> => {
  try {
    console.log('-- Starting application --');
    console.log('...loading environment');
    new EnvironmentService().load();

    registerInfrastructure();
    registerUseCases();

    const app = createApp();
    startHttpApi(app);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
};
await executeApp();
