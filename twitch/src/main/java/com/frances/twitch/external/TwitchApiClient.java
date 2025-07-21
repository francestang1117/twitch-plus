package com.frances.twitch.external;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.frances.twitch.TwitchFeignOAuth2Config;
import com.frances.twitch.external.model.ClipResponse;
import com.frances.twitch.external.model.GameResponse;
import com.frances.twitch.external.model.StreamResponse;
import com.frances.twitch.external.model.VideoResponse;

@FeignClient(name = "twitch-api", configuration = TwitchFeignOAuth2Config.class)
public interface TwitchApiClient {

    @GetMapping("/games")
    GameResponse getGames(@RequestParam("name") String name);

    @GetMapping("/games/top")
    GameResponse getTopGames();

    @GetMapping("/search/categories")
    GameResponse searchCategories(@RequestParam("query") String query);

    @GetMapping("/videos")
    VideoResponse getVideos(@RequestParam("game_id") String gameId, @RequestParam("first") int first);

    @GetMapping("/clips")
    ClipResponse getClips(@RequestParam("game_id") String gameId, @RequestParam("first") int first);

    @GetMapping("/streams")
    StreamResponse getStreams(@RequestParam("game_id") List<String> gameIds, @RequestParam("first") int first);

}
