DELIMITER |
CREATE TRIGGER trig_generate_user_address
BEFORE INSERT ON users
FOR EACH ROW
  BEGIN
    IF NEW.adress_id IS NULL
    THEN BEGIN
      INSERT INTO adresses (street, zipcode_id) VALUES ('Musterstraße 1', 16960);
      SET NEW.adress_id = LAST_INSERT_ID();
    END; END IF;
  END |
