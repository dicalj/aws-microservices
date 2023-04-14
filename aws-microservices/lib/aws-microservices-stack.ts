import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservice } from './microservice';
import { SwnApiGateway } from './apigateway';
import { SwnEventBus } from './eventbus';
import { SwnQueue } from './queue';
import { SwnCloudWatch } from './cloudwatch';

export class AwsMicroservicesStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database');

    const microservices = new SwnMicroservice(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    });

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservice: microservices.orderingMicroservice
    });

    const queue = new SwnQueue(this, 'Queue', {
      consumer: microservices.orderingMicroservice
    });

    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFunction: microservices.basketMicroservice,
      targetQueue: queue.orderQueue
    });

    const cloudwatch = new SwnCloudWatch(this, 'CloudWatch', {
      productMicroservice: microservices.productMicroservice
    })
  }
}
