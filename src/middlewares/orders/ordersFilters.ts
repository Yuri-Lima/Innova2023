require("dotenv").config();
import express from 'express';
import stringInjections from '../../Utils/string.injections';
import mask_phone_number from '../../Utils/brazil.format.mobileNumber';
import { orderproperties } from '../../types/order';

/**
 *  Check if the request is a created order event
 */
function orderCreatedFilter(req: express.Request, _res: express.Response, next: express.NextFunction) {
    const event = <string>req.headers['event'];
    console.debug('Event: ' + event);
    if(event === 'created'){
        next();
    } else {
        console.log('Invalid event', event);
        return _res.status(201).json({
            status: 201,
            message: 'Invalid event',
            error: true,
            data: event
        });
    }
}

/**
 * Check if the request is a updated order event
 */
function orderUpdatedFilter(req: express.Request, _res: express.Response, next: express.NextFunction) {
    const event = <string>req.headers['event'];
    console.debug('Event: ' + event);
    if(event === 'updated'){
        next();
    } else {
        console.log('Invalid event', event);
        return _res.status(201).json({
            status: 201,
            message: 'Invalid event',
            error: true,
            data: event
        });
    }
}

/**
 * Product Filter - Check if the order has coroa
 */
function productFilter(req: express.Request, _res: express.Response, next: express.NextFunction) {
    const items = req.body.line_items;
    const products = items.filter((item: any) => item.name.toLowerCase().includes('coroa'));
    
    // Constraint: Coroa is not allowed
    if(products.length > 0){
        console.log('Coroa is not allowed');
        return _res.status(201).json({
            status: 201,
            message: 'Coroa is not allowed',
            error: true,
            data: products.map((product: any) => product.name)
        });
    }
    // If the order has no coroa, continue
    next();
}

/**
 * Sanitize the request body
 */
