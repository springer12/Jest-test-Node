import { getConnectionOptions, createConnection } from "typeorm";

export const createTypeormConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  console.log(process.env.NODE_ENV,'<-----env')
  console.log(connectionOptions,'<-----options')
  return createConnection({ ...connectionOptions, name: "default" });
};
