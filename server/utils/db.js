// Set up db connection here
import { MongoClient } from "mongodb";

const connectionString = "mongodb://127.0.0.1:27017";
const option = {useUnifiedTopology: true}

export const client = new MongoClient(connectionString, option);

export const db = client.db("practice-mongo");
