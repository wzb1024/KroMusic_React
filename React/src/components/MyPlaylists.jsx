import React, { Component, useState } from "react";
import { Checkbox, message, Input } from "antd";
import { Link } from "react-router-dom";
import $ from "jquery";
import {
  Collapse,
  Button,
  Popover,
  Modal,
  Descriptions,
  Form,
  Table,
  Switch,
  Select,
  Upload,
} from "antd";
import { CaretRightOutlined, MoreOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class MyPlaylists extends Component {
  constructor() {
    super();
    this.state = {
      playlists: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  refresh() {
    $.getJSON(
      "/User/Account/GetSelfPlaylists",
      function (result) {
        if (result.State) {
          this.setState({
            playlists: result.Model,
          });
        } else {
          message.error(result.ErrorMsg);
        }
      }.bind(this)
    );
  }
  componentDidMount() {
    this.refresh();
  }
  handleDelete(index) {
    var list = this.state.playlists;
    const id = list[index].Id;
    $.ajax("/Music/Playlist/DelPlaylist", {
      data: { id: id },
      success: function (result) {
        if (result.State) {
          message.success("删除成功");
          list.splice(index, 1);
          this.setState({
            playlists: list,
          });
        } else {
          message.error(result.ErrorMsg);
        }
      }.bind(this),
    });
  }
  handleCreate() {
    this.refresh();
  }
  render() {
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <b style={{ fontSize: "16px" }}>我的歌单</b>
          <NewPlaylistModal handleCreate={this.handleCreate}></NewPlaylistModal>
        </div>

        <Collapse
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          expandIconPosition="left"
        >
          {this.state.playlists.map((item, i) => (
            <Panel header={item.Name} key={item.Id}>
              <PlaylistTable
                details={item}
                index={i}
                handleDelete={this.handleDelete}
                refresh={this.refresh}
              ></PlaylistTable>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }
}

const Description = ({ details }) => (
  <>
    <Descriptions title={details.Name} bordered column={4}>
      <Descriptions.Item label="创建者">{details.NickName}</Descriptions.Item>
      <Descriptions.Item label="创建时间" span={2}>
        {details.CreateTime}
      </Descriptions.Item>
      <Descriptions.Item label="播放数">{details.PlayTimes}</Descriptions.Item>
      <Descriptions.Item label="点赞数">{details.Likes}</Descriptions.Item>
      <Descriptions.Item label="标签" span={2}>
        {details.Tags.map((n) => n)}
      </Descriptions.Item>
      <Descriptions.Item label="是否公开" span={1}>
        {details.IsPublic ? "是" : "否"}
      </Descriptions.Item>
      <Descriptions.Item label="图片" span={2}>
        <img src={details.Cover} height="100px" />
      </Descriptions.Item>
      <Descriptions.Item label="描述" span={2}>
        {details.Description}
      </Descriptions.Item>
    </Descriptions>
  </>
);

class PaylistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
      details: props.details,
    };
    this.Cover = null;
    this.handleHdimgChange = this.handleHdimgChange.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
  }
  onFinish(values) {
    var formData = new FormData();
    var id = this.state.details.Id;
    formData.append("Id", id);
    formData.append("Name", values.name);
    formData.append("IsPublic", values.isPublic);
    formData.append("Description", values.description);
    if (typeof values.tags !== "undefined")
      formData.append("Tags", values.tags);
    if (this.Cover != null) formData.append("cover", this.Cover);
    $.ajax("/Music/Playlist/ModifyPlaylist", {
      type: "post",

      //ajax2.0可以不用设置请求头，但是jq帮我们自动设置了，这样的话需要我们自己取消掉
      contentType: false,
      //取消帮我们格式化数据，是什么就是什么
      processData: false,

      data: formData,
      success: function () {
        this.props.refresh();
        this.props.change();
      }.bind(this),
    });
  }
  componentDidMount() {
    $.getJSON(
      "/Music/Playlist/GetCategories",
      function (result) {
        this.setState({
          types: result,
        });
      }.bind(this)
    );
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      callback(reader.result);
    });
    reader.readAsDataURL(img);
  }
  handleHdimgChange(info) {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) => {
        var d = this.state.details;
        d.Cover = imageUrl;
        this.setState({
          details: d,
        });
      });
    }
  }
  beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) {
      this.Cover = file;
      return true;
    } else {
      return false;
    }
  }
  render() {
    const { details } = this.state;
    const { Option, OptGroup } = Select;
    return (
      <Form
        name="Modify"
        onFinish={this.onFinish}
        scrollToFirstError
        initialValues={{
          name: details.Name,
          isPublic: details.IsPublic,
          description: details.Description,
        }}
      >
        <Form.Item
          name="name"
          label="歌单名"
          rules={[
            {
              required: true,
              message: "请输入歌单名",
            },
            {
              type: "string",
              message: "歌单名为字符串",
            },
            {
              whitespace: true,
              message: "禁止为空格",
            },
            {
              max: 15,
              min: 3,
              message: "长度为3~15",
            },
          ]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item name="isPublic" label="是否公开" valuePropName="checked">
          <Switch />
        </Form.Item>
        <img src={details.Cover} height="100px"></img>
        <Form.Item name="cover" label="封面">
          <Upload
            beforeUpload={this.beforeUpload}
            showUploadList={false}
            onChange={this.handleHdimgChange}
          >
            <Button type="link">更换封面</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[
            {
              type: "string",
              message: "歌单名为字符串",
            },
            {
              whitespace: true,
              message: "禁止为空格",
            },
          ]}
        >
          <Input.TextArea rows={4} style={{ width: 400 }} />
        </Form.Item>
        <Form.Item
          name="tags"
          label="类型"
          rules={[
            {
              required: false,
              message: "请选择类型",
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: 400 }}
            tokenSeparators={[","]}
            maxTagCount={5}
            showArrow
            defaultValue={details.TagId}
          >
            {this.state.types.map((item) => (
              <OptGroup key={item.TypeName} label={item.TypeName}>
                {item.Categories.map((it) => (
                  <Option key={it.Id} value={it.Id}>
                    {it.Name}
                  </Option>
                ))}
              </OptGroup>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存修改
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const NewPlaylistModal = ({ handleCreate }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const onFinish = (values) => {
    $.post(
      "/Music/Playlist/CreatePlaylist",
      { name: values.name },
      (result) => {
        if (result.State) {
          handleCreate(result.Model);
        } else {
          message.error(result.ErrorMsg);
        }
      }
    );
    form.setFieldsValue({ name: "" });
    setVisible(false);
  };
  return (
    <>
      <Button
        style={{ float: "right" }}
        type="primary"
        size="small"
        onClick={() => {
          setVisible(true);
        }}
      >
        新建歌单
      </Button>
      <Modal
        width="460px"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          form.setFieldsValue({ name: "" });
        }}
        footer={null}
      >
        <Form
          name="register"
          onFinish={onFinish}
          form={form}
          scrollToFirstError
          layout="inline"
        >
          <Form.Item
            name="name"
            label="歌单名"
            rules={[
              {
                required: true,
                message: "请输入歌单名",
              },
              {
                type: "string",
                message: "歌单名为字符串",
              },
              {
                whitespace: true,
                message: "禁止为空格",
              },
              {
                max: 15,
                min: 3,
                message: "昵称长度为3~15",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
class PlaylistModal extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      visible: false,
      updating: false,
    };
    this.handleOk = this.handleOk.bind(this);
  }

  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }

  render() {
    const { visible, loading } = this.state;
    return (
      <>
        <Button
          type="primary"
          size="small"
          onClick={(event) => {
            this.setState({
              visible: true,
            });
          }}
        >
          资料
        </Button>
        <Modal
          width={this.state.updating ? "500px" : "800px"}
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
          footer={
            this.state.updating
              ? [
                  <Button
                    key="back"
                    type="link"
                    onClick={() => this.setState({ updating: false })}
                  >
                    取消
                  </Button>,
                ]
              : [
                  <Button
                    key="back"
                    type="link"
                    onClick={() => this.setState({ updating: true })}
                  >
                    修改
                  </Button>,
                ]
          }
        >
          {this.state.updating ? (
            <PaylistForm
              change={() => this.setState({ updating: false })}
              refresh={this.props.refresh}
              details={this.props.details}
            ></PaylistForm>
          ) : (
            <Description details={this.props.details}></Description>
          )}
        </Modal>
      </>
    );
  }
}

class PlaylistTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      updating: false,
      songs: props.details.Songs.concat(),
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }
  handleRemove() {
    $.post("/Music/Playlist/RmItems", { items: this.state.selectedRowKeys });
    var list = [];
    this.state.songs.forEach((item) => {
      if (this.state.selectedRowKeys.indexOf(item.Id) === -1) {
        list.push(item);
      }
    });
    this.setState({
      songs: list,
      updating: false,
      selectedRowKeys: [],
    });
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const columns = [
      {
        title: "歌曲",
        dataIndex: "song",
      },
      {
        title: "歌手",
        dataIndex: "singer",
      },
    ];

    const data = [];
    this.state.songs.forEach((item) => {
      data.push({
        key: item.Id,
        song: item.MusicName,
        singer: item.SingerName,
      });
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          {this.state.updating ? (
            <>
              <Button
                type="primary"
                size="small"
                disabled={!hasSelected}
                loading={loading}
                onClick={this.handleRemove}
              >
                删除已选项
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() =>
                  this.setState({ updating: false, selectedRowKeys: [] })
                }
              >
                取消编辑
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              size="small"
              onClick={() => this.setState({ updating: true })}
            >
              编辑
            </Button>
          )}

          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `选中 ${selectedRowKeys.length} 项` : ""}
          </span>

          <PlaylistModal
            details={this.props.details}
            refresh={this.props.refresh}
          ></PlaylistModal>
          <Button
            type="primary"
            size="small"
            onClick={() => this.props.handleDelete(this.props.index)}
          >
            删除
          </Button>
          <Link to={"/playlist/" + this.props.details.Id}>
            <Button type="primary" size="small">
              详情页
            </Button>
          </Link>
        </div>
        <Table
          rowSelection={this.state.updating && rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}

export default MyPlaylists;
