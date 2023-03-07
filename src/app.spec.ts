import request from 'supertest';
import orderCreatedSample from './Utils/wc.samples/order.created.sample';
// import { axiosRequest, AxiosRequestConfig } from './Utils/axios.requests';
import App from './app'
require('dotenv').config();

describe("App Routes Tests", () => {

  test('Health Check', async() => {
    const endpoint:string = '/api/woo/healthCheck';
    const res = await request(App.app).get(endpoint);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Hooks API Status: OK');
  });

  test('Order Created', async() => {
    const orderCreatedSampleString = JSON.parse(JSON.stringify(orderCreatedSample));
    const endpoint:string = '/api/woo/hooks/order/created';
    const res = await request(App.app).post(endpoint).
      set('Content-type', 'application/json').
      // set('x-forwarded-for', '127.0.0.1').
      set('x-wc-webhook-resource', 'order').
      set('x-wc-webhook-event', 'created').
      // set('referer', 'https://www.newinnova.com').
      set('x-wc-webhook-id', '123456789').
      set('x-wc-webhook-topic', 'order.created').
      set('x-wc-webhook-signature', '123456789').
      // set('x-wc-webhook-source', 'https://www.newinnova.com').
      send(orderCreatedSampleString);
    
    // console.log('Order Created: ', res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Order saved');
  });

  test('Order Created Product Forbidden', async() => {
    const orderCreatedSampleString = JSON.parse(JSON.stringify(orderCreatedSample));
    orderCreatedSampleString.line_items[0].product_id = 0;
    const endpoint:string = '/api/woo/hooks/order/created';
    const res = await request(App.app).post(endpoint).
      set('Content-type', 'application/json').
      // set('x-forwarded-for', '127.0.0.1').
      set('x-wc-webhook-resource', 'order').
      set('x-wc-webhook-event', 'created').
      // set('referer', 'https://www.newinnova.com').
      set('x-wc-webhook-resource', 'order').
      set('x-wc-webhook-id', '123456789').
      set('x-wc-webhook-topic', 'order.created').
      set('x-wc-webhook-signature', '123456789').
      // set('x-wc-webhook-source', 'https://www.newinnova.com').
      send(orderCreatedSampleString);
    
    // console.log('Order Created: ', res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Order saved');
  });
});
