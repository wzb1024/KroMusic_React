import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Tabs, Avatar, Result, Button, Upload, message } from "antd";
import { Link } from "react-router-dom";
const Singers = () => {
  const [gender, setGender] = useState("男");
  const [region, setRegion] = useState("欧美");
  const [singers, setSingers] = useState([]);
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
    <>
      <div>
        <div style={{ width: "100%", height: "90px" }}></div>
        <div
          style={{
            width: "20px",
            lineHeight: "20px",
            fontSize: "20px",
            margin: "50px",
            display: "inline",
            backgroundColor: "green",
            height: "20px",
          }}
        >
          性别
        </div>
        <span
          onClick={() => setGender("男")}
          style={{ fontSize: "20px", padding: "10px" }}
        >
          男
        </span>
        <span
          onClick={() => setGender("女")}
          style={{ fontSize: "20px", padding: "10px" }}
        >
          女
        </span>
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              display: "inline",
              width: "20px",
              lineHeight: "20px",
              fontSize: "20px",
              margin: "50px",
              height: "20px",
              backgroundColor: "green",
            }}
          >
            地区
          </div>
          <span
            onClick={() => {
              setRegion("欧美");
            }}
            style={{ fontSize: "20px", padding: "10px" }}
          >
            欧美
          </span>
          <span
            onClick={() => {
              setRegion("日韩");
            }}
            style={{ fontSize: "20px", padding: "10px" }}
          >
            日韩
          </span>
          <span
            onClick={() => {
              setRegion("内地");
            }}
            style={{ fontSize: "20px", padding: "10px" }}
          >
            内地
          </span>
          <span
            onClick={() => {
              setRegion("港澳");
            }}
            style={{ fontSize: "20px", padding: "10px" }}
          >
            港澳
          </span>
          <span
            onClick={() => {
              setRegion("台湾");
            }}
            style={{ fontSize: "20px", padding: "10px" }}
          >
            台湾
          </span>
          <span
            onClick={() => {
              setRegion("其他");
            }}
            style={{ fontSize: "20px", padding: "10px" }}
          >
            其他
          </span>
        </div>
      </div>
      <div className="singer_container">
        {singers.map((item) => (
          <div
            key={item.Id}
            className="singer_box"
            style={{ marginTop: "80px", marginLeft: "70px" }}
          >
            <Link to={"/singer/" + item.Id}>
              {" "}
              <Avatar src={item.Image} size={200} />
              <div style={{ marginTop: "30px", marginLeft: "70px" }}>
                {item.Name}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
export default Singers;
