package com.frances.twitch.favorite;

import com.frances.twitch.db.FavoriteRecordRepository;
import com.frances.twitch.db.ItemRepository;
import com.frances.twitch.db.entity.FavoriteRecordEntity;
import com.frances.twitch.db.entity.ItemEntity;
import com.frances.twitch.db.entity.UserEntity;
import com.frances.twitch.model.TypeGroupItemList;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

// spring service component
@Service
public class FavoriteService {

    // Inject item repository and favorite repostory
    private final ItemRepository itemRepository;
    private final FavoriteRecordRepository favoriteRecordRepository;

    public FavoriteService(ItemRepository itemRepository,
                           FavoriteRecordRepository favoriteRecordRepository) {
        this.itemRepository = itemRepository;
        this.favoriteRecordRepository = favoriteRecordRepository;
    }

    /**
     * Mark an item as a user's favorite
     *
     * Check if the item already exists in the database by twitchId, if not, save the item.
     * Check if the user has already favorited this item, if not, create and save a new favorite record.
     *
     * @param user
     * @param item
     */
    @CacheEvict(cacheNames = "recommend_items", key = "#user")
    @Transactional
    public void setFavoriteItem(UserEntity user, ItemEntity item) {
        ItemEntity savedItem = itemRepository.findByTwitchId(item.twitchId());
        if (savedItem == null) {
            savedItem = itemRepository.save(item);
        }
        if (favoriteRecordRepository.existsByUserIdAndItemId(user.id(), savedItem.id())) {
            throw new DuplicateFavoriteException();         // prevent duplicate favorites
        }
        FavoriteRecordEntity favoriteRecord = new FavoriteRecordEntity(null, user.id(), savedItem.id(), Instant.now());
        favoriteRecordRepository.save(favoriteRecord);
    }

    /**
     * Remove an item from the user's favorites
     *
     * Find the item by its twitchId, if the item exists, delete the favorite record for the user
     *
     * @param user
     * @param twitchId
     */
    @CacheEvict(cacheNames = "recommend_items", key = "#user")
    public void unsetFavoriteItem(UserEntity user, String twitchId) {
        ItemEntity item = itemRepository.findByTwitchId(twitchId);
        if (item != null) {
            favoriteRecordRepository.delete(user.id(), item.id());
        }
    }

    /**
     * Get the list of the user's favorites
     *
     * @param user
     * @return
     */
    public List<ItemEntity> getFavoriteItems(UserEntity user) {
        List<Long> favoriteItemIds = favoriteRecordRepository.findFavoriteItemIdsByUserId(user.id());
        return itemRepository.findAllById(favoriteItemIds);
    }

    /**
     * Get the user's favorite items grouped by type
     *
     * @param user
     * @return
     */
    public TypeGroupItemList getGroupedFavoriteItems(UserEntity user) {
        List<ItemEntity> items = getFavoriteItems(user);
        return new TypeGroupItemList(items);
    }
}
