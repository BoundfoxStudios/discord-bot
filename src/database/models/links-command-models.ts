import { DataTypes, Model, Relationships } from '../../deps.ts';

export class CategoryModel extends Model {
  static table = 'categories';
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
  };

  id!: number;
  name!: string;

  static links(): Promise<LinkModel[]> {
    return this.hasMany(LinkModel);
  }
}

export class LinkModel extends Model {
  static table = 'links';
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    categoryId: Relationships.belongsTo(CategoryModel),
    title: DataTypes.STRING,
    url: DataTypes.STRING,
  };

  id!: number;
  categoryId!: number;
  title?: string;
  url!: string;

  static category(): Promise<CategoryModel> {
    return this.hasOne(CategoryModel);
  }
}

