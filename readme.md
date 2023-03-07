# New Innova Cesta Project

# WC - WebHooks
1. Order Created webhook
   1. receive order data
   2. check if order is valid
   3. check if there is a signature
   4. check and remove constrants from order data example: `lines_items.name === 'Coroa'`
   5. sanitize order data
   6. send order data to the queue using the exchange name wc


# Helper
- (Create-global-variables)[https://javascript.plainenglish.io/how-to-create-global-variables-in-typescript-with-node-js-9ca24f648991]
- (SpreadSheet-nodejs)[https://developers.google.com/sheets/api/quickstart/nodejs]
- (Socket.io with PM2 Cluster Mode)[https://socket.io/docs/v4/pm2/]
- (Nginx SocketIo)[https://www.nginx.com/blog/nginx-nodejs-websockets-socketio/]
- (Pm2 with Nginx)[https://pm2.keymetrics.io/docs/tutorials/pm2-nginx-production-setup]

# OpenSSL Commands
- (OpenSSL)[https://www.openssl.org/docs/man1.1.1/man1/openssl.html]
- openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Authtication Decisions
- oauth2 with passport
- Cookies
- Session
- Client side authentication
- Role Based Access Control (RBAC)

# How this project was created
The mais folder are App and Server
- App: control

# Pending
- [ ] wc.cron.controllers - create a cron the rest of the task routes keys

# Fields Availables
order_id
parent_id
status
currency
version
prices_include_tax
date_created
date_modified
discount_total
discount_tax
shipping_total
shipping_tax
cart_tax
total
total_tax
customer_id
order_key
billing_first_name
billing_last_name
billing_company_1
billing_address_1
billing_address_2
billing_city
billing_state
billing_postcode
billing_country
billing_email
billing_phone
billing_payment
billing_cpf_1
billing_cnpj_1
billing_company_2
billing_space
billing_delivery
billing_recipient
billing_recipient_phone
billing_number_1
billing_complementary
billing_neighborhood_1
billing_msg
billing_space_2
billing_number_2
billing_neighborhood_2
billing_persontype
billing_cpf_2
billing_rg
billing_cnpj_2
billing_ie
billing_birthdate
billing_sex
billing_cellphone
billing_middle_name
billing_full_name
billing_recipient_first_name
billing_recipient_middle_name
billing_recipient_last_name
billing_recipient_full_name

shipping_first_name
shipping_last_name
shipping_company
shipping_address_1
shipping_address_2
shipping_city
shipping_state
shipping_postcode
shipping_country
shipping_phone
shipping_number
shipping_neighborhood

payment_method
payment_method_title
transaction_id
customer_ip_address
customer_user_agent
created_via
customer_note
date_paid
cart_hash
number
meta_data
line_items
tax_lines
shipping_lines
fee_lines
coupon_lines
refunds
payment_url
is_editabl
needs_payment
date_created_gmt
date_modified_gmt
date_completed_gmt
date_paid_gmt
schedule_date
schedule_time
schedule_time_celebration
schedule_delivery_alert
schedule_space_3
currrency_symbol
_links
n