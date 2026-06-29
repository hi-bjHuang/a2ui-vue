# a2ui-vue

[English](README.md) | 中文

A2UI (Agent-to-User Interface) 的 Vue 渲染器。

这个仓库包含可复用的 Vue 渲染器包，以及一个 `a2ui_explorer` demo 应用。
`a2ui_explorer` 可以作为轻量级 demo 上传或部署，用来浏览 A2UI basic catalog
示例，并测试 A2A agent 对话流程。

## 包结构

- `src/`：Vue 渲染器源码，对外导出为 `@hi-bjhuang/a2ui-vue`。
- `a2ui_explorer/`：基于 Vite 的 demo 应用，用于渲染 catalog 示例并连接
  A2A agent。

## 安装

```bash
npm install
```

## 构建渲染器

```bash
npm run build
```

## 使用渲染器

```ts
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {A2uiSurface, basicCatalog, provideMarkdownRenderer} from '@hi-bjhuang/a2ui-vue';
```

## Explorer Demo

Explorer 提供三个视图：

- `All components`：渲染所有已加载的 basic catalog 示例。
- `Focused`：按消息逐步查看单个示例，并展示当前 data model。
- `Chat`：向 A2A agent 发送消息，并渲染返回的文本或 A2UI surface。

### 前置条件

- Node.js 18 或更高版本。
- 本地运行 explorer 时，需要从 GitHub 克隆 A2UI reference 仓库，并与当前仓库并列放置：

```bash
git clone https://github.com/a2ui-project/a2ui.git
```

GitHub 仓库地址：https://github.com/a2ui-project/a2ui

Explorer 当前从以下路径加载示例 JSON：

```ts
../../../a2ui/specification/v0_9/catalogs/basic/examples/*.json
```

如果上传 explorer 时不带旁边的 `a2ui` 仓库，需要把这些示例 JSON 一起拷贝到
部署包中，并相应修改 `a2ui_explorer/src/examples.ts`。

### 本地运行

```bash
cd a2ui_explorer
npm install
npm run dev
```

打开：

```text
http://localhost:5180
```

开发服务器端口配置在 `a2ui_explorer/vite.config.ts`。

### 构建上传包

```bash
cd a2ui_explorer
npm install
npm run build
```

静态产物会生成到：

```text
a2ui_explorer/dist
```

上传这个目录中的内容即可部署到任意静态托管服务。

## Agent 对话配置

Explorer 前端不包含模型 API key，只连接一个 A2A agent URL。

默认 agent 地址：

```ts
http://localhost:10002
```

配置位置：

- `a2ui_explorer/src/App.vue`
- `a2ui_explorer/src/client.ts`

聊天客户端会从下面地址读取 agent card：

```text
http://localhost:10002/.well-known/agent-card.json
```

模型 key 配置在 agent 服务里，不在这个 Vue 项目中。以 A2UI
restaurant finder 示例为例，key 从示例 agent 的 `.env` 文件读取：

```text
samples/agent/adk/restaurant_finder/.env
```

示例源码：
https://github.com/a2ui-project/a2ui/tree/main/samples/agent/adk/restaurant_finder

这个 agent 常见变量包括：

```env
MODEL_NAME=...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
DEEPSEEK_API_KEY=...
LITELLM_MODEL=...
```

只需要配置当前选择的模型或 provider 所需的变量。

## 部署注意事项

- 执行 `npm run build` 后，explorer 是纯前端静态应用。
- `Chat` 视图需要访问可用的 A2A agent。公开部署时，可以把
  `localhost:10002` 替换为已部署的 agent 地址，也可以让用户在页面的
  `Agent URL` 输入框中填写。
- 确保 agent 允许来自前端部署域名的 CORS 请求。
- 不要把模型 provider 的 API key 放到前端代码里，key 应保存在 agent
  服务环境变量中。

## 常见问题

如果示例没有加载出来，检查旁边的 `a2ui` 仓库路径是否正确，或者修改
`a2ui_explorer/src/examples.ts` 指向已打包的示例文件。

如果聊天失败，先确认 agent 正在运行，并且下面地址可以返回 JSON：

```bash
curl http://localhost:10002/.well-known/agent-card.json
```

如果浏览器提示 CORS 错误，需要在 agent 服务的 CORS allowlist 中加入
explorer 的访问域名。
