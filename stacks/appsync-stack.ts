import * as path from "path";

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appSync from "aws-cdk-lib/aws-appsync";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface AppSyncStackProps extends cdk.StackProps {
    userPool: UserPool;
    createTodoFunc: NodejsFunction;
}

export class AppSyncStack extends cdk.Stack {
    public readonly api: appSync.GraphqlApi;

    constructor(scope: Construct, id: string, props: AppSyncStackProps) {
        super(scope, id, props);

        this.api = this.createAppSyncApi(props);
        this.createTodoResolver(scope, props, this.api);
        this.createOutputs(this.api);
    }

    createAppSyncApi(props: AppSyncStackProps) {
        const api = new appSync.GraphqlApi(this, "Api", {
            name: "TodoApp",
            definition: appSync.Definition.fromFile(path.join(__dirname, "../graphql/schema.graphql")),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appSync.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: props.userPool
                    },
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: appSync.AuthorizationType.IAM,
                    },
                ],
            },
            logConfig: {
                fieldLogLevel: appSync.FieldLogLevel.ALL,
            },
        })

        return api;
    }

    createTodoResolver(
        scope: Construct, 
        props: AppSyncStackProps, 
        api: appSync.IGraphqlApi
    ) {
        const createTodoResolver = api
            .addLambdaDataSource("CreateTodoDataSource", props.createTodoFunc)
            .createResolver("CreateTodoMutation", {
                typeName: "Mutation",
                fieldName: "createTodo",
            })
    }

    createOutputs(api: appSync.GraphqlApi) {
        new cdk.CfnOutput(this, "GraphQLApiURL", {
            value: api.graphqlUrl
        });
    }
} 

