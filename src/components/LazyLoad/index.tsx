import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import type { propsType } from "./types";

/**
 * LazyLoad组件,用于延迟加载组件
 *
 * 该组件接受一个可选的className,用于设置容器的样式
 * 亦可接受一个可选的style对象,用于设置容器的样式
 * offset用于设置观察器的rootMargin,其值可以是数字或字符串,例如"100px"或100
 * width和height用于设置容器的宽高
 * onContentVisible用于在组件可见时执行的回调函数
 * placeholder用于在组件不可见时显示的占位符
 */
const Index: FC<propsType> = ({ className = "", style, offset, width, onContentVisible, placeholder, height, children }) => {
	/**
	 * 创建一个容器的ref,用于观察器的observe
	 */
	const containerRef = useRef<HTMLDivElement>(null);

	/**
	 * 创建一个状态,用于记录组件的可见性
	 */
	const [visible, setVisible] = useState(false);

	/**
	 * 创建一个观察器的ref,用于观察容器的可见性
	 */
	const elementObserver = useRef<IntersectionObserver>();

	/**
	 * 观察器的回调函数,用于在组件可见时执行
	 */
	function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
		/**
		 *  entries是一个数组,包含了观察器观察的所有元素
		 *  我们只需要关心第一个元素,即容器
		 */
		const [entry] = entries;
		const { isIntersecting } = entry;

		/**
		 *  如果容器可见,则设置状态为true,并执行onContentVisible回调函数
		 *  并且停止观察器,避免重复执行回调函数
		 */
		if (isIntersecting) {
			setVisible(true);
			onContentVisible?.();

			const node = containerRef.current;
			if (node && node instanceof HTMLElement) {
				elementObserver.current?.unobserve(node);
			}
		}
	}

	/**
	 * useEffect Hook,用于在组件mount/unmount时执行某些操作
	 * 在这里,我们使用useEffect来创建观察器,并在组件unmount时停止观察器
	 */
	useEffect(() => {
		/**
		 *  options用于设置观察器的配置项
		 *  rootMargin用于设置观察器的rootMargin,其值可以是数字或字符串,例如"100px"或100
		 *  threshold用于设置观察器的阈值,其值可以是0到1之间的数字,例如0.5
		 */
		const options = {
			rootMargin: typeof offset === "number" ? `${offset}px` : offset,
			threshold: 0,
		};

		/**
		 *  创建观察器,并将其绑定到elementObserver的ref上
		 */
		elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

		/**
		 *  获取容器的ref
		 */
		const node = containerRef.current;

		/**
		 *  如果容器存在,则观察其可见性
		 */
		if (node instanceof HTMLElement) {
			elementObserver.current.observe(node);
		}

		/**
		 *  返回一个函数,用于在组件unmount时停止观察器
		 */
		return () => {
			/**
			 *  如果容器存在,则停止观察器
			 */
			if (node && node instanceof HTMLElement) {
				elementObserver.current?.unobserve(node);
			}
		};
	}, []);

	/**
	 *  styles用于设置容器的样式,将style和width/height对象合并
	 */
	const styles = { height, width, ...style };

	/**
	 *  返回一个div元素,用于渲染容器
	 *  visible用于控制容器的可见性
	 *  placeholder用于在容器不可见时显示的占位符
	 */
	return (
		<div ref={containerRef} className={className} style={styles}>
			{visible ? children : placeholder}
		</div>
	);
};

export default Index;
