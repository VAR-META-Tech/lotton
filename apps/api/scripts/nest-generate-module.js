// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

/**
 * @input: yarn generate:module [name].
 *         The [name] parameter is the desired name for the module, service, and controller.
 * @output: creates a new module, service, and controller with the given name
 * @return: returns an error message if there is an error, otherwise returns the stdout
 * @example: yarn generate:module user
 */
const name = process.argv[2];
if (!name) {
  console.warn(
    'Please provide a name for the module, service, and controller.',
  );
  process.exit(1);
}

const modulePath = `modules/${name}`;
const projectOption = '--project src';

exec(
  `nest g module ${modulePath} ${projectOption} && nest g service ${modulePath} ${projectOption} && nest g controller ${modulePath} ${projectOption}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  },
);
