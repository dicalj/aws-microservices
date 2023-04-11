import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

interface SwnApiGatewayProps {
  productMicroservice: IFunction;
  basketMicroservice: IFunction;
  orderingMicroservice: IFunction;
}

export class SwnApiGateway extends Construct {

  constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
    super(scope, id)

    this.createProductApi(props.productMicroservice);
    this.createBasketApi(props.basketMicroservice);
    this.createOrderApi(props.orderingMicroservice);
  }

  private createBasketApi(basketMicroservice: IFunction): LambdaRestApi {
    // Basket microservices api gateway
    // root name = basket

    // GET /basket
    // POST /basket

    // GET /basket/{userName}
    // DELETE /basket/{userName}

    // POST /basket/checkout

    const apgw = new LambdaRestApi(this, 'basketApi', {
      restApiName: 'Basket Service',
      handler: basketMicroservice,
      proxy: false,
      integrationOptions: {
        allowTestInvoke: false
      }
    });

    const basket = apgw.root.addResource('basket')
    basket.addMethod('GET') // GET /basket
    basket.addMethod('POST') // POST /basket

    const singleBasket = basket.addResource('{userName}')
    singleBasket.addMethod('GET') // GET /basket/{userName}
    singleBasket.addMethod('DELETE') // DELETE /basket/{userName}

    const basketCheckout = basket.addResource('checkout')
    basketCheckout.addMethod('POST') // POST /basket/checkout

    return apgw
  }

  private createProductApi(productMicroservice: IFunction): LambdaRestApi {
    // Product microservices api gateway
    // root name = product

    // GET /product
    // POST /product

    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const apgw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: productMicroservice,
      proxy: false,
      integrationOptions: {
        allowTestInvoke: false
      }
    });

    const product = apgw.root.addResource('product')
    product.addMethod('GET') // GET /product
    product.addMethod('POST') // POST /product

    const singleProduct = product.addResource('{id}')
    singleProduct.addMethod('GET') // GET /product/{id}
    singleProduct.addMethod('PUT') // PUT /product/{id}
    singleProduct.addMethod('DELETE') // DELETE /product/{id}

    return apgw
  }

  private createOrderApi(orderingMicroservice: IFunction): LambdaRestApi {
    // Order microservices api gateway
    // root name = order

    // GET /order
    // GET /order/{userName}

    const apgw = new LambdaRestApi(this, 'orderApi', {
      restApiName: 'Order Service',
      handler: orderingMicroservice,
      proxy: false,
      integrationOptions: {
        allowTestInvoke: false
      }
    });

    const order = apgw.root.addResource('order')
    order.addMethod('GET') // GET /order

    const singleOrder = order.addResource('{userName}')
    singleOrder.addMethod('GET') // GET /order/{userName}

    return apgw
  }
}