function sanitizeBody(req: express.Request, _res: express.Response, next: express.NextFunction) {
    const body:any = req.body;
    console.log('Sanitizing body...', body);

    const sanitizedBody:orderproperties= {
        id: body.id,
        parent_id: body.parent_id,
        status: body.status,
        currency: body.currency,
        version: body.version,
        prices_include_tax: body.prices_include_tax,
        date_created: body.date_created,
        date_modified: body.date_modified,
        discount_total: body.discount_total,
        discount_tax: body.discount_tax,
        shipping_total: body.shipping_total,    
        shipping_tax: body.shipping_tax,
        cart_tax: body.cart_tax,
        total: body.total,
        total_tax: body.total_tax,
        customer_id: body.customer_id,
        order_key: body.order_key,
        billing: {...body.billing},
        shipping: {...body.shipping},
        payment_method: body.payment_method,
        payment_method_title: body.payment_method_title,
        transaction_id: body.transaction_id,
        customer_ip_address: body.customer_ip_address,
        customer_user_agent: body.customer_user_agent,
        created_via: body.created_via,
        customer_note: body.customer_note,
        date_completed: body.date_completed,
        date_paid: body.date_paid,
        cart_hash: body.cart_hash,
        number: body.number,
        meta_data: body.meta_data,
        line_items: body.line_items,
        tax_lines: body.tax_lines,
        shipping_lines: body.shipping_lines,
        fee_lines: body.fee_lines,
        coupon_lines: body.coupon_lines,
        refunds: body.refunds,
        payment_url: body.payment_url,
        is_editable: body.is_editable,
        needs_payment: body.needs_payment,
        date_created_gmt: body.date_created_gmt,
        date_modified_gmt: body.date_modified_gmt,
        date_completed_gmt: body.date_completed_gmt,
        date_paid_gmt: body.date_paid_gmt,
        schedule: body.schedule,
        currency_symbol: body.currency_symbol || 'R$',
        _links: body._links
    };
    /**
     * Customer contact mobile phone sanitization
     * Constraint: Mobile phone must be in the format (XX) XXXXX-XXXX Brazilian format
     */
    if(sanitizedBody.billing.phone){
        const billingPhone = mask_phone_number(sanitizedBody.billing.phone);
        if(billingPhone.result){
            sanitizedBody.billing.phone = billingPhone.phoneNumber;
        }
        else{
            console.error('Invalid phone number');
            return _res.status(201).json({
                status: 201,
                message: 'Invalid phone number',
                error: true,
                data: {
                    orderId: sanitizedBody.id,
                    billingPhone: sanitizedBody.billing.phone
                }
            });
        }
    } else {
        console.error('Phone number is required');
        return _res.status(201).json({
            status: 201,
            message: 'Phone number is required',
            error: true,
            data: {
                orderId: sanitizedBody.id,
                billingPhone: sanitizedBody.billing.phone
            }
        });
    }
    /**
     * billing_recipient_phone sanitization
     */
    if(sanitizedBody.billing.billing_recipient_phone){
        const billingRecipientPhone = mask_phone_number(sanitizedBody.billing.billing_recipient_phone);
        if(billingRecipientPhone.result){
            sanitizedBody.billing.billing_recipient_phone = billingRecipientPhone.phoneNumber;
        }
        else{
            console.error('Invalid phone number');
            sanitizedBody.billing.billing_recipient_phone = "";
        }
    }
    /**
     * Billing Cellphone sanitization
     */
    if(sanitizedBody.billing.cellphone){
        const billingCellphone = mask_phone_number(sanitizedBody.billing.cellphone);
        if(billingCellphone.result){
            sanitizedBody.billing.cellphone = billingCellphone.phoneNumber;
        }
        else{
            console.error('Invalid cellphone number');
            sanitizedBody.billing.cellphone = "";
        }
    }
    /**
     * Shipping phone sanitization
     */
    if(sanitizedBody.shipping.phone){
        const shippingPhone = mask_phone_number(sanitizedBody.shipping.phone);
        if(shippingPhone.result){
            sanitizedBody.shipping.phone = shippingPhone.phoneNumber;
        }
        else{
            console.error('Invalid shipping phone number');
            sanitizedBody.shipping.phone = "";
        }
    }

    /**
     * Constraint: First name, middle name and last name must be only one word with the first letter capitalized.
     * Fullname must be the concatenation of first name, middle name and last name.
     */
     sanitizedBody.billing.first_name = String(sanitizedBody.billing.first_name);
     sanitizedBody.billing.last_name = String(sanitizedBody.billing.last_name);
     sanitizedBody.billing.first_name = sanitizedBody.billing.first_name.split(' ')[0].charAt(0).toUpperCase() + sanitizedBody.billing.first_name.split(' ')[0].slice(1);

    // Check if middle name exists inside of the first name
    if (sanitizedBody.billing.first_name.split(' ')[1]) {
        sanitizedBody.billing.middle_name = String(sanitizedBody.billing.first_name.split(' ')[1]).charAt(0).toUpperCase() + String(sanitizedBody.billing.first_name.split(' ')[1]).slice(1);
    } else {
        sanitizedBody.billing.middle_name = null;
    }
    sanitizedBody.billing.last_name = sanitizedBody.billing.last_name.split(' ')[0].charAt(0).toUpperCase() + sanitizedBody.billing.last_name.split(' ')[0].slice(1);
    
    // Check if middle name exists
    if(sanitizedBody.billing.middle_name) {
        sanitizedBody.billing.full_name = sanitizedBody.billing.first_name + ' ' + sanitizedBody.billing.middle_name + ' ' + sanitizedBody.billing.last_name;
    } else {
        sanitizedBody.billing.full_name = sanitizedBody.billing.first_name + ' ' + sanitizedBody.billing.last_name;
    }
    /**
     * Billing recipient Sanitization
     * Constraint: Destination Customer Name billing_recipient First Name, Middle Name and Last Name must be only one word with the first letter capitalized.
     * Destination Customer Name Full Name must be the concatenation of first name, middle name and last name.
     */
    sanitizedBody.billing.billing_recipient = String(sanitizedBody.billing.billing_recipient);
    sanitizedBody.billing.billing_recipient_first_name = sanitizedBody.billing.billing_recipient.split(' ')[0].charAt(0).toUpperCase() + sanitizedBody.billing.billing_recipient.split(' ')[0].slice(1);
    if (sanitizedBody.billing.billing_recipient.split(' ')[1]) {
        sanitizedBody.billing.billing_recipient_middle_name = String(sanitizedBody.billing.billing_recipient.split(' ')[1]).charAt(0).toUpperCase() + String(sanitizedBody.billing.billing_recipient.split(' ')[1]).slice(1);
    } else {
        sanitizedBody.billing.billing_recipient_middle_name = null;
    }
    if (sanitizedBody.billing.billing_recipient.split(' ')[2]) {
        sanitizedBody.billing.billing_recipient_last_name = String(sanitizedBody.billing.billing_recipient.split(' ')[2]).charAt(0).toUpperCase() + String(sanitizedBody.billing.billing_recipient.split(' ')[2]).slice(1);
    } else {
        sanitizedBody.billing.billing_recipient_last_name = null;
    }
    if (sanitizedBody.billing.billing_recipient_middle_name && sanitizedBody.billing.billing_recipient_last_name) {
        sanitizedBody.billing.billing_recipient_full_name = sanitizedBody.billing.billing_recipient_first_name + ' ' + sanitizedBody.billing.billing_recipient_middle_name + ' ' + sanitizedBody.billing.billing_recipient_last_name;
    } else if (sanitizedBody.billing.billing_recipient_middle_name) {
        sanitizedBody.billing.billing_recipient_full_name = sanitizedBody.billing.billing_recipient_first_name + ' ' + sanitizedBody.billing.billing_recipient_middle_name;
    } else {
        sanitizedBody.billing.billing_recipient_full_name = sanitizedBody.billing.billing_recipient_first_name || null;
    }

    /**
     * Product/Line Items Sanitization
     */
    let itens_pushed: any[] = [];
     const text_itens:string = "{n}Nome: {name}{n}Quantidade: {quantity}{n}Preco: {price}{n}{n}";
    if(sanitizedBody.line_items.length > 0){
        sanitizedBody.line_items.forEach((item: any) => {
            let data_to_be_replaced = {
                name: item.name,
                quantity: item.quantity,
                price: item.total || item.price,
                n: '\n'
            }
            let new_text_item_replaced = stringInjections(text_itens, data_to_be_replaced);
            itens_pushed.push(new_text_item_replaced);
        });
    }
    sanitizedBody.line_items.sanitazed_data = itens_pushed.join('');

    // console.log(itens_pushed);
    // console.log(sanitizedBody.line_items.sanitazed_data);
    // console.log(sanitizedBody);

    req.body = {...sanitizedBody, n: '\n'}; // Replace the body with the sanitized body
    
    next();
}

export {
    orderCreatedFilter,
    orderUpdatedFilter,
    productFilter,
    sanitizeBody
};