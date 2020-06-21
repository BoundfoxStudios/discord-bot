import { CategoryModel, LinkModel } from '../database/models/links-command-models.ts';
import { modelExists, modelGet, modelWhere } from '../database/query-helper.ts';
import { Injectable } from '../deps.ts';
import { deriveDebug } from '../utils.ts';

const debug = deriveDebug('LinksService');

@Injectable()
export class LinksService {
  async listCategories(): Promise<CategoryModel[]> {
    return await CategoryModel.all();
  }

  async listLinks(categoryName: string): Promise<LinkModel[]> {
    categoryName = categoryName.toLowerCase();

    if (!await modelExists(CategoryModel, 'name', categoryName)) {
      throw new Error('Category does not exist!');
    }

    const { id } = (await modelGet(CategoryModel, 'name', categoryName))!;

    return await modelWhere(LinkModel, 'categoryId', id).all();
  }

  async addLink(url: string, categoryName: string, name?: string): Promise<void> {
    debug('Trying to add link %s, %s, %s', url, categoryName, name);

    url = this.normalizeUrl(url);
    categoryName = categoryName.toLowerCase();

    if (await modelExists(LinkModel, 'url', url)) {
      throw new Error('Link already exists!');
    }

    if (!await modelExists(CategoryModel, 'name', categoryName)) {
      throw new Error('Category does not exist!');
    }

    const category = (await modelGet(CategoryModel, 'name', categoryName))!;

    const link = new LinkModel();
    link.title = name;
    link.url = url;
    link.categoryId = category.id;

    await link.save();
  }

  async removeLink(url: string): Promise<void> {
    url = this.normalizeUrl(url);

    if (!await modelExists(LinkModel, 'url', url)) {
      throw new Error('Link not found.');
    }

    await modelWhere(LinkModel, 'url', url).delete();
  }

  private normalizeUrl(url: string): string {
    return new URL(url).toString();
  }
}
