CREATE DATABASE MODEL;
\c MODEL;

CREATE TABLE CLAIMS (
  num_claim VARCHAR(42),
  absorption VARCHAR(42),
  timestampz VARCHAR(42),
  num_offseter VARCHAR(42),
  PRIMARY KEY (num_claim)
);

CREATE TABLE MINTERS (
  num_minter VARCHAR(42),
  address VARCHAR(42),
  max_supply VARCHAR(42),
  reserved_supply VARCHAR(42),
  status VARCHAR(42),
  unit_price VARCHAR(42),
  public_sale_open VARCHAR(42),
  whitelist_sale_open VARCHAR(42),
  max_buy_per_tx VARCHAR(42),
  payment_token_address VARCHAR(42),
  num_project VARCHAR(42),
  num_payment VARCHAR(42),
  PRIMARY KEY (num_minter)
);

CREATE TABLE OFFSETERS (
  num_offseter VARCHAR(42),
  address VARCHAR(42),
  apr VARCHAR(42),
  total_deposited VARCHAR(42),
  min_claimable VARCHAR(42),
  PRIMARY KEY (num_offseter)
);

CREATE TABLE OFFSETTING_POSITIONS (
  num_user VARCHAR(42),
  num_offseter VARCHAR(42),
  num_offseter_position VARCHAR(42),
  deposited VARCHAR(42),
  claimable VARCHAR(42),
  claimed VARCHAR(42),
  PRIMARY KEY (num_user, num_offseter)
);

CREATE TABLE PAYMENTS (
  num_payment VARCHAR(42),
  address VARCHAR(42),
  decimal VARCHAR(42),
  PRIMARY KEY (num_payment)
);

CREATE TABLE PROJECTS (
  num_project VARCHAR(42),
  address VARCHAR(42),
  name VARCHAR(42),
  total_supply VARCHAR(42),
  uri VARCHAR(42),
  num_offseter VARCHAR(42),
  num_yielder VARCHAR(42),
  PRIMARY KEY (num_project)
);

CREATE TABLE SNAPSHOTS (
  num_snapshot VARCHAR(42),
  project VARCHAR(42),
  previous_timestampz VARCHAR(42),
  previous_project_absorption VARCHAR(42),
  previous_offseter_absorption VARCHAR(42),
  previous_yielder_absorption VARCHAR(42),
  current_timestampz VARCHAR(42),
  current_project_absorption VARCHAR(42),
  current_offseter_absorption VARCHAR(42),
  current_yielder_absorption VARCHAR(42),
  period_project_absorption VARCHAR(42),
  period_offseter_absorption VARCHAR(42),
  period_yielder_absorption VARCHAR(42),
  num_yielder VARCHAR(42),
  PRIMARY KEY (num_snapshot)
);

CREATE TABLE TOKENS (
  num_tokoen VARCHAR(42),
  token_blockchain_identifier VARCHAR(42),
  uri VARCHAR(42),
  num_user VARCHAR(42),
  num_project VARCHAR(42),
  PRIMARY KEY (num_tokoen)
);

CREATE TABLE USERS (
  num_user VARCHAR(42),
  address VARCHAR(42),
  PRIMARY KEY (num_user)
);

CREATE TABLE VESTERS (
  num_vester VARCHAR(42),
  address VARCHAR(42),
  PRIMARY KEY (num_vester)
);

CREATE TABLE VESTINGS (
  num_vesting VARCHAR(42),
  address VARCHAR(42),
  vesting_blockchain_identifier VARCHAR(42),
  claimable VARCHAR(42),
  timestampz VARCHAR(42),
  num_yielder VARCHAR(42),
  num_vester VARCHAR(42),
  num_user VARCHAR(42),
  PRIMARY KEY (num_vesting)
);

CREATE TABLE WHITELISTINGS (
  num_user VARCHAR(42),
  num_whitelist VARCHAR(42),
  PRIMARY KEY (num_user, num_whitelist)
);

CREATE TABLE WHITELISTS (
  num_whitelist VARCHAR(42),
  user VARCHAR(42),
  proofs VARCHAR(42),
  leaf VARCHAR(42),
  slots VARCHAR(42),
  num_minter VARCHAR(42),
  PRIMARY KEY (num_whitelist)
);

CREATE TABLE YIELDERS (
  num_yielder VARCHAR(42),
  address VARCHAR(42),
  apr VARCHAR(42),
  total_deposited VARCHAR(42),
  PRIMARY KEY (num_yielder)
);

CREATE TABLE YIELDING_POSITIONS (
  num_user VARCHAR(42),
  num_yielder VARCHAR(42),
  num_yielder_position VARCHAR(42),
  deposited VARCHAR(42),
  claimable VARCHAR(42),
  claimed VARCHAR(42),
  PRIMARY KEY (num_user, num_yielder)
);

ALTER TABLE CLAIMS ADD FOREIGN KEY (num_offseter) REFERENCES OFFSETERS (num_offseter);
ALTER TABLE MINTERS ADD FOREIGN KEY (num_payment) REFERENCES PAYMENTS (num_payment);
ALTER TABLE MINTERS ADD FOREIGN KEY (num_project) REFERENCES PROJECTS (num_project);
ALTER TABLE OFFSETTING_POSITIONS ADD FOREIGN KEY (num_offseter) REFERENCES OFFSETERS (num_offseter);
ALTER TABLE OFFSETTING_POSITIONS ADD FOREIGN KEY (num_user) REFERENCES USERS (num_user);
ALTER TABLE PROJECTS ADD FOREIGN KEY (num_yielder) REFERENCES YIELDERS (num_yielder);
ALTER TABLE PROJECTS ADD FOREIGN KEY (num_offseter) REFERENCES OFFSETERS (num_offseter);
ALTER TABLE SNAPSHOTS ADD FOREIGN KEY (num_yielder) REFERENCES YIELDERS (num_yielder);
ALTER TABLE TOKENS ADD FOREIGN KEY (num_project) REFERENCES PROJECTS (num_project);
ALTER TABLE TOKENS ADD FOREIGN KEY (num_user) REFERENCES USERS (num_user);
ALTER TABLE VESTINGS ADD FOREIGN KEY (num_user) REFERENCES USERS (num_user);
ALTER TABLE VESTINGS ADD FOREIGN KEY (num_vester) REFERENCES VESTERS (num_vester);
ALTER TABLE VESTINGS ADD FOREIGN KEY (num_yielder) REFERENCES YIELDERS (num_yielder);
ALTER TABLE WHITELISTINGS ADD FOREIGN KEY (num_whitelist) REFERENCES WHITELISTS (num_whitelist);
ALTER TABLE WHITELISTINGS ADD FOREIGN KEY (num_user) REFERENCES USERS (num_user);
ALTER TABLE WHITELISTS ADD FOREIGN KEY (num_minter) REFERENCES MINTERS (num_minter);
ALTER TABLE YIELDING_POSITIONS ADD FOREIGN KEY (num_yielder) REFERENCES YIELDERS (num_yielder);
ALTER TABLE YIELDING_POSITIONS ADD FOREIGN KEY (num_user) REFERENCES USERS (num_user);