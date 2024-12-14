import ConfigProvider from "../index.tsx";
import Calendar from "../../Calendar/index.tsx";
import Space from '../../Space/index.tsx';
import './Space.css';

/**
 * flex布局组件
 */
const meta = {
	title: 'ConfigProvider',
	component: ConfigProvider,
	args: {},
	tags: ['!autodocs'],
	// argTypes: {
	// 	space: {control: 'radio', options: ['small', 'middle', 'large', 32]},
	// 	locale: {control: 'radio', options: ['zh-CN', 'en-US']}
	// },
};
export default meta;

export const space = (props) => {
	return <ConfigProvider {...props}>
		<Space>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</Space>
	</ConfigProvider>
}
space.argTypes = {
	space: {control: 'radio', options: ['small', 'middle', 'large', 32]},
}

export const calendar = (props) => {
	return <ConfigProvider {...props}>
		<Calendar/>
	</ConfigProvider>
}
calendar.argTypes = {
	locale: {control: 'radio', options: ['zh-CN', 'en-US']}
}


