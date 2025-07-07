package com.frances.twitch.Item;

import com.frances.twitch.external.TwitchService;
import com.frances.twitch.external.model.Clip;
import com.frances.twitch.external.model.Stream;
import com.frances.twitch.external.model.Video;
import com.frances.twitch.model.TypeGroupItemList;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private static final int SEARCH_RESULT_LIMIT = 20;

    private final TwitchService twitchService;

    public ItemService(TwitchService twitchService) {
        this.twitchService = twitchService;
    }

    @Cacheable("items")
    public TypeGroupItemList getItems(String gameId) {
        List<Video> videos = twitchService.getVideos(gameId, SEARCH_RESULT_LIMIT);
        List<Clip> clips = twitchService.getClips(gameId, SEARCH_RESULT_LIMIT);
        List<Stream> streams = twitchService.getStreams(List.of(gameId), SEARCH_RESULT_LIMIT);
        return new TypeGroupItemList(gameId, streams, videos, clips);
    }
}
