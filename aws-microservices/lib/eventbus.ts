import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnEventBusProps {
  publisherFunction: IFunction;
  targetFunction: IFunction;
}

export class SwnEventBus extends Construct {

  constructor(scope: Construct, id: string, props: SwnEventBusProps) {
    super(scope, id);

    // event bus
    const eventBus = new EventBus(this, 'SwnEventBus', {
      eventBusName: 'SwnEventBus'
    })

    // event bus rule
    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus: eventBus,
      enabled: true,
      description: 'When Basket microservice checkout the basket',
      eventPattern: {
        source: ['com.swn.basket.checkoutbasket'],
        detailType: ['CheckoutBasket']
      },
      ruleName: 'CheckoutBasketRule'
    })

    // event bus grant
    eventBus.grantPutEventsTo(props.publisherFunction);

    // event bus rule target
    checkoutBasketRule.addTarget(new LambdaFunction(props.targetFunction));
  }
}
