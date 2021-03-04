import React, { useState, useEffect } from "react";
import $ from "jquery";
import {
  Tabs,
  Avatar,
  Result,
  Button,
  Upload,
  message,
  Radio,
  Divider,
} from "antd";
import { Link } from "react-router-dom";

const Singers = () => {
  const [gender, setGender] = useState("全部");
  const [region, setRegion] = useState("全部");
  const [singers, setSingers] = useState([]);
  const regions = ["全部", "内地", "港澳", "欧美", "日韩", "其他"];
  const genders = ["全部", "男", "女"];
  const GetData = () => {
    $.getJSON(
      "/Music/Singer/GetSingers",
      { gender: gender, region: region },
      (result) => {
        setSingers(result);
      }
    );
  };
  useEffect(GetData, [gender, region]);

  return (
    <div className="container">
      <div className="singers_category">
        <Radio.Group defaultValue="a" buttonStyle="solid" defaultValue="全部">
          {regions.map((item) => (
            <Radio.Button
              style={{ border: "none" }}
              onClick={() => setRegion(item)}
              value={item}
            >
              {item}
            </Radio.Button>
          ))}
        </Radio.Group>
        <br />
        <br />
        <Radio.Group defaultValue="a" buttonStyle="solid" defaultValue="全部">
          {genders.map((item) => (
            <Radio.Button
              style={{ border: "none" }}
              onClick={() => setGender(item)}
              value={item}
            >
              {item}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <Divider style={{ margin: "  10px" }}></Divider>

      <div className="singer_container">
        <div>
          {singers.map((item) => (
            <div
              key={item.Id}
              className="singer_box"
              style={{ padding: "30px 50px 0px 0px" }}
            >
              <Link to={"/singer/" + item.Id}>
                <Avatar src={item.Image} size={130} />
                <div style={{ textAlign: "center" }}>{item.Name}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Singers;
