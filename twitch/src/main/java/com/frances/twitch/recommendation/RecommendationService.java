package com.frances.twitch.recommendation;

import com.frances.twitch.db.entity.ItemEntity;
import com.frances.twitch.db.entity.UserEntity;
import com.frances.twitch.external.TwitchService;
import com.frances.twitch.external.model.Clip;
import com.frances.twitch.external.model.Stream;
import com.frances.twitch.external.model.Video;
import com.frances.twitch.favorite.FavoriteService;
import com.frances.twitch.model.TypeGroupItemList;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationService {

    // the maximum number of distinct game ids to use as seed for recommendation
    private static final int MAX_GAME_SEED = 3;

    // total number of recommended items per page
    private static final int PER_PAGE_ITEM_SIZE = 20;

    private final TwitchService twitchService;
    private final FavoriteService favoriteService;

    public RecommendationService(TwitchService twitchService, FavoriteService favoriteService) {
        this.twitchService = twitchService;
        this.favoriteService = favoriteService;
    }

    /**
     * If the user is not logged in, recommend top games,
     * if logged in and if the user has no favorites, recommend top games,
     * if user has favorites, recommend items based on the favorite game ids
     *
     * @param userEntity
     * @return
     */
    @Cacheable("recommend_items")
    public TypeGroupItemList recommendItems(UserEntity userEntity) {
        List<String> gameIds;
        // some of the items have already be saved
        Set<String> exclusions = new HashSet<>();
        // when not login, no specific user, return the top game ids
        if (userEntity == null) {
            gameIds = twitchService.getTopGameIds();
        } else {
            List<ItemEntity> items = favoriteService.getFavoriteItems(userEntity);
            // when the user does not have the favorite games
            if (items.isEmpty()) {
                gameIds = twitchService.getTopGameIds();
            } else {
                // when the user has the favorite games
                Set<String> uniqueGameIds = new HashSet<>();
                for (ItemEntity item : items) {
                    uniqueGameIds.add(item.gameId());
                    exclusions.add(item.twitchId());
                }
                gameIds = new ArrayList<>(uniqueGameIds);
            }
        }

        // limit the game size to 3
        int gameSize = Math.min(gameIds.size(), MAX_GAME_SEED);
        // the number of game list size
        int perGameListSize = PER_PAGE_ITEM_SIZE / gameSize;

        List<ItemEntity> streams = recommendStreams(gameIds, exclusions);
        List<ItemEntity> clips = recommendClips(gameIds.subList(0, gameSize), perGameListSize, exclusions);
        List<ItemEntity> videos = recommendVideos(gameIds.subList(0, gameSize), perGameListSize, exclusions);

        return new TypeGroupItemList(streams, clips, videos);
    }

    /**
     * Recommend live streams by game ids and filter out streams that are already favored by the user
     *
     * @param gameIds
     * @param exclusions
     * @return
     */
    private List<ItemEntity> recommendStreams(List<String> gameIds, Set<String> exclusions) {
        // can take multiple game ids
        List<Stream> streams = twitchService.getStreams(gameIds, PER_PAGE_ITEM_SIZE);
        List<ItemEntity> resultItems = new ArrayList<>();
        for (Stream stream : streams) {
            if (!exclusions.contains(stream.id())) {
                resultItems.add(new ItemEntity(stream));
            }
        }
        return resultItems;
    }

    /**
     * Recommend recorded videos per game
     *
     * @param gameIds
     * @param perGameListSize
     * @param exclusions
     * @return
     */
    private List<ItemEntity> recommendVideos(List<String> gameIds, int perGameListSize, Set<String> exclusions) {
        List<ItemEntity> resultItems = new ArrayList<>();
        for(String gameId : gameIds) {
            List<Video> listPerGame = twitchService.getVideos(gameId, perGameListSize);
            for (Video video : listPerGame) {
                if (!exclusions.contains(video.id())) {
                    resultItems.add(new ItemEntity(gameId, video));
                }
            }
        }
        return resultItems;
    }

    /**
     * Recommend clips per game.
     *
     * @param gameIds
     * @param perGameListSize
     * @param exclusions
     * @return
     */
    private List<ItemEntity> recommendClips(List<String> gameIds, int perGameListSize, Set<String> exclusions) {
        List<ItemEntity> resultItems = new ArrayList<>();
        for (String gameId : gameIds) {
            List<Clip> listPerGame = twitchService.getClips(gameId, perGameListSize);
            for (Clip clip : listPerGame) {
                if (!exclusions.contains(clip.id())) {
                    resultItems.add(new ItemEntity(clip));
                }
            }
        }
        return resultItems;
    }
}
