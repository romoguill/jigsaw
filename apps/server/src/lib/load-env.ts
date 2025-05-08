import dotenv from 'dotenv';
import path from 'path';

console.log(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env'
);

console.log(
  path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env'
  )
);

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env'
  ),
});
