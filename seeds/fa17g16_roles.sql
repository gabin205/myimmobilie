-- insert available roles
INSERT INTO fa17g16.roles (id, name) VALUES (1, 'buyer'), (2, 'seller'), (3, 'agent'), (4, 'admin');
-- insert agencies with random user as manager
INSERT INTO fa17g16.real_estate_agencies (id, name, manager_id, email, adress_id, register_number, register_court, website)
  SELECT
    1
    , 'SFStateHomes'
    , id
    , email
    , adress_id
    , concat('register_number', FLOOR(1 + (RAND() * 40)))
    , 'register_court'
    , 'website'
  FROM users
  WHERE id = FLOOR(1 + (RAND() * 90));
INSERT INTO fa17g16.real_estate_agencies (id, name, manager_id, email, adress_id, register_number, register_court, website)
  SELECT
    2
    , 'SJStateRealtors'
    , id
    , email
    , adress_id
    , concat('register_number', FLOOR(1 + (RAND() * 40)))
    , 'register_court'
    , 'website'
  FROM users
  WHERE id = FLOOR(1 + (RAND() * 90));
INSERT INTO fa17g16.real_estate_agencies (id, name, manager_id, email, adress_id, register_number, register_court, website)
  SELECT
    3
    , 'CSURealEstate'
    , id
    , email
    , adress_id
    , concat('register_number', FLOOR(1 + (RAND() * 40)))
    , 'register_court'
    , 'website'
  FROM users
  WHERE id = FLOOR(1 + (RAND() * 90));
-- assign all users the "buyer" role
INSERT INTO fa17g16.user_roles (user_id, role_id, agency_id)
  SELECT
    id
    , 1
    , NULL
  FROM fa17g16.users;
-- assign all users the "seller" role
INSERT INTO fa17g16.user_roles (user_id, role_id, agency_id)
  SELECT
    id
    , 2
    , NULL
  FROM fa17g16.users;
-- assign selected users the "agent" role and a random agency
INSERT INTO fa17g16.user_roles (user_id, role_id, agency_id)
  SELECT
    id
    , 3
    , (
    SELECT id
    FROM real_estate_agencies
    WHERE id = FLOOR(1 + (RAND() * 3)))
  FROM fa17g16.users
  WHERE id <= 5;

