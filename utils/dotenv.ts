import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';

const envPath = path.join('./', '.env');
const myEnv = dotenv.config({ path: envPath });

dotenvExpand.expand(myEnv);
