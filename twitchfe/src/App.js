import React, { useEffect, useState } from "react";
import { Layout, Menu, message } from "antd";
import PageHeader from "./components/PageHeader";
import { FireOutlined, LikeOutlined } from "@ant-design/icons";
import {
  getFavoriteItem,
  getRecommendations,
  getTopGames,
  logout,
  searchGameById,
} from "./utils";
import CustomSearch from "./components/CustomSearch";
import Home from "./components/Home";

const { Content, Sider } = Layout;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [resources, setResources] = useState({
    videos: [],
    streams: [],
    clips: [],
  });

  useEffect(() => {
    getTopGames()
      .then((data) => {
        setTopGames(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);

  const signinOnSuccess = () => {
    setLoggedIn(true);
    getFavoriteItem().then((data) => {
      setFavoriteItems(data);
    });
  };

  const signoutOnClick = () => {
    logout()
      .then(() => {
        setLoggedIn(false);
        message.success("Successfully Signed out");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const customSearchOnSuccess = (data) => {
    setResources(data);
  };

  const mapTopGamesToProps = (topGames) => [
    {
      label: "Recommend for you!",
      key: "recommendation",
      icon: <LikeOutlined />,
    },
    {
      label: "Popular Games",
      key: "popular_games",
      icon: <FireOutlined />,
      children: topGames.map((game) => ({
        label: game.name,
        key: game.id,
        icon: (
          <img
            alt="placeholder"
            src={
              game.box_art_url
                ? game.box_art_url
                    .replace("{height}", "40")
                    .replace("{width}", "40")
                : `https://api.dicebear.com/7.x/shapes/svg?seed=${game.id}` // use randome pictures as placeholder when no image from source
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${game.id}`;
            }}
            style={{ borderRadius: "50%", marginRight: "20px" }}
          />
        ),
      })),
    },
  ];

  // ant design will call this function, and ant design will use key, which from ant Menu
  const onGameSelect = ({ key }) => {
    if (key === "recommendation") {
      getRecommendations().then((data) => {
        setResources(data);
      });
      return;
    }

    // if key is not recommendation, it is game id
    searchGameById(key).then((data) => {
      setResources(data);
    });
  };

  const favoriteOnChange = () => {
    getFavoriteItem()
      .then((data) => {
        setFavoriteItems(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <Layout>
      <PageHeader
        loggedIn={loggedIn}
        signoutOnClick={signoutOnClick}
        signinOnSuccess={signinOnSuccess}
        favoriteItems={favoriteItems}
      />
      <Layout>
        <Sider width={300} className="site-layout-background">
          <CustomSearch onSuccess={customSearchOnSuccess} />
          <Menu
            mode="inline"
            onSelect={onGameSelect}
            style={{ marginTop: "10px" }}
            items={mapTopGamesToProps(topGames)}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            className="site-layout-background"
            style={{ padding: 24, margin: 0, height: 800, overflow: "auto" }}
          >
            <Home
              resources={resources}
              loggedIn={loggedIn}
              favoriteItems={favoriteItems}
              favoriteOnChange={favoriteOnChange}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
