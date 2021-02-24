import { MongoClient } from 'mongodb';

export const expectEqual = (expected: any) => (d: any) =>
    expect(d).toEqual(expected);

export const dropCollections = async (
    repoClient: MongoClient,
    collections: string[]
): Promise<any> => {
    const colls = await repoClient.db('photon').collections();
    return colls
        ? Promise.all(
              colls
                  .filter((col) => collections.includes(col.collectionName))
                  .map((col) => col.drop())
          )
        : Promise.resolve();
};
