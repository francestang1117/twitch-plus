package com.frances.twitch.favorite;

import com.frances.twitch.db.entity.ItemEntity;

public record FavoriteRequestBody(
        // corresponds to the "favorite" field in json
        ItemEntity favorite
) {
}
