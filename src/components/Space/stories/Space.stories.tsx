import Space from '../index.tsx';
import {ConfigProvider} from "../ConfigProvider/ConfigProvider.tsx";
import './Space.css'

const meta = {
	title: 'Space',
	component: Space,
	args: {
		// className: '',
		// style: {},
		// size: 'small' as SizeType | [SizeType, SizeType],
		direction: 'horizontal',
		// align: 'start',
		// wrap: false
	},
	parameters: {
		docs: {
			description: {},
		},
	},
	argTypes: {},
	tags: ['autodocs'],
};
export default meta;

const Template = (props) => {
	return <ConfigProvider space={{size: 20}}>
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


