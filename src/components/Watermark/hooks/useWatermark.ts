import { useEffect, useRef, useState } from "react";
import type { propsType } from "../types";
import { merge } from "lodash-es";

export type WatermarkOptions = Omit<propsType, "className" | "style" | "children">;

/** 判断一个对象是否为数字 */
export function isNumber(obj: any): obj is number {
	/** 使用Object.prototype.toString判断数据类型，并且确保值为自身 */
	return Object.prototype.toString.call(obj) === "[object Number]" && obj === obj;
}

/**
 * 将值转换为数字，如果无法转换则使用默认值
 * @param value - 待转换的值
 * @param defaultValue - 默认值
 */
const toNumber = (value?: string | number, defaultValue?: number) => {
	/** 如果值为undefined，则返回默认值 */
	if (value === undefined) {
		return defaultValue;
	}
	/** 如果值是数字，则直接返回 */
	if (isNumber(value)) {
		return value;
	}
	/** 尝试将字符串转换为浮点数 */
	const numberVal = parseFloat(value);
	/** 如果转换后的值是数字，则返回，否则返回默认值 */
	return isNumber(numberVal) ? numberVal : defaultValue;
};

/** 默认配置选项 */
const defaultOptions = {
	/** 默认旋转角度 */
	rotate: -20,
	/** 默认z-index */
	zIndex: 1,
	/** 默认宽度 */
	width: 100,
	/** 默认间距 */
	gap: [100, 100],
	/** 默认字体样式 */
	fontStyle: {
		/** 默认字体大小 */
		fontSize: "16px",
		/** 默认字体颜色 */
		color: "rgba(0, 0, 0, 0.15)",
		/** 默认字体 */
		fontFamily: "sans-serif",
		/** 默认字体粗细 */
		fontWeight: "normal",
	},
	/** 获取容器的默认方法 */
	getContainer: () => document.body,
};

/**
 * 获取合并后的配置选项
 * @param options - 部分配置选项
 */
const getMergedOptions = (options: Partial<WatermarkOptions> = {}) => {
	/** 合并用户传入的配置选项与默认配置选项 */
	const mergedOptions = {
		...options,
		rotate: options.rotate || defaultOptions.rotate,
		zIndex: options.zIndex || defaultOptions.zIndex,
		fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
		width: toNumber(options.width, options.image ? defaultOptions.width : undefined),
		height: toNumber(options.height, undefined)!,
		getContainer: options.getContainer!,
		gap: [
			toNumber(options.gap?.[0], defaultOptions.gap[0]),
			toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
		],
	} as Required<WatermarkOptions>;

	/** 合并偏移量 */
	const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
	const mergedOffsetY = toNumber(mergedOptions.offset?.[1] || mergedOptions.offset?.[0], 0)!;
	mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

	return mergedOptions;
};

/**
 * 计算文本在画布中的大小
 * @param ctx - 画布上下文
 * @param content - 文本内容数组
 * @param rotate - 旋转角度
 */
const measureTextSize = (ctx: CanvasRenderingContext2D, content: string[], rotate: number) => {
	let width = 0;
	let height = 0;
	const lineSize: Array<{ width: number; height: number }> = [];

	content.forEach((item) => {
		/** 测量每行文本的宽度和高度 */
		const { width: textWidth, fontBoundingBoxAscent, fontBoundingBoxDescent } = ctx.measureText(item);
		const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

		/** 找到最长的文本宽度 */
		if (textWidth > width) {
			width = textWidth;
		}

		/** 累加文本总高度 */
		height += textHeight;
		lineSize.push({ height: textHeight, width: textWidth });
	});

	/** 计算旋转角度的弧度值 */
	const angle = (rotate * Math.PI) / 180;

	return {
		/** 原始宽度 */
		originWidth: width,
		/** 原始高度 */
		originHeight: height,
		/** 旋转后的宽度 */
		width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)),
		/** 旋转后的高度 */
		height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))),
		lineSize,
	};
};

/**
 * 获取画布数据
 * @param options - 配置选项
 */
