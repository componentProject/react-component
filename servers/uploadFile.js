import express from "express";
import multer from "multer";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * 文件上传服务
 * 端口: 3333
 * 功能: 处理文件上传请求
 */
// 正确获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// 确保上传目录存在
const uploadsDir = path.join(__dirname, "uploads");
console.log("上传目录路径:", uploadsDir);

// 检查路径是否存在且是否是目录
try {
	if (fs.existsSync(uploadsDir)) {
		const stats = fs.statSync(uploadsDir);
		if (!stats.isDirectory()) {
			console.log(`${uploadsDir} 存在但不是目录，创建新目录`);
			// 如果存在但不是目录，重命名它并创建目录
			fs.renameSync(uploadsDir, `${uploadsDir}_file_${Date.now()}`);
			fs.mkdirSync(uploadsDir, { recursive: true });
		} else {
			console.log(`上传目录已存在`);
		}
	} else {
		console.log(`创建上传目录: ${uploadsDir}`);
		fs.mkdirSync(uploadsDir, { recursive: true });
	}
} catch (error) {
	console.error(`处理上传目录时出错:`, error);
	// 尝试使用绝对路径创建
	const absoluteUploadsDir = path.resolve(__dirname, "uploads");
	console.log(`尝试使用绝对路径: ${absoluteUploadsDir}`);
	fs.mkdirSync(absoluteUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname;
		cb(null, uniqueSuffix);
	},
});

const upload = multer({
	storage,
});

// 文件上传路由
app.post("/upload", upload.single("file"), function (req, res, next) {
	console.log("文件上传成功:", req.file.filename);
	console.log("文件信息:", req.file);
	console.log("表单数据:", req.body);

	res.json({
		message: "success",
		fileUrl: `/uploads/${req.file.filename}`,
		fileName: req.file.originalname,
	});
});

// 添加一个简单的健康检查端点
app.get("/health", (req, res) => {
	res.json({ status: "UP", service: "upload-service" });
});

// 启动服务器
const PORT = process.env.UPLOAD_SERVER_PORT || 3333;
app.listen(PORT, () => {
	console.log(`文件上传服务已启动: http://localhost:${PORT}/upload`);
	console.log(`健康检查: http://localhost:${PORT}/health`);
});
