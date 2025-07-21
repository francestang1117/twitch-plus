package com.frances.twitch.external;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.frances.twitch.external.model.Clip;
import com.frances.twitch.external.model.Game;
import com.frances.twitch.external.model.Stream;
import com.frances.twitch.external.model.Video;

@Service    // let springboot know this class could be used
public class TwitchService {

    // not change
    private final TwitchApiClient twitchApiClient;

    public TwitchService(TwitchApiClient twitchApiClient) {
        this.twitchApiClient = twitchApiClient;
    }

    @Cacheable("top_games")
    public List<Game> getTopGames() {
        return twitchApiClient.getTopGames().data();
    }

    @Cacheable("games_by_name")
    public List<Game> getGames(String name) {
        return twitchApiClient.getGames(name).data();
    }

    @Cacheable("search_categories")
    public List<Game> searchCategories(String query) {
        return twitchApiClient.searchCategories(query).data();
    }

    public List<Stream> getStreams(List<String> gameIds, int first) {
        if (gameIds == null || gameIds.isEmpty()) {
            return Collections.emptyList();
        }

        // get data stream
        List<Stream> streams = twitchApiClient.getStreams(gameIds, first).data();
        // Sort the list of streams by viewer count in descending order
        return streams.stream().sorted(Comparator.comparingInt(Stream::viewerCount).reversed()).collect(Collectors.toList());
    }

    public List<Video> getVideos(String gameId, int first) {
        return twitchApiClient.getVideos(gameId, first).data();
    }

    public List<Clip> getClips(String gameId, int first) {
        return twitchApiClient.getClips(gameId, first).data();
    }

    public List<String> getTopGameIds() {
        List<String> topGameIds = new ArrayList<>();
        for (Game game : getTopGames()) {
            topGameIds.add(game.id());
        }
        return topGameIds;
    }
}
