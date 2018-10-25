create table adresses
(
	id int(10) unsigned auto_increment
		primary key,
	street varchar(50) not null,
	zipcode_id int(10) unsigned not null
)
;

create index adresses_zipcode_id_foreign
	on adresses (zipcode_id)
;

create table knex_migrations
(
	id int(10) unsigned auto_increment
		primary key,
	name varchar(255) null,
	batch int null,
	migration_time timestamp default CURRENT_TIMESTAMP not null
)
;

create table knex_migrations_lock
(
	is_locked int null
)
;

create table messages
(
	id int(10) unsigned auto_increment
		primary key,
	type enum('message', 'agent_contact', 'appointment') null,
	header varchar(50) not null,
	body text not null,
	sender_id int(10) unsigned null,
	receiver_id int(10) unsigned null,
	sent_at datetime default CURRENT_TIMESTAMP null,
	received_at datetime null,
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null,
	parent_id int(10) unsigned not null,
	constraint messages_parent_id_foreign
		foreign key (parent_id) references messages (id)
)
;

create index messages_receiver_id_foreign
	on messages (receiver_id)
;

create index messages_sender_id_foreign
	on messages (sender_id)
;

create index messages_type_index
	on messages (type)
;

create index messages_parent_id_foreign
	on messages (parent_id)
;

create table permissions
(
	id int(10) unsigned auto_increment
		primary key,
	name varchar(30) not null
)
;

create table real_estate_advertisements
(
	id int(10) unsigned auto_increment
		primary key,
	real_estate_id int(10) unsigned null,
	user_id int(10) unsigned null,
	active_from timestamp default CURRENT_TIMESTAMP not null,
	active_to timestamp default '1970-01-01 00:00:01' not null,
	description varchar(255) null,
	created_at datetime null,
	updated_at datetime null
)
;

create index real_estate_advertisements_active_from_index
	on real_estate_advertisements (active_from)
;

create index real_estate_advertisements_active_to_index
	on real_estate_advertisements (active_to)
;

create index real_estate_advertisements_real_estate_id_index
	on real_estate_advertisements (real_estate_id)
;

create index real_estate_advertisements_user_id_index
	on real_estate_advertisements (user_id)
;

create table real_estate_agencies
(
	id int(10) unsigned auto_increment
		primary key,
	name varchar(30) not null,
	adress_id int(10) unsigned null,
	phone varchar(255) null,
	mobile varchar(255) null,
	email varchar(70) not null,
	register_court varchar(50) not null,
	register_number varchar(50) not null,
	website varchar(50) not null,
	manager_id int(10) unsigned null,
	profilepicture varchar(255) null,
	constraint real_estate_agencies_email_unique
		unique (email),
	constraint real_estate_agencies_register_number_unique
		unique (register_number),
	constraint real_estate_agencies_adress_id_foreign
		foreign key (adress_id) references adresses (id)
)
;

create index real_estate_agencies_adress_id_index
	on real_estate_agencies (adress_id)
;

create index real_estate_agencies_manager_id_index
	on real_estate_agencies (manager_id)
;

create table real_estate_medias
(
	id int(10) unsigned auto_increment
		primary key,
	type enum('video', 'picture') null,
	path varchar(255) null comment 'path to file',
	estate_id int(10) unsigned null,
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null
)
;

create index real_estate_medias_estate_id_index
	on real_estate_medias (estate_id)
;

create index real_estate_medias_type_index
	on real_estate_medias (type)
;

create table real_estates
(
	id int(10) unsigned auto_increment
		primary key,
	adress_id int(10) unsigned null,
	owner_id int(10) unsigned null,
	seller_id int(10) unsigned null,
	header varchar(40) not null,
	description text not null,
	size decimal(8,2) null comment 'quadratmeter',
	cost decimal(8,2) null comment 'preis',
	running_cost decimal(8,2) null comment 'nebenkosten',
	isActive tinyint(1) default '0' null,
	build_at datetime null comment 'maybe change to varchar/number for year',
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null,
	constraint real_estates_adress_id_foreign
		foreign key (adress_id) references adresses (id)
)
;

create index real_estates_adress_id_foreign
	on real_estates (adress_id)
;

create index real_estates_owner_id_index
	on real_estates (owner_id)
;

create index real_estates_seller_id_index
	on real_estates (seller_id)
;

alter table real_estate_advertisements
	add constraint real_estate_advertisements_real_estate_id_foreign
		foreign key (real_estate_id) references real_estates (id)
;

