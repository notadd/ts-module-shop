const SOURCE_PATH = process.env.NODE_ENV === 'packages' ? 'dist' : 'src';
module.exports= {
  "type": "postgres",
  "host": "localhost",
  "port":  5432,
  "username": "postgres",
  "password": "123456",
  "database": "postgres",
  "entities": [`${SOURCE_PATH}/**/**.entity{.ts,.js}`],
  "synchronize": false,
  "logging":false
}