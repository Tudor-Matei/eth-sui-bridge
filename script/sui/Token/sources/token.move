module token::token;

use sui::coin::{Self, TreasuryCap, Coin};

public struct TOKEN has drop {}

fun init(witness: TOKEN, ctx: &mut TxContext) {
		let (treasury, metadata) = coin::create_currency(
				witness,
				6,
				b"IBT",
				b"",
				b"",
				option::none(),
				ctx,
		);
		transfer::public_freeze_object(metadata);
		transfer::public_transfer(treasury, ctx.sender())
}

public fun mint(
		treasury_cap: &mut TreasuryCap<TOKEN>,
		amount: u64,
		recipient: address,
		ctx: &mut TxContext,
) {
		let coin = coin::mint(treasury_cap, amount, ctx);
		transfer::public_transfer(coin, recipient)
}

public fun burn(treasury_cap: &mut TreasuryCap<TOKEN>, coin: Coin<TOKEN>) {
    coin::burn(treasury_cap, coin);
}

