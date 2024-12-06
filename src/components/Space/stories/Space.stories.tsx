import Space from '../index.tsx';
import {ConfigProvider} from "../ConfigProvider/ConfigProvider.tsx";
import './Space.css'

/**
 * flex布局组件
 */
const meta = {
	title: 'Space',
	component: Space,
	args: {},
	argTypes: {
		split: {control: undefined},
	},
	tags: ['autodocs'],
};
export default meta;

const Template = (props) => {
	return <ConfigProvider space={20}>
		<Space {...props}>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</Space>
	</ConfigProvider>
}

export const horizontal = Template.bind({});
horizontal.args = {
	direction: "horizontal"
}
export const vertical = Template.bind({});
vertical.args = {
	direction: "vertical"
}


