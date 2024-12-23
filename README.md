# 项目名称

## 简介

这是一个用于将文档转换为API的chrome extension项目。通过解析文档内容，自动生成相应的API接口，简化开发流程。

## 功能

- 自动解析文档内容
- 生成RESTful API接口
- 支持多种文档格式

## 安装

请确保已安装Python 3.6或更高版本。

```bash
git clone https://github.com/yourusername/alexyu-doc2api.git
cd alexyu-doc2api
pip install -r requirements.txt
```

## 使用方法

1. 将需要解析的文档放置在`docs`目录下。
2. 运行以下命令生成API接口：

```bash
python generate_api.py
```

3. 启动API服务：

```bash
python run_server.py
```

## 配置

在`config.yaml`文件中可以进行以下配置：

- `input_dir`: 文档输入目录
- `output_dir`: API输出目录
- `host`: 服务主机地址
- `port`: 服务端口号

## 贡献

欢迎提交Issue和Pull Request来贡献代码。

## 许可证

本项目采用MIT许可证，详情请参阅`LICENSE`文件。
