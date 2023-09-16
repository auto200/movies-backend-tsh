import fsPromises from 'node:fs/promises';

export class JSONDbDriver<DbSchema = unknown> {
  public data: DbSchema;

  constructor(
    private filePath: string,
    defaultData: DbSchema
  ) {
    this.data = defaultData;
  }

  async load(): Promise<void> {
    try {
      const parsedData = JSON.parse(await fsPromises.readFile(this.filePath, 'utf-8'));

      if (parsedData) {
        this.data = parsedData as DbSchema;
      }
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      throw e;
    }
  }

  async write(): Promise<void> {
    if (this.data) await fsPromises.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }
}
