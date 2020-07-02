/*
	Datenmodell: Mensa Projekt
	
	schema: wifi_mensa
	datum: jan 2020

*/

CREATE SCHEMA wifi_mensa;


-- *******************************
--  Table: user
-- *******************************

create table wifi_mensa.user
(
	user_id				numeric(10) not null,
	user_number			NUMERIC(10),
	last_name			varchar(100),
	first_name			varchar(100),
	nickname				varchar(100),
	password			varchar(100),
	role				NUMERIC(1),
	deleted				BOOLEAN,

	constraint user_pk primary key (user_id)
);

create sequence wifi_mensa.user_seq start with 1 increment by 1;


-- *******************************
--  Table: location
-- *******************************

CREATE TABLE wifi_mensa.location
(
	location_id			NUMERIC(10) not NULL,
	name 				VARCHAR(200),
	street				VARCHAR(200),
	post_code			NUMERIC(10),
	deleted 			BOOLEAN,

	CONSTRAINT location_pk PRIMARY KEY (location_id)
);
CREATE SEQUENCE wifi_mensa.location_seq START WITH 1 INCREMENT by 1;


-- *******************************
--  Table: products
-- *******************************

CREATE TABLE wifi_mensa.product
(
	product_id			NUMERIC(10) not NULL,
	name 				VARCHAR(200),
	description			VARCHAR(200),
	calorie				NUMERIC(10),
	image 				VARCHAR(1000),
	price				NUMERIC(10),
	deleted				BOOLEAN,
	product_type_id		NUMERIC(10),


	CONSTRAINT product_pk PRIMARY KEY (product_id)
);

CREATE SEQUENCE wifi_mensa.product_seq START WITH 1 INCREMENT by 1;


-- *******************************
--  Table: products_location
-- *******************************

CREATE TABLE wifi_mensa.product_location
(
	product_location_id	NUMERIC(10) not NULL,
	location_id				NUMERIC(10),
	product_id				NUMERIC(10),
	available				BOOLEAN,
	expiry_date_start		DATE,
	expiry_date_end			DATE,

	CONSTRAINT product_location_pk PRIMARY KEY (product_location_id)
);

CREATE SEQUENCE wifi_mensa.product_location_seq START WITH 1 INCREMENT BY 1;


-- *******************************
--  Table: Menue
-- *******************************

CREATE TABLE wifi_mensa.menue
(
	menue_id		NUMERIC(10) not NULL,
	product_id		NUMERIC(10),
	menue_number	NUMERIC(1),
	serve_date		DATE,

	CONSTRAINT menue_pk PRIMARY KEY (menue_id)	
);

CREATE SEQUENCE wifi_mensa.menue_seq START WITH 1 INCREMENT BY 1;

-- *******************************
--  Table: menue_detail
-- *******************************

CREATE TABLE wifi_mensa.menue_detail
(
	menue_detail_id		NUMERIC(10) NOT NULL,
	menue_id			NUMERIC(10), 
	product_location_id NUMERIC(10),

	constraint menue_detail_pk PRIMARY KEY (menue_detail_id)
);

CREATE SEQUENCE wifi_mensa.menue_detail_seq START with 1 INCREMENT by 1;

-- *******************************
--  Table: order
-- *******************************

CREATE TABLE wifi_mensa.order
(
	order_id		NUMERIC(10) NOT NULL,
	user_id			NUMERIC(10),
	location_id		NUMERIC(10),
	order_date		DATE,
	consumed		BOOLEAN,
	total_cost		NUMERIC(100),
	barcode			VARCHAR(200),
	serve_date		DATE,
	canceled		BOOLEAN,

	CONSTRAINT order_pk PRIMARY KEY (order_id)	
);

CREATE SEQUENCE wifi_mensa.order_seq START WITH 1 INCREMENT by 1;

-- *******************************
--  Table: orders_detail
-- *******************************

CREATE TABLE wifi_mensa.order_detail
(
	order_detail_id		NUMERIC(10) NOT NULL,
	order_id			NUMERIC(10),
	products_location_id NUMERIC(10),

	CONSTRAINT order_detail_pk PRIMARY KEY(order_detail_id)
);

CREATE SEQUENCE wifi_mensa.order_detail_seq START WITH 1 INCREMENT BY 1;



-- *******************************
--  Table: product_type
-- *******************************

CREATE TABLE wifi_mensa.product_type
(
	product_type_id		NUMERIC(10) NOT NULL,
	type				VARCHAR(200),

	CONSTRAINT product_type_pk PRIMARY KEY(product_type_id)
);

CREATE SEQUENCE wifi_mensa.product_type_seq START WITH 1 INCREMENT BY 1;




-- ********************************
--	Foreign Keys müssen noch eingetragen werden.
--	Überlegen ob bei Zwischentabellen ein zusammengesetzer PK
--	sinnvoller ist.


-- ********************************
--	Foreign Keys: Table order
alter TABLE wifi_mensa.order add CONSTRAINT order_user_fk
	FOREIGN KEY (user_id) REFERENCES wifi_mensa.user (user_id);

alter TABLE wifi_mensa.order add CONSTRAINT order_location_fk
	FOREIGN KEY (location_id) REFERENCES wifi_mensa.location (location_id);


-- ********************************
--	Foreign Keys: Table order_detail
alter TABLE wifi_mensa.order_detail add CONSTRAINT orderdetail_order_fk
	FOREIGN KEY (order_id) REFERENCES wifi_mensa.order (order_id);

alter TABLE wifi_mensa.order_detail add CONSTRAINT orderdetail_productlocation_fk
	FOREIGN KEY (order_id) REFERENCES wifi_mensa.order (order_id);


-- ********************************
--	Foreign Keys: Table menue_detail
alter TABLE wifi_mensa.menue_detail add CONSTRAINT menuedetail_menue_fk
	FOREIGN KEY (menue_id) REFERENCES wifi_mensa.menue (menue_id);

alter TABLE wifi_mensa.menue_detail add CONSTRAINT menuedetail_productlocation_fk
	FOREIGN KEY (product_location_id) REFERENCES wifi_mensa.product_location (product_location_id);


-- ********************************
--	Foreign Keys: Table products_location
ALTER TABLE wifi_mensa.product_location ADD CONSTRAINT productlocation_location_fk
	FOREIGN KEY (location_id) REFERENCES wifi_mensa.location (location_id);

ALTER TABLE wifi_mensa.product_location ADD CONSTRAINT productlocation_product_fk
	FOREIGN KEY (product_id) REFERENCES wifi_mensa.product (product_id);



-- ********************************
--	Foreign Keys: Table product
ALTER TABLE wifi_mensa.product ADD CONSTRAINT product_producttype_fk
	FOREIGN KEY (product_type_id) REFERENCES wifi_mensa.product_type (product_type_id);

