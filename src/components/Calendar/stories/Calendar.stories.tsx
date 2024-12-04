// import {fn} from '@storybook/test';

import Calendar from '../index.tsx';

const meta = {
    title: '日历',
    component: Calendar,
    parameters: {
			docs: {
			},
    },
    tags: ['autodocs'],
    args: {},
};

export default meta;

const Template = (props) => {
		return <Calendar {...props} />;
};
export const calendar = Template.bind({});
calendar.args = {};
