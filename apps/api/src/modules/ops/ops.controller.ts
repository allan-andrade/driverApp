import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class OpsController {
  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  ready() {
    return {
      status: 'ready',
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  @Public()
  @Get('metrics')
  metrics() {
    return {
      process: {
        uptimeSeconds: Math.round(process.uptime()),
        memoryRss: process.memoryUsage().rss,
      },
      app: {
        env: process.env.NODE_ENV ?? 'development',
      },
    };
  }
}
