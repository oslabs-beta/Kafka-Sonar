// The following package is experimental and provides helper methods to start the UI app of Docker Desktop from puppeteer, and then navigate to and test an extension.
// See reference: https://docs.docker.com/desktop/extensions-sdk/dev/continuous-integration/
import { DesktopUI } from '@docker/extension-test-helper';
import { exec as originalExec } from 'child_process';
import * as util from 'util';

export const exec = util.promisify(originalExec);

describe('Instantiate Docker Desktop dashboard instance, build and install extension before testing, and uninstall extension after testing', () => {
  // keep a handle on the app to stop it at the end of tests
  let dashboard;

  beforeAll(async () => {
    await exec(`docker build -t kafkasonar/kafkasonar:latest .`, {
      cwd: 'my-extension-src-root',
    });

    await exec(`docker extension install -f kafkasonar/kafkasonar:latest`);
  });

  afterAll(async () => {
    dashboard?.stop();
    await exec(`docker extension uninstall kafkasonar/kafkasonar:latest`);
  });

  describe('E2E test Kafka Sonar', async () => {
    dashboard = await DesktopUI.start();

    test('navigate to extension', async () => {
      const eFrame = await dashboard.navigateToExtension(
        'kafkasonar/kafkasonar:latest'
      );

      // use puppeteer APIs to manipulate the UI, click on buttons, expect visual display and validate your extension
      await eFrame.waitForSelector('#someElementId');
    });
  });
});
