import * as cdk from "aws-cdk-lib"; 
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DatabaseStack extends cdk.Stack {
    public readonly usersTable: Table;
    public readonly todosTable: Table;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props); 
        this.usersTable = new Table(this, "UsersTable", {
            tableName: "Users",
            partitionKey: {
                name: "UserID",
                type: AttributeType.STRING,
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })

        this.todosTable = new Table(this, "TodosTable", {
            tableName: "Todos",
            partitionKey: {
                name: "UserID",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "TodoID",
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })

        // Allows you to create different partition key to create data 
        this.todosTable.addGlobalSecondaryIndex({
            indexName: "getTodoId",
            partitionKey: {
                name: "UserID",
                type: AttributeType.STRING
            },
            // This is temporary (not a good way to fetch data)
            sortKey: {
                name: "title",
                type: AttributeType.STRING
            }
        })
    }
}