import MutateObserver from '../index.tsx';
import {useState, useEffect} from 'react'

const meta = {
	title: 'MutateObserver',
	component: MutateObserver,
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
	const [className, setClassName] = useState('aaa');

	useEffect(() => {
		setTimeout(() => setClassName('bbb'), 2000);
	}, []);
	return <>
		<MutateObserver {...props}>
			<div id="container" style={{width: '100px', height: '100px', background: 'red'}}>
				<div className={className}>
					{
						className === 'aaa' ? <div>aaa</div> : <div>
							<p>bbb</p>
						</div>
					}
				</div>
			</div>
		</MutateObserver>
	</>

}
export const portal = Template.bind({});
portal.args = {
	onMutate: (mutationsList: MutationRecord[])=>{
	console.log(mutationsList);
}
};
