import { Layout, Row, Col, Button } from "antd";
import Login from "./Login";
import Register from "./Register";
import Favorites from "./Favorites";
import React from "react";

const { Header } = Layout;

function PageHeader({
  loggedIn,
  signoutOnClick,
  signinOnSuccess,
  favoriteItems,
}) {
  return (
    <Header>
      <Row justify="space-between">
        <Col>{loggedIn && <Favorites favoriteItems={favoriteItems} />}</Col>{" "}
        {/*right side */}
        <Col>
          {loggedIn && (
            <Button shape="round" onClick={signoutOnClick}>
              Logout
            </Button>
          )}
          {!loggedIn && (
            <>
              <Login onSuccess={signinOnSuccess} />
              <Register />
            </>
          )}
        </Col>
      </Row>
    </Header>
  );
}

export default PageHeader;
