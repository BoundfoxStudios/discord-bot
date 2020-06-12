import { Area } from '../deps.ts';
import { HealthController } from './health.controller.ts';

@Area({
  baseRoute: '/api',
  controllers: [HealthController],
})
export class ApiArea {
}
