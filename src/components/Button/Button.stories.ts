import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {Button} from './Button.tsx';

const meta = {
    title: '按钮',
    component: Button,
    parameters: {
        docs: {
            description: {
                // component: '测试',
            }
        },
        backgrounds: {
            default: 'dark',
            values: [{name: 'dark', value: '#333'}]
        },
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color'
        },
        size: {
            control: 'select',
        }
    },
    args: {onClick: fn()},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        primary: true,
        label: 'Button',
    },
    parameters: {
        docs: {
            description: {
                story: '测试',
            }
        },
    }
};

export const Secondary: Story = {
    args: {
        label: 'Button',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        label: 'Button',
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        label: 'Button',
    },
};
