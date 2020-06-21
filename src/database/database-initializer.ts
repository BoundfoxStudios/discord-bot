import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { Inject, Injectable } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { CategoryModel } from './models/links-command-models.ts';

const debug = deriveDebug('DatabaseInitializer');

@Injectable()
export class DatabaseInitializer {
  constructor(@Inject(DiTokens.Configuration) private readonly configuration: Configuration) {
  }

  async initialize(): Promise<void> {
    debug('Initializing categories...');

    for (const category of this.configuration.commands.links.defaultCategories) {
      await this.createCategory(category);
    }
  }

  private async createCategory(name: string): Promise<void> {
    const existingCategory = await CategoryModel.where('name', name).count();

    if (existingCategory) {
      return;
    }

    debug('Creating category %s', name);

    const category = new CategoryModel();
    category.name = name;
    await category.save();
  }
}