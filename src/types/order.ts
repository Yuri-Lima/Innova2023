/**
 * Original type from WooCommerce API
 */
type billing = {
    [x: string]: any;
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
    payment: string;
    billing_cpf: string;
    billing_cnpj: string;
    billing_company: string;
    space: string;
    delivery: string;
    billing_recipient: string;
    billing_recipient_phone: string;
    billing_number: string;
    billing_complementary: string;
    billing_neighborhood: string;
    billing_msg: string;
    space_2: string;
    number: string;
    neighborhood: string;
    persontype: string;
    cpf: string;
    rg: string;
    cnpj: string;
    ie: string;
    birthdate: string;
    sex: string;
    cellphone: string;
}
type shipping = {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
    number: string;
    neighborhood: string;
}
type meta_data = Array<{
    id: number;
    key: string;
    value: string;
}>;
type taxes = Array<{
    id: number;
    total: string;
    subtotal: string;
}>;
type line_items = Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: taxes;
    meta_data: meta_data;
    sku: string;
    price: number;
    image: [Object];
    parent_name: string | null;
}>;
type tax_lines = Array<{
    id: number;
    rate_code: string;
    rate_id: number;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    meta_data: meta_data;
}>;
type shipping_lines = Array<{
    id: number;
    method_title: string;
    method_id: string;
    instance_id: string;
    total: string;
    total_tax: string;
    taxes: taxes;
    meta_data: meta_data;
}>;
type fee_lines = Array<{
    id: number;
    title: string;
    tax_class: string;
    tax_status: string;
    total: string;
    total_tax: string;
    taxes: taxes;
    meta_data: meta_data;
}>;
type coupon_lines = Array<{
    id: number;
    code: string;
    discount: string;
    discount_tax: string;
    meta_data: meta_data;
}>;
type refunds = Array<{
    id: number;
    reason: string;
    total: string;
    date_created: Date;
    date_modified: Date;
    meta_data: meta_data;
}>;
type schedule = {
    date: Date;
    time: string;
    time_end: string;
    time_start: string;
    time_end_gmt: string;
    time_start_gmt: string;
    date_gmt: Date;
    time_celebration: string;
    delivery_alert: string;
    space_3: string;
};
type self = Array<{
    href: string;
}>;
type collection = Array<{
    href: string;
}>;
type customer = Array<{
    href: string;
}>;

/**
 * Extended version of WooCommerce API type
 */
 type stringNull = string | string[] | null | Array<string | null>;
 type billing_extended = billing & {
    middle_name: stringNull;
    full_name: stringNull;
    billing_recipient_first_name: stringNull;
    billing_recipient_middle_name: stringNull;
    billing_recipient_last_name: stringNull;
    billing_recipient_full_name: stringNull;
    sanitazed_data: stringNull;
 }
 type shipping_extended = shipping & {
    middle_name: stringNull;
    full_name: stringNull;
    sanitazed_data: stringNull;
}
type line_items_extended = line_items & {
    sanitazed_data: stringNull;
}

interface orderproperties  {
    id: number;
    parent_id: number;
    status: 'on-hold' | 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded' | 'failed';
    currency: 'BRL' | 'USD' | 'EUR';
    version: string;
    prices_include_tax: boolean;
    date_created: Date;
    date_modified: Date;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    customer_id: number;
    order_key: string;
    billing: billing_extended;
    shipping: shipping_extended;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    customer_ip_address: string;
    customer_user_agent: string;
    created_via: string;
    customer_note: string;
    date_completed: Date | null;
    date_paid: Date | null;
    cart_hash: string;
    number: string;
    meta_data: meta_data;
    line_items: line_items_extended;
    tax_lines: tax_lines;
    shipping_lines: shipping_lines;
    fee_lines: fee_lines;
    coupon_lines: coupon_lines;
    refunds: refunds;
    payment_url: string;
    is_editable: boolean;
    needs_payment: boolean;
    date_created_gmt: Date;
    date_modified_gmt: Date;
    date_completed_gmt: Date | null;
    date_paid_gmt: Date | null;
    schedule: schedule;
    currency_symbol: string | null | undefined | 'R$' | '$' | '€';
    _links: {
        self: self;
        collection: collection;
        customer: customer;
    };
}
export {
    billing,
    shipping,
    meta_data,
    taxes,
    line_items,
    tax_lines,
    shipping_lines,
    fee_lines,
    coupon_lines,
    refunds,
    schedule,
    self,
    collection,
    customer,
    orderproperties,
    billing_extended,
    shipping_extended,
    line_items_extended
}