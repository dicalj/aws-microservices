import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservice } from './microservice';
import { SwnApiGateway } from './apigateway';
import { SwnEventBus } from './eventbus';

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
    })

    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFunction: microservices.basketMicroservice,
      targetFunction: microservices.orderingMicroservice
    });
  }
}
