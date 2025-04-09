import express from "express";
import bodyParser from "body-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.join(__dirname, "..");

// 创建Express应用
const app = express();

// 使用中间件
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

// 确保locales目录存在
const localesDir = path.join(rootDir, "src", "locales");
console.log("Locales directory path:", localesDir);
if (!fs.existsSync(localesDir)) {
	console.log("创建locales目录");
	fs.mkdirSync(localesDir, { recursive: true });
}

// 文件备份函数
const backupFile = (filePath) => {
	const backupPath = `${filePath}.bak`;
	console.log("Backup file path:", backupPath);
	if (fs.existsSync(filePath)) {
		fs.copyFileSync(filePath, backupPath);
		console.log(`已备份文件: ${backupPath}`);
	}
};

// 安全解析TypeScript文件
const parseTypeScriptFile = (content) => {
	const match = content.match(/export default (\{[\s\S]*?\});/);
	if (match && match[1]) {
		try {
			return JSON.parse(match[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'));
		} catch (error) {
			throw new Error("解析文件失败");
		}
	}
	throw new Error("无法提取数据");
};

// 创建Express路由
const router = express.Router();

// 获取消息定义
router.get("/messages", (req, res) => {
	try {
		const filePath = path.join(localesDir, "messages.ts");
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: "文件不存在" });
		}

		const content = fs.readFileSync(filePath, "utf8");
		const data = parseTypeScriptFile(content);
		return res.json(data);
	} catch (error) {
		console.error("读取消息文件失败:", error);
		res.status(500).json({ error: error.message });
	}
});

// 获取翻译文件
router.get("/locales/:locale", (req, res) => {
	try {
		const locale = req.params.locale;
		if (!locale.match(/^[a-zA-Z0-9-]+$/)) {
			return res.status(400).json({ error: "无效的locale参数" });
		}

		const filePath = path.join(localesDir, `${locale}.ts`);
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: "文件不存在" });
		}

		const content = fs.readFileSync(filePath, "utf8");
		const data = parseTypeScriptFile(content);
		return res.json(data);
	} catch (error) {
		console.error("读取翻译文件失败:", error);
		res.status(500).json({ error: error.message });
	}
});

// 保存消息定义
router.post("/messages", (req, res) => {
	try {
		const messagesData = req.body;
		const filePath = path.join(localesDir, "messages.ts");
		console.log("Saving messages to:", filePath);

		// 备份文件
		backupFile(filePath);

		const content = `export default ${JSON.stringify(messagesData, null, 2)};`;
		fs.writeFileSync(filePath, content, "utf8");
		console.log("消息定义文件已更新");
		res.json({ success: true });
	} catch (error) {
		console.error("保存消息文件失败:", error);
		res.status(500).json({ error: error.message });
	}
});

// 保存翻译文件
router.post("/locales/:locale", (req, res) => {
	try {
		const locale = req.params.locale;
		if (!locale.match(/^[a-zA-Z0-9-]+$/)) {
			return res.status(400).json({ error: "无效的locale参数" });
		}

		const translationData = req.body;
		const filePath = path.join(localesDir, `${locale}.ts`);
		console.log("Saving translation to:", filePath);

		// 备份文件
		backupFile(filePath);

		const content = `export default ${JSON.stringify(translationData, null, 2)};`;
		fs.writeFileSync(filePath, content, "utf8");
		console.log(`${locale}翻译文件已更新`);
		res.json({ success: true });
	} catch (error) {
		console.error("保存翻译文件失败:", error);
		res.status(500).json({ error: error.message });
	}
});

// 获取支持的语言列表
router.get("/locales", (req, res) => {
	try {
		res.json(["zh-CN", "en-US"]);
	} catch (error) {
		console.error("获取语言列表失败:", error);
		res.status(500).json({ error: error.message });
	}
});

// 将路由挂载到根路径
app.use("/api", router);

// 启动服务器
const PORT = process.env.INTL_SERVER_PORT || 3001;
app.listen(PORT, () => {
	console.log(`国际化服务器运行在 http://localhost:${PORT}`);
});
