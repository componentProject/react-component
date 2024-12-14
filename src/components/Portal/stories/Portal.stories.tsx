import Portal from '../index.tsx';

const meta = {
	title: 'Portal',
	component: Portal,
	args: {},
	argTypes: {
		attach: {
			control: 'radio',
			options: ['.box1', '.box2']
		},
		children:{
			control: 'disabled'
		}
	},
}

export default meta;

const Template = (props) => {
	return <>
		<div style={{width: '200px', height: '200px', border: '1px solid'}}>
			<div className={'box1'}>容器1</div>
			<div className={'box2'}>容器2</div>
		</div>
		<Portal {...props}>
			<div style={{width: '100px', height: '100px', background: 'red'}}></div>
		</Portal>
	</>

}
export const portal = Template.bind({});
portal.args = {
	attach: '.box1'
};
