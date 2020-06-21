import { Model } from '../deps.ts';

export const modelExists = async <T extends Model>(model: new() => T, fieldName: keyof T, value: any): Promise<boolean> => {
  return !!await modelCount(model, fieldName, value);
};

export const modelWhere = <T extends Model>(model: new() => T, fieldName: keyof T, value: any): typeof Model => {
  return Model.where.call(modelAsTypeOfModel(model), fieldName as string, value);
}

export const modelGet = async <T extends Model>(model: new() => T, fieldName: keyof T, value: any): Promise<T | undefined> => {
  return (await modelWhere(model, fieldName, value).get())[0];
}

export const modelCount = async <T extends Model>(model: new() => T, fieldName: keyof T, value: any): Promise<number> => {
  return await Model.where.call(modelAsTypeOfModel(model), fieldName as string, value).count();
};

function modelAsTypeOfModel<T extends Model>(model: new() => T): typeof Model {
  return model as unknown as typeof Model;
}
