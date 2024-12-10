import CopyToClipboard from '../index.tsx';

const meta = {
	title: 'CopyToClipboard',
	component: CopyToClipboard,
	tags: ['autodocs'],
	args: {},
	argTypes: {
		children: {
			control: 'disabled'
		}
	},
}

export default meta;

const Template = (props) => {
	return <>
		<CopyToClipboard {...props}>
			<div>复制</div>
		</CopyToClipboard>
	</>

}
export const copy = Template.bind({});
copy.args = {
	text: 'hello world',
	debug: true,
	message: '复制成功'
}
