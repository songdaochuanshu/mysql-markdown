const { MySQLMarkdown } = require('./dist/index');

let template = new MySQLMarkdown({
  database: 'template',
  user: 'template',
  password: '123456',
  host: 'localhost',
  port: 3306,
  output: './',
  fileName: 'template',
});

template.run();