alter table real_estate_medias
	add constraint real_estate_medias_estate_id_foreign
		foreign key (estate_id) references real_estates (id)
;

create table role_permissions
(
	id int(10) unsigned auto_increment
		primary key,
	role_id int(10) unsigned null,
	permission_id int(10) unsigned null,
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null,
	constraint role_permissions_permission_id_foreign
		foreign key (permission_id) references permissions (id)
)
;

create index role_permissions_permission_id_foreign
	on role_permissions (permission_id)
;

create index role_permissions_role_id_foreign
	on role_permissions (role_id)
;

create table roles
(
	id int(10) unsigned auto_increment
		primary key,
	name varchar(30) not null
)
;

alter table role_permissions
	add constraint role_permissions_role_id_foreign
		foreign key (role_id) references roles (id)
;

create table searches
(
	id int(10) unsigned auto_increment
		primary key,
	user_id int(10) unsigned null,
	search varchar(40) not null comment 'gesuchert ausdruck - plz / ort',
	type enum('house', 'apartment') null,
	min_size decimal(8,2) null,
	max_size decimal(8,2) null,
	min_price decimal(8,2) null,
	max_price decimal(8,2) null,
	min_rooms int(10) unsigned null,
	max_rooms int(10) unsigned null,
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null
)
;

create index searches_user_id_foreign
	on searches (user_id)
;

create table user_families
(
	id int(10) unsigned auto_increment
		primary key,
	type enum('kid', 'wife', 'husband') not null,
	age int null,
	usePublicTransport tinyint(1) default '1' null,
	adress_id int(10) unsigned null,
	user_id int(10) unsigned null,
	constraint user_families_adress_id_foreign
		foreign key (adress_id) references adresses (id)
)
;

create index user_families_adress_id_foreign
	on user_families (adress_id)
;

create index user_families_user_id_index
	on user_families (user_id)
;

create table user_roles
(
	id int(10) unsigned auto_increment
		primary key,
	user_id int(10) unsigned null,
	role_id int(10) unsigned null,
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null,
	constraint user_roles_role_id_foreign
		foreign key (role_id) references roles (id)
)
;

create index user_roles_role_id_index
	on user_roles (role_id)
;

create index user_roles_user_id_index
	on user_roles (user_id)
;

create table users
(
	id int(10) unsigned auto_increment
		primary key,
	first_name varchar(20) not null,
	last_name varchar(30) not null,
	email varchar(70) not null,
	salt varchar(255) not null,
	password varchar(255) not null comment 'hashed password',
	phone varchar(255) null,
	mobile varchar(255) null,
	adress_id int(10) unsigned null,
	profilepicture varchar(255) null comment 'path to profile picture',
	created_at datetime default CURRENT_TIMESTAMP not null,
	updated_at datetime default CURRENT_TIMESTAMP not null,
	constraint users_email_unique
		unique (email),
	constraint users_adress_id_foreign
		foreign key (adress_id) references adresses (id)
)
;

create index users_adress_id_foreign
	on users (adress_id)
;

alter table messages
	add constraint messages_sender_id_foreign
		foreign key (sender_id) references users (id)
;

alter table messages
	add constraint messages_receiver_id_foreign
		foreign key (receiver_id) references users (id)
;

alter table real_estate_advertisements
	add constraint real_estate_advertisements_user_id_foreign
		foreign key (user_id) references users (id)
;

alter table real_estate_agencies
	add constraint real_estate_agencies_manager_id_foreign
		foreign key (manager_id) references users (id)
;

alter table real_estates
	add constraint real_estates_owner_id_foreign
		foreign key (owner_id) references users (id)
;

alter table real_estates
	add constraint real_estates_seller_id_foreign
		foreign key (seller_id) references users (id)
;

alter table searches
	add constraint searches_user_id_foreign
		foreign key (user_id) references users (id)
;

alter table user_families
	add constraint user_families_user_id_foreign
		foreign key (user_id) references users (id)
;

alter table user_roles
	add constraint user_roles_user_id_foreign
		foreign key (user_id) references users (id)
;

create table zipcodes
(
	id int(10) unsigned auto_increment
		primary key,
	zipcode varchar(5) null,
	location varchar(80) null
)
;

create index zipcodes_location_index
	on zipcodes (location)
;

create index zipcodes_zipcode_index
	on zipcodes (zipcode)
;

alter table adresses
	add constraint adresses_zipcode_id_foreign
		foreign key (zipcode_id) references zipcodes (id)
;

