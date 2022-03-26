# mysql-markdown

[![GitHub stars](https://img.shields.io/github/stars/songdaochuanshu/mysql-markdown)](https://github.com/songdaochuanshu/mysql-markdown/stargazers)
[![GitHub license](https://img.shields.io/github/license/songdaochuanshu/mysql-markdown)](https://github.com/songdaochuanshu/mysql-markdown/blob/main/LICENSE)

[![NPM](https://nodei.co/npm/mysql-markdown.png)](https://nodei.co/npm/mysql-markdown/)

### Installation

```bash 
npm install mysql-markdown --save
or
yarn add mysql-markdown
```

### DEMO

```js 

// import { MySQLMarkdown } from 'mysql-markdown'
const { MySQLMarkdown } = require('mysql-markdown');


let template = new MySQLMarkdown({
  database: 'template',
  user: 'template',
  password: '123456',
  host: 'localhost',
  port: 3306,
  output: './',
  fileName: 'template',
});

template.build();

```