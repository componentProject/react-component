import '../src/assets/styles/main.css'

const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};
export const decorators = [
	(Story) => (
		<div className="flex-col" style={{
			maxHeight: '100%',
			overflow: 'hidden'
		}}>
			{Story()}
		</div>
	),
];
export default preview;
