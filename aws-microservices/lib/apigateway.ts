import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

interface SwnApiGatewayProps {
  productMicroservice: IFunction
}

export class SwnApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
    super(scope, id)

    // product
    // GET /product
    // POST /product

    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const apgw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: props.productMicroservice,
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
  }
}