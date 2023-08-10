// The following package is experimental and provides helper methods to start the UI app of Docker Desktop from puppeteer, and then navigate to and test an extension. See reference: https://docs.docker.com/desktop/extensions-sdk/dev/continuous-integration/
const { DesktopUI } = require('@docker/extension-test-helper');
const { exec } = require('child_process');
const util = require('util');

const cliExec = util.promisify(exec);

describe('Instantiate Docker Desktop dashboard instance, build and install extension before testing, and uninstall extension after testing', () => {
  // keep a handle on the app to stop it at the end of tests
  let dashboard;

  // beforeAll(async () => {
  //   await cliExec(`docker build -t kafkasonar/kafkasonar:latest .`, {
  //     cwd: '.',
  //   });

  //   await cliExec(`docker extension install -f kafkasonar/kafkasonar:latest`);
  // }, 30000);

  // afterAll(async () => {
  //   dashboard?.stop();
  //   await cliExec(`docker extension uninstall kafkasonar/kafkasonar:latest`);
  // });

  describe('E2E test Kafka Sonar', () => {
    test('navigate to extension', async () => {
      dashboard = await DesktopUI.start();

      const eFrame = await dashboard.navigateToExtension(
        'kafkasonar/kafkasonar:latest'
      );

      // use puppeteer APIs to manipulate the UI, click on buttons, expect visual display and validate your extension
      // await eFrame.waitForSelector('#someElementId');
    });
  });
});

module.exports = cliExec;
