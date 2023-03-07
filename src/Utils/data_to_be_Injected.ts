/**
 * @fileoverview This file is used to inject data into the string
 * Example: {id} => 1 This
 */

/**
 * From Types
 */
import { orderproperties } from '../types/order';

function data_to_be_Injected_Function(obj: orderproperties, _optionalData?: any) {
    if (_optionalData?.status) {
        obj.status = _optionalData.status;
    }
    return {
        order_id: obj.id || " ",
        parent_id: obj.parent_id || " ",
        status: obj.status || " ",
        currency: obj.currency || " ",
        version: obj.version || " ",
        prices_include_tax: obj.prices_include_tax || " ",
        date_created: obj.date_created || " ",
        date_modified: obj.date_modified || " ",
        discount_total: obj.discount_total || " ",
        discount_tax: obj.discount_tax || " ",
        shipping_total: obj.shipping_total || " ",
        shipping_tax: obj.shipping_tax || " ",
        cart_tax: obj.cart_tax || " ",
        total: obj.total || " ",
        total_tax: obj.total_tax || " ",
        customer_id: obj.customer_id || " ",
        order_key: obj.order_key || " ",
        billing_first_name: obj.billing.first_name || " ",
        billing_last_name: obj.billing.last_name || " ",
        billing_company_1: obj.billing.company || " ",
        billing_address_1: obj.billing.address_1 || " ",
        billing_address_2: obj.billing.address_2 || " ",
        billing_city: obj.billing.city || " ",
        billing_state: obj.billing.state || " ",
        billing_postcode: obj.billing.postcode || " ",
        billing_country: obj.billing.country || " ",
        billing_email: obj.billing.email || " ",
        billing_phone: obj.billing.phone || " ",
        billing_payment: obj.billing.payment || " ",
        billing_cpf_1: obj.billing.billing_cpf || " ",
        billing_cnpj_1: obj.billing.billing_cnpj || " ",
        billing_company_2: obj.billing.billing_company || " ",
        billing_space: obj.billing.space || " ",
        billing_delivery: obj.billing.delivery || " ",
        billing_recipient: obj.billing.billing_recipient || " ",
        billing_recipient_phone: obj.billing.billing_recipient_phone || " ",
        billing_number_1: obj.billing.billing_number || " ",
        billing_complementary: obj.billing.billing_complementary || " ",
        billing_neighborhood_1: obj.billing.billing_neighborhood || " ",
        billing_msg: obj.billing.billing_msg || " ",
        billing_space_2: obj.billing.space_2 || " ",
        billing_number_2: obj.billing.number || " ",
        billing_neighborhood_2: obj.billing.neighborhood || " ",
        billing_persontype: obj.billing.persontype || " ",
        billing_cpf_2: obj.billing.cpf || " ",
        billing_rg: obj.billing.rg || " ",
        billing_cnpj_2: obj.billing.cnpj || " ",
        billing_ie: obj.billing.ie || " ",
        billing_birthdate: obj.billing.birthdate || " ",
        billing_sex: obj.billing.sex || " ",
        billing_cellphone: obj.billing.cellphone || " ",
        billing_middle_name: obj.billing.middle_name || " ",
        billing_full_name: obj.billing.full_name || " ",
        billing_recipient_first_name: obj.billing.billing_recipient_first_name || " ",
        billing_recipient_middle_name: obj.billing.billing_recipient_middle_name || " ",
        billing_recipient_last_name: obj.billing.billing_recipient_last_name  || " ",
        billing_recipient_full_name: obj.billing.billing_recipient_full_name || " ",

        shipping_first_name: obj.shipping.first_name || " ",
        shipping_last_name: obj.shipping.last_name || " ",
        shipping_company: obj.shipping.company || " ",
        shipping_address_1: obj.shipping.address_1 || " ",
        shipping_address_2: obj.shipping.address_2 || " ",
        shipping_city: obj.shipping.city || " ",
        shipping_state: obj.shipping.state || " ",
        shipping_postcode: obj.shipping.postcode || " ",
        shipping_country: obj.shipping.country || " ",
        shipping_phone: obj.shipping.phone || " ",
        shipping_number: obj.shipping.number || " ",
        shipping_neighborhood: obj.shipping.neighborhood || " ",

        payment_method: obj.payment_method || " ",
        payment_method_title: obj.payment_method_title || " ",
        transaction_id: obj.transaction_id || " ",
        customer_ip_address: obj.customer_ip_address || " ",
        customer_user_agent: obj.customer_user_agent || " ",
        created_via: obj.created_via || " ",
        customer_note: obj.customer_note || " ",
        date_paid: obj.date_paid || " ",
        cart_hash: obj.cart_hash || " ",
        number: obj.number || " ",
        meta_data: obj.meta_data || " ",
        line_items: obj.line_items.sanitazed_data || " ",
        tax_lines: obj.tax_lines || " ",
        shipping_lines: obj.shipping_lines || " ",
        fee_lines: obj.fee_lines || " ",
        coupon_lines: obj.coupon_lines || " ",
        refunds: obj.refunds || " ",
        payment_url: obj.payment_url || " ",
        is_editable: obj.is_editable || " ",
        needs_payment: obj.needs_payment || " ",
        date_created_gmt: obj.date_created_gmt || " ",
        date_modified_gmt: obj.date_modified_gmt || " ",
        date_completed_gmt: obj.date_completed_gmt || " ",
        date_paid_gmt: obj.date_paid_gmt || " ",
        schedule_date: obj.schedule.date || " ",
        schedule_time: obj.schedule.time || " ",
        schedule_time_celebration: obj.schedule.time_celebration || " ",
        schedule_delivery_alert: obj.schedule.delivery_alert || " ",
        schedule_space_3: obj.schedule.space_3 || " ",
        currrency_symbol: obj.currency_symbol || " ",
        _links: obj._links || " ",
        n: "\n" || " "
    }
}

export {
    data_to_be_Injected_Function
}