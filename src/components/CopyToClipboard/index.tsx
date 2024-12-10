import { Children, cloneElement} from 'react';
import copy from 'copy-to-clipboard';
import type {FC} from 'react';
import type {CopyToClipboardProps} from './types';
/**
 * 点击时复制传入的text到剪切板,
 *
 * 通过copy-to-clipboard实现
 */
const CopyToClipboard: FC<CopyToClipboardProps> = (props) => {
	const {
		text,
		onCopy,
		debug,
		message,
		format,
		children,
	} = props;

	const elem = Children.only(children);

	function onClick(event: MouseEvent) {
		const elem = Children.only(children);

		const result = copy(text, {
			debug,
			message,
			format
		});

		if (onCopy) {
			onCopy(text, result);
		}

		if (typeof elem?.props?.onClick === 'function') {
			elem.props.onClick(event);
		}
	}

	return cloneElement(elem, {onClick});
}

export default CopyToClipboard;
