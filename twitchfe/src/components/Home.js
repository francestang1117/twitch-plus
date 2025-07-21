import { Button, Card, List, message, Spin, Tabs, Tooltip } from "antd";
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

const renderCardTitle = (item, loggedIn, favs = [], favOnChange, loading) => {
  // title
  const cleanTitle = (raw = "") =>
    raw
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/^\s+/, "") // remove leading whitespace
      .replace(/\s+/g, " ") // replace multiple spaces with a single space
      .trim(); // remove leading and trailing whitespace

  const broadcaster = cleanTitle(item.broadcaster_name || item.user_name || "");
  const title = cleanTitle(item.title || "");

  // const title = `${item.broadcaster_name} - ${item.title}`;

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
      {/* <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: 450 }}> */}

      <div
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          color: "#111",
          lineHeight: "1.2",
          marginBottom: "4px",
          textAlign: "center",
        }}
      >
        {broadcaster}
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "#666",
          lineHeight: "1.3",
          marginBottom: "5px",
          maxWidth: "100%",
          maxHeight: "2.6em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        <Tooltip title={title}>
          <span>{cleanTitle(title)}</span>
        </Tooltip>
      </div>
    </>
  );
};

const renderCardGrid = (data, loggedIn, favs, favOnChange, loading) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <List
      grid={{
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginRight: "20px" }}>
          <Card
            hoverable
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
            bodyStyle={{ padding: "12px" }}
            title={
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {renderCardTitle(item, loggedIn, favs, favOnChange)}
              </div>
            }
          >
            <a
              href={`https://www.twitch.tv/${item.userLogin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="placeholder"
                src={processUrl(item.thumbnail_url)}
                // adjust display
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
                    item.id || item.title || Math.random()
                  )}`;
                }}
              />
            </a>
            <div
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#888",
                textAlign: "right",
              }}
            >
              {item.view_count?.toLocaleString() || "0"} views
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

const Home = ({
  resources,
  loggedIn,
  favoriteItems,
  favoriteOnChange,
  loading,
}) => {
  const { videos = [], streams = [], clips = [] } = resources || {};
  const {
    videos: favVideos,
    streams: favStreams,
    clips: favClips,
  } = favoriteItems;

  const tabStyle = {
    fontSize: "18px",
    fontWeight: 600,
    fontFamily: "'Raleway', 'Josefin Sans', 'Montserrat', sans-serif",
    letterSpacing: "0.5px",
  };

  return (
    <Tabs defaultActiveKey="tabKeys.Streams">
      <TabPane
        tab={<span style={tabStyle}>Streams</span>}
        key={tabKeys.Streams}
        forceRender={true}
      >
        {renderCardGrid(
          streams,
          loggedIn,
          favStreams,
          favoriteOnChange,
          loading
        )}
      </TabPane>
      <TabPane
        tab={<span style={tabStyle}>Videos</span>}
        key={tabKeys.Videos}
        forceRender={true}
      >
        {renderCardGrid(videos, loggedIn, favVideos, favoriteOnChange, loading)}
      </TabPane>
      <TabPane
        tab={<span style={tabStyle}>Clips</span>}
        key={tabKeys.Clips}
        forceRender={true}
      >
        {renderCardGrid(clips, loggedIn, favClips, favoriteOnChange, loading)}
      </TabPane>
    </Tabs>
  );
};

export default Home;