const getCanvasData = async (
	options: Required<WatermarkOptions>,
): Promise<{ width: number; height: number; base64Url: string }> => {
	const { rotate, image, content, fontStyle, gap } = options;

	/** 创建画布元素 */
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;

	/** 获取设备像素比 */
	const ratio = window.devicePixelRatio;

	/**
	 * 配置画布
	 * @param size - 画布大小
	 */
	const configCanvas = (size: { width: number; height: number }) => {
		/** 计算画布的宽度和高度 */
		const canvasWidth = gap[0] + size.width;
		const canvasHeight = gap[1] + size.height;

		/** 设置画布的实际宽高 */
		canvas.setAttribute("width", `${canvasWidth * ratio}px`);
		canvas.setAttribute("height", `${canvasHeight * ratio}px`);
		/** 设置画布的样式宽高 */
		canvas.style.width = `${canvasWidth}px`;
		canvas.style.height = `${canvasHeight}px`;

		/** 将画布的原点移动到中心位置 */
		ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
		/** 缩放画布以适应设备像素比 */
		ctx.scale(ratio, ratio);

		/** 旋转画布 */
		const RotateAngle = (rotate * Math.PI) / 180;
		ctx.rotate(RotateAngle);
	};

	/** 绘制文字 */
	const drawText = () => {
		const { fontSize, color, fontWeight, fontFamily } = fontStyle;
		/** 获取真实的字体大小 */
		const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

		/** 设置字体样式 */
		ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
		const measureSize = measureTextSize(ctx, [...content], rotate);

		const width = options.width || measureSize.width;
		const height = options.height || measureSize.height;

		configCanvas({ width, height });

		/** 设置字体颜色 */
		ctx.fillStyle = color!;
		ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
		ctx.textBaseline = "top";

		/** 逐行绘制文本 */
		[...content].forEach((item, index) => {
			const { height: lineHeight, width: lineWidth } = measureSize.lineSize[index];

			/** 计算文本的起始位置 */
			const xStartPoint = -lineWidth / 2;
			const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

			/** 在画布上绘制文本 */
			ctx.fillText(item, xStartPoint, yStartPoint, options.width || measureSize.originWidth);
		});
		return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
	};

	/** 绘制图片 */
	function drawImage() {
		return new Promise<{ width: number; height: number; base64Url: string }>((resolve) => {
			const img = new Image();
			/** 允许跨域 */
			img.crossOrigin = "anonymous";
			img.referrerPolicy = "no-referrer";

			img.src = image;
			img.onload = () => {
				let { width, height } = options;
				if (!width || !height) {
					/** 根据图片的宽高比计算宽度或高度 */
					if (width) {
						height = (img.height / img.width) * +width;
					} else {
						width = (img.width / img.height) * +height;
					}
				}
				configCanvas({ width, height });

				/** 绘制图片到画布上 */
				ctx.drawImage(img, -width / 2, -height / 2, width, height);
				return resolve({ base64Url: canvas.toDataURL(), width, height });
			};
			img.onerror = () => {
				/** 图片加载失败时，绘制文本 */
				return drawText();
			};
		});
	}

	/** 根据是否有图片来决定绘制文字或图片 */
	return image ? drawImage() : drawText();
};

/** 自定义hook用于生成水印 */
export default function useWatermark(params: WatermarkOptions = {}) {
	/** 使用useState来存储水印配置选项 */
	const [options, setOptions] = useState(params || {});

	/** 获取合并后的配置选项 */
	const mergedOptions = getMergedOptions(options);
	/** 用于存储水印DOM元素 */
	const watermarkDiv = useRef<HTMLDivElement>();
	/** 用于观察DOM变化 */
	const mutationObserver = useRef<MutationObserver>();

	const container = mergedOptions.getContainer();
	const { zIndex, gap } = mergedOptions;

	/** 绘制水印 */
	function drawWatermark() {
		if (!container) {
			return;
		}

		getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
			/** 计算偏移量 */
			const offsetLeft = mergedOptions.offset[0] + "px";
			const offsetTop = mergedOptions.offset[1] + "px";

			/** 设置水印的样式 */
			const wmStyle = `
      width:calc(100% - ${offsetLeft});
      height:calc(100% - ${offsetTop});
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

			if (!watermarkDiv.current) {
				/** 创建新div作为水印背景 */
				const div = document.createElement("div");
				watermarkDiv.current = div;
				container.append(div);
				container.style.position = "relative";
			}

			/** 更新水印样式 */
			watermarkDiv.current?.setAttribute("style", wmStyle.trim());

			if (container) {
				/** 断开之前的观察器 */
				mutationObserver.current?.disconnect();

				/** 创建并配置新的观察器 */
				mutationObserver.current = new MutationObserver((mutations) => {
					const isChanged = mutations.some((mutation) => {
						let flag = false;
						if (mutation.removedNodes.length) {
							flag = Array.from(mutation.removedNodes).some((node) => node === watermarkDiv.current);
						}
						if (mutation.type === "attributes" && mutation.target === watermarkDiv.current) {
							flag = true;
						}
						return flag;
					});
					/** 如果水印被移除或改变，重新绘制 */
					if (isChanged) {
						watermarkDiv.current?.parentNode?.removeChild(watermarkDiv.current);
						watermarkDiv.current = undefined;
						drawWatermark();
					}
				});

				/** 开始观察容器 */
				mutationObserver.current.observe(container, {
					attributes: true,
					subtree: true,
					childList: true,
				});
			}
		});
	}

	/** 使用useEffect在组件挂载时绘制水印 */
	useEffect(() => {
		drawWatermark();
	}, [options]);

	return {
		generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
			setOptions(merge({}, options, newOptions));
		},
	};
}
