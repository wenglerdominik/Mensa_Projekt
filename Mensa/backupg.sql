PGDMP     '                     x           wifi_db    12.2    12.2 t    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16393    wifi_db    DATABASE     �   CREATE DATABASE wifi_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'German_Germany.1252' LC_CTYPE = 'German_Germany.1252';
    DROP DATABASE wifi_db;
                postgres    false            �           0    0    DATABASE wifi_db    ACL     ,   GRANT ALL ON DATABASE wifi_db TO wifi_user;
                   postgres    false    2977                        2615    16395 	   wifi_chat    SCHEMA        CREATE SCHEMA wifi_chat;
    DROP SCHEMA wifi_chat;
                postgres    false            �           0    0    SCHEMA wifi_chat    ACL     .   GRANT USAGE ON SCHEMA wifi_chat TO wifi_user;
                   postgres    false    8            	            2615    24655 
   wifi_mensa    SCHEMA        CREATE SCHEMA wifi_mensa;
    DROP SCHEMA wifi_mensa;
                postgres    false            �            1259    24650    test    TABLE     y   CREATE TABLE public.test (
    id numeric(100,0) NOT NULL,
    "numeric" numeric(10,0),
    text character varying(2)
);
    DROP TABLE public.test;
       public         heap    postgres    false            �            1259    16413    contact    TABLE     �   CREATE TABLE wifi_chat.contact (
    contact_type_id numeric(10,0) NOT NULL,
    person_id numeric(10,0) NOT NULL,
    content character varying(100)
);
    DROP TABLE wifi_chat.contact;
    	   wifi_chat         heap    postgres    false    8            �           0    0    TABLE contact    ACL     D   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_chat.contact TO wifi_user;
       	   wifi_chat          postgres    false    208            �            1259    16406    contact_type    TABLE     y   CREATE TABLE wifi_chat.contact_type (
    contact_type_id numeric(10,0) NOT NULL,
    labeling character varying(100)
);
 #   DROP TABLE wifi_chat.contact_type;
    	   wifi_chat         heap    postgres    false    8            �           0    0    TABLE contact_type    ACL     I   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_chat.contact_type TO wifi_user;
       	   wifi_chat          postgres    false    206            �            1259    16411    contact_type_seq    SEQUENCE     |   CREATE SEQUENCE wifi_chat.contact_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE wifi_chat.contact_type_seq;
    	   wifi_chat          postgres    false    8            �           0    0    SEQUENCE contact_type_seq    ACL     ?   GRANT ALL ON SEQUENCE wifi_chat.contact_type_seq TO wifi_user;
       	   wifi_chat          postgres    false    207            �            1259    16418    message    TABLE     y   CREATE TABLE wifi_chat.message (
    message_id numeric(10,0) NOT NULL,
    person_id numeric(10,0),
    content text
);
    DROP TABLE wifi_chat.message;
    	   wifi_chat         heap    postgres    false    8            �           0    0    TABLE message    ACL     D   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_chat.message TO wifi_user;
       	   wifi_chat          postgres    false    209            �            1259    16428    message_person    TABLE     �   CREATE TABLE wifi_chat.message_person (
    message_id numeric(10,0) NOT NULL,
    person_id numeric(10,0) NOT NULL,
    state_val numeric(2,0),
    state_text character varying(100),
    state_date timestamp without time zone
);
 %   DROP TABLE wifi_chat.message_person;
    	   wifi_chat         heap    postgres    false    8            �           0    0    TABLE message_person    ACL     K   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_chat.message_person TO wifi_user;
       	   wifi_chat          postgres    false    211            �            1259    16426    message_seq    SEQUENCE     w   CREATE SEQUENCE wifi_chat.message_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE wifi_chat.message_seq;
    	   wifi_chat          postgres    false    8            �           0    0    SEQUENCE message_seq    ACL     :   GRANT ALL ON SEQUENCE wifi_chat.message_seq TO wifi_user;
       	   wifi_chat          postgres    false    210            �            1259    16396    person    TABLE     �  CREATE TABLE wifi_chat.person (
    person_id numeric(10,0) NOT NULL,
    last_name character varying(100),
    first_name character varying(100),
    nick_name character varying(100),
    password character varying(100),
    last_login date,
    state_val numeric(2,0),
    state_text character varying(100),
    state_date timestamp without time zone,
    person_uid character varying(200)
);
    DROP TABLE wifi_chat.person;
    	   wifi_chat         heap    postgres    false    8            �           0    0    TABLE person    ACL     C   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_chat.person TO wifi_user;
       	   wifi_chat          postgres    false    204            �            1259    16458    person_info    VIEW     &  CREATE VIEW wifi_chat.person_info AS
 SELECT p.first_name,
    p.last_name,
    c.content,
    ct.labeling
   FROM ((wifi_chat.person p
     LEFT JOIN wifi_chat.contact c ON ((p.person_id = c.person_id)))
     LEFT JOIN wifi_chat.contact_type ct ON ((c.contact_type_id = ct.contact_type_id)));
 !   DROP VIEW wifi_chat.person_info;
    	   wifi_chat          postgres    false    208    206    206    204    208    208    204    204    8            �            1259    16404 
   person_seq    SEQUENCE     v   CREATE SEQUENCE wifi_chat.person_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE wifi_chat.person_seq;
    	   wifi_chat          postgres    false    8            �           0    0    SEQUENCE person_seq    ACL     9   GRANT ALL ON SEQUENCE wifi_chat.person_seq TO wifi_user;
       	   wifi_chat          postgres    false    205            �            1259    24663    location    TABLE     �   CREATE TABLE wifi_mensa.location (
    location_id numeric(10,0) NOT NULL,
    name character varying(200),
    street character varying(200),
    post_code numeric(10,0),
    deleted boolean
);
     DROP TABLE wifi_mensa.location;
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE location    ACL     F   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa.location TO wifi_user;
       
   wifi_mensa          postgres    false    216            �            1259    24668    location_seq    SEQUENCE     y   CREATE SEQUENCE wifi_mensa.location_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE wifi_mensa.location_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE location_seq    ACL     <   GRANT ALL ON SEQUENCE wifi_mensa.location_seq TO wifi_user;
       
   wifi_mensa          postgres    false    217            �            1259    24687    menue    TABLE     �   CREATE TABLE wifi_mensa.menue (
    menue_id numeric(10,0) NOT NULL,
    product_id numeric(10,0),
    menue_number numeric(1,0),
    serve_date date
);
    DROP TABLE wifi_mensa.menue;
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE menue    ACL     C   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa.menue TO wifi_user;
       
   wifi_mensa          postgres    false    222            �            1259    24694    menue_detail    TABLE     �   CREATE TABLE wifi_mensa.menue_detail (
    menue_detail_id numeric(10,0) NOT NULL,
    menue_id numeric(10,0),
    product_location_id numeric(10,0)
);
 $   DROP TABLE wifi_mensa.menue_detail;
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE menue_detail    ACL     J   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa.menue_detail TO wifi_user;
       
   wifi_mensa          postgres    false    224            �            1259    24699    menue_detail_seq    SEQUENCE     }   CREATE SEQUENCE wifi_mensa.menue_detail_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE wifi_mensa.menue_detail_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE menue_detail_seq    ACL     @   GRANT ALL ON SEQUENCE wifi_mensa.menue_detail_seq TO wifi_user;
       
   wifi_mensa          postgres    false    225            �            1259    24692 	   menue_seq    SEQUENCE     v   CREATE SEQUENCE wifi_mensa.menue_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE wifi_mensa.menue_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE menue_seq    ACL     9   GRANT ALL ON SEQUENCE wifi_mensa.menue_seq TO wifi_user;
       
   wifi_mensa          postgres    false    223            �            1259    24701    order    TABLE       CREATE TABLE wifi_mensa."order" (
    order_id numeric(10,0) NOT NULL,
    user_id numeric(10,0),
    location_id numeric(10,0),
    order_date date,
    consumed boolean,
    total_cost numeric(100,0),
    barcode character varying(200),
    serve_date date,
    canceled boolean
);
    DROP TABLE wifi_mensa."order";
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE "order"    ACL     E   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa."order" TO wifi_user;
       
   wifi_mensa          postgres    false    226            �            1259    24708    order_detail    TABLE     �   CREATE TABLE wifi_mensa.order_detail (
    order_detail_id numeric(10,0) NOT NULL,
    order_id numeric(10,0),
    products_location_id numeric(10,0)
);
 $   DROP TABLE wifi_mensa.order_detail;
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE order_detail    ACL     J   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa.order_detail TO wifi_user;
       
   wifi_mensa          postgres    false    228            �            1259    24713    order_detail_seq    SEQUENCE     }   CREATE SEQUENCE wifi_mensa.order_detail_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE wifi_mensa.order_detail_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE order_detail_seq    ACL     @   GRANT ALL ON SEQUENCE wifi_mensa.order_detail_seq TO wifi_user;
       
   wifi_mensa          postgres    false    229            �            1259    24706 	   order_seq    SEQUENCE     v   CREATE SEQUENCE wifi_mensa.order_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE wifi_mensa.order_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE order_seq    ACL     9   GRANT ALL ON SEQUENCE wifi_mensa.order_seq TO wifi_user;
       
   wifi_mensa          postgres    false    227            �            1259    24670    product    TABLE     #  CREATE TABLE wifi_mensa.product (
    product_id numeric(10,0) NOT NULL,
    name character varying(200),
    description character varying(200),
    calorie numeric(10,0),
    image character varying(1000),
    price numeric(10,2),
    deleted boolean,
    product_type_id numeric(10,0)
);
    DROP TABLE wifi_mensa.product;
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE product    ACL     E   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa.product TO wifi_user;
       
   wifi_mensa          postgres    false    218            �            1259    24680    product_location    TABLE     �   CREATE TABLE wifi_mensa.product_location (
    product_location_id numeric(10,0) NOT NULL,
    location_id numeric(10,0),
    product_id numeric(10,0),
    available boolean,
    expiry_date_start date,
    expiry_date_end date
);
 (   DROP TABLE wifi_mensa.product_location;
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE product_location    ACL     N   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa.product_location TO wifi_user;
       
   wifi_mensa          postgres    false    220            �            1259    24685    product_location_seq    SEQUENCE     �   CREATE SEQUENCE wifi_mensa.product_location_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE wifi_mensa.product_location_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE product_location_seq    ACL     D   GRANT ALL ON SEQUENCE wifi_mensa.product_location_seq TO wifi_user;
       
   wifi_mensa          postgres    false    221            �            1259    24678    product_seq    SEQUENCE     x   CREATE SEQUENCE wifi_mensa.product_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE wifi_mensa.product_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE product_seq    ACL     ;   GRANT ALL ON SEQUENCE wifi_mensa.product_seq TO wifi_user;
       
   wifi_mensa          postgres    false    219            �            1259    24767    product_type    TABLE     v   CREATE TABLE wifi_mensa.product_type (
    product_type_id numeric(10,0) NOT NULL,
    type character varying(200)
);
 $   DROP TABLE wifi_mensa.product_type;
    
   wifi_mensa         heap    postgres    false    9            �            1259    24821    product_type_seq    SEQUENCE     }   CREATE SEQUENCE wifi_mensa.product_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE wifi_mensa.product_type_seq;
    
   wifi_mensa          postgres    false    9            �            1259    24656    user    TABLE     )  CREATE TABLE wifi_mensa."user" (
    user_id numeric(10,0) NOT NULL,
    user_number numeric(10,0),
    last_name character varying(100),
    first_name character varying(100),
    nickname character varying(100),
    password character varying(100),
    role numeric(1,0),
    deleted boolean
);
    DROP TABLE wifi_mensa."user";
    
   wifi_mensa         heap    postgres    false    9            �           0    0    TABLE "user"    ACL     D   GRANT SELECT,INSERT,UPDATE ON TABLE wifi_mensa."user" TO wifi_user;
       
   wifi_mensa          postgres    false    214            �            1259    24661    user_seq    SEQUENCE     u   CREATE SEQUENCE wifi_mensa.user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE wifi_mensa.user_seq;
    
   wifi_mensa          postgres    false    9            �           0    0    SEQUENCE user_seq    ACL     8   GRANT ALL ON SEQUENCE wifi_mensa.user_seq TO wifi_user;
       
   wifi_mensa          postgres    false    215            �          0    24650    test 
   TABLE DATA           3   COPY public.test (id, "numeric", text) FROM stdin;
    public          postgres    false    213   \�       �          0    16413    contact 
   TABLE DATA           I   COPY wifi_chat.contact (contact_type_id, person_id, content) FROM stdin;
 	   wifi_chat          postgres    false    208   ��       �          0    16406    contact_type 
   TABLE DATA           D   COPY wifi_chat.contact_type (contact_type_id, labeling) FROM stdin;
 	   wifi_chat          postgres    false    206   �       �          0    16418    message 
   TABLE DATA           D   COPY wifi_chat.message (message_id, person_id, content) FROM stdin;
 	   wifi_chat          postgres    false    209   ��       �          0    16428    message_person 
   TABLE DATA           e   COPY wifi_chat.message_person (message_id, person_id, state_val, state_text, state_date) FROM stdin;
 	   wifi_chat          postgres    false    211   ��       �          0    16396    person 
   TABLE DATA           �   COPY wifi_chat.person (person_id, last_name, first_name, nick_name, password, last_login, state_val, state_text, state_date, person_uid) FROM stdin;
 	   wifi_chat          postgres    false    204   ̃       �          0    24663    location 
   TABLE DATA           U   COPY wifi_mensa.location (location_id, name, street, post_code, deleted) FROM stdin;
 
   wifi_mensa          postgres    false    216   ��       �          0    24687    menue 
   TABLE DATA           S   COPY wifi_mensa.menue (menue_id, product_id, menue_number, serve_date) FROM stdin;
 
   wifi_mensa          postgres    false    222   ��       �          0    24694    menue_detail 
   TABLE DATA           Z   COPY wifi_mensa.menue_detail (menue_detail_id, menue_id, product_location_id) FROM stdin;
 
   wifi_mensa          postgres    false    224   ܄       �          0    24701    order 
   TABLE DATA           �   COPY wifi_mensa."order" (order_id, user_id, location_id, order_date, consumed, total_cost, barcode, serve_date, canceled) FROM stdin;
 
   wifi_mensa          postgres    false    226   ��       �          0    24708    order_detail 
   TABLE DATA           [   COPY wifi_mensa.order_detail (order_detail_id, order_id, products_location_id) FROM stdin;
 
   wifi_mensa          postgres    false    228   �       �          0    24670    product 
   TABLE DATA           u   COPY wifi_mensa.product (product_id, name, description, calorie, image, price, deleted, product_type_id) FROM stdin;
 
   wifi_mensa          postgres    false    218   3�       �          0    24680    product_location 
   TABLE DATA           �   COPY wifi_mensa.product_location (product_location_id, location_id, product_id, available, expiry_date_start, expiry_date_end) FROM stdin;
 
   wifi_mensa          postgres    false    220   ,�       �          0    24767    product_type 
   TABLE DATA           A   COPY wifi_mensa.product_type (product_type_id, type) FROM stdin;
 
   wifi_mensa          postgres    false    230   I�       �          0    24656    user 
   TABLE DATA           t   COPY wifi_mensa."user" (user_id, user_number, last_name, first_name, nickname, password, role, deleted) FROM stdin;
 
   wifi_mensa          postgres    false    214   ��       �           0    0    contact_type_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('wifi_chat.contact_type_seq', 10, true);
       	   wifi_chat          postgres    false    207            �           0    0    message_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('wifi_chat.message_seq', 1, false);
       	   wifi_chat          postgres    false    210            �           0    0 
   person_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('wifi_chat.person_seq', 9, true);
       	   wifi_chat          postgres    false    205            �           0    0    location_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('wifi_mensa.location_seq', 1, false);
       
   wifi_mensa          postgres    false    217            �           0    0    menue_detail_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('wifi_mensa.menue_detail_seq', 1, false);
       
   wifi_mensa          postgres    false    225            �           0    0 	   menue_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('wifi_mensa.menue_seq', 1, false);
       
   wifi_mensa          postgres    false    223            �           0    0    order_detail_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('wifi_mensa.order_detail_seq', 1, false);
       
   wifi_mensa          postgres    false    229            �           0    0 	   order_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('wifi_mensa.order_seq', 1, false);
       
   wifi_mensa          postgres    false    227            �           0    0    product_location_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('wifi_mensa.product_location_seq', 1, false);
       
   wifi_mensa          postgres    false    221            �           0    0    product_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('wifi_mensa.product_seq', 29, true);
       
   wifi_mensa          postgres    false    219            �           0    0    product_type_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('wifi_mensa.product_type_seq', 5, true);
       
   wifi_mensa          postgres    false    231            �           0    0    user_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('wifi_mensa.user_seq', 6, true);
       
   wifi_mensa          postgres    false    215            �
           2606    24654    test test_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.test DROP CONSTRAINT test_pkey;
       public            postgres    false    213            �
           2606    16417    contact contact_pk 
   CONSTRAINT     k   ALTER TABLE ONLY wifi_chat.contact
    ADD CONSTRAINT contact_pk PRIMARY KEY (contact_type_id, person_id);
 ?   ALTER TABLE ONLY wifi_chat.contact DROP CONSTRAINT contact_pk;
    	   wifi_chat            postgres    false    208    208            �
           2606    16410    contact_type contact_type_pk 
   CONSTRAINT     j   ALTER TABLE ONLY wifi_chat.contact_type
    ADD CONSTRAINT contact_type_pk PRIMARY KEY (contact_type_id);
 I   ALTER TABLE ONLY wifi_chat.contact_type DROP CONSTRAINT contact_type_pk;
    	   wifi_chat            postgres    false    206            �
           2606    16432     message_person message_person_pk 
   CONSTRAINT     t   ALTER TABLE ONLY wifi_chat.message_person
    ADD CONSTRAINT message_person_pk PRIMARY KEY (message_id, person_id);
 M   ALTER TABLE ONLY wifi_chat.message_person DROP CONSTRAINT message_person_pk;
    	   wifi_chat            postgres    false    211    211            �
           2606    16425    message message_pk 
   CONSTRAINT     [   ALTER TABLE ONLY wifi_chat.message
    ADD CONSTRAINT message_pk PRIMARY KEY (message_id);
 ?   ALTER TABLE ONLY wifi_chat.message DROP CONSTRAINT message_pk;
    	   wifi_chat            postgres    false    209            �
           2606    16403    person person_pk 
   CONSTRAINT     X   ALTER TABLE ONLY wifi_chat.person
    ADD CONSTRAINT person_pk PRIMARY KEY (person_id);
 =   ALTER TABLE ONLY wifi_chat.person DROP CONSTRAINT person_pk;
    	   wifi_chat            postgres    false    204            �
           2606    24667    location location_pk 
   CONSTRAINT     _   ALTER TABLE ONLY wifi_mensa.location
    ADD CONSTRAINT location_pk PRIMARY KEY (location_id);
 B   ALTER TABLE ONLY wifi_mensa.location DROP CONSTRAINT location_pk;
    
   wifi_mensa            postgres    false    216            �
           2606    24698    menue_detail menue_detail_pk 
   CONSTRAINT     k   ALTER TABLE ONLY wifi_mensa.menue_detail
    ADD CONSTRAINT menue_detail_pk PRIMARY KEY (menue_detail_id);
 J   ALTER TABLE ONLY wifi_mensa.menue_detail DROP CONSTRAINT menue_detail_pk;
    
   wifi_mensa            postgres    false    224            �
           2606    24691    menue menue_pk 
   CONSTRAINT     V   ALTER TABLE ONLY wifi_mensa.menue
    ADD CONSTRAINT menue_pk PRIMARY KEY (menue_id);
 <   ALTER TABLE ONLY wifi_mensa.menue DROP CONSTRAINT menue_pk;
    
   wifi_mensa            postgres    false    222            �
           2606    24712    order_detail order_detail_pk 
   CONSTRAINT     k   ALTER TABLE ONLY wifi_mensa.order_detail
    ADD CONSTRAINT order_detail_pk PRIMARY KEY (order_detail_id);
 J   ALTER TABLE ONLY wifi_mensa.order_detail DROP CONSTRAINT order_detail_pk;
    
   wifi_mensa            postgres    false    228            �
           2606    24705    order order_pk 
   CONSTRAINT     X   ALTER TABLE ONLY wifi_mensa."order"
    ADD CONSTRAINT order_pk PRIMARY KEY (order_id);
 >   ALTER TABLE ONLY wifi_mensa."order" DROP CONSTRAINT order_pk;
    
   wifi_mensa            postgres    false    226            �
           2606    24684 $   product_location product_location_pk 
   CONSTRAINT     w   ALTER TABLE ONLY wifi_mensa.product_location
    ADD CONSTRAINT product_location_pk PRIMARY KEY (product_location_id);
 R   ALTER TABLE ONLY wifi_mensa.product_location DROP CONSTRAINT product_location_pk;
    
   wifi_mensa            postgres    false    220            �
           2606    24677    product product_pk 
   CONSTRAINT     \   ALTER TABLE ONLY wifi_mensa.product
    ADD CONSTRAINT product_pk PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY wifi_mensa.product DROP CONSTRAINT product_pk;
    
   wifi_mensa            postgres    false    218            �
           2606    24771    product_type product_type_pk 
   CONSTRAINT     k   ALTER TABLE ONLY wifi_mensa.product_type
    ADD CONSTRAINT product_type_pk PRIMARY KEY (product_type_id);
 J   ALTER TABLE ONLY wifi_mensa.product_type DROP CONSTRAINT product_type_pk;
    
   wifi_mensa            postgres    false    230            �
           2606    24660    user user_pk 
   CONSTRAINT     U   ALTER TABLE ONLY wifi_mensa."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (user_id);
 <   ALTER TABLE ONLY wifi_mensa."user" DROP CONSTRAINT user_pk;
    
   wifi_mensa            postgres    false    214            �
           2606    16438    contact contact_contacttype_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_chat.contact
    ADD CONSTRAINT contact_contacttype_fk FOREIGN KEY (contact_type_id) REFERENCES wifi_chat.contact_type(contact_type_id);
 K   ALTER TABLE ONLY wifi_chat.contact DROP CONSTRAINT contact_contacttype_fk;
    	   wifi_chat          postgres    false    206    208    2777            �
           2606    16433    contact contact_person_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_chat.contact
    ADD CONSTRAINT contact_person_fk FOREIGN KEY (person_id) REFERENCES wifi_chat.person(person_id);
 F   ALTER TABLE ONLY wifi_chat.contact DROP CONSTRAINT contact_person_fk;
    	   wifi_chat          postgres    false    204    208    2775            �
           2606    16443    message message_person_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_chat.message
    ADD CONSTRAINT message_person_fk FOREIGN KEY (person_id) REFERENCES wifi_chat.person(person_id);
 F   ALTER TABLE ONLY wifi_chat.message DROP CONSTRAINT message_person_fk;
    	   wifi_chat          postgres    false    209    2775    204            �
           2606    16453 '   message_person messageperson_message_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_chat.message_person
    ADD CONSTRAINT messageperson_message_fk FOREIGN KEY (message_id) REFERENCES wifi_chat.message(message_id);
 T   ALTER TABLE ONLY wifi_chat.message_person DROP CONSTRAINT messageperson_message_fk;
    	   wifi_chat          postgres    false    2781    211    209            �
           2606    16448 &   message_person messageperson_person_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_chat.message_person
    ADD CONSTRAINT messageperson_person_fk FOREIGN KEY (person_id) REFERENCES wifi_chat.person(person_id);
 S   ALTER TABLE ONLY wifi_chat.message_person DROP CONSTRAINT messageperson_person_fk;
    	   wifi_chat          postgres    false    211    204    2775            �
           2606    24735 !   menue_detail menuedetail_menue_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.menue_detail
    ADD CONSTRAINT menuedetail_menue_fk FOREIGN KEY (menue_id) REFERENCES wifi_mensa.menue(menue_id);
 O   ALTER TABLE ONLY wifi_mensa.menue_detail DROP CONSTRAINT menuedetail_menue_fk;
    
   wifi_mensa          postgres    false    2795    222    224            �
           2606    24740 +   menue_detail menuedetail_productlocation_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.menue_detail
    ADD CONSTRAINT menuedetail_productlocation_fk FOREIGN KEY (product_location_id) REFERENCES wifi_mensa.product_location(product_location_id);
 Y   ALTER TABLE ONLY wifi_mensa.menue_detail DROP CONSTRAINT menuedetail_productlocation_fk;
    
   wifi_mensa          postgres    false    220    224    2793            �
           2606    24720    order order_location_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa."order"
    ADD CONSTRAINT order_location_fk FOREIGN KEY (location_id) REFERENCES wifi_mensa.location(location_id);
 G   ALTER TABLE ONLY wifi_mensa."order" DROP CONSTRAINT order_location_fk;
    
   wifi_mensa          postgres    false    216    226    2789            �
           2606    24715    order order_user_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa."order"
    ADD CONSTRAINT order_user_fk FOREIGN KEY (user_id) REFERENCES wifi_mensa."user"(user_id);
 C   ALTER TABLE ONLY wifi_mensa."order" DROP CONSTRAINT order_user_fk;
    
   wifi_mensa          postgres    false    226    214    2787                        2606    24725 !   order_detail orderdetail_order_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.order_detail
    ADD CONSTRAINT orderdetail_order_fk FOREIGN KEY (order_id) REFERENCES wifi_mensa."order"(order_id);
 O   ALTER TABLE ONLY wifi_mensa.order_detail DROP CONSTRAINT orderdetail_order_fk;
    
   wifi_mensa          postgres    false    2799    228    226                       2606    24730 +   order_detail orderdetail_productlocation_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.order_detail
    ADD CONSTRAINT orderdetail_productlocation_fk FOREIGN KEY (order_id) REFERENCES wifi_mensa."order"(order_id);
 Y   ALTER TABLE ONLY wifi_mensa.order_detail DROP CONSTRAINT orderdetail_productlocation_fk;
    
   wifi_mensa          postgres    false    226    228    2799            �
           2606    24853    product product_producttype_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.product
    ADD CONSTRAINT product_producttype_fk FOREIGN KEY (product_type_id) REFERENCES wifi_mensa.product_type(product_type_id);
 L   ALTER TABLE ONLY wifi_mensa.product DROP CONSTRAINT product_producttype_fk;
    
   wifi_mensa          postgres    false    230    2803    218            �
           2606    24745 ,   product_location productlocation_location_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.product_location
    ADD CONSTRAINT productlocation_location_fk FOREIGN KEY (location_id) REFERENCES wifi_mensa.location(location_id);
 Z   ALTER TABLE ONLY wifi_mensa.product_location DROP CONSTRAINT productlocation_location_fk;
    
   wifi_mensa          postgres    false    2789    216    220            �
           2606    24750 +   product_location productlocation_product_fk    FK CONSTRAINT     �   ALTER TABLE ONLY wifi_mensa.product_location
    ADD CONSTRAINT productlocation_product_fk FOREIGN KEY (product_id) REFERENCES wifi_mensa.product(product_id);
 Y   ALTER TABLE ONLY wifi_mensa.product_location DROP CONSTRAINT productlocation_product_fk;
    
   wifi_mensa          postgres    false    218    2791    220            �   #   x�3�4�L�2�4426153��4�LL����� @��      �   s   x�%�A
!E��U
2):��y�nɈL�P-mo_������o��nO}�\�S�8�Hl��r�ֺSC��Q����|l2�;H�#�T��V���v��jV��?+�#7��?�_#d      �   p   x�3�I��S�+�S�((�,K,��2Bs�,�M��2F*��+.�LO��2�t�M��A�4�	@����=��ٕ�\��ii�ɩ�f�\���΁\���9�
�.\1z\\\ �/+z      �      x������ � �      �      x������ � �      �   �   x����j�0E�ү���-i�E@���Kh�ff$�<�v��MhK����p��X��>"��Xzq��.�H�e���z�lW۾��ح�mDf�R���x`&�hkH�.҉p�^�N���q���ّf���T6�Y$��d�19�9J��.��A<��iqX�~��W<�����k6 �m�34DX�䔪T�r7�R~��R      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �  x�]T�R�@�G_��E��d�!v�����0	�ZY[Z�\������o "���J�D�}L�tO�&3�&/�S�'#x��x���P@%p�r���v+�5���g��,)�CP2�F���0�����N������C2�r����K�EV"�~���Q�B��Y��}C	_�;:ז=7���B��MMa��qG),J![4�-�V�_�0�T�e&+�.�\7��\�������V�e\��6�܉�+�5�㸮r������:�����e@]ig,��7�V\ۦ(PV�'u%$[b��4a�§�)��j���Br���r/b�eNY����P��L�\�\9c2��khJ��o�-�������-1R0��C��vWԘMݵ\zY�}��T`�yƓc��wd�n�|yȣݗ���j�FUZy���2���9Xs�m�i���������)z��<p%�>�e-�US��(�'�� �k���-�]c��喆Q���B�6:ν�H����sT�v넽�R���ڀ���h�9}a<:��4�g�r��1[��gV�+��FWa��NU�4�A���I�~F�+�TE�E�m�A��H���{��}J� 9T�?9a�߃��_��Oٕ�HO,�F&� j���:��0G�g��b�d�g%�͝�a���$׽�����aG*�CϽ��В!����ZԻ�m�N��i;�ɐZM��$�='{�ny�#�н���4���[�{      �      x������ � �      �   D   x�3���/�M��2�KMO��2�>��������T.ΰ�"(۔�/19�1�*-N,������ D��      �   Y   x�3���O�K�I-�t�������L�O���t�4�,��r2,.O�	��Iv���4�L�2is)M��tIL�OJ-*�*������ �<!�     