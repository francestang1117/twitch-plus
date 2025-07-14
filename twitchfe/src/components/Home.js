import { Button, Card, List, message, Tabs, Tooltip } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { addFavoriteItem, deleteFavoriteItem } from "../utils";

const { TabPane } = Tabs;
const tabKeys = {
  Streams: "stream",
  Videos: "videos",
  Clips: "clips",
};

const processUrl = (url) => {
  if (!url) return "";

  if (url.includes("{width}") || url.includes("{height}")) {
    return url.replace("{width}", "480").replace("{height}", "272");
  }
  return url;

  // url
  //   .replace("%{height}", "252")
  //   .replace("%{width}", "480")
  //   .replace("{height}", "252")
  //   .replace("{width}", "480");
};

const renderCardTitle = (item, loggedIn, favs = [], favOnChange) => {
  const title = `${item.broadcaster_name} - ${item.title}`;

  const isFav = favs.find((fav) => fav.twitch_id === item.twitch_id);

  const favOnClick = () => {
    if (isFav) {
      deleteFavoriteItem(item)
        .then(() => {
          favOnChange();
        })
        .catch((err) => {
          message.error(err.message);
        });

      return;
    }

    addFavoriteItem(item)
      .then(() => {
        favOnChange();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <>
      {loggedIn && (
        <Tooltip
          title={isFav ? "Remove from favorite list" : "Add to favorite list"}
        >
          <Button
            shape="circle"
            icon={isFav ? <StarFilled /> : <StarOutlined />}
            onClick={favOnClick}
          />
        </Tooltip>
      )}
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: 450 }}>
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
      </div>
    </>
  );
};

const renderCardGrid = (data, loggedIn, favs, favOnChange) => {
  return (
    <List
      grid={{
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginRight: "20px" }}>
          <Card
            title={renderCardTitle(item, loggedIn, favs, favOnChange)}
            style={{ width: "100%", height: "100%" }}
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <img
                alt="placeholder"
                src={processUrl(item.thumbnail_url)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
                    item.id || item.title || Math.random()
                  )}`;
                }}
              />
            </a>
          </Card>
        </List.Item>
      )}
    />
  );
};

const Home = ({ resources, loggedIn, favoriteItems, favoriteOnChange }) => {
  const { videos, streams, clips } = resources;
  const {
    videos: favVideos,
    streams: favStreams,
    clips: favClips,
  } = favoriteItems;

  return (
    <Tabs defaultActiveKey="tabKeys.Streams">
      <TabPane tab="Streams" key={tabKeys.Streams} forceRender={true}>
        {renderCardGrid(streams, loggedIn, favStreams, favoriteOnChange)}
      </TabPane>
      <TabPane tab="Videos" key={tabKeys.Videos} forceRender={true}>
        {renderCardGrid(videos, loggedIn, favVideos, favoriteOnChange)}
      </TabPane>
      <TabPane tab="Clips" key={tabKeys.Clips} forceRender={true}>
        {renderCardGrid(clips, loggedIn, favClips, favoriteOnChange)}
      </TabPane>
    </Tabs>
  );
};

export default Home;
