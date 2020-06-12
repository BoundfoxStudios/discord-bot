import { Controller, Get } from '../deps.ts';

@Controller('/health')
export class HealthController {
  @Get('/check')
  private check(): { ok: boolean } {
    return { ok: true };
  }
}
