import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
} from "@aws-sdk/client-dynamodb"

import { marshall } from "@aws-sdk/util-dynamodb"
import { AppSyncResolverEvent } from "aws-lambda";
import { ulid } from "ulid";

const client = new DynamoDBClient({ region: "us-east-1" })

const TABLE_NAME = "Todos";

export const handler = async (event: AppSyncResolverEvent<any>) => {
    console.log(JSON.stringify(event, null, 2));
    const { UserId, title } = event.arguments.input;
    const TodoID = ulid();
    const params: PutItemCommandInput = {
        TableName: TABLE_NAME,
        Item: marshall({
            UserId,
            TodoID,
            title,
            completed: false,
            __typename: "Todo"
        }),
    }

    try {
        await client.send(new PutItemCommand(params));

        return {
            UserId,
            TodoID,
            title,
            completed: false,
            __typename: "Todo"
        }

    } catch (error) {
        console.log(error);
        throw error;
    }



}