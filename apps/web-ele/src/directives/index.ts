import type { App } from 'vue';

import vAutoFitHeight from './autoFitHeight';

export function setupDirectives(app: App) {
  app.directive('auto-fit-height', vAutoFitHeight);
}
