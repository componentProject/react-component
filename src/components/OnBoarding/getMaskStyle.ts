/**
 * 根据element和container计算mask的样式
 *
 * 该函数返回一个对象，包含了mask的样式
 *  width: mask的宽度
 *  height: mask的高度
 *  borderTopWidth: mask的上边框的宽度
 *  borderLeftWidth: mask的左边框的宽度
 *  borderBottomWidth: mask的下边框的宽度
 *  borderRightWidth: mask的右边框的宽度
 *
 *  该函数计算mask的样式时，会考虑到container的滚动条的影响
 *  例如，element的top值可能小于0（因为container的滚动条的存在），这时，borderTopWidth的值将被设置为Math.max(elementTopWithScroll, 0)
 *
 *  @param element - 需要计算mask样式的元素
 *  @param container - element的容器
 *  @returns 一个对象，包含了mask的样式
 */
export const getMaskStyle = (element: HTMLElement, container: HTMLElement) => {
	if (!element) {
		return {};
	}

	/**
	 * 获取element的几何信息
	 */
	const { height, width, left, top } = element.getBoundingClientRect();

	/**
	 * 计算element的top和left值，考虑到container的滚动条的影响
	 */
	const elementTopWithScroll = container.scrollTop + top;
	const elementLeftWithScroll = container.scrollLeft + left;

	/**
	 * 返回mask的样式
	 */
	return {
		width: container.scrollWidth,
		height: container.scrollHeight,
		borderTopWidth: Math.max(elementTopWithScroll, 0),
		borderLeftWidth: Math.max(elementLeftWithScroll, 0),
		borderBottomWidth: Math.max(container.scrollHeight - height - elementTopWithScroll, 0),
		borderRightWidth: Math.max(container.scrollWidth - width - elementLeftWithScroll, 0),
	};
};
