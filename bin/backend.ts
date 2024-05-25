#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../stacks/database-stack';
import { ComputeStack } from '../stacks/compute-stack';
import { AuthStack } from '../stacks/auth-stack';
import { AppSyncStack } from '../stacks/appsync-stack';

const app = new cdk.App();
const databaseStack = new DatabaseStack(app, "DatabaseStack");

const computeStack = new ComputeStack(app, "ComputeStack", {
  usersTable: databaseStack.usersTable
});

const authStack = new AuthStack(app, "AuthStack", {
  addUserPostConfirmation: computeStack.addUserToTableFunc
});

const appSyncStack = new AppSyncStack(app, "AppSyncStack", {
  userPool: authStack.todoUserPool
})
