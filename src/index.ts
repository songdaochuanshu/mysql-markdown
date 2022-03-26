import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';

interface MySQLMarkdownOptions {
  database?: string;
  user?: string;
  password?: string;
  port?: number;
  host?: string;
  output?: string;
  fileName?: string;
}

interface columnsOptions {
  table_name: string;
  column_name: string;
  column_comment: string;
  data_type: string;
  character_maximum_length: string;
  numeric_precision: string;
  is_nullable: string;
  column_default: string;
  column_key: string;
}

export class MySQLMarkdown {
  private config: MySQLMarkdownOptions;
  private connection: mysql.Connection;

  constructor(config: MySQLMarkdownOptions) {
    this.config = config;
    this.connection = mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port,
    });
  }

  private async getTables(): Promise<Array<columnsOptions>> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = "${this.config.database}"`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results as any);
          }
        }
      );
    });
  }

  private async getTableColumns(tableName: string) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT column_name, column_comment, data_type, character_maximum_length, numeric_precision, is_nullable, column_default, column_key FROM information_schema.columns WHERE table_name = '${tableName}'`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results as any);
          }
        }
      );
    });
  }

  private createTable(columns: Array<columnsOptions>) {
    let table = `| 序号 | 名称 | 描述 | 类型 | 键 | 为空 | 默认值 |\n| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |\n`;
    columns.forEach((column, index) => {
      table += `| ${index + 1} | ${column.column_name} | ${
        column.column_comment
      } | ${column.data_type} | ${column.column_key} | ${
        column.is_nullable
      } | ${column.column_default}  |\n`;
    });
    return table;
  }

  private createFile(
    index: number,
    tableName: string,
    columns: Array<columnsOptions>
  ) {
    let file = `### ${index}.${tableName}\n`;
    file += this.createTable(columns);
    return file;
  }

  async build() {
    const tables = await this.getTables();
    let posts = '';
    tables.forEach(async (table, index) => {
      console.log(table.table_name);
      const columns = await this.getTableColumns(table.table_name);
      posts +=
        this.createFile(index + 1, table.table_name, columns as any) + '\n\n';
      fs.writeFileSync(
        path.join(this.config.output ?? './', `${this.config.fileName}.md`),
        posts
      );
    });
  }
}
