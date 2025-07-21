import { useState } from "react";
import {
  searchGameByName,
  getGameDetails,
  searchGameById,
  getCategoryOptions,
} from "../utils";
import { Button, message, Modal, Form, Input, AutoComplete } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function CustomSearch({ onSuccess, onLoadingChange }) {
  const [displayModal, setDisplayModal] = useState(false);
  // autocomplete dropdown options
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");

  const handleCancel = () => {
    setDisplayModal(false);
  };

  const searchOnClick = () => {
    setDisplayModal(true);
  };

  const handleSearch = (value) => {
    setInput(value);
    if (!value) {
      // clear options when input is empty
      setOptions([]);
      return;
    }

    // call API to search game categories by name
    getCategoryOptions(value)
      .then((games) => {
        // formate results
        const results = games.map((game) => ({
          value: game.name,
          id: game.id,
        }));
        setOptions(results);
      })
      .catch(() => setOptions([]));
  };

  // trigger when user selects an option
  const handleSelect = (value, option) => {
    setInput(value);
    onSuccess(null);
    // loading
    if (onLoadingChange) onLoadingChange(true);
    setDisplayModal(false);
    searchGameById(option.id)
      .then((data) => {
        onSuccess(data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        if (onLoadingChange) onLoadingChange(false);
      });
  };

  // const onSubmit = (data) => {
  //   searchGameByName(data.game_name)
  //     .then((data) => {
  //       setDisplayModal(false);
  //       onSuccess(data);
  //     })
  //     .catch((err) => {
  //       message.error(err.message);
  //     });
  // };

  return (
    <>
      <Button
        shape="round"
        onClick={searchOnClick}
        icon={<SearchOutlined />}
        style={{
          fontSize: "15px",
          marginLeft: "20px",
          marginTop: "20px",
          height: "40px",
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        Custom Search
      </Button>
      <Modal
        title="Search"
        visible={displayModal}
        onCancel={handleCancel}
        footer={null}
      >
        <AutoComplete
          style={{ width: "100%" }}
          value={input}
          options={options}
          onChange={(v) => setInput(v)}
          onSearch={handleSearch}
          onSelect={handleSelect}
          placeholder="Enter a game name"
        >
          <Input
            onPressEnter={() => {
              const selected = options.find((opt) => opt.value === input);
              if (selected) {
                handleSelect(selected.value, selected);
              } else {
                message.warning("Please select a game from the dropdown");
              }
            }}
          />
        </AutoComplete>
        {/* <Form name="custom_search" onFinish={onSubmit}>
          <Form.Item
            name="game_name"
            rules={[{ required: true, message: "Please enter a game name" }]}
          >
            <Input placeholder="Game name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form> */}
      </Modal>
    </>
  );
}

export default CustomSearch;
