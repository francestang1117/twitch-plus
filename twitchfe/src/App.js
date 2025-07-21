import React, { useEffect, useState } from "react";
import { Layout, Menu, message, Spin } from "antd";
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
  // add loading effect
  const [loading, setLoading] = useState(false);

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
      label: <span className="fancy-menu-label">Recommend for you!</span>,
      key: "recommendation",
      icon: <LikeOutlined style={{ fontSize: "17px" }} />,
    },
    {
      label: <span className="fancy-menu-label">Popular Games</span>,
      key: "popular_games",
      icon: <FireOutlined style={{ fontSize: "17px" }} />,
      children: topGames.map((game) => ({
        label: <span className="game-label">{game.name}</span>,
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
    setLoading(true);
    if (key === "recommendation") {
      getRecommendations()
        .then((data) => {
          setResources(data);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // if key is not recommendation, it is game id
    searchGameById(key)
      .then((data) => {
        setResources(data);
      })
      .finally(() => {
        setLoading(false);
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
          <CustomSearch
            onSuccess={customSearchOnSuccess}
            onLoadingChange={setLoading}
          />
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
              loading={loading}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
