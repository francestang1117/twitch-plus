package com.frances.twitch.db;

import com.frances.twitch.db.entity.ItemEntity;
import org.springframework.data.repository.ListCrudRepository;

public interface ItemRepository extends ListCrudRepository<ItemEntity, Long> {
    // SELECT * FROM items WHERE twitch_id = ?
    ItemEntity findByTwitchId(String twitchId);
}
