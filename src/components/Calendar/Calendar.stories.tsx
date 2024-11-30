import type {Meta, StoryObj} from '@storybook/react';
// import {fn} from '@storybook/test';

import Calendar from './index.tsx';

const meta = {
    title: '日历',
    component: Calendar,
    parameters: {
			docs: {
				description: {
					defaultValue: '测试',
				}
			},
    },
    tags: ['autodocs'],
		argTypes: {
		},
    args: {},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
