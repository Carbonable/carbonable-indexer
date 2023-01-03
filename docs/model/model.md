**CLAIMS** (<ins>num_claim</ins>, absorption, timestampz, _#num_offseter_)<br>
**MINTERS** (<ins>num_minter</ins>, address, max_supply, reserved_supply, status, unit_price, public_sale_open, whitelist_sale_open, max_buy_per_tx, payment_token_address, _#num_project_, _#num_payment_)<br>
**OFFSETERS** (<ins>num_offseter</ins>, address, apr, total deposited, min_claimable)<br>
**OFFSETTING_POSITIONS** (<ins>_#num_user_</ins>, <ins>_#num_offseter_</ins>, num_offseter_position, deposited, claimable, claimed)<br>
**PAYMENTS** (<ins>num_payment</ins>, address, decimal)<br>
**PROJECTS** (<ins>num_project</ins>, address, name, total_supply, uri, _#num_offseter_, _#num_yielder_)<br>
**SNAPSHOTS** (<ins>num_snapshot</ins>, project, previous_timestampz, previous_project_absorption, previous_offseter_absorption, previous_yielder_absorption, current_timestampz, current_project_absorption, current_offseter_absorption, current_yielder_absorption, period_project_absorption, period_offseter_absorption, period_yielder_absorption, _#num_yielder_)<br>
**TOKENS** (<ins>num_tokoen</ins>, token_blockchain_identifier, uri, _#num_user_, _#num_project_)<br>
**USERS** (<ins>num_user</ins>, address)<br>
**VESTERS** (<ins>num_vester</ins>, address)<br>
**VESTINGS** (<ins>num_vesting</ins>, address, vesting_blockchain_identifier, claimable, timestampz, _#num_yielder_, _#num_vester_, _#num_user_)<br>
**WHITELISTINGS** (<ins>_#num_user_</ins>, <ins>_#num_whitelist_</ins>)<br>
**WHITELISTS** (<ins>num_whitelist</ins>, user, proofs, leaf, slots, _#num_minter_)<br>
**YIELDERS** (<ins>num_yielder</ins>, address, apr, total deposited)<br>
**YIELDING_POSITIONS** (<ins>_#num_user_</ins>, <ins>_#num_yielder_</ins>, num_yielder_position, deposited, claimable, claimed)