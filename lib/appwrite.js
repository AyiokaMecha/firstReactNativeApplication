import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";
import Query from "../app/search/[query]";

export const config = {
  endpoint: "http://cloud.appwrite.io/v1",
  platform: "com.mecha.aora",
  projectId: "6694a26700092b0096b2",
  databaseId: "6694a3cc0028e8bfaca0",
  userCollectionId: "6694a400003ba5e9f537",
  videoCollectionId: "6694a42e0013038f137d",
  storageId: "6694a5e0000bb0c6deba",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  account;
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  const currentAccount = await account.get();

  if (!currentAccount) throw Error;

  const currentUser = await databases.listDocuments(
    config.databaseId,
    config.userCollectionId,
    [Query.equal("accountId", currentAccount.$id)]
  );

  if (!currentUser) throw Error;
  return currentUser.documents[0];
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.orderDesc('$createdAt', Query.limit(7))]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
